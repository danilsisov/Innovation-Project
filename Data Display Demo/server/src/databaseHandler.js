import PackageModel from "../models/packages.js";
import {Parser} from "json2csv";
import fs from "fs";
import mongoose from "mongoose";

export async function displayUserData(res, userid, date_from, date_to) {
    if (userid.toLowerCase() == "all") {
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
            client_id: userid,
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

export async function displayPackageData(res, package_id) {
    await PackageModel.find({
        item_id: package_id
    }).lean().exec((err, data) => {
        if (err) res.json(err);
        else res.json(data);
    });
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
        const fields = ['client_id', 'item_id', 'status', 'date'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //try to change it to the local PC's download folder
        fs.writeFile("C:\\Users\\thaid\\OneDrive\\Desktop\\new data display\\Data Display Demo\\"+searched_uid+"_"+date_from+"_"+date_to+".csv", csv_data, function(error) {
            if (error) throw error;
        });
    });
}

//exports entire collection
export async function exportAllHistory() {
    await PackageModel.find({
        date:
            {
                $gt: new Date(0),
                $lt: new Date()
            }
    }).lean().exec((err, data) => {
        //add more fields if needed
        const fields = ['client_id', 'item_id', 'status', 'date'];
        const parser = new Parser({fields});
        const csv_data = parser.parse(data);
        //try to change it to the local PC's download folder
        fs.writeFile("insert local address here", csv_data, function(error) {
            if (error) throw error;
        });
    });
}

export async function jsonWriter(package_id) {
    await PackageModel.find({
        item_id: package_id
    }).lean().exec((err, data) => {
        if (data[0] != undefined) {
            let newJSON = {
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            "title": package_id
                        },
                        "geometry": {
                            "coordinates": data[0].location.coordinates,
                            "type": "Point"
                        }
                    }
                ],
                "type": "FeatureCollection"
            }
            let insert = JSON.stringify(newJSON, null, 2);
            fs.writeFileSync('--INSERT START OF ADDRESS HERE--\\Data Display Demo\\client\\src\\components\\data\\test.json', insert);
        }
    });
}

export async function jsonWriterClient(userid, date_from, date_to) {
    await PackageModel.find({
        client_id: userid,
        date:
            {
                $gt: new Date(date_from),
                $lt: new Date(date_to)
            }
    }).lean().exec((err, data) => {
        let baseJson = {
            "features": [
            ],
            "type": "FeatureCollection"
        }
        data.forEach((item) => {
            baseJson.features.push(
                {
                    "type": "Feature",
                    "properties": {
                        "title": item.item_id
                    },
                    "geometry": {
                        "coordinates": item.location.coordinates,
                        "type": "Point"
                    }
                }
            )
        })
        let insert = JSON.stringify(baseJson, null, 2);
        fs.writeFileSync('--INSERT START OF ADDRESS HERE--\\Data Display Demo\\client\\src\\components\\data\\test.json', insert);});

}