import task from '../models/task';
import schedule from 'node-schedule';
import twilio from 'twilio';
import jwt from "jsonwebtoken";

var sms = require('../sms.js');

module.exports = app => {

	const cfg = app.libs.config;
	const conn = app.db;

	function verifyToken(req, res, next){
		const bearerHeader = req.headers['authorization'];

		if(typeof bearerHeader !== 'undefined'){

			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];
			req.token = bearerToken;
			next();
		} else {
			res.sendStatus(403);
		}
	};

	app.get("/tasks", verifyToken, (req, res) => {
		const tasks = new task(conn);

		let id;

		jwt.verify(req.token, cfg.jwtSecret, (err, data) => {
			if(err){
				res.sendStatus(403);
			} else {
				id = data.user[0]._id;
			}
		});

		tasks.getTaskByID(id)
		.then(result => res.json(result))
		.catch(error => {
			res.status(412).json({msg: error.message});
		});
	});

	app.delete("/tasks/:id", verifyToken, (req,res) => {
		const tasks = new task(conn);

		let id;

		jwt.verify(req.token, cfg.jwtSecret, (err, data) => {
			if(err){
				res.sendStatus(403);
			} else {
				tasks.deleteTask(req.params.id)
				.then(result => res.json({msg: "successfully deleted!"}))
				.catch(error => {
					res.status(412).json({msg: error.message});
				});
			};
		});
	});

	app.post('/tasks', verifyToken, (req, res) => { 
		
		const tasks = new task(conn);

		jwt.verify(req.token, cfg.jwtSecret, (err, data) => {

			if(err){
				res.sendStatus(403);
			} else {
				let remindHour = req.body.rehour;
				let date = new Date(req.body.year, req.body.month - 1, req.body.day, req.body.hour, req.body.min);
				let id = data.user[0]._id;
				
				date = date.setHours(date.getHours() - remindHour);
				date = new Date(parseInt(date));

				const newTask = {
					name: req.body.name,
					body: req.body.body,
					date: date,
					user_id: id
				};
				
				tasks.saveTask(newTask);

				sms.createSms(date, data.user[0].number, req.body.body);

				res.json({msg: "successfully added!"});
			}
		});
	});
}