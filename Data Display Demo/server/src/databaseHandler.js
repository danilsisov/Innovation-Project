//updates status (there will be more) of package
import PackageModel from "../models/packages.js";
import {Parser} from "json2csv";
import fs from "fs";

setInterval(dataUpdate, 10000);

//update preexisting data in intervals. check if you can improve
export async function dataUpdate() {
    let check = Math.floor(Math.random() * 4);
    let randomizer = Math.floor(Math.random() * await PackageModel.countDocuments());
    let updated;
    switch (check) {
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

export async function DisplayData(res, searched_uid, date_from, date_to) {
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

export async function exportUserHistory(searched_uid, date_from, date_to) {
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

//exports all data, admin rights only
export async function exportAllHistory() {
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