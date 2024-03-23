const db = require("../models/models");
const jwt = require("jsonwebtoken");
const {create} = require("axios");

const maxAge = 3*24*60*60;

const createToken = (id) => {
	return jwt.sign({id}, process.env.SECRET, {
		expiresIn: maxAge,
	});
}

const handleErrors = (err) => {
	let errors = { email:"", pass:""};
	if(err.message)


	if(err.message === "Incorrect Email"){
		errors.email = "That email is not registered";
	}

	if(err.message === "Incorrect Password"){
		errors.email = "Incorrect Password";
	}

	if(err.code === 11000){
		errors.email = "Email is already registered";
		return errors;
	}
	if(err.message.includes("Users validation failed")){
		Object.values(err.error).forEach(({properties}) => {
			errors[properties.path] = properties.message;
		})
	}
	return errors;
}

module.exports.register = async (req, res, next) => {
	let newInstrumentArray;
	let newInstrument;
	try {
		const {
			email,
			password,
			f_name,
			l_name,
			zip,
			bio = "", // Default vals provided for ones that aren't required
			is_admin = false,
			instruments = [],
		} = req.body;


		const newUser = await db.User.create({
			email,
			password,
			f_name,
			l_name,
			zip,
			bio,
			is_admin,
		});

		// If instruments are provided, associate them with the new user
		newInstrumentArray = [];
		if (instruments.length > 0) {
			newInstrument = await db.UserInstrument.create({instrument_id: instrumentId, user_id: newUser.user_id});
			newInstrumentArray.push(newInstrument);
		}

		// Generate JWT token for the new user
		const token = createToken(newUser.user_id);

		// Set the JWT token in the cookie
		res.cookie("jwt", token, {
			withCredentials: true,
			httpOnly: false,
			maxAge: maxAge * 1000,
		});

		// Respond with the user ID and a success message
		res.status(201).json({user: newUser.user_id, created: true});
	} catch (err) {
		// Handle errors
		console.error(err);
		const errors = handleErrors(err);
		res.json({errors, created: false});
	}
};


module.exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await db.User.login(email,password);
		if (user) {
			const token = createToken(user.user_id);
			res.cookie("jwt", token, {
				withCredentials: true,
				httpOnly: false,
				maxAge: maxAge * 1000,
			});
			res.status(200).json({ user: user.user_id, created: false });
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (err) {
		console.error(err);
		const errors = handleErrors(err);
		res.json({errors, created: false});
	}
};

module.exports.account = async (req,res,next) => {
	try{
		console.log("is this account method being hit?")
		const userId = req.user.id;
		const user = await db.User.findOne({where: {user_id: userId}, include: [db.Instrument, db.Event]});

		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(404).json({ error: "User not found" });
		}
	}catch (err){
		console.error(err);
		const errors = handleErrors(err);
		res.json({errors, created: false});
	}
}
