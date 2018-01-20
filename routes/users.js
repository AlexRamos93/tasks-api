import user from '../models/user';
import bcrypt from "bcrypt";
import passport from 'passport';
import jwt from "jsonwebtoken";

module.exports = app => {

	const conn = app.db;
	const cfg = app.libs.config;


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

	app.route('/user')
		.get(verifyToken, (req, res) => {
			const users = new user(conn);

			jwt.verify(req.token, cfg.jwtSecret, (err, data) => {
				if(err){
					res.sendStatus(403);
				} else {
					let name = data.user[0].name;
					let email = data.user[0].email;
					let number = data.user[0].number;
					let result = {
						name,
						email,
						number
					}
					res.json(result);
				}
			});
    })
    .delete(verifyToken, (req, res) => {
		const users = new user(conn);

			jwt.verify(req.token, cfg.jwtSecret, (err, data) => {
				if(err){
					res.sendStatus(403);
				} else {
					users.deleteUser(data.user[0]._id)
					.then(result => res.json({msg: "successfully deleted!"}))
					.catch(error => {
						res.status(412).json({msg: error.message});
					});
				};
			});
    });

	app.post('/users', (req, res)=> {
		
		const users = new user(conn);

		const newUser = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			number: req.body.number
		}

		users.saveUser(newUser);

		res.json({success: 'success'});
	});

}