import express from 'express';
import {
    login,
    logout,
    userInformation
} from "../controllers/auth.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/logout', verifyToken, logout)
authRouter.get('/me', verifyToken, userInformation);

export { authRouter };