//Type ES Module
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

//local JS files
import * as databaseHandler from "./databaseHandler.js";
import * as generator from "./generator.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
await mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");

/** TO DO:
 * Add final destination coordinates
 * Check ETA, calculate road speed and time it takes
 *
 * Improve data update
 * */


//display data of user between dates
app.get("/findData/:userid/:date1/:date2", async (req, res) => {
    let userid = req.params.userid,
        date_from = req.params.date1,
        date_to = req.params.date2;

    //check packages of specific user or all users at a certain period
    await databaseHandler.DisplayUserData(res, userid, date_from, date_to);
})

//display package data
app.get("/findData/:package_id/", async (req, res) => {
    let package_id = req.params.package_id;

    console.log(package_id);
    //check packages of specific user or all users at a certain period
    await databaseHandler.DisplayPackageData(res, package_id);
})

app.patch('/showPackagelocation/:package_id/', async (req, res) => {
    let package_id = req.params.package_id;
    await databaseHandler.DisplayPackageLocation(res, package_id);

})

//export user data from a specific period
app.post("/dataExportUser", async (req, res) => {
    //ideally should get the user id and selected time periods for date
    console.log("Check some");
    let userid = req.body.userid,
        date_from = req.body.date1,
        date_to = req.body.date2;

    await databaseHandler.exportUserHistory(userid, date_from, date_to);
})

app.post("/dataExportAll", async (res) => {
    console.log("Check all");
    await databaseHandler.exportAllHistory();
})

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});

