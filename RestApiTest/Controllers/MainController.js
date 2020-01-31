"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const JsonHelper_1 = require("../Helpers/JsonHelper");
const connector_1 = require("../Workers/connector");
var ping = require('ping');
const host = "google.com";
class MainController {
    constructor() {
        this.router = express.Router();
        this._connector = new connector_1.default();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post("/singin", this.Signin);
        this.router.post("/signup", this.Signup);
        this.router.get("/info", this.Info);
        this.router.get("/latency", this.Latency);
        this.router.get("/logout:all", this.Logout);
    }
    Signin(request, response) {
        let user = JsonHelper_1.default.JsonReg2User(request.body);
        if (this._connector.LogIn(user)) {
            let token = this._connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Signup(request, response) {
        let user = JsonHelper_1.default.JsonReg2User(request.body);
        if (!this._connector.AddUser(user)) {
            let token = this._connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Info(request, response) {
        if (this._connector.AuthValidate(request.cookies.Token)) {
            response.send({ login: this._connector.GetTokenInfo(request.cookies.Token).Owner });
        }
    }
    Latency(request, response) {
        if (this._connector.AuthValidate(request.cookies.Token)) {
            ping.sys.probe(host, function (isAlive) {
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        }
    }
    Logout(request, response, next) {
        if (this._connector.AuthValidate(request.cookies.Token)) {
            this._connector.DeleteUserToken(JsonHelper_1.default.Url2QueryParams(request.baseUrl), this._connector.GetTokenInfo(request.cookies.Token));
        }
    }
}
exports.MainController = MainController;
exports.default = MainController;
//# sourceMappingURL=MainController.js.map