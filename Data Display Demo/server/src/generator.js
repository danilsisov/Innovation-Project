//add more logic (e.g. if it's unshipped then give it no storage ID)
//maybe keep everything as unshipped at the start?
import {faker} from "@faker-js/faker";
import PackageModel from "../models/packages.js";
import UserModel from "../models/users.js";

//generate new data

/*setInterval(createRandomUser, 5000);

setInterval(createPackage, 2000);*/

export async function createRandomUser() {
    let newUser = {
        user_id: faker.datatype.uuid()
    }
    const new_user = new UserModel(newUser)
    await new_user.save();
    console.log("Generated new user");
}

export async function createPackage() {
    let x1 = coordinatesGenerator(0),
        y1 = coordinatesGenerator(1);
    try {
        //helps pick a random user from the database
        let randomizer = Math.floor(Math.random() * await UserModel.countDocuments());
        let newPackage = {
            location: {
                type: 'Point',
                coordinates: [x1, y1]
            },
            item_id: faker.internet.password(),
            client_id: await UserModel.findOne().skip(randomizer).then((result) => {
                return (result.user_id);
            }),
            storage_id: faker.helpers.arrayElement(['Storage A', 'Storage B']),
            status: faker.helpers.arrayElement(['Unshipped', 'Sorting'/*, 'On the way', 'Delivered'*/]),
            dist_in_km: distance(60.250690, 24.902729, x1, y1),
            delivery_time_in_mins: (((distance(60.250690, 24.902729, x1, y1))/30)*60)+ Math.floor((Math.random() * 20) + 1),
            date: faker.date.between(
                '2020-08-01T00:00:00.000Z',
                '2023-03-01T00:00:00.000Z'
            )
        }
        const new_package = new PackageModel(newPackage);
        await new_package.save();
        console.log("Generated new package");
    }
    catch (err) {
        console.log(err.stack);
    }
}

///function to calculate distance in km between two coordinate points on the map
function distance(x1, y1, x2, y2) {
    if ((x1 == x2) && (y1 == y2)) {
        return 0;
    }
    else {
        let radx1 = Math.PI * x1/180;
        let radx2 = Math.PI * x2/180;
        let theta = y1-y2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radx1) * Math.sin(radx2) + Math.cos(radx1) * Math.cos(radx2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1.609344; ///return in km
    }
}

function coordinatesGenerator(index) {
    return faker.address.nearbyGPSCoordinate(
        [60.250690, 24.902729],
        5,
        true
    )[index];
}
