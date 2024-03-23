const jwt = require("jsonwebtoken");
const db = require("../models/models");

module.exports.checkUser = (req, res, next) => {
	const token = req.cookies.jwt; //we grab cookie/token and match it to our created token
	if (token) {
		jwt.verify(token,  process.env.SECRET, async (err, decodedToken) => {
			if (err) { //if it doesn't work we send res.status false
				res.json({ status: false });
				next();
			} else { //if it matches we send res.true and user is allowed to do
				// whatever we also send their email, we can send more. If that fails we send false
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
