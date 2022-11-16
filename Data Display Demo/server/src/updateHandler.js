import mongoose from "mongoose";
import PackageModel from "../models/packages.js";

/**
 * How to update many data at once without bottleneck?
 */

/** TO DO:
 * Add final destination coordinates
 * Improve data update if possible
 * */

//5 seconds, interchangeable
const intervalTime = 5000;


//either decrease intervals or increase elapsedTime in checker()
//update package status randomly between every 5 minute

/*
setInterval(updatePackageStatus, Math.floor(Math.random() * 300000));

setInterval(updatePackageTimeDist, intervalTime);
*/

//update location also! AND REMAINING DISTANCE!
export async function updatePackageStatus() {
    let check = /*Math.floor(Math.random() * 3)*/2;
    console.log("Checking case " + check);
    switch (check) {
        case 0:
            await toSorting();
            break;
        case 1:
            await toOnTheWay();
            break;
        case 2:
            await toDelivered();
            break;/*
        default:
            await checker();
            break;*/
        //maybe add cases for delivery problems
    }
}

//assume it updates every 10 seconds
async function updatePackageTimeDist() {
    //unsure if I should update the time and dist for Unshipped and Sorting yet,
    // since I assume that the deliv time should only count when it's on the way
    /*await PackageModel.find({status: "Unshipped"})
        .then((async (result) => {
            result.forEach((item) => {
                updateTime(item);
            })
        }))
    await PackageModel.find({status: "Sorting"})
        .then((async (result) => {
            result.forEach((item) => {
                updateTime(item);
            })
        }))*/
    await PackageModel.find({status: "On the way"})
        .then((async (result) => {
            result.forEach((item) => {
                updateTime(item);
                updateDist(item);
            })
        }))
}

async function toSorting() {
    await PackageModel.findOneAndUpdate(
        {status: "Unshipped"} , {status: "Sorting", date: new Date()}
    ).then((result) =>{
        if (result != null)
            console.log("Updated state of package " + result.item_id + " to Sorting");
    });
}

async function toOnTheWay() {
    await PackageModel.findOneAndUpdate(
        {status: "Sorting"} , {status: "On the way", date: new Date()}
    ).then((result) =>{
        console.log("Updated state of package " + result.item_id + " to On the way")
    });
}

//also need to update old Delivered data, some of them still have higher than 0 dist and time
async function toDelivered() {
    await PackageModel.find(
        {status: "On the way"}
    )
    .then(async (result) => {
        for (const item of result) {
            console.log(item);
            if (item.dist_in_km < 0.5 && item.delivery_time_in_mins < 1) {
                await PackageModel.findOneAndUpdate(
                    {item_id: item.item_id},
                    {status: "Delivered", date: new Date(), dist_in_km: 0, delivery_time_in_mins: 0}
                );
                console.log(item.item_id + " has been updated to Delivered");
            }
        }
    })
}

async function updateTime(result) {
    //5 seconds of a minute is 5/60 ~= 0.08333, intervalTime is converted
    let updatedTime = result.delivery_time_in_mins - ((intervalTime/1000)/60);
    await PackageModel.findOneAndUpdate(
        {item_id: result.item_id},
        {
            delivery_time_in_mins: updatedTime
        }
    )
    console.log("Updated package " + result.item_id);
    console.log("Previous time: " + result.delivery_time_in_mins.toFixed(2));
    console.log("current time: " + updatedTime.toFixed(2) + " minutes");
}

async function updateDist(result) {
    //d = v * t, t = d/v. Assume the package moves at 30 km/h nonstop, = 0.5 km/m
    let updatedDist = result.dist_in_km - ((intervalTime/1000)/60) * 0.5;
    await PackageModel.findOneAndUpdate(
        {item_id: result.item_id},
        //also need to update coordinates. Still need 2nd coords
        {
            dist_in_km: updatedDist
        }
    )
    console.log("Updated package " + result.item_id);
    console.log("Previous distance: " + result.dist_in_km.toFixed(2));
    console.log("current distance: " + updatedDist.toFixed(2) + " km");
}

/**
 * May need a function that calculates distance based on coordinates and time
 * */
