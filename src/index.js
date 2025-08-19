const express = require("express");
const { engine } = require("express-handlebars");

const app = express();

app.use(express.static(__dirname + "/assets"))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
    res.render(
        "home", 
        { 
            message: "Whalecome to Docker!",
            memeUrl: "https://media.giphy.com/media/yoJC2A59OCZHs1LXvW/giphy.gif"
        }
    );
});

app.listen(3000, () => console.log("Server is running on port 3000"));