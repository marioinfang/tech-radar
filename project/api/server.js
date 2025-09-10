import express from 'express';
import { technologyRouter } from './routes/technology.routes.js';
import {logger} from "./middlewares/logger.middleware.js";
import {errorHandler} from "./middlewares/error-handler.middleware.js";

// Express Setup
const server = express();

// Middleware
server.use(express.json())
server.use(logger);

// Routers
server.use('/technology', technologyRouter);

// Error Handler Middleware
server.use(errorHandler);

server.listen(8000);
console.log('Server is running on port 8000');