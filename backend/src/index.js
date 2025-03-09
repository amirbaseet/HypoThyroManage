const express = require('express');
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dotenv = require(`dotenv`).config();
const cors = require('cors');

const app = express();
const port = process.env.PORT  || 3001;
//MiddleWare 
app.use(express.json());
app.use(cors()); 
//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.get('/',(req,res)=>{
    res.send({status:"STARTED"});
})
dbConnect();

app.listen(port,()=>{
    console.log(`Server is runing on port ${port}`);
});