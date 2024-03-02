const models = require('./models');
const sequelize = require('./database');

const instrumentList = [
    "Accordian",
    "Bagpipes",
    "Banjo",
    "Bongos",
    "Cello",
    "Clarinet",
    "Bass Clarinet",
    "Contrabass Clarinet",
    "Cornet",
    "Double Bass",
    "Drum Kit",
    "English Horn",
    "Euphonium",
    "Flute",
    "Bass Flute",
    "French Horn",
    "Glockenspiel",
    "Acoustic Guitar",
    "Bass Guitar",
    "Electric Guitar",
    "Harmonica",
    "Harp",
    "Harpsichord",
    "Hammered Dulcimer",
    "Kalimba",
    "Lute",
    "Lyre",
    "Mandolin",
    "Marimba",
    "Melodica",
    "Oboe",
    "Ocarina",
    "Organ",
    "Otamatone",
    "Pan Pipes",
    "Pennywhistle",
    "Percussion (General)",
    "Piano",
    "Piccolo",
    "Recorder",
    "Alto Saxophone",
    "Tenor Saxophone",
    "Baritone Saxophone",
    "Soprano Saxophone",
    "Stylophone",
    "Timpani", 
    "Trombone",
    "Bass Trombone",
    "Trumpet",
    "Flugelhorn",
    "Piccolo Trumpet",
    "Theremin",
    "Tuba",
    "Ukulele",
    "Vibraphone",
    "Viola",
    "Violin",
    "Xylophone"
]

async function importInstruments() {
    const instrumentExists = await models.Instrument.findOne();
    if (instrumentExists == null)
    {
        console.log("Creating instrument list.")
        instrumentList.forEach(instrument => {
            models.Instrument.create({name: instrument});
        }); 
    }
    else
    {
        console.log("Instrument List exists, skipping inserts.")
    }    
}

module.exports = {importInstruments};