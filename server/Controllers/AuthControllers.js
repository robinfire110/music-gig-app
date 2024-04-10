const { instrumentArrayToIds } = require("../helpers/model-helpers");
const { userSchema } = require("../helpers/validators");
const db = require("../models/models");
const jwt = require("jsonwebtoken");

const maxAge = 3*24*60*60;

const createToken = (id, isAdmin) => {
	return jwt.sign({ id, isAdmin }, process.env.SECRET, {
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
		const data = req.body;

		//Validate
		data.instruments = await instrumentArrayToIds(data?.instruments);
        const {error} = userSchema.validate(data)
        if (error) 
        {
            console.log(error);
            return res.send(error.details);
        }

		//Create
		const newUser = await db.User.create({email: data?.email, password: data?.password, f_name: data?.f_name, l_name: data?.l_name, zip: data?.zip, bio: data?.bio, is_admin: data?.is_admin});

		// If instruments are provided, associate them with the new user
		newInstrumentArray = [];
        if (data.instruments)
        {
            for (const instrument of data.instruments) {
                //Add if found
                if (instrument)
                {
                    newInstrument = await db.UserInstrument.create({instrument_id: instrument, user_id: newUser.user_id});
                    newInstrumentArray.push(newInstrument);
                }
                else
                {
                    console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
                }
            }
        }

		// Generate JWT token for the new user
		const token = createToken(newUser.user_id, newUser.isAdmin);

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
			const token = createToken(user.user_id, user.isAdmin);
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
		if (req.user.isAdmin) userToSend.isAdmin = req.user.isAdmin;
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
		//const { f_name, l_name, zip, instruments, bio } = req.body;
		const data = req.body;
		const userId = req.user.user_id;

		//Validate
		data.instruments = await instrumentArrayToIds(data?.instruments);
		delete data.password;
		const {error} = userSchema.fork(['email', 'password'], (schema) => schema.optional()).validate(data)
        if (error) 
        {
            console.log(error);
            return res.send(error.details);
        }

		await db.User.updateUser(userId, data);

		//Instruments
		newInstrumentArray = [];
		if (data.instruments)
		{
			await db.UserInstrument.destroy({where: {user_id: userId}});
			for (const instrument of data.instruments) {
				//Add if found
				if (instrumentId)
				{
					newInstrument = await db.UserInstrument.findOrCreate({where: {instrument_id: instrumentId, user_id: id}});
					newInstrumentArray.push(newInstrument);
				}
				else
				{
					console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
				}
			}
		}

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


