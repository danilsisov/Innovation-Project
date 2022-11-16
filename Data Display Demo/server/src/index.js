//Type ES Module
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

//local JS files
import * as databaseHandler from "./databaseHandler.js";
import * as generator from "./generator.js";
import * as updateHandler from "./updateHandler.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

const urlConnect = "";
await mongoose.connect("Enter the URL here");

//display data of user between dates
app.get("/findData/:userid/:date1/:date2", async (req, res) => {
    let userid = req.params.userid,
        date_from = req.params.date1,
        date_to = req.params.date2;

    //check packages of specific user or all users at a certain period
    await databaseHandler.displayUserData(res, userid, date_from, date_to);
})

//display package data
app.get("/findData/:package_id/", async (req, res) => {
    let package_id = req.params.package_id;

    //check packages of specific user or all users at a certain period
    await databaseHandler.displayPackageData(res, package_id);
})

app.put("/findData/:userid/:date1/:date2", async (req) => {
    let userid = req.params.userid,
        date_from = req.params.date1,
        date_to = req.params.date2;
    await databaseHandler.jsonWriterClient(userid, date_from, date_to);
})

app.put("/findData/:package_id/", async (req) => {
    let package_id = req.params.package_id;
    await databaseHandler.jsonWriter(package_id);
})

//export user data from a specific period
app.post("/dataExportUser", async (req) => {
    //ideally should get the user id and selected time periods for date
    console.log("Check some");
    let userid = req.body.userid,
        date_from = req.body.date1,
        date_to = req.body.date2;

    await databaseHandler.exportUserHistory(userid, date_from, date_to);
})

app.post("/dataExportAll", async () => {
    console.log("Check all");
    await databaseHandler.exportAllHistory();
})

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});

