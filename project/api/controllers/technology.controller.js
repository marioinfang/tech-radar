import {connectDB} from "../config/db.config.js";
import {ObjectId} from "mongodb";

const getTechnologies = async (req, res) => {
    const { technologyCollection } = await connectDB();
    const result = await technologyCollection.find({}).toArray();
    res.json(result);
};

const getTechnology = async (req, res) => {
    const { technologyCollection } = await connectDB();
    const result = await technologyCollection.findOne({ _id: new ObjectId(req.params.id) });

    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(404).json({ message: 'Technology not found' });
    }
}

const createTechnology = async (req, res) => {
    console.log(req.body);
    const { technologyCollection } = await connectDB();
    const result = await technologyCollection.insertOne(req.body);

    res.status(201).json(result);
}

const updateTechnology = async (req, res) => {
    const { technologyCollection } = await connectDB();

    const result = await technologyCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body } );

    res.status(200).json(result);
}

const deleteTechnology = async (req, res) => {
    const { technologyCollection } = await connectDB();

    const result = await technologyCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.status(200).json(result);
}

export { getTechnologies, getTechnology, createTechnology, updateTechnology, deleteTechnology };