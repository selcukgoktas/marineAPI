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

const scrap_url = 'https://www.myshiptracking.com/vessels/'+mmsi;


(async () => {

   // console.log("Scrap url : "+scrap_url);

    const options ={
        method:'GET',
        url:scrap_url
     };

    const scrap_res= await axios(options);
   // console.log('Scrap Response : '+scrap_res.data);

   const $ = cheerio.load(scrap_res.data);




//const vesselUrl = $(`#content_in > div > div.listbox.anc_activity.ads_160_right > div > table > tbody > tr > td:nth-child(2) > span.table_title.table_vessel_title > a`).attr('href');

const gourl='https://www.myshiptracking.com/vessels/'+mmsi;
const mapurl="https://www.myshiptracking.com/?mmsi="+mmsi;

console.log("New url : "+gourl);

const vesOptions={
method:'GET',
url:gourl
};


const scrap_ves=await axios(vesOptions);

const $v = cheerio.load(scrap_ves.data);



const msg = {
    mmsi,
    gourl,
    mapurl,
    
    Name: $v(`#stick-id-3 > div > div > div > div.d-flex.p-2.text-center.text-sm-left.flex-grow-1.justify-center-sm > div > div:nth-child(1)`).text(),
    FlagPng: "https://www.myshiptracking.com/"+$v(`#vsl-info-card > table > tbody > tr:nth-child(4) > td > div > img`).text(),
    Flag:$v(`#vsl-info-card > table > tbody > tr:nth-child(4) > td > div`).text(),
    IMO: $v(`#vsl-info-card > table > tbody > tr:nth-child(2) > td`).text(),
    CallSign: $v(`#vsl-info-card > table > tbody > tr:nth-child(5) > td`).text(),
    Type: $v(`#content_in_txt > div:nth-child(7) > div > div.mst-flex-wrapper.order-10.order-lg-2 > div.mst-flex-item.mst-flex-60.pl-2.pr-2.toMobHide > div > div.card-body.p-3.p-sm-3 > p:nth-child(3) > strong:nth-child(2)`).text(),
    Size: $v(`#vsl-info-card > table > tbody > tr:nth-child(6) > td`).text(),
    SpeedAvg: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(1) > tr:nth-child(3) > td`).text(),
    SpeedMax: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(1) > tr:nth-child(4) > td`).text(),
    DraughtAVG: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(1) > tr:nth-child(5) > td`).text(),
    GRT: $v(`#vsl-info-card > table > tbody > tr:nth-child(7) > td`).text(),
    DWT: $v(`#vsl-info-card > table > tbody > tr:nth-child(8) > td`).text(),
  
    Build: $v(`#vsl-info-card > table > tbody > tr:nth-child(9) > td`).text(),
    Information: $v(`#content_in_txt > div:nth-child(7) > div > div.mst-flex-wrapper.order-10.order-lg-2 > div.mst-flex-item.mst-flex-60.pl-2.pr-2.toMobHide > div > div.card-body.p-3.p-sm-3`).text(),
    Longitude: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(1) > td`).text(),  
    Latitude: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(2) > td`).text(),
    Status: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(3) > td`).text(),
    Speed: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(4) > td > i`).text(),
    Course: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(5) > td`).text(),
    Area: $v(`#ft-position > div > div.card-body.p-2.p-sm-4.position-relative.bg-transparent > table > tbody > tr:nth-child(6) > td`).text(),
    from: $v(`#vpage-current-trip > div.d-flex.flex-grow-1.overflow-hidden > div > div:nth-child(1) > div > div:nth-child(1) > h3 > a`).text(),
    to: $v(`#vpage-current-trip > div.d-flex.flex-grow-1.overflow-hidden > div > div.flex-grow-1.w-50-force.myst-arrival-cont.arrived.z1 > div > div:nth-child(1) > h3 > a`).text(),
    tripTime: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(1) > tr:nth-child(1) > td`).text(),
    PositionReceived: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(2) > tr:nth-child(5) > td > span`).text(),
    tripDistance: $v(`#ft-trip > div:nth-child(1) > div > div.card-body.p-2.p-sm-3 > div.d-flex.border-top.flex-column.flex-sm-row.pt-sm-2.mt-3 > div.p-sm-2.mt-3.mt-sm-0.flex-fill > table > tbody:nth-child(1) > tr:nth-child(2) > td`).text(),
    fromDateTime: $v(`#vpage-current-trip > div.d-flex.flex-grow-1.overflow-hidden > div > div:nth-child(1) > div > div.px-1`).text(),
    toDateTime: $v(`#vpage-current-trip > div.d-flex.flex-grow-1.overflow-hidden > div > div.flex-grow-1.w-50-force.myst-arrival-cont.arrived.z1 > div > div:nth-child(5)`).text(),
    company: $v(`#companysect > div > strong`).text(),
   
    
    

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
