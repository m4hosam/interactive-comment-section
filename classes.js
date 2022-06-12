class CommentOb {
    constructor(id, content, createdAt, score, username, replies) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.score = score;
        this.username = username;
        this.replies = replies;
    }

}

class RepliesOb {
    constructor(id, content, createdAt, score, username, replyingTo) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.score = score;
        this.username = username;
        this.replyingTo = replyingTo;
    }
}