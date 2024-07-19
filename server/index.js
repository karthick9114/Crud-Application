const express = require("express");
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

const getUsers = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, "sample.json"));
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users:", error);
        return [];
    }
}

const saveUsers = (users) => {
    try {
        fs.writeFileSync(path.join(__dirname, "sample.json"), JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error saving users:", error);
    }
}

app.get("/users", (req, res) => {
    const users = getUsers();
    return res.json(users);
});

app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let users = getUsers();
    let filteredUsers = users.filter((user) => user.id !== id);
    saveUsers(filteredUsers);
    return res.json(filteredUsers);
});

app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields required" });
    }
    let users = getUsers();
    let id = Date.now();
    users.push({ id, name, age, city });
    saveUsers(users);
    return res.json({ message: "User detail added successfully" });
});

app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields required" });
    }
    let users = getUsers();
    let index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).send({ message: "User not found" });
    }
    users[index] = { id, name, age, city };
    saveUsers(users);
    return res.json({ message: "User detail updated successfully" });
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
