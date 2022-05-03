// Simple Express server setup to serve the build output
//import path from "path";
import express from "express";
//import bodyParser from "body-parser";
//import cors from "cors";
import dotenv from "dotenv";
//import allRouter from "./router/all.js";



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


app.get(/^(?!\/api).+/, (stdreq, stdres) => {
	var query = stdreq.query;
	console.log("Other Queries : ",query);
	stdres.sendFile(path.join(__dirname + '/public/index.html'));
});


console.log(`✅ \x1b[32m Backend Server`);
console.log(`💡 \x1b[33m Reactjs Build in Public`);
console.log(` ❌ \x1b[31m System with Debug`);
console.log(` 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);

app.listen(PORT, () =>

	console.log(`✅  \x1b[32m  Server started: ${URL}`)

);
