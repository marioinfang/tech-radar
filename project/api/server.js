import express from 'express';
import dotenv from 'dotenv';
import {logger} from "./middlewares/logger.middleware.js";
import {errorHandler} from "./middlewares/error-handler.middleware.js";
import {verifyToken} from "./middlewares/auth.middleware.js";
import {authRouter} from "./routes/auth.routes.js";
import {technologyRouter} from './routes/technology.routes.js';
import {connectDB} from "./config/db.config.js";
import {mockData} from "./config/mockData.config.js";
import cookieParser from "cookie-parser";

// Express Setup
const server = express();

// Environment Variables
dotenv.config();

// Middleware
server.use(express.json())
server.use(cookieParser());
server.use(logger);

// Routers
server.use('/auth', authRouter);
server.use('/technology', verifyToken, technologyRouter);

// Error Handler Middleware
server.use(errorHandler);

connectDB().then(async () => {
    await mockData();
    server.listen(8000, () => {
        console.log(`Server is running on port ${8000}`);
    });
});