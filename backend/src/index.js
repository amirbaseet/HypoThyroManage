const express = require('express');
const dbConnect = require("./config/dbConnect");
const Symptom = require('./models/Symptom'); // Import the Symptom model

require(`dotenv`).config();
const cors = require('cors');

const app = express();
const port = process.env.PORT  || 3001;
//MiddleWare 
app.use(express.json());
app.use(cors()); 
//Routes
//import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const reportRoutes = require("./routes/reportRoutes");

//use Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/symptoms",symptomRoutes);
app.use("/api/reports", reportRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

app.get('/',(req,res)=>{
    res.send({status:"STARTED"});
})
dbConnect();

const insertSymptoms = async () =>{
    try{
        const symptoms = [
            "Kabızlık", "Halsizlik", "Yorgunluk", "Kilo alma",
            "Cilt kuruluğu", "Saç dökülmesi", "Üşüme", "Hareketlerde yavaşlama",
            "Ses değişikliği (kısılması/boğukluğu)", "Unutkanlık / Hafızada zayıflama",
            "Kas krampları", "Eklem ağrısı", "Depresif ruh halinde olma",
            "Sinirlilik", "Konuşmada yavaşlama", "Cinsel isteksizlik",
            "Konsantrasyon/odaklanmada zorlanma", "Adet düzensizliği",
            "Hareket halindeyken nefes darlığı", "Ödem/şişlik"
        ];
        // Check if symptoms already exist
        const existingSymptoms = await Symptom.countDocuments();
        if (existingSymptoms === 0) {
            await Symptom.insertMany(symptoms.map(name => ({ name })));
            console.log("✅ Symptoms added successfully!");
        } else {
            console.log("⚠️ Symptoms already exist, skipping insertion.");
        }
    } catch (error) {
        console.error("❌ Error inserting symptoms:", error);
    }

}
// Call function once when the server starts
insertSymptoms();


app.listen(port,()=>{
    console.log(`Server is runing on port ${port}`);
});