require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();
const categoryRoutes = require("./routes/Admin-Category-Routes");
const staffRoutes = require("./routes/Admin-Staff-Route");
const protectedRoutes = require("./routes/protectedRoute");
const router = require("./routes/userRoutes");

app.use(cors());    
app.use(express.json());

app.use( "/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", router); 
app.use("/", categoryRoutes);
app.use("/", staffRoutes);
app.use("/protected", protectedRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server connected on ${PORT}`);
});