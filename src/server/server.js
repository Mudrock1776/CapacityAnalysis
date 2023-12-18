const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env"});
const PORT = process.env.PORT || 8080;

const Db = require("./DBconn");

app.use(cors());

app.use(express.json());

//Routes
app.use(require("./routes/Capacity"));

app.use(express.static(path.resolve(__dirname, "../client/build")))

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})