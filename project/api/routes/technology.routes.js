import express from 'express';
import {
    getTechnologies,
    getTechnology,
    createTechnology,
    updateTechnology,
    deleteTechnology,
} from '../controllers/technology.controller.js';

const technologyRouter = express.Router();

technologyRouter.get('/', getTechnologies);
technologyRouter.get('/:id', getTechnology);
technologyRouter.post('/', createTechnology);
technologyRouter.put('/:id', updateTechnology);
technologyRouter.delete('/:id', deleteTechnology);

export { technologyRouter };