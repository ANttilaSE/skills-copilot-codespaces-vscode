// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Create end point to get comments by post id
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Create end point to create comments
app.post('/posts/:id/comments', async (req, res) => {
    // Generate a random id
    const commentId = randomBytes(4).toString('hex');
    // Get the content from the request body
    const { content } = req.body;
    // Get the id from the url
    const postId = req.params.id;
    // Get the comments from the commentsByPostId object
    const comments = commentsByPostId[postId] || [];
    // Add the new comment to the comments object
    comments.push({ id: commentId, content, status: 'pending' });
    // Add the comments to the commentsByPostId object
    commentsByPostId[postId] = comments;

    // Emit event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending'
        }
    });

    // Send back a response
    res.status(201).send(comments);
});

// Create end point to receive events from event bus
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        // Get the id and status from the data
        const { id, postId, status, content } = data;
        // Get the comments from the commentsByPostId object
        const comments = commentsByPostId[postId];
        // Find the comment with the id
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        // Update the status
        comment.status = status;

        // Emit event to event bus
    }
});