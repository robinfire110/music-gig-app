const db = require("../models/models");
const instrument = require('./instrumentList');
const axois = require('axios');
const { faker } = require("@faker-js/faker");
const moment = require("moment");
const cheerio = require('cheerio');
const { Op, where } = require('sequelize');
require('dotenv').config();

/* Functions */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Import Instruments
async function importInstruments() {
    console.log("Creating instrument list.")
    instrument.instrumentList.forEach(instrument => {
        db.Instrument.findOrCreate({where: { name: instrument }});
    });
}

//Get gas prices
async function getGasPrices() {
    //Get data
    /* API Calls. Cost money to do. Instead, I have files. */
    //const gasPrice = await axois.get("https://api.collectapi.com/gasPrice/allUsaPrice", {headers: {"content-type": "application/json", "authorization": process.env.API_GAS_PRICE}}).catch(error => console.log(error));
    //const stateNames = await axois.get("https://api.collectapi.com/gasPrice/usaStateCode", {headers: {"content-type": "application/json", "authorization": process.env.API_GAS_PRICE}}).catch(error => console.log(error));;   

    //Get data from AAA site and parse it
    let data = axois.get(`https://gasprices.aaa.com/state-gas-price-averages/`).then(async (res) => {
        const $ = cheerio.load(res.data);

        //Create map of state abbreviations
        const stateNames = require('./stateCodes.json');
        const stateCodes = new Object();
        for (let i = 0; i < stateNames.result.length; i++)
        {
            let name = stateNames.result[i].name;
            stateCodes[name] = stateNames.result[i].code;
        }
        
        //Get state data
        $(".sortable-table tr").each(async (i, row) => {
            const stateName = $(row).find('a').text().replace(/\s\s+/g, '');
            const gasPrice = $(row).find('td.regular').text().replace(/[^0-9.]/g, '')
            if (stateName != "")
            {
                await db.GasPrice.upsert({location: stateCodes[`${stateName}`], average_price: gasPrice});  
            } 
        });

        //Add MPG Values (//https://afdc.energy.gov/data/10310, https://www.energy.gov/sites/default/files/styles/full_article_width/public/2022-05/FOTW_1237.png?itok=bOmGiBgI)
        await db.GasPrice.upsert({location: "motorcyle_mpg", average_price: 43});
        await db.GasPrice.upsert({location: "sedan_mpg", average_price: 23});
        await db.GasPrice.upsert({location: "suv_mpg", average_price: 20});
        await db.GasPrice.upsert({location: "truck_van_mpg", average_price: 15});
        await db.GasPrice.upsert({location: "bus_mpg", average_price: 7});

        //Add other values (totalAverage, averageMPG)
        await db.GasPrice.upsert({location: "average_gas", average_price: $("p.price-text").text().replace(/[^0-9.]/g, '')});
        await db.GasPrice.upsert({location: "average_mpg", average_price: 20});
    });
}


//Create faker data
async function createFakerData(userNum, eventNum, financialNum) {
    console.log("Inserting faker data");
    //Vars
    let userIds = [];
    let instrument_count;
    let ncZipCodes = ["27006", "27007", "27009", "27011", "27012", "27013", "27014", "27016", "27017", "27018", "27019", "27020", "27021", "27022", "27023", "27024", "27025", "27027", "27028", "27030", "27040", "27041", "27042", "27043", "27045", "27046", "27047", "27048", "27050", "27051", "27052", "27053", "27054", "27055", "27101", "27103", "27104", "27105", "27106", "27107", "27109", "27110", "27127", "27201", "27202", "27203", "27205", "27207", "27208", "27209", "27212", "27213", "27214", "27215", "27217", "27229", "27231", "27233", "27235", "27239", "27242", "27243", "27244", "27247", "27248", "27249", "27252", "27253", "27256", "27258", "27259", "27260", "27262", "27263", "27265", "27268", "27278", "27281", "27282", "27283", "27284", "27288", "27291", "27292", "27295", "27298", "27299", "27301", "27302", "27305", "27306", "27310", "27311", "27312", "27313", "27314", "27315", "27316", "27317", "27320", "27325", "27326", "27330", "27332", "27340", "27341", "27342", "27343", "27344", "27349", "27350", "27351", "27355", "27356", "27357", "27358", "27360", "27370", "27371", "27374", "27376", "27377", "27379", "27401", "27403", "27405", "27406", "27407", "27408", "27409", "27410", "27411", "27412", "27455", "27501", "27502", "27503", "27504", "27505", "27506", "27507", "27508", "27509", "27510", "27511", "27513", "27514", "27516", "27517", "27518", "27519", "27520", "27521", "27522", "27523", "27524", "27525", "27526", "27527", "27529", "27530", "27531", "27533", "27534", "27536", "27537", "27539", "27540", "27541", "27542", "27544", "27545", "27546", "27549", "27551", "27553", "27555", "27556", "27557", "27559", "27560", "27562", "27563", "27565", "27568", "27569", "27570", "27571", "27572", "27573", "27574", "27576", "27577", "27581", "27582", "27583", "27584", "27587", "27589", "27591", "27592", "27593", "27594", "27596", "27597", "27599", "27601", "27603", "27604", "27605", "27606", "27607", "27608", "27609", "27610", "27612", "27613", "27614", "27615", "27616", "27617", "27695", "27697", "27701", "27703", "27704", "27705", "27707", "27708", "27709", "27712", "27713", "27801", "27803", "27804", "27805", "27806", "27807", "27808", "27809", "27810", "27812", "27813", "27814", "27815", "27816", "27817", "27818", "27819", "27820", "27821", "27822", "27823", "27824", "27825", "27826", "27827", "27828", "27829", "27830", "27831", "27832", "27834", "27837", "27839", "27840", "27841", "27842", "27843", "27844", "27845", "27846", "27847", "27849", "27850", "27851", "27852", "27853", "27855", "27856", "27857", "27858", "27860", "27861", "27862", "27863", "27864", "27865", "27866", "27869", "27870", "27871", "27872", "27873", "27874", "27875", "27876", "27877", "27878", "27879", "27880", "27881", "27882", "27883", "27884", "27885", "27886", "27888", "27889", "27890", "27891", "27892", "27893", "27896", "27897", "27909", "27910", "27915", "27916", "27917", "27919", "27920", "27921", "27922", "27923", "27924", "27925", "27926", "27927", "27928", "27929", "27932", "27935", "27936", "27937", "27938", "27939", "27941", "27942", "27943", "27944", "27946", "27947", "27948", "27949", "27950", "27953", "27954", "27956", "27957", "27958", "27959", "27960", "27962", "27964", "27965", "27966", "27967", "27968", "27969", "27970", "27972", "27973", "27974", "27976", "27978", "27979", "27980", "27981", "27982", "27983", "27985", "27986", "28001", "28006", "28007", "28009", "28012", "28016", "28017", "28018", "28019", "28020", "28021", "28023", "28024", "28025", "28027", "28031", "28032", "28033", "28034", "28036", "28037", "28039", "28040", "28041", "28042", "28043", "28052", "28054", "28056", "28071", "28072", "28073", "28074", "28075", "28076", "28077", "28078", "28079", "28080", "28081", "28083", "28086", "28088", "28089", "28090", "28091", "28092", "28097", "28098", "28101", "28102", "28103", "28104", "28105", "28107", "28108", "28109", "28110", "28112", "28114", "28115", "28117", "28119", "28120", "28124", "28125", "28127", "28128", "28129", "28133", "28134", "28135", "28136", "28137", "28138", "28139", "28144", "28146", "28147", "28150", "28152", "28159", "28160", "28163", "28164", "28166", "28167", "28168", "28169", "28170", "28173", "28174", "28202", "28203", "28204", "28205", "28206", "28207", "28208", "28209", "28210", "28211", "28212", "28213", "28214", "28215", "28216", "28217", "28223", "28226", "28227", "28244", "28262", "28269", "28270", "28273", "28274", "28277", "28278", "28280", "28282", "28301", "28303", "28304", "28305", "28306", "28307", "28308", "28310", "28311", "28312", "28314", "28315", "28318", "28320", "28323", "28325", "28326", "28327", "28328", "28330", "28331", "28332", "28333", "28334", "28337", "28338", "28339", "28340", "28341", "28342", "28343", "28344", "28345", "28347", "28348", "28349", "28350", "28351", "28352", "28355", "28356", "28357", "28358", "28359", "28360", "28362", "28363", "28364", "28365", "28366", "28367", "28368", "28369", "28371", "28372", "28373", "28374", "28375", "28376", "28377", "28378", "28379", "28382", "28383", "28384", "28385", "28386", "28387", "28390", "28391", "28392", "28393", "28394", "28395", "28396", "28398", "28399", "28401", "28403", "28405", "28409", "28411", "28412", "28420", "28421", "28422", "28423", "28424", "28425", "28428", "28429", "28430", "28431", "28432", "28433", "28434", "28435", "28436", "28438", "28439", "28441", "28442", "28443", "28444", "28445", "28447", "28448", "28449", "28450", "28451", "28452", "28453", "28454", "28455", "28456", "28457", "28458", "28460", "28461", "28462", "28463", "28464", "28465", "28466", "28467", "28468", "28469", "28470", "28472", "28478", "28479", "28480", "28501", "28504", "28508", "28509", "28510", "28511", "28512", "28513", "28515", "28516", "28518", "28519", "28520", "28521", "28523", "28524", "28525", "28526", "28527", "28528", "28529", "28530", "28531", "28532", "28533", "28537", "28538", "28539", "28540", "28542", "28543", "28544", "28546", "28547", "28551", "28552", "28553", "28554", "28555", "28556", "28557", "28560", "28562", "28570", "28571", "28572", "28573", "28574", "28575", "28577", "28578", "28579", "28580", "28581", "28582", "28584", "28585", "28586", "28587", "28589", "28590", "28594", "28601", "28602", "28604", "28605", "28606", "28607", "28609", "28610", "28611", "28612", "28613", "28615", "28616", "28617", "28618", "28619", "28621", "28622", "28623", "28624", "28625", "28626", "28627", "28628", "28629", "28630", "28631", "28634", "28635", "28636", "28637", "28638", "28640", "28641", "28642", "28643", "28644", "28645", "28646", "28649", "28650", "28651", "28652", "28653", "28654", "28655", "28657", "28658", "28659", "28660", "28662", "28663", "28664", "28665", "28666", "28667", "28668", "28669", "28670", "28671", "28672", "28673", "28675", "28676", "28677", "28678", "28679", "28681", "28682", "28683", "28684", "28685", "28689", "28690", "28692", "28693", "28694", "28697", "28698", "28701", "28702", "28704", "28705", "28707", "28708", "28709", "28710", "28711", "28712", "28713", "28714", "28715", "28716", "28717", "28718", "28719", "28720", "28721", "28722", "28723", "28725", "28726", "28729", "28730", "28731", "28732", "28733", "28734", "28735", "28736", "28739", "28740", "28741", "28742", "28743", "28745", "28746", "28747", "28748", "28749", "28751", "28752", "28753", "28754", "28755", "28756", "28757", "28758", "28759", "28761", "28762", "28763", "28766", "28768", "28770", "28771", "28772", "28773", "28774", "28775", "28777", "28778", "28779", "28781", "28782", "28783", "28785", "28786", "28787", "28788", "28789", "28790", "28791", "28792", "28801", "28803", "28804", "28805", "28806", "28901", "28902", "28904", "28905", "28906", "28909"];

    //Users
    for (let i = 0; i < userNum; i++) {
        //Create users
        let newUser = await db.User.create({ email: faker.internet.email(), password: faker.internet.password(), f_name: faker.person.firstName(), l_name: faker.person.lastName(), zip: ncZipCodes[getRandomInt(ncZipCodes.length)], bio: faker.person.bio() });
        userIds.push(newUser.user_id);

        //Create instruments
        for (let j = 0; j < getRandomInt(6); j++) {
            try {
                await db.UserInstrument.findOrCreate({ where: { instrument_id: getRandomInt(instrument.instrumentList.length), user_id: newUser.user_id } });
            } catch (error) {
                console.log(`Skipping - Error occured adding UserInstruments ${error}`);
            }
        }
    }

    //Events
    for (let i = 0; i < eventNum; i++) {
        //Create date
        let refDate = new Date().toISOString();
        let startDate = faker.date.future({ refDate: refDate });
        let endDate = faker.date.soon({ refDate: startDate, days: .5 });

        //Create event
        let newEvent = await db.Event.create({ event_name: faker.commerce.productName(), start_time: startDate, end_time: endDate, pay: (Math.random() * 500).toFixed(2), description: faker.commerce.productDescription(), rehearse_hours: getRandomInt(4), mileage_pay: .05 + (Math.random() * .2), is_listed: getRandomInt(2) });
        newEvent.set({ event_hours: getEventHours(newEvent.start_time, newEvent.end_time) });
        await newEvent.save();
        let newAddress = await db.Address.create({ event_id: newEvent.event_id, street: faker.location.street(), city: faker.location.city(), zip: ncZipCodes[getRandomInt(ncZipCodes.length)], state: "NC" });
        let newStatus = await db.UserStatus.create({ user_id: userIds[getRandomInt(userIds.length)], event_id: newEvent.event_id, status: "owner" });

        //Create instruments
        for (let j = 0; j < getRandomInt(3); j++) {
            try {
                await db.EventInstrument.findOrCreate({ where: { instrument_id: getRandomInt(instrument.instrumentList.length), event_id: newEvent.event_id } });
            } catch (error) {
                console.log(`Skipping - Error occured adding EventInstruments ${error}}`);
            }
        }
    }

    //Financial
    for (let i = 0; i < financialNum; i++) {
        //Create users
        let newFinancial = await db.Financial.create({ fin_name: faker.company.name(), date: faker.date.recent(), total_wage: (Math.random() * 500).toFixed(2), event_hours: getRandomInt(6) });
        let newFinStatus = await db.FinStatus.create({ user_id: userIds[getRandomInt(userIds.length)], fin_id: newFinancial.fin_id });
    }
}

async function getInstrumentId(instrument) {
    //Get db.Instrument by name
    if (typeof instrument == "string") {
        let instrumentId = await db.Instrument.findOne({ where: { name: instrument } });
        return instrumentId?.instrument_id;
    }
    else {
        let instrumentId = (await db.Instrument.findOne({ where: { instrument_id: instrument } }));
        return instrumentId?.instrument_id;
    }
}

//Ensure instrument array is only made up of ids
async function instrumentArrayToIds(instrumentArray)
{
    const newArray = [];
    if (instrumentArray)
    {
        for (const instrument of instrumentArray) 
        {
            instrumentId = await getInstrumentId(instrument);
            if (instrumentId) newArray.push(instrumentId);
            else console.log("Instrument not found. Possibly incorrect ID or name?. Skipping instrument");
        }
    }
    console.log("NewArray", newArray);
    return newArray;
}

function getEventHours(start_time, end_time) {
    return (moment(end_time) - moment(start_time)) / 3600000;
}

//Check if userId exists
async function checkValidUserId(id)
{
    let user = await db.User.findOne({where: {user_id: id}});
    if (parseInt(id) == parseInt(user?.user_id)) return true;
    return false;
}

//Check if eventId exists
async function checkValidEventId(id)
{
    let event = await db.Event.findOne({where: {event_id: id}});
    if (parseInt(id) == parseInt(event?.event_id)) return true;
    return false;
}

//Check if finId exists
async function checkValidFinancialId(id)
{
    let financial = await db.Financial.findOne({where: {fin_id: id}});
    if (parseInt(id) == parseInt(financial?.fin_id)) return true;
    return false;
}

//Set Unlisted Data
//If time has passed (based on start time)
async function updateUnlistedData(id=-1)
{
    //Get time passed events
    const where = id == -1 ? {start_time: {[Op.lte]: moment().toDate()}} : {event_id: id, start_time: {[Op.lte]: moment().toDate()}};
    const events = await db.Event.update({is_listed: false}, {where: where});

    //Print
    if (events.length > 0 && events[0] != 0) console.log("Unlisted past events.");
}

async function fixData() {
    //Update zip codes
    /*
    let ncZipCodes = ["27006","27007","27009","27011","27012","27013","27014","27016","27017","27018","27019","27020","27021","27022","27023","27024","27025","27027","27028","27030","27040","27041","27042","27043","27045","27046","27047","27048","27050","27051","27052","27053","27054","27055","27101","27103","27104","27105","27106","27107","27109","27110","27127","27201","27202","27203","27205","27207","27208","27209","27212","27213","27214","27215","27217","27229","27231","27233","27235","27239","27242","27243","27244","27247","27248","27249","27252","27253","27256","27258","27259","27260","27262","27263","27265","27268","27278","27281","27282","27283","27284","27288","27291","27292","27295","27298","27299","27301","27302","27305","27306","27310","27311","27312","27313","27314","27315","27316","27317","27320","27325","27326","27330","27332","27340","27341","27342","27343","27344","27349","27350","27351","27355","27356","27357","27358","27360","27370","27371","27374","27376","27377","27379","27401","27403","27405","27406","27407","27408","27409","27410","27411","27412","27455","27501","27502","27503","27504","27505","27506","27507","27508","27509","27510","27511","27513","27514","27516","27517","27518","27519","27520","27521","27522","27523","27524","27525","27526","27527","27529","27530","27531","27533","27534","27536","27537","27539","27540","27541","27542","27544","27545","27546","27549","27551","27553","27555","27556","27557","27559","27560","27562","27563","27565","27568","27569","27570","27571","27572","27573","27574","27576","27577","27581","27582","27583","27584","27587","27589","27591","27592","27593","27594","27596","27597","27599","27601","27603","27604","27605","27606","27607","27608","27609","27610","27612","27613","27614","27615","27616","27617","27695","27697","27701","27703","27704","27705","27707","27708","27709","27712","27713","27801","27803","27804","27805","27806","27807","27808","27809","27810","27812","27813","27814","27815","27816","27817","27818","27819","27820","27821","27822","27823","27824","27825","27826","27827","27828","27829","27830","27831","27832","27834","27837","27839","27840","27841","27842","27843","27844","27845","27846","27847","27849","27850","27851","27852","27853","27855","27856","27857","27858","27860","27861","27862","27863","27864","27865","27866","27869","27870","27871","27872","27873","27874","27875","27876","27877","27878","27879","27880","27881","27882","27883","27884","27885","27886","27888","27889","27890","27891","27892","27893","27896","27897","27909","27910","27915","27916","27917","27919","27920","27921","27922","27923","27924","27925","27926","27927","27928","27929","27932","27935","27936","27937","27938","27939","27941","27942","27943","27944","27946","27947","27948","27949","27950","27953","27954","27956","27957","27958","27959","27960","27962","27964","27965","27966","27967","27968","27969","27970","27972","27973","27974","27976","27978","27979","27980","27981","27982","27983","27985","27986","28001","28006","28007","28009","28012","28016","28017","28018","28019","28020","28021","28023","28024","28025","28027","28031","28032","28033","28034","28036","28037","28039","28040","28041","28042","28043","28052","28054","28056","28071","28072","28073","28074","28075","28076","28077","28078","28079","28080","28081","28083","28086","28088","28089","28090","28091","28092","28097","28098","28101","28102","28103","28104","28105","28107","28108","28109","28110","28112","28114","28115","28117","28119","28120","28124","28125","28127","28128","28129","28133","28134","28135","28136","28137","28138","28139","28144","28146","28147","28150","28152","28159","28160","28163","28164","28166","28167","28168","28169","28170","28173","28174","28202","28203","28204","28205","28206","28207","28208","28209","28210","28211","28212","28213","28214","28215","28216","28217","28223","28226","28227","28244","28262","28269","28270","28273","28274","28277","28278","28280","28282","28301","28303","28304","28305","28306","28307","28308","28310","28311","28312","28314","28315","28318","28320","28323","28325","28326","28327","28328","28330","28331","28332","28333","28334","28337","28338","28339","28340","28341","28342","28343","28344","28345","28347","28348","28349","28350","28351","28352","28355","28356","28357","28358","28359","28360","28362","28363","28364","28365","28366","28367","28368","28369","28371","28372","28373","28374","28375","28376","28377","28378","28379","28382","28383","28384","28385","28386","28387","28390","28391","28392","28393","28394","28395","28396","28398","28399","28401","28403","28405","28409","28411","28412","28420","28421","28422","28423","28424","28425","28428","28429","28430","28431","28432","28433","28434","28435","28436","28438","28439","28441","28442","28443","28444","28445","28447","28448","28449","28450","28451","28452","28453","28454","28455","28456","28457","28458","28460","28461","28462","28463","28464","28465","28466","28467","28468","28469","28470","28472","28478","28479","28480","28501","28504","28508","28509","28510","28511","28512","28513","28515","28516","28518","28519","28520","28521","28523","28524","28525","28526","28527","28528","28529","28530","28531","28532","28533","28537","28538","28539","28540","28542","28543","28544","28546","28547","28551","28552","28553","28554","28555","28556","28557","28560","28562","28570","28571","28572","28573","28574","28575","28577","28578","28579","28580","28581","28582","28584","28585","28586","28587","28589","28590","28594","28601","28602","28604","28605","28606","28607","28609","28610","28611","28612","28613","28615","28616","28617","28618","28619","28621","28622","28623","28624","28625","28626","28627","28628","28629","28630","28631","28634","28635","28636","28637","28638","28640","28641","28642","28643","28644","28645","28646","28649","28650","28651","28652","28653","28654","28655","28657","28658","28659","28660","28662","28663","28664","28665","28666","28667","28668","28669","28670","28671","28672","28673","28675","28676","28677","28678","28679","28681","28682","28683","28684","28685","28689","28690","28692","28693","28694","28697","28698","28701","28702","28704","28705","28707","28708","28709","28710","28711","28712","28713","28714","28715","28716","28717","28718","28719","28720","28721","28722","28723","28725","28726","28729","28730","28731","28732","28733","28734","28735","28736","28739","28740","28741","28742","28743","28745","28746","28747","28748","28749","28751","28752","28753","28754","28755","28756","28757","28758","28759","28761","28762","28763","28766","28768","28770","28771","28772","28773","28774","28775","28777","28778","28779","28781","28782","28783","28785","28786","28787","28788","28789","28790","28791","28792","28801","28803","28804","28805","28806","28901","28902","28904","28905","28906","28909"];
    let usersList = await db.User.findAll();
    usersList.forEach(user => {
        user.set({zip: ncZipCodes[getRandomInt(ncZipCodes.length)]});
        user.save();
    });
    */

    //Fix event hours
    /*
    let eventList = await db.Event.findAll();
    eventList.forEach(async event => {
        event.set({event_hours: getEventHours(event.start_time, event.end_time)});
        await event.save();
    });
    */

    //Fix is_listed
    let eventList = await db.Event.findAll();
    eventList.forEach(async event => {
        event.set({is_listed: true});
        await event.save();
    }); 
}

module.exports = { getRandomInt, importInstruments, getGasPrices, createFakerData, getInstrumentId, instrumentArrayToIds, getEventHours, updateUnlistedData, fixData, checkValidUserId, checkValidEventId, checkValidFinancialId }