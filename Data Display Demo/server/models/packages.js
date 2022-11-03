import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
    geometry: {
        user_address: { type: [Number], index: '2dsphere'}
    },
    item_id: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    storage_id: {
        type: String,
        required: true
    },/*
    location_id: {
        type: String,
        required: true
    },*/
    status: {
        type: String,
        default: "Delivery not started"
    },
    dist_in_km: {
        type: Number,
        required: true
    },
    delivery_time_in_mins: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: new Date().toLocaleDateString("en-US")
    },
})

const PackageModel = mongoose.model("packages", PackageSchema);
export default PackageModel;
