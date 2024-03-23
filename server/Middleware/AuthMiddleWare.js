const jwt = require("jsonwebtoken");
const db = require("../models/models");

module.exports.checkUser = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token,  process.env.SECRET, async (err, decodedToken) => {
			if (err) {
				res.json({ status: false });
				next();
			} else {
				const user = await db.User.findByPk(decodedToken);
				if(user) res.json({status:true,user:user.email})
				else{
					res.json({ status: false });
					next();
				}
			}
		});
	} else {
		res.json({ status: false });
		next();
	}
};
