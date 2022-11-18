import {faker} from "@faker-js/faker";
import PackageModel from "../models/packages.js";
import UserModel from "../models/users.js";
import mongoose from "mongoose";

//generate new data. Adjust time if needed, expect ~5 packages per second max
/*setInterval(createRandomUser, 100);*/
/*setInterval(createOldPackage, 20);
setInterval(createPackage, 30);*/

async function createRandomUser() {
    let newUser = {
        user_id: faker.datatype.uuid()
    }
    const new_user = new UserModel(newUser);
    await new_user.save();
    console.log("Generated new user");
}

/**
* Deliv_time get a random time between 9-12 and 13-16.
 * It'll be concatenated with a random date generated in the package creation
**/

async function createPackage() {
    let holder = storagePicker();
    let distance = distanceCalculator(holder[2], holder[3], holder[0], holder[1]);
    let deliv_time = faker.helpers.arrayElement([
        faker.date.between('2020-08-01T13:00:00.000', '2020-08-01T16:00:00.000'),
        faker.date.between('2020-08-01T09:00:00.000', '2020-08-01T12:00:00.000'),
    ]);

    try {
        //helps pick a random user from the database
        let randomizer = Math.floor(Math.random() * await UserModel.countDocuments());
        let newPackage = {
            item_id: faker.internet.password(),
            client_id: await UserModel.findOne().skip(randomizer).then((result) => {
                return (result.user_id);
            }),
            location: {
                type: 'Point',
                coordinates: [holder[0], holder[1]]
            },
            storage_id: holder[4],
            status: faker.helpers.arrayElement(['Unshipped', 'Sorting', 'On the way']),
            dist_in_km: distance,
            delivery_time_in_mins: ((distance/30)*60)+ Math.random() * ((distance/30)*60) * 0.25,
            date: new Date(faker.date.between('2020-08-01T00:00:00.000', '2023-03-01T00:00:00.000')
                .toISOString()
                .substr(0, 11)
                .concat('', just_time(deliv_time)))

        }
        const new_package = new PackageModel(newPackage);
        await new_package.save();
        console.log("Generated new package");
    }
    catch (err) {
        console.log(err.stack);
    }
}

//for populating database with past deliveries
async function createOldPackage() {
    let holder = storagePicker();
    let deliv_time = faker.helpers.arrayElement([
        faker.date.between('2020-08-01T16:00:00.000', '2020-08-01T19:00:00.000'),
        faker.date.between('2020-08-01T12:00:00.000', '2020-08-01T15:00:00.000'),
    ]);
    try {
        //helps pick a random user from the database
        let randomizer = Math.floor(Math.random() * await UserModel.countDocuments());
        let oldPackage = {
            item_id: faker.internet.password(),
            client_id: await UserModel.findOne().skip(randomizer).then((result) => {
                return (result.user_id);
            }),
            location: {
                type: 'Point',
                coordinates: [holder[0], holder[1]]
            },
            storage_id: holder[4],
            status: "Delivered",
            dist_in_km: 0,
            delivery_time_in_mins: 0,
            date: new Date(faker.date
                .between('2020-08-01T00:00:00.000', '2022-03-01T00:00:00.000')
                .toISOString()
                .substr(0, 11)
                .concat('', just_time(deliv_time)))
        }
        const old_package = new PackageModel(oldPackage);
        await old_package.save();
        console.log("Generated old package");
    }
    catch (err) {
        console.log(err.stack);
    }
}

function just_time(timestamp){  //take Date object and extract time out of it
    let time = timestamp.toISOString(); //convert from date type to string
    return time.substr(11,12); //extract and return time
}

///function to calculate distance in km between two coordinate points on the map
function distanceCalculator(x1, y1, x2, y2) {
    if ((x1 == x2) && (y1 == y2)) {
        return 0;
    }
    else {
        var radx1 = Math.PI * x1/180;
        var radx2 = Math.PI * x2/180;
        var theta = y1-y2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radx1) * Math.sin(radx2) + Math.cos(radx1) * Math.cos(radx2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344; ///return in km
    }
}

function coordinatesGenerator(index, long, lat, rad) {
    return parseFloat(faker.address.nearbyGPSCoordinate(
        [long, lat],
        rad,
        true
    )[index]) ;
}

function storagePicker() {
    //xy is the destination, x0 y0 is the starting point AKA storage (there are 3 around Helsinki area)
    let holder = [];
    let x, y, x0, y0;
    let storage_picker = Math.floor(Math.random() * 3);
    switch (storage_picker) {
        case 0:
            x0 = 24.902729;
            y0 = 60.250690;
            x = coordinatesGenerator(0, x0, y0, 5);
            y = coordinatesGenerator(1, x0, y0, 5);
            holder.push(x, y, x0, y0, 'Storage A');
            return holder;
        case 1:
            x0 = 25.048008;
            y0 = 60.249280;
            x = coordinatesGenerator(0, x0, y0, 3);
            y = coordinatesGenerator(1, x0, y0, 3);
            holder.push(x, y, x0, y0, 'Storage B');
            return holder;
        case 2:
            x0 = 24.937641;
            y0 = 60.206252;
            x = coordinatesGenerator(0, x0, y0, 1);
            y = coordinatesGenerator(1, x0, y0, 1);
            holder.push(x, y, x0, y0, 'Storage C');
            return holder;
    }
}

