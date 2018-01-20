import bcrypt from "bcrypt";
import user from '../models/user';
import jwt from "jsonwebtoken";

module.exports = app => {

  const isCompare = (encodedPassword, password) => {
    return bcrypt.compareSync(password, encodedPassword);
  };

  const cfg = app.libs.config;

  const conn = app.db;

  app.post("/token", (req, res) => {
    const users = new user(conn);

    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      users.getUser(email)
        .then(user => {
          if(isCompare(user[0].password, password)) {
            jwt.sign({user}, cfg.jwtSecret, {expiresIn: '2h'},(err, token) => {
              res.json({
                token
              });
            });
          } else {
            res.sendStatus(401);
          }
        })
        .catch(error => {
          res.sendStatus(403);
        });
    } else {
      res.sendStatus(404);
    }
  });
};