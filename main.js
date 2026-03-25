import express from "express"
import connectDB from "./db.js";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

// import { connect } from "mongoose";
// import { Query } from "mongoose";
import Query from "./models/UserQuery.js";   
const app=express()
// app.set("view engine", "ejs");
// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

const db=connectDB();

app.get("/",(req,res)=>{
    res.send("hello running")
    // // res.render("index")
    // res.json()

})

// app.post("/ask",async(req,res)=>{
//     try {
//            const data = req.body.comments
//     await Query.create({
//         question:data
//     });
//     console.log("datasave")

//     res.send("data save sucessfully") 
//     } catch (error) {
//         console.log(error)
//         res.send("error in data saving")
//     }

// })


app.post("/api/ask-ai", async (req, res) => {
  try {
    const data = req.body.comments.trim();

    const userquestion = await Query.create({ question: data });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: data }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const ans = response.data.choices[0].message.content;

    userquestion.answer = ans;
    await userquestion.save();

    res.json({ answer: ans });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      answer: "Server error ❌",
    });
  }
});

// app.post("/api/ask-ai",async(req,res)=>{
//     try {
//         const data=req.body.comments.trim();
//         const userquestion= await Query.create({question:data})

//         const response= await axios.post("https://openrouter.ai/api/v1/chat/completions",
//         {
//             // model: "google/gemma-3-4b-it:free",
//             model:"meta-llama/llama-3-8b-instruct",
//             messages:[{role:"user",content:data}]
//         },
//         {
//             headers:{
//                     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//                     "Content-Type": "application/json",
//                     "HTTP-Referer": "http://localhost:3000",
//                     "X-Title": "My App"
//             }
//         }
//         );
//         const ans=response.data.choices[0].message.content;
//         userquestion.answer=ans;
//         await userquestion.save();
//         res.json({answer : ans});
//     } catch (error) {
//         console.log(error)
//     }
 
// })

app.post("/api/save", async (req, res) => {
    try {
        const { question, answer } = req.body;

        await Query.create({ question, answer });

        res.json({ message: "Saved successfully ✅" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Save failed ❌" });
    }
});

app.listen(5000,()=>{
    console.log("this running on 3000")
})