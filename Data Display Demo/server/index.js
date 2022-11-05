//Type ES Module
const app = express();
import { faker } from '@faker-js/faker';
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";

import {Parser} from 'json2csv';

import PackageModel from "./models/packages.js";
import * as fs from "fs";

app.use(express.json());
app.use(cors());

//insert link here. Removed for safety reasons
await mongoose.connect("");

/** TO DO:
 * Add final destination coordinates
 * Check ETA, calculate road speed and time it takes
 *
 * Improve data update
 * */

//generate new data every 30s
/*setInterval(seedDB, 1000);*/

//update preexisting data every 20s
/*setInterval(dataUpdate, 50);*/

//display data of user between dates
app.get("/findData/:searched_uid/:date1/:date2", async (req, res) => {
    let searched_uid = req.params.searched_uid,
        date_from = req.params.date1,
        date_to = req.params.date2;

    //check packages of specific user or all users at a certain period
    await DisplayData(res, searched_uid, date_from, date_to);
})

//export user data from a specific period
app.post("/dataExport", async (req, res) => {
    //ideally should get the user id and selected time periods for date
    let searched_uid = req.body.searched_uid,
        date_from = req.body.date1,
        date_to = req.body.date2;

    await exportUserHistory(searched_uid, date_from, date_to);
})

app.post("/dataExportAll", async (res) => {
    await exportAllHistory();
})

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});

//add more logic (e.g. if it's unshipped then give it no storage ID)
//maybe keep everything as unshipped at the start?
async function seedDB() {
    try {
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
            status: faker.helpers.arrayElement([/*'On the way', 'Delivered', 'Sorting', */'Unshipped']),
            // can also add names of users, zipcode, email, properties of package (size,weight...), also can add avatar picture
            // need to think of time it took to deliver
        }
        const new_package = new PackageModel(newPackage);
        await new_package.save();
        console.log("Generated new data");
    }
    catch (err) {
        console.log(err.stack);
    }
}

//updates status (there will be more) of package
async function dataUpdate() {
    let check = Math.floor(Math.random() * 4);
    let updated;
    switch (check) {
        //PROBLEM: findoneandupdate updates everything
        case 0:
            updated = await PackageModel.findOneAndUpdate({status: "Unshipped"} , {status: "Sorting"});
        case 1:
            updated = await PackageModel.findOneAndUpdate({status: "Sorting"} , {status: "On the way"});
        case 2: //in case it goes through another checkpoint
            updated = await PackageModel.findOneAndUpdate({status: "On the way"} , {status: "Sorting"});
        case 3:
            updated = await PackageModel.findOneAndUpdate({status: "On the way"} , {status: "Delivered"});
    }
    console.log("Updated case " + check + "\n" + updated)
}

async function DisplayData(res, searched_uid, date_from, date_to) {
    if (searched_uid.toLowerCase() == "all") {
        await PackageModel.find({
            date:
                {
                    $gt: new Date(0),
                    $lt: new Date()
                }
        }).lean().exec((err, data) => {
            if (err) res.json(err);
            else res.json(data);
        });
    }

    else {
        await PackageModel.find({
            client_id: searched_uid,
            date:
                {
                    $gt: new Date(date_from),
                    $lt: new Date(date_to)
                }
        }).lean().exec((err, data) => {
            if (err) res.json(err);
            else res.json(data);
        });
    }
}

async function exportUserHistory(searched_uid, date_from, date_to) {
    await PackageModel.find({
        client_id: searched_uid,
        date:
            {
                $gt: new Date(date_from),
                $lt: new Date(date_to)
            }
    }).lean().exec((err, data) => {
        if (err) throw err;
        const fields = ['client_id', 'item_id', 'status', 'date'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //try to change it to the local PC's download folder
        fs.writeFile("C:\\Users\\thaid\\OneDrive\\Desktop\\Data Display Demo\\"+searched_uid+"_"+date_from+"_"+date_to+".csv", csv_data, function(error) {
            if (error) throw error;
        });
    });
}

//exports all data
async function exportAllHistory() {
    await PackageModel.find({
        date:
            {
                $gt: new Date(0),
                $lt: new Date()
            }
    }).lean().exec((err, data) => {
        if (err) throw err;
        //add more fields if needed
        const fields = ['client_id', 'item_id', 'status', 'date'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //try to change it to the local PC's download folder
        fs.writeFile("C:\\Users\\thaid\\OneDrive\\Desktop\\Data Display Demo\\exportedAll.csv", csv_data, function(error) {
            if (error) throw error;
        });
    });
}
