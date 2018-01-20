import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import passport from 'passport';

module.exports = app => {
	app.set("port", 3000);
	app.set("json spaces", 4);
	app.use(helmet());
	app.use(cors({
		origin: ["http://localhost:3001"], //THE CLIENT ADDRESS
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"]
	}));
  	app.use(bodyParser.json());
	app.use(passport.initialize());
  	app.use((req, res, next) => {
	    delete req.body.id;
	    next();
	});
}