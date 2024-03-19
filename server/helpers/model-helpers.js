function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const createFakerData = async (userNum, eventNum, financialNum) => {
  console.log("Inserting faker data");
  //Vars
  let userIds = [];
  let instrument_count;

  //Users
  for (let i = 0; i < userNum; i++) {
    //Create users
    let newUser = await User.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      f_name: faker.person.firstName(),
      l_name: faker.person.lastName(),
      zip: faker.location.zipCode(),
      bio: faker.person.bio(),
    });
    userIds.push(newUser.user_id);

    //Create instruments
    for (let j = 0; j < getRandomInt(6); j++) {
      try {
        await UserInstrument.findOrCreate({
          where: {
            instrument_id: getRandomInt(instrument.instrumentList.length),
            user_id: newUser.user_id,
          },
        });
      } catch (error) {
        console.log(
          `Skipping - Error occurred adding UserInstruments ${error}`,
        );
      }
    }
  }

  //Events
  for (let i = 0; i < eventNum; i++) {
    //Create date
    let refDate = new Date().toISOString();
    let startDate = faker.date.future({ refDate: refDate });
    let endDate = faker.date.soon({ refDate: startDate, days: 0.5 });

    //Create event
    let newEvent = await Event.create({
      event_name: faker.commerce.productName(),
      start_time: startDate,
      end_time: endDate,
      pay: (Math.random() * 500).toFixed(2),
      event_hours: getRandomInt(7),
      description: faker.commerce.productDescription(),
      rehearse_hours: getRandomInt(4),
      mileage_pay: getRandomInt(25),
      is_listed: getRandomInt(2),
    });
    let newAddress = await Address.create({
      event_id: newEvent.event_id,
      street: faker.location.street(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      state: faker.location.state(),
    });
    let newStatus = await UserStatus.create({
      user_id: userIds[getRandomInt(userIds.length)],
      event_id: newEvent.event_id,
      status: "owner",
    });

    //Create instruments
    for (let j = 0; j < getRandomInt(3); j++) {
      try {
        await EventInstrument.findOrCreate({
          where: {
            instrument_id: getRandomInt(instrument.instrumentList.length),
            event_id: newEvent.event_id,
          },
        });
      } catch (error) {
        console.log(
          `Skipping - Error occurred adding EventInstruments ${error}}`,
        );
      }
    }
  }

  //Financial
  for (let i = 0; i < financialNum; i++) {
    //Create users
    let newFinancial = await Financial.create({
      fin_name: faker.company.name(),
      date: faker.date.recent(),
      total_wage: (Math.random() * 500).toFixed(2),
      event_hours: getRandomInt(6),
    });
    let newFinStatus = await FinStatus.create({
      user_id: userIds[getRandomInt(userIds.length)],
      fin_id: newFinancial.fin_id,
    });
  }
};

module.exports = {
  getRandomInt,
  createFakerData,
};
