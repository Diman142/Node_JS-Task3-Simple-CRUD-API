import express from "express";
import process from 'node:process';
import * as dotenv from 'dotenv';

import { User } from "./types";
import { addIdForNewUser,  getUserById, instanceOfNewUser, isUserIdValid } from "./utils";

dotenv.config();
const jsonBodyParses = express.json();
export const app = express();
app.use(jsonBodyParses);

const port = process.env.PORT;
let users: User[] = [];

app.get(
    "/api/users",
    (_req, res) => {
        res.status(200)
        res.json(users);
    }
);

//TODO and test validation
app.get(
    "/api/users/:id",
    (req, res) => {
        if(!isUserIdValid(req.params.id)) {
            res.status(400);
            res.send('userId is not valid');
            return
        }
        const user = getUserById(users, req.params.id)
        if(user) {
            res.status(200);
            res.json(user);
        } else {
            res.status(404);
            res.send(`user with id ${req.params.id} is not found`);
        }
    }
);

app.post(
    "/api/users",
    (req, res) => {
        const newUser = req.body;
        if(instanceOfNewUser(newUser)) {
            const newUserWithId = addIdForNewUser(newUser)
            users.push(newUserWithId);
            res.status(201);
            res.send(newUserWithId);
        } else {
            res.status(400);
            res.send('user is not valid');
        }

    }
);

app.put(
    "/api/users/:id",
    (req, res) => {
        const changedUserId = req.params.id;
        if(!isUserIdValid(req.params.id)) {
            res.status(400);
            res.send('userId is not valid');
            return
        }
        const user = getUserById(users, req.params.id);
        const newUser = addIdForNewUser(req.body);
        if(user) {
            const userIndex = users.findIndex((u) => u.id === changedUserId);
            users.splice(userIndex, 1, newUser);
            res.status(200);
            res.json(newUser)
        } else {
            res.status(404);
            res.send(`user with id ${req.params.id} is not found`);
        }
    }  
)

app.delete(
    "/api/users/:id",
    (req, res) => {
        const changedUserId = req.params.id;
        if(!isUserIdValid(changedUserId)) {
            res.status(400);
            res.send('userId is not valid');
            return;
        }
        const user = getUserById(users, changedUserId);
        if(!user) {
            res.status(404);
            res.send(`user with id ${changedUserId} is not found`);
            return
        }
        users = users.filter(u => u.id !== changedUserId);
        res.status(204);
        res.send('user has been removed');
    }
);

app.use((_req, res) => {
    res.status(404);
    res.send('URL adress is not correct');
});


export const server = app.listen(
    port,
    () => {
        console.log(`App listening on port ${port}`);
    }
);
