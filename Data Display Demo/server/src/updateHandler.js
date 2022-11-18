import mongoose from "mongoose";
import PackageModel from "../models/packages.js";

//5 seconds, modify if needed
const intervalTime = 5000;

//update package status randomly between every 5 minute. Modify time if needed
/*setInterval(updatePackageStatus, Math.floor(Math.random() * 300000));

//updates time and dist of packages with On the way status
setInterval(updatePackageTimeDist, intervalTime);*/

export async function updatePackageStatus() {
    let check = Math.floor(Math.random() * 3);
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
            break;
    }
}

async function updatePackageTimeDist() {
    //the deliv time and dist should only start decreasing when it's on the way
    //however I'm leaving these for testing purposes
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
        {status: "Unshipped"} , {status: "Sorting"}
    ).then((result) =>{
        if (result != null)
            console.log("Updated state of package " + result.item_id + " to Sorting");
    });
}

async function toOnTheWay() {
    await PackageModel.findOneAndUpdate(
        {status: "Sorting"} , {status: "On the way"}
    ).then((result) =>{
        console.log("Updated state of package " + result.item_id + " to On the way")
    });
}

async function toDelivered() {
    await PackageModel.find(
        {status: "On the way"}
    )
    .then(async (result) => {
        for (const item of result) {
            console.log(item);
            if (item.dist_in_km == 0 && item.delivery_time_in_mins == 0) {
                await PackageModel.findOneAndUpdate(
                    {item_id: item.item_id},
                    {status: "Delivered", dist_in_km: 0, delivery_time_in_mins: 0}
                );
                console.log(item.item_id + " has been updated to Delivered");
            }
        }
    })
}

async function updateTime(result) {
    //5 seconds of a minute is 5/60 ~= 0.08333, intervalTime is converted
    let updatedTime = result.delivery_time_in_mins - ((intervalTime/1000)/60);
    if (updatedTime < 0) updatedTime = 0;
    await PackageModel.findOneAndUpdate(
        {item_id: result.item_id},
        {delivery_time_in_mins: updatedTime}
    )/*
    console.log("Updated package " + result.item_id);
    console.log("Previous time: " + result.delivery_time_in_mins.toFixed(2));
    console.log("current time: " + updatedTime.toFixed(2) + " minutes");*/
}

async function updateDist(result) {
    //d = v * t, t = d/v. Assume the package moves at 30 km/h nonstop, = 0.5 km/m
    //added an extra Math.random to simulate things like red lights, pauses
    // (has to be smaller than (intervalTime/1000)/60 which is roughly 0.083
    let updatedDist = result.dist_in_km - ((intervalTime/1000)/60) * 0.5 + Math.random() * 0.03;
    if (updatedDist < 0) updatedDist = 0;
    await PackageModel.findOneAndUpdate(
        {item_id: result.item_id},
        {dist_in_km: updatedDist}
    )/*
    console.log("Updated package " + result.item_id);
    console.log("Previous distance: " + result.dist_in_km.toFixed(2));
    console.log("current distance: " + updatedDist.toFixed(2) + " km");*/
}

