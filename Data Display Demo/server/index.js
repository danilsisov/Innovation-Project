const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PackageModel = require("./models/packages");
const cors = require("cors");

mongoose.connect("mongodb+srv://minhdo:SI-E_Metropolia2019.@madd-cluster.d0ozgqq.mongodb.net/packages-database?retryWrites=true&w=majority");

app.use(express.json());
app.use(cors());

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

//unable to save date???
app.post("/createPackage", async (req, res) => {
    const new_package = new PackageModel(req.body);
    await new_package.save();
    res.json(req.body);
})

//"npm start" in server directory should suffice, see package.json -> "script" -> "start"
app.listen(3001, () => {
    console.log("Server is running at port 3001");
});