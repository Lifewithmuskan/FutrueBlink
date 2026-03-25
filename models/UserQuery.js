import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
    question: String,
     answer: String
},{ timestamps: true });

const Query = mongoose.model("Query", querySchema);

export default Query;  