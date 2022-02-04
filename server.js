const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser")

// next line to enable views directory
app.set('view engine', 'ejs');
// important to make bodyParser work effieciently
app.use(bodyParser.urlencoded({ extended: true }));
// access any other files withen ejs(css js images) to public directory
app.use(express.static("public"))

app.get("/", function (req, res) {
    const name = "Mohamed Hosam";
    res.render("home", { data: name });
})

app.post("/", function (req, res) {
    console.log(req.body.id);
    res.redirect('/comments');
})

app.get("/comments", function (req, res) {
    res.render("comments");
})


app.listen(3000, function () {
    console.log("Server is Working");
})