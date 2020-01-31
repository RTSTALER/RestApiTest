import App from './app';
import { MongoHelper } from "./Workers/MongoHelper";
import MainController from './Controllers/MainController';
import e = require('express');



let router = e.Router();

const app = new App(
    1337,
    router
);
app.listen();

