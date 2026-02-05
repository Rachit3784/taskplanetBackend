import e from "express";

import dotenv from "dotenv"

import { Dburl } from "./config/ENV_variable.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { ConnectDB } from "./config/ConnectDB.js";

import { UserRouter } from "./routes/User.routes.js";


import { ProfileRouter } from "./routes/ProfileManagementRoute.js";
import { PostRouter } from "./routes/PostRouter.js";

dotenv.config();


export const app = e();

const start = async ()=>{
  // console.log("Hello")
    
    app.use(e.json());
    app.use(cookieParser());

const whitelist = [ 'https://taskplanet-frontend-pi.vercel.app', 'http://localhost:5173' ];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 204

};

app.use(cors(corsOptions));

// Handle preflight requests centrally to avoid using path patterns that break some router versions
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Apply CORS middleware for this preflight request and finish
    return cors(corsOptions)(req, res, () => res.status(204).end());
  }
  // Ensure credentials header is available on responses
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

   app.use('/authenticate',UserRouter)
  app.use('/post',PostRouter);
   app.use('/profile-manage',ProfileRouter);
   await  ConnectDB(Dburl)
}


start();