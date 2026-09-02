require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const protectedRoutes = require("./routes/protectedRoute");
const router = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/", router); 
app.use("/protected", protectedRoutes);

app.listen(3000, () => {
    console.log("Server connected on 3000");
});
