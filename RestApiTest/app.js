"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MainController_1 = require("./Controllers/MainController");
const connector_1 = require("./Workers/connector");
var bodyParser = require('body-parser');
class App {
    constructor(port, _router) {
        this.app = express();
        this.port = port;
        this.router = _router;
        this.initMidleWare();
        this.Maincontroller = new MainController_1.default(this.router);
        this.initRouter();
    }
    ;
    initRouter() {
        this.app.use('/', this.router);
    }
    initMidleWare() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(bodyParser.json());
        });
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.listen(this.port, () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield connector_1.default.Connect("mongodb+srv://root:12345@cluster0-gc9nu.gcp.mongodb.net/users?retryWrites=true&w=majority");
                }
                catch (err) {
                    console.log("ERROR!! - " + err);
                }
                console.log(`App listening on the port ${this.port}`);
            }));
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map