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
const JsonHelper_1 = require("../Helpers/JsonHelper");
const connector_1 = require("../Workers/connector");
var ping = require('ping');
const host = "google.com";
class MainController {
    constructor(router) {
        this.intializeRoutes(router);
    }
    intializeRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            router.post("/signin", this.Signin);
            router.post("/signup", this.Signup);
            router.get("/info", this.Info);
            router.get("/latency", this.Latency);
            router.get("/logout", this.Logout);
        });
    }
    static parseCookies(request) {
        var list = {}, rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    }
    Signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = JsonHelper_1.default.JsonReg2User(request.body);
            if (yield connector_1.default.LogIn(user)) {
                let token = connector_1.default.CreateToken(user.login);
                response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
                response.status(201);
                response.send();
            }
            else {
                response.status(401);
                response.send();
            }
        });
    }
    Signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = JsonHelper_1.default.JsonReg2User(request.body);
            if (!user.isEmail && !user.isPhone) {
                response.status(400);
                response.send("incorrect login");
                return;
            }
            if (yield connector_1.default.AddUser(user)) {
                let token = connector_1.default.CreateToken(user.login);
                response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
                response.status(201);
                response.send();
            }
            else {
                response.status(400);
                response.send();
            }
        });
    }
    Info(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connector_1.default.AuthValidate(MainController.parseCookies(request).Token)) {
                var own = yield connector_1.default.GetTokenInfo(MainController.parseCookies(request).Token);
                response.cookie('Token', MainController.parseCookies(request).Token, { expires: new Date(Date.now() + 600000) });
                response.send({
                    login: own.Owner
                });
            }
            else {
                response.status(401);
                response.send();
            }
        });
    }
    Latency(request, response) {
        if (connector_1.default.AuthValidate(MainController.parseCookies(request).Token)) {
            ping.sys.probe(host, function (isAlive) {
                response.cookie('Token', MainController.parseCookies(request).Token, { expires: new Date(Date.now() + 600000) });
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        }
        else {
            response.status(401);
            response.send();
        }
    }
    Logout(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connector_1.default.AuthValidate(MainController.parseCookies(request).Token)) {
                connector_1.default.DeleteUserToken(JSON.parse(request.query.all), yield connector_1.default.GetTokenInfo(MainController.parseCookies(request).Token));
                response.status(201);
                response.send();
            }
            else {
                response.status(400);
                response.send();
            }
        });
    }
}
exports.MainController = MainController;
exports.default = MainController;
//# sourceMappingURL=MainController.js.map