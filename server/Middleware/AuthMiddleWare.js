const jwt = require("jsonwebtoken");
const db = require("../models/models");

module.exports.checkUser = (req, res, next) => {
	const token = req.cookies && req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
			if (err) {
				console.error("JWT Verification Error:", err);
				res.json({ status: false });
			} else {
				try {
					const user = await db.User.findByPk(decodedToken.id);

					if (user) {
						req.user = user;
						next();
					} else {
						res.json({ status: false });
					}
				} catch (error) {
					console.error("Database Error:", error);
					res.json({ status: false });
				}
			}
		});
	} else {
		res.json({ status: false });
	}
};



