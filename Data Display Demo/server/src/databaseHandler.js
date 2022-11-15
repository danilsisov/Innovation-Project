//updates status (there will be more) of package
import PackageModel from "../models/packages.js";
import {Parser} from "json2csv";
import fs from "fs";

/*setInterval(dataUpdate, 2000);*/

//update location also!
export async function dataUpdate() {
    let check = Math.floor(Math.random() * 3);
    let updated;
    switch (check) {
        case 0:
            updated = await PackageModel.findOneAndUpdate(
                {status: "Unshipped"} , {status: "Sorting", date: new Date()}
            ).then((result)=> {
                console.log("Updated case " + check + " of package " + result.item_id)
            });
            break;
        case 1:
            updated = await PackageModel.findOneAndUpdate(
                {status: "Sorting"} , {status: "On the way", date: new Date()}
            ).then((result)=> {
                console.log("Updated case " + check + " of package " + result.item_id)
            });
            break;
        case 2: //in case it goes through another checkpoint
            updated = await PackageModel.findOneAndUpdate(
                {status: "On the way"} , {status: "Delivered", date: new Date()}
            ).then((result)=> {
                console.log("Updated case " + check + " of package " + result.item_id)
            });
            break;
        //maybe add case for delivery problems
    }
}

export async function DisplayUserData(res, userid, date_from, date_to) {
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

export async function DisplayPackageData(res, package_id) {
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

export async function DisplayPackageLocation(res, package_id) {

    await PackageModel.find({
        item_id: package_id
    }).lean().exec((err, data) => {
        if (err) res.json(err);
        else res.json(data);

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