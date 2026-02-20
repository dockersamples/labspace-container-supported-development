const express = require("express");
const { engine } = require("express-handlebars");
const { getRandomMeme } = require("./db");
require('dotenv').config({ quiet: true });

const app = express();

app.use(express.static(__dirname + "/assets"))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/", async (req, res) => {
    res.render(
        "home", 
        { 
            message: "Whalecome to Docker!",
            memeUrl: await getRandomMeme(),
        }
    );
});

app.listen(3000, () => console.log("Server is running on port 3000"));