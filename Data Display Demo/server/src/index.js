//Type ES Module
const app = express();
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";

//local JS files
import * as databaseHandler from "./databaseHandler.js"

app.use(express.json());
app.use(cors());
await mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");

/** TO DO:
 * Add final destination coordinates
 * Check ETA, calculate road speed and time it takes
 *
 * Improve data update
 * */


//display data of user between dates
app.get("/findData/:searched_uid/:date1/:date2", async (req, res) => {
    let searched_uid = req.params.searched_uid,
        date_from = req.params.date1,
        date_to = req.params.date2;

    //check packages of specific user or all users at a certain period
    await databaseHandler.DisplayData(res, searched_uid, date_from, date_to);
})

//export user data from a specific period
app.post("/dataExport", async (req, res) => {
    //ideally should get the user id and selected time periods for date
    let searched_uid = req.body.searched_uid,
        date_from = req.body.date1,
        date_to = req.body.date2;

    await databaseHandler.exportUserHistory(searched_uid, date_from, date_to);
})

app.post("/dataExportAll", async (res) => {
    await databaseHandler.exportAllHistory();
})

app.listen(3001, () => {
    console.log("Server is running at port 3001");
});

