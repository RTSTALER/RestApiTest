"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var bodyParser = require('body-parser');
class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initMidleWare();
        this.initializeControllers(controllers);
    }
    initMidleWare() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map