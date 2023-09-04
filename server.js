import cors from 'cors'
import http from 'http'
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import route from "./routes/routes"
import compression from 'compression';
import connect from "./helpers/db"
import errorHandler from './helpers/errorHandler';


const app = express();
 
// console.log(config.allowedDomains)
// app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(helmet())
app.use(compression())

// app.use('/api/playkeno', kenoRoute)

app.use("/", route);


const server = http.createServer(app);

server.listen(config.port, () => {
	connect();
	console.log("I'm connected to the backend!");
	
});