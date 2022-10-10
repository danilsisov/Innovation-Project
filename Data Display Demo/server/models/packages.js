
<<<<<<< Updated upstream
const mongoose = require("mongoose");
=======
import mongoose from "mongoose";

>>>>>>> Stashed changes
const PackageSchema = new mongoose.Schema({
    //destination coordinates geojson
    //https://stackoverflow.com/questions/28749471/mongoose-schema-for-geojson-coordinates
    geometry: {
        location_coords: { type: [Number], index: '2dsphere'},
    },
    item_id: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date().toLocaleDateString("en-US")
    },
    //either locker number or user's home
    storage_id: {
        type: String
    },
    //either postal office or user's home
    location_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Delivery not started"
    }
})

const PackageModel = mongoose.model("packages", PackageSchema);
<<<<<<< Updated upstream
module.exports = PackageModel;
=======
export default PackageModel;
>>>>>>> Stashed changes
