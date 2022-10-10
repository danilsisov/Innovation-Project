<<<<<<< Updated upstream
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PackageModel = require("./models/packages");
const cors = require("cors");

mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");
=======
const app = express();
import { faker } from '@faker-js/faker';
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";

import PackageModel from "./models/packages.js";
>>>>>>> Stashed changes

app.use(express.json());
app.use(cors());

<<<<<<< Updated upstream
=======
//Type ES Module

async function seedDB() {
    try {
        await mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");
        //generate new package
        let newPackage = {
            storage_id: faker.helpers.arrayElement(['Storage A', 'Storage B', 'User address']),
            //price: faker.finance.amount(),
            item_id: faker.internet.password(),
            //Item_name: faker.commerce.product(),
            geometry: {
                location_coords: faker.address.nearbyGPSCoordinate(
                    [60.192059, 24.945831],
                    20,
                    true
                )
            },
            // 20 km area from the center of Helsinki (most likely need to change city as Helsinki is close to water)
            location_id: faker.internet.password(),
            client_id: faker.datatype.uuid(), //maybe limit options??? Otherwise all users will be unique
            date: faker.date.between(
                '2020-08-01T00:00:00.000Z',
                '2023-03-01T00:00:00.000Z'
            ),
            status: faker.helpers.arrayElement(['On the way', 'Delivered', 'Sorting', 'Not received by delivery']),
            // can also add names of users, zipcode, email, properties of package (size,weight...), also can add avatar picture
            // need to think of time it took to deliver
        }
        const new_package = new PackageModel(newPackage);
        await new_package.save();
        console.log("working");
    }
    catch (err) {
        console.log(err.stack);
    }
}

>>>>>>> Stashed changes
app.get("/getPackages", (req, res) => {
    PackageModel.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        }
        else {
            console.log(result);
            res.json(result);
        }
    });
});

<<<<<<< Updated upstream
//unable to save date???
app.post("/createPackage", async (req, res) => {
    const new_package = new PackageModel(req.body);
    await new_package.save();
    res.json(req.body);
})

//"npm start" in server directory should suffice, see package.json -> "script" -> "start"
=======
app.get("/gen", async () => {
    await seedDB();
})

>>>>>>> Stashed changes
app.listen(3001, () => {
    console.log("Server is running at port 3001");
});