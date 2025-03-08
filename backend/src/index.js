const express = require('express');
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dotenv = require(`dotenv`).config();

const app = express();
const port = process.env.port || 3001;
//MiddleWare 
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);


app.get('/',(req,res)=>{
    res.send({status:"STARTED"});
})
try{
dbConnect();
}catch (err){
    console.log(err)
} 

app.listen(port,()=>{
    console.log(`Server is runing on port ${port}`);
})