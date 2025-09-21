import {ObjectId} from "mongodb";
import {Technology} from "../models/technology.model.js";
import {UserRole} from "../models/user.model.js";
import {toTechnologyDto, mapTechnologyCreateDto, mapTechnologyUpdateDto} from "../models/technology.dto.js";

const getTechnologies = async (req, res) => {
    let query = {};

    if (req.user.role === UserRole.EMPLOYEE) {
        query = { published: { $ne: null } };
    }

    if (req.user.role === UserRole.CTO && req.query.published !== undefined) {
        if (req.query.published === "true") {
            query = { published: { $ne: null } };
        } else if (req.query.published === "false") {
            query = { published: null };
        }
    }

    const technologies = await Technology.find(query);

    console.log(technologies);
    res.json(technologies.map(toTechnologyDto));
};

const getTechnology = async (req, res) => {
    const result = await Technology.findById(req.params.id);

    if (!result) {
        return res.status(404).json({ message: 'Technology not found' });
    }

    if (req.user.role === UserRole.EMPLOYEE && !result.published) {
        return res.status(403).json({ message: 'Forbidden: Insufficient rights' });
    }

    if (result) {
        return res.status(200).json(toTechnologyDto(result));
    }
}

const createTechnology = async (req, res) => {
    const technology = mapTechnologyCreateDto(req.body);
    const result = await Technology.create(technology);
    return res.status(201).json(toTechnologyDto(result));
}

const updateTechnology = async (req, res) => {
    const technology = await Technology.findById(req.params.id);

    if (!technology) {
        return res.status(404).json({ message: 'Technology not found' });
    }

    const updatedTechnology = mapTechnologyUpdateDto(req.body, technology);

    const result = await Technology.findByIdAndUpdate(
        req.params.id,
        updatedTechnology,
        { new: true, runValidators: true }
    );

    return res.status(200).json(toTechnologyDto(result));
}

const deleteTechnology = async (req, res) => {
    const result = await Technology.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Technology not found' });
    }

    return res.status(200).json({ message: 'Technology deleted successfully' });
}

export { getTechnologies, getTechnology, createTechnology, updateTechnology, deleteTechnology };