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
        connector_1.default.connect("mongodb+srv://root:<12345>@cluster0-gc9nu.gcp.mongodb.net/test?retryWrites=true&w=majority");
    }
    intializeRoutes(router) {
        return __awaiter(this, void 0, void 0, function* () {
            router.post("/singin", this.Signin);
            router.post("/signup", this.Signup);
            router.get("/info", this.Info);
            router.get("/latency", this.Latency);
            router.get("/logout:all", this.Logout);
        });
    }
    Signin(request, response) {
        let user = JsonHelper_1.default.JsonReg2User(request.body);
        if (connector_1.default.LogIn(user)) {
            let token = connector_1.default.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Signup(request, response) {
        let user = JsonHelper_1.default.JsonReg2User(request.body);
        if (!connector_1.default.AddUser(user)) {
            let token = connector_1.default.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Info(request, response) {
        if (connector_1.default.AuthValidate(request.cookies.Token)) {
            response.send({ login: connector_1.default.GetTokenInfo(request.cookies.Token).Owner });
        }
    }
    Latency(request, response) {
        if (connector_1.default.AuthValidate(request.cookies.Token)) {
            ping.sys.probe(host, function (isAlive) {
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        }
    }
    Logout(request, response, next) {
        if (connector_1.default.AuthValidate(request.cookies.Token)) {
            connector_1.default.DeleteUserToken(JsonHelper_1.default.Url2QueryParams(request.baseUrl), connector_1.default.GetTokenInfo(request.cookies.Token));
        }
    }
}
exports.MainController = MainController;
exports.default = MainController;
//# sourceMappingURL=MainController.js.map