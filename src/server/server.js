const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

if (process.env.PORT == null) {
    process.env.PORT = 8080;
}
if (process.env.MONGOURL == null){
    process.env.MONGOURL = 'mongodb://localhost:27017/Capacity';
}

const Db = require("./DBconn");

app.use(cors());

app.use(express.json());

//Routes
app.use(require("./routes/Capacity"));

app.use(express.static(path.resolve(__dirname, "../client/out")))

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
    console.log(`Using Database: ${process.env.MONGOURL}`);
})