import express from 'express';

const app = express()

const port = process.env.PORT || 3100

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const jokes = [
    {
        id: 1,
        title: "Why don't skeletons fight each other?",
        content: "Because they don't have the guts!"
    },
    {
        id: 2,
        title: "What do you call fake spaghetti?",
        content: "An impasta!"
    },
    {
        id: 3,
        title: "Why did the scarecrow win an award?",
        content: "Because he was outstanding in his field!"
    },
    {
        id: 4,
        title: "Why don't eggs tell jokes?",
        content: "Because they might crack up!"
    },
    {
        id: 5,
        title: "What did one ocean say to the other ocean?",
        content: "Nothing, they just waved!"
    }
];

app.get('/api/jokes', (req, res) => {
    res.send(jokes)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})