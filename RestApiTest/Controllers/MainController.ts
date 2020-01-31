import * as express from 'express';
import JsonHelpers from '../Helpers/JsonHelper';
import Connector from '../Workers/connector';
import { Token } from "../Models/TokenModel";

var ping = require('ping');
const host = "google.com";


export class MainController {
   

    constructor(router) {
        this.intializeRoutes(router);
        Connector.connect("mongodb+srv://root:<12345>@cluster0-gc9nu.gcp.mongodb.net/test?retryWrites=true&w=majority");
    }

    public async intializeRoutes(router) {
        router.post("/singin", this.Signin);
        router.post("/signup", this.Signup);
        router.get("/info", this.Info);
        router.get("/latency", this.Latency);
        router.get("/logout:all", this.Logout);
    }

    Signin(request: express.Request, response: express.Response): void {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (Connector.LogIn(user)) {
            let token = Connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Signup(request: express.Request, response: express.Response): void {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (!Connector.AddUser(user)) {
            let token = Connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Info(request: express.Request, response: express.Response): void {
        if (Connector.AuthValidate(request.cookies.Token as string)) {
            response.send({ login: Connector.GetTokenInfo(request.cookies.Token as string).Owner });
        }
    }
    Latency(request: express.Request, response: express.Response): void {
        if (Connector.AuthValidate(request.cookies.Token as string)) {
            ping.sys.probe(host, function (isAlive) {
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        }

    }

    Logout(request: express.Request, response: express.Response, next: express.NextFunction): void {
        if (Connector.AuthValidate(request.cookies.Token as string)) {
            Connector.DeleteUserToken(JsonHelpers.Url2QueryParams(request.baseUrl),
                Connector.GetTokenInfo(request.cookies.Token as string));
        }
    }
}

export default MainController;