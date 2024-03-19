const db = require("../models");
const { User, UserInstrument, Instrument } = db; // Destructure User and UserInstrument from db

//Controller Methods. You call these in routes.
exports.create = async (req, res) => {
  try {
    // Get data
    const data = req.body;

    // Add to User
    const newUser = await User.create({
      email: data.email,
      password: data.password,
      f_name: data.f_name,
      l_name: data.l_name,
      zip: data.zip,
      bio: data.bio,
      is_admin: data.is_admin,
    });

    // Add instruments (adds relation to UserInstrument table)
    const newInstrumentArray = [];
    if (data.instruments) {
      for (const instrument of data.instruments) {
        // Get instrumentId
        let instrumentId = await Instrument.getInstrumentId(instrument);

        // Add if found
        if (instrumentId) {
          const newInstrument = await UserInstrument.create({
            instrument_id: instrumentId,
            user_id: newUser.user_id,
          });
          newInstrumentArray.push(newInstrument);
        } else {
          console.log(
            "Instrument not found. Possibly incorrect ID or name?. Skipping instrument",
          );
        }
      }
    }
    res.send({ newUser, newInstrumentArray });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Retreive all users

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Instrument, Event],
    });
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

///FIND ONE
//Get single by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      where: { user_id: id },
      include: [Instrument, Event],
    });
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* UPDATE */
//Update user

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    // Find and update the user
    const [updatedRowsCount, [updatedUser]] = await User.update(data, {
      where: { user_id: id },
      returning: true, // Return the updated user
    });

    // Check if the user was found and updated
    if (updatedRowsCount > 0) {
      // If instruments are provided, update them
      const newInstrumentArray = [];
      if (data.instruments) {
        // First, delete existing user instruments
        await UserInstrument.destroy({ where: { user_id: id } });

        // Now, add the new instruments
        for (const instrument of data.instruments) {
          // Get instrumentId
          let instrumentId = await Instrument.getInstrumentId(instrument);
          if (instrumentId) {
            const [newInstrument] = await UserInstrument.findOrCreate({
              where: { instrument_id: instrumentId, user_id: id },
            });
            newInstrumentArray.push(newInstrument);
          } else {
            console.log(
              "Instrument not found. Possibly incorrect ID or name?. Skipping instrument",
            );
          }
        }
      }

      res.send({ user: updatedUser, newInstrumentArray });
    } else {
      res.status(404).send(`No user with user_id ${id} found.`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/* DELETE */
//Delete user
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { user_id: id } });
    if (user) {
      await user.destroy();
      res.send(user);
    } else {
      res.status(404).send(`No user of user_id ${id} found.`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Get single by email
//Returns JSON of user with given email. Will be empty if does not exist.
exports.findByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send(`No user with email ${email} found.`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Add instrument
//Adds instrumet(s) to user with associated user_id
exports.addInstrumentToUser = async (req, res) => {
  try {
    //Get data
    const data = req.body;
    const id = req.params.id;

    //Add instrument (adds relation to UserInstrument table)
    newInstrumentArray = [];
    if (data.instruments) {
      for (const instrument of data.instruments) {
        //Get instrumentId
        let instrumentId = await Instrument.getInstrumentId(instrument);

        //Add if found
        if (instrumentId) {
          newInstrument = await UserInstrument.findOrCreate({
            where: { instrument_id: instrumentId, user_id: id },
          });
          newInstrumentArray.push(newInstrument);
        } else {
          console.log(
            "Instrument not found. Possibly incorrect ID or name?. Skipping instrument",
          );
        }
      }
    }
    res.send({ newInstrumentArray });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Update instrument
//Updates instrumet(s) to user with associated user_id
//WILL DELETE OLD ENTIRES AND UPDATE ENTIRELY WITH NEW ONES.
// If you need to only add or delete one instrument, use the POST and DELETE
// requests instead.

exports.updateUserInstrument = async (req, res) => {
  try {
    //Get data
    const data = req.body;
    const id = req.params.id;

    //Add instrument (adds relation to UserInstrument table)
    newInstrumentArray = [];
    if (data.instruments) {
      //Delete old entries
      await UserInstrument.destroy({ where: { user_id: id } });

      for (const instrument of data.instruments) {
        //Get instrumentId
        let instrumentId = await getInstrumentId(instrument);

        //Add if found
        if (instrumentId) {
          newInstrument = await UserInstrument.findOrCreate({
            where: { instrument_id: instrumentId, user_id: id },
          });
          newInstrumentArray.push(newInstrument);
        } else {
          console.log(
            "Instrument not found. Possibly incorrect ID or name?. Skipping instrument",
          );
        }
      }
    } else {
      throw { message: "No instrument object given." };
    }
    res.send({ newInstrumentArray });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Delete instrument

exports.deleteInstrument = async (req, res) => {
  try {
    const { user_id, instrument_id } = req.params;
    const instrument = await UserInstrument.findOne({
      where: { user_id: user_id, instrument_id: instrument_id },
    });

    if (instrument) {
      await instrument.destroy();
      res.send(instrument);
    } else {
      res
        .status(404)
        .send(
          `No instrument of user_id ${user_id} and instrument_id ${instrument_id} found.`,
        );
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
