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
    repliedToId: String,
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
    this.repliedToId = repliedToId;
    this.content = content;
    this.createdAt = createdAt;
    this.score = score;
    this.username = username;
    this.replyingTo = replyingTo;
}




// const newComment = new Comment({
//     id: 1,
//     content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
//     createdAt: "1 month ago",
//     score: 12,
//     username: "amyrobson",
//     replies: []
// })
// const newReply = new Reply({
//     id: 1,
//     content: "Impressive! Though it seems the drag ",
//     createdAt: "1 month ago",
//     score: 12,
//     username: "amyrobson",
//     replyingTo: "Mohamed"
// })
// newReply.save()
// newComment.replies.push(newReply);
// newComment.save();
// Comment.find({}).populate("replies").exec(function (err, data) {
//     console.log(data[0].replies[0])
// })

// const newReply = new Comment({
//     id: 1,
//     content: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
//     createdAt: "1 month ago",
//     score: 12,
//     username: "amyrobson",
//     replies: [ObjectId("620659df7b566d956f1c37fc")]
// })
// // newReply.save()



// const newComment2 = new Comment({
//     id: 2,
//     content: "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
//     createdAt: "2 weeks ago",
//     score: 5,
//     username: "maxblagun",
//     replies: [
//         {
//             id: 3,
//             content: "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
//             createdAt: "1 week ago",
//             score: 4,
//             replyingTo: "maxblagun",
//             username: "ramsesmiron"
//         },
//         {
//             id: 4,
//             content: "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
//             createdAt: "2 days ago",
//             score: 2,
//             replyingTo: "ramsesmiron",
//             username: "juliusomo"
//         }
//     ]
// })



// newComment.save();
// newComment2.save();
// Comment.find({}).then(data => console.log(data));

function elapsedTime() {
    let start = new Date() // in the data base
    // after spending time
    let end = new Date()
    let elapsed = end - start
    console.log(start)
    console.log(end)
    console.log(elapsed / 1000)
}


app.get("/", function (req, res) {
    const name = "Mohamed Hosam";
    res.render("home", { data: name });
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
            // console.log(data[0].replies[0]);
            res.render("comments", { currentId: currentuser, currentUsername: users[currentuser - 1], data: docs });
        }
    })
    // Comment.find(async function (err, docs) {
    //     if (err)
    //         console.log(err)
    //     else {

    //         res.render("comments", { currentId: currentuser, currentUsername: users[currentuser - 1], data: docs });
    //     }
    // })
    // // console.log();

})
app.post("/newComment", async function (req, res) {
    let newId = users.indexOf(req.body.username) + 1;
    let obj = new CommentOb(newId, req.body.content, "1 min ago", 0, req.body.username, []);
    let d = new Comment(obj);
    await d.save();
    res.redirect('/comments');
})
// id, content, createdAt, score, username, replyingTo
app.post("/reply", async function (req, res) {
    let newId = users.indexOf(req.body.username) + 1;
    let obj = new RepliesOb(newId, req.body.content, "1 min ago", 0, req.body.username, req.body.repliedAt, req.body.commentId);
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