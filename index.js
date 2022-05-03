// Simple Express server setup to serve the build output
import path from "path";
import express from "express";
import bodyParser from "body-parser";
//import cors from "cors";
import dotenv from "dotenv";
//import allRouter from "./router/all.js";
import axios from "axios";
import * as cheerio from 'cheerio';

import xpath from "xpath";

// HOST CONST
dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 1453;
const PROTOCOL = process.env.HTTPS === 'true' ? "https" : "http";

const URL = `${PROTOCOL}://${HOST}:${PORT}`;

const app = express();


const __dirname = path.resolve();

app.use(express.static("public"));
// app.use(cors());
app.use(express.json());
//app.use(connection);

app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));


// app.use(`/api/v1/all`, allRouter);


app.get('/api/vessel/', (req, res) => {
	const query = req.query;
   
  

	console.log("URL  : ",query);

    const mmsi=query.mmsi;

//https://www.marinetraffic.com/en/data/?asset_type=vessels&columns=flag,shipname,photo,recognized_next_port,reported_eta,reported_destination,current_port,imo,ship_type,show_on_live_map,time_of_latest_position,lat_of_latest_position,lon_of_latest_position,notes&quicksearch|begins|quicksearch=310627000

// https://marineforce.herokuapp.com/api/vessel?mmsi=310627000

const scrap_url = 'https://www.myshiptracking.com/vessels?name='+mmsi;


(async () => {

   // console.log("Scrap url : "+scrap_url);

    const options ={
        method:'GET',
        url:scrap_url
     };

    const scrap_res= await axios(options);
   // console.log('Scrap Response : '+scrap_res.data);

   const $ = cheerio.load(scrap_res.data);




const vesselUrl = $(`#content_in > div > div.listbox.anc_activity.ads_160_right > div > table > tbody > tr > td:nth-child(2) > span.table_title.table_vessel_title > a`).attr('href');;

const gourl="https://www.myshiptracking.com"+vesselUrl;

console.log("New url : "+gourl);

const vesOptions={
method:'GET',
url:gourl
};


const scrap_ves=await axios(vesOptions);

const $v = cheerio.load(scrap_ves.data);







const msg = {
    vesselUrl,
    mmsi,
    Name: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(1) > td:nth-child(2) > strong`).text(),
    Flag: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(2) > td:nth-child(2)`).text(),
    IMO: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(4) > td:nth-child(2) > strong`).text(),
    CallSign: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(5) > td:nth-child(2)`).text(),
    Type: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(6) > td:nth-child(2)`).text(),
    Size: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(7) > td:nth-child(2)`).text(),
    SpeedAvgMax: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(8) > td:nth-child(2)`).text(),
    DraughtAVG: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(9) > td:nth-child(2)`).text(),
    GRT: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(10) > td:nth-child(2)`).text(),
    DWT: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(11) > td:nth-child(2)`).text(),
    Owner: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(12) > td.vessels_table_key`).text(),
    Build: $v(`#content_in > div > div.listbox.listbox_tr1.ads_160_right > div.listbox_content.can_select.tablevessel > div.vessels_main_data.cell > table > tbody > tr:nth-child(13) > td:nth-child(2)`).text(),
    Information: $v(`#content_in > div > div:nth-child(4) > div.listbox_content.paddleftright.font13`).text(),
    Longitude: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)`).text(),  
    Latitude: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)`).text(),
    Status: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)`).text(),
    Speed: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2)`).text(),
    Course: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2)`).text(),
    Area: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child(2)`).text(),
    Port: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(7) > td:nth-child(2)`).text(),
    Station: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(1) > tbody > tr:nth-child(8) > td:nth-child(2)`).text(),
    LastPort: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(2)`).text(),
    Destination: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)`).text(),
    ETA: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(2)`).text(),
    Draught: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(2)`).text(),
    PositionReceived: $v(`#content_in > div > div:nth-child(5) > div.listbox_content.can_select.paddfull > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(2)`).text(),
    DestinationPort: $v(`#content_in > div > div:nth-child(7) > div.listbox_content > table > tbody > tr > td:nth-child(1) > a`).text(),
    ScheduledArrival : $v(`#content_in > div > div:nth-child(7) > div.listbox_content > table > tbody > tr > td:nth-child(2) > span`).text(),
    EstimatedArrival: $v(`#content_in > div > div:nth-child(7) > div.listbox_content > table > tbody > tr > td:nth-child(3) > span`).text(),
    
    

};

res.status(200).json(msg);    

})();



   
   
	
});


app.get(/^(?!\/api).+/, (stdreq, stdres) => {
	var query = stdreq.query;
	
	stdres.sendFile(path.join(__dirname + '/public/index.html'));
});


console.log(`✅ \x1b[32m Backend Server`);
console.log(`💡 \x1b[33m HTML Build in Public`);
console.log(` ❌ \x1b[31m System with Debug`);
console.log(` 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);

app.listen(PORT, () =>

	console.log(`✅  \x1b[32m  Server started: ${URL}`)

);
