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

await mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");

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

//generate new data every 30s
/*setInterval(seedDB, 1000);*/

//update preexisting data every 20s
/*setInterval(dataUpdate, 50);*/

app.get("/getPackages", (req, res) => {
    PackageModel.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        }
        else {
            console.log("Found data");
            res.json(result);
        }
    });
});

//export test, exports entire database
/*app.get("/export", async () => {
    await PackageModel.find().lean().exec((err, data) => {
        if (err) throw err;
        const fields = ['item_id', 'client_id'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //manually config your location, although I may change it to the PC's download folder
        fs.writeFile("C:\\Users\\thaid\\OneDrive\\Desktop\\Data Display Demo\\exported.csv", csv_data, function(error) {
            if (error) throw error;
            console.log("Exported successfully!");
        });
    });
})*/

app.get("/datesSelect", async (req, res) => {
  res.send(200);
})

//testing for export
app.post("/datesSelect", async (req, res) => {
    //ideally should get the user id and selected time periods for date
    let searched_uid = req.body.searched_uid,
        date_from = req.body.date1,
        date_to = req.body.date2;

    await PackageModel.find({
        //adjust item id, test for now
        client_id: searched_uid,
        //pass the dates as query!!! also ensure date1 < date2
        date:
            {
                $gt: new Date(date_from),
                $lt: new Date(date_to)
            }
    }).lean().exec((err, data) => {
        if (err) throw err;
        //use all the fields
        const fields = ['client_id', 'item_id', 'status', 'date'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //manually config your location, although I may change it to the PC's download folder
        fs.writeFile("C:\\Users\\thaid\\OneDrive\\Documents\\GitHub\\Innovation-Project\\Data Display Demo\\exported.csv", csv_data, function(error) {
            if (error) throw error;
            console.log("Exported successfully!");
        });
    });
    res.status(200);
    console.log("Exported data of" + searched_uid + " from " + date_from + " to " + date_to)
})

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});