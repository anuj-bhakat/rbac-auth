// import faker from 'faker';
import { faker } from '@faker-js/faker';
import Records from '../models/records.js';
import { Types } from 'mongoose';

// Get all records
export const getAllRecord = async (req, res, next) => {
    try {
        const records = await Records.find();
        return res.json(records);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch records.' });
    }
};

// Create a new record
export const createRecord = async (req, res, next) => {
    try {
        const { productName, price } = req.body;
        const newRecord = new Records({ productName, price });
        await newRecord.save();

        return res.json({
            message: "New product saved successfully.",
            product: newRecord,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create record.' });
    }
};

// Update a record
export const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { productName, price } = req.body;

        const record = await Records.findOneAndUpdate(
            { _id: id },
            { $set: { productName, price } },
            { new: true }
        );

        return res.json({
            message: "Product updated successfully.",
            product: record,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update record.' });
    }
};

// Delete a record
export const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Records.findOneAndDelete({ _id: id });

        return res.json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete record.' });
    }
};

// Generate dummy records
const generateRandomRecords = () => {
    const records = [];
    for (let i = 0; i < 50; i++) {
        const productName = faker.commerce.productName();
        const price = Math.floor(Math.random() * 99) + 1;
        records.push({ productName, price });
    }
    return records;
};

// Insert dummy records into DB
const insertRecords = async () => {
    try {
        const records = generateRandomRecords();
        await Records.insertMany(records);
        console.log("Records inserted successfully");
    } catch (error) {
        console.error(error);
    }
};

// Init route for inserting records
export const init = async (req, res, next) => {
    await insertRecords();
    return res.send("Records inserted successfully");
};
