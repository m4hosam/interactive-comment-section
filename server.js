const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser")

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/commentsData", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conneccted To DataBase')
    })
    .catch(er => {
        console.log('Connection Error To DataBase')
    });

// next line to enable views directory
app.set('view engine', 'ejs');
// important to make bodyParser work effieciently
app.use(bodyParser.urlencoded({ extended: true }));
// access any other files withen ejs(css js images) to public directory
app.use(express.static("public"))

let currentuser = 0;
const users = ["amyrobson", "juliusomo", "maxblagun", "ramsesmiron"]


const replySchema = new mongoose.Schema({
    id: Number,
    content: String,
    createdAt: String,
    score: Number,
    replyingTo: String,
    username: String,
})

const commentSchema = new mongoose.Schema({
    id: Number,
    content: String,
    createdAt: String,
    score: Number,
    username: String,
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }]
})

const Comment = mongoose.model("Comment", commentSchema);
const Reply = mongoose.model("Reply", replySchema);

function CommentOb(id, content, createdAt, score, username, replies) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = score;
    this.username = username;
    this.replies = replies;
}
function RepliesOb(id, content, createdAt, score, username, replyingTo, repliedToId) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = score;
    this.username = username;
    this.replyingTo = replyingTo;
}




const newComment = new Comment({
    id: 1,
    content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    createdAt: "Tue Feb 15 2022 17:35:51 GMT+0300 (GMT+03:00)",
    score: 12,
    username: "amyrobson",
    replies: []
})


// newComment.save();
// Comment.find({}).populate("replies").exec(function (err, data) {
//     console.log(data[0].replies[0])
// })


// newComment.save();
// newComment2.save();
// Comment.find({}).then(data => console.log(data));


// let start = new Date("Tue Feb 15 2022 17:35:51 GMT+0300 (GMT+03:00)") 
// let tmp = "Tue Feb 15 2022 17:35:51 GMT+0300 (GMT+03:00)";

function elapsedTime(date) {
    start = new Date(date) // in the data base
    const end = new Date();
    const elapsed = Math.floor((end - start) / 1000);
    if (elapsed == 0)
        return "1 second ago"
    const years = Math.floor(elapsed / (3600 * 24 * 30 * 12));
    const months = Math.floor(elapsed % (3600 * 24 * 30 * 12) / (3600 * 24 * 30));
    const days = Math.floor(elapsed % (3600 * 24 * 30) / (3600 * 24));
    const hours = Math.floor(elapsed % (3600 * 24) / 3600);
    const mins = Math.floor(elapsed % 3600 / 60);
    const seconds = Math.floor(elapsed % 60);
    const timeString = ["years", "months", "days", "hours", "mins", "seconds"];
    const time = [years, months, days, hours, mins, seconds];
    let i = 0;
    while (i < 6 && time[i] == 0) {
        i++;
    }
    return time[i] + " " + timeString[i] + " ago";
}
// let start = "Tue Feb 15 2022 17:35:51 GMT+0300 (GMT+03:00)"


app.get("/", function (req, res) {
    res.render("home");
})

app.post("/", function (req, res) {
    console.log(req.body.id);
    currentuser = req.body.id;
    res.redirect('/comments');
})

app.get("/comments", function (req, res) {
    // populate used to excute the relateed database in replies
    Comment.find({}).populate("replies").exec(async function (err, docs) {
        if (err)
            console.log(err)
        else {
            for (let element of docs) {
                element.createdAt = elapsedTime(element.createdAt);
                console.log("element created at: " + element.createdAt)
                if (element.replies.length > 0) {
                    for (let replyElement of element.replies) {
                        replyElement.createdAt = elapsedTime(replyElement.createdAt);
                        console.log("reply created at: " + replyElement.createdAt)
                    }
                }
            }
            res.render("comments", { currentId: currentuser, currentUsername: users[currentuser - 1], data: docs });
        }
    })
})
app.post("/newComment", async function (req, res) {
    let newId = users.indexOf(req.body.username) + 1;
    let obj = new CommentOb(newId, req.body.content, (new Date()).toString(), 0, req.body.username, []);
    let d = new Comment(obj);
    await d.save();
    res.redirect('/comments');
})
// id, content, createdAt, score, username, replyingTo
app.post("/reply", async function (req, res) {
    let newId = users.indexOf(req.body.username) + 1;
    let obj = new RepliesOb(newId, req.body.content, (new Date()).toString(), 0, req.body.username, req.body.repliedAt, req.body.commentId);
    // console.log(obj)
    Comment.findById(req.body.commentId, async function (err, docs) {
        if (err)
            console.log(err)
        else {
            const newReply = new Reply(obj)
            await newReply.save();
            docs.replies.push(newReply)
            await docs.save();
            res.redirect('/comments');
        }
    })
})



app.post("/score", async function (req, res) {
    // console.log(req.body);
    Comment.findById(req.body.commentId, async function (err, docs1) {
        if (err)
            console.log(err)
        else if (docs1 == null) {
            console.log("not found in comments");
            Reply.findById(req.body.commentId, async function (err, docs2) {
                if (err)
                    console.log(err)
                else if (docs2 == null) {
                    console.log("not found Any where")
                }
                else {
                    console.log(docs2.score)
                    if (req.body.op == "add")
                        docs2.score = docs2.score + 1;
                    else if (req.body.op == "minus") {
                        if (docs2.score > 0)
                            docs2.score = docs2.score - 1;
                    }
                    else {
                        console.log("Error");
                        res.redirect('/comments');
                    }
                    console.log("-----" + docs2.score)
                    await docs2.save()
                    res.redirect('/comments');
                }
            })
        }
        else {
            console.log(docs1.score)
            if (req.body.op == "add")
                docs1.score = docs1.score + 1;
            else if (req.body.op == "minus") {
                if (docs1.score > 0)
                    docs1.score = docs1.score - 1;
            }
            else {
                console.log("Error");
                res.redirect('/comments');
            }
            await docs1.save()
            res.redirect('/comments');
        }
    })
})



app.listen(3000, function () {
    console.log("Connected To The Server");
})