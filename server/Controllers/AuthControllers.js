const db = require("../models/models");
const jwt = require("jsonwebtoken");
const {updateUserToAdmin, getAllUsers, demoteUserFromAdmin, removeUser, resetUserPassword} = require("../Service/AdminService");


const maxAge = 3*24*60*60;

const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET, {
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

module.exports.account = async (req, res, next) => {
	try {
		const userToSend = {};

		if (req.user.user_id) userToSend.user_id = req.user.user_id;
		if (req.user.email) userToSend.email = req.user.email;
		if (req.user.f_name) userToSend.f_name = req.user.f_name;
		if (req.user.l_name) userToSend.l_name = req.user.l_name;
		if (req.user.zip) userToSend.zip = req.user.zip;
		if (req.user.bio) userToSend.bio = req.user.bio;
		if (req.user.isAdmin !== undefined) userToSend.isAdmin = req.user.isAdmin;
		if (req.user.Instruments) userToSend.Instruments = req.user.Instruments;
		if (req.user.Events) userToSend.Events = req.user.Events;

		if (Object.keys(userToSend).length > 0) {
			res.status(200).json({ user: userToSend });
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (err) {
		console.error(err);
		const errors = handleErrors(err);
		res.json({ errors, created: false });
	}
};


module.exports.update_user = async (req, res, next) => {
	try {
		const { f_name, l_name, zip, instruments, bio } = req.body;
		const userId = req.user.user_id;

		const newData = {
			f_name,
			l_name,
			zip,
			instruments,
			bio
		};

		await db.User.updateUser(userId, newData);

		res.status(200).json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};


module.exports.getUserEvents = async (req, res, next) => {
	try {
		const userId = req.user.user_id;
		const eventIds = await db.UserStatus.findByUserId(userId);
		const events = await db.Event.findByEventIds(eventIds);
		const cleanedEvents = events.map(event => event.dataValues);

		res.status(200).json({ userGigs: cleanedEvents });
	} catch (error) {
		console.error('Error fetching user events:', error);
		throw new Error('Failed to fetch user events');
	}
}


module.exports.getUserFinancials = async (req,res, next) => {
	try {
		const userId = req.user.user_id;
		const finIds = await  db.FinStatus.getFinIdsByUserId(userId);
		const financials = await db.Financial.getFinancialsByFinIds(finIds);
		const cleanedFinancials = financials.map(financial => financial.dataValues);

		res.status(200).json({ userFinancials: cleanedFinancials });
	}catch (error){
		console.error('Error fetching user events:', error);
		throw new Error('Failed to fetch user financails');
	}
}

module.exports.getUsers = async (req,res,next) => {
	try{
		if (req.user.isAdmin) {
			const users = await getAllUsers();
			res.status(200).json({users : users});
		} else {
			res.status(403).json({ error: "Access denied. You are not authorized to perform this action." });
		}
	}catch (error){
		console.error('Error fetching Users:', error);
		throw new Error('Failed to fetch users');
	}
}

module.exports.giveUserAdmin = async (req, res, next) => {
	try {
		const userIdToUpdate = req.body.user_id;

		await updateUserToAdmin(userIdToUpdate);

		const updatedUser = await db.User.findByPk(userIdToUpdate);
		if (updatedUser && updatedUser.isAdmin) {
			res.status(200).json({ success: true, message: "User now has admin privileges" });
		} else {
			res.status(500).json({ error: 'Failed to update User' });
		}
	} catch (error) {
		console.error('Error Giving user admin privileges:', error);
		res.status(500).json({ error: 'Failed to update User' });
	}
}

module.exports.giveUserUser = async (req, res, next) => {
	try {
		const userIdToUpdate = req.body.user_id;

		await demoteUserFromAdmin(userIdToUpdate);

		const updatedUser = await db.User.findByPk(userIdToUpdate);
		if (updatedUser && !updatedUser.isAdmin) {
			res.status(200).json({ success: true, message: "Admin User has been demoted to User" });
		} else {
			res.status(500).json({ error: 'Failed to update User' });
		}
	} catch (error) {
		console.error('Error Demoting user:', error);
		res.status(500).json({ error: 'Failed to update User' });
	}
}


module.exports.removeUser = async (req, res, next) => {
	try {
		const userIdToRemove = req.body.user_id;
		await removeUser(userIdToRemove);

		const userExists = await db.User.findByPk(userIdToRemove);
		if (!userExists) {
			res.status(200).json({ success: true, message: "User has been successfully removed from the database" });
		} else {
			res.status(500).json({ error: 'Failed to remove user from the database' });
		}
	} catch (error) {
		console.error('Error removing user:', error);
		res.status(500).json({ error: 'Failed to remove user from the database' });
	}
}

module.exports.resetUserPassword = async (req, res, next) => {
	try {
		if (!req.user.isAdmin) {
			return res.status(403).json({ error: "Access denied. Only admins can reset passwords." });
		}
		console.log(req.body)
		const userId = req.body.user.user_id;
		const newPassword = req.body.newPassword;
		console.log(userId)
		console.log(newPassword)
		const result = await resetUserPassword(userId, newPassword);

		res.status(200).json({ success: true, message: "Successfully reset user password" });
	} catch (error) {
		console.error("Error resetting user password:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};







