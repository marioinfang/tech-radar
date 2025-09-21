import express from 'express';
import {UserRole} from "../models/user.model.js";
import {requireRole} from "../middlewares/role.middleware.js";
import {
    getTechnologies,
    getTechnology,
    createTechnology,
    updateTechnology,
    deleteTechnology,
} from '../controllers/technology.controller.js';

const technologyRouter = express.Router();

technologyRouter.get('/', requireRole(UserRole.CTO, UserRole.EMPLOYEE), getTechnologies);
technologyRouter.get('/:id', requireRole(UserRole.CTO, UserRole.EMPLOYEE), getTechnology);
technologyRouter.post('/', requireRole(UserRole.CTO), createTechnology);
technologyRouter.put('/:id', requireRole(UserRole.CTO), updateTechnology);
technologyRouter.delete('/:id', requireRole(UserRole.CTO), deleteTechnology);

export { technologyRouter };