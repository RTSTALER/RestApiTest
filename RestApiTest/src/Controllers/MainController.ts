import * as express from 'express';
import JsonHelpers from '../Helpers/JsonHelper';
import Connector from '../Workers/connector';
import { Token } from "../../Models/TokenModel";

var ping = require('ping');
const host = "google.com";


export class MainController {


    constructor(router) {
        this.intializeRoutes(router);
    }

    public async intializeRoutes(router) {
        router.post("/signin", this.Signin);
        router.post("/signup", this.Signup);
        router.get("/info", this.Info);
        router.get("/latency", this.Latency);
        router.get("/logout", this.Logout);
    }

    public static parseCookies(request): any {
        var list = {},
            rc = request.headers.cookie;

        rc && rc.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    }

    async Signin(request: express.Request, response: express.Response): Promise<void> {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (await Connector.LogIn(user)) {
            let token = Connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
            response.status(201);
            response.send();
        } else {
            response.status(401);
            response.send();
        }
    }
    async Signup(request: express.Request, response: express.Response): Promise<void> {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (!user.isEmail && !user.isPhone) {
            response.status(400);
            response.send("incorrect login");
            return;
        }
        if (await Connector.AddUser(user)) {
            let token = Connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
            response.status(201)
            response.send();
        } else {
            response.status(400);
            response.send();
        }

    }
    async Info(request: express.Request, response: express.Response): Promise<void> {
        if (Connector.AuthValidate(MainController.parseCookies(request).Token)) {
            var own = await Connector.GetTokenInfo(MainController.parseCookies(request).Token);
            response.cookie('Token', MainController.parseCookies(request).Token, { expires: new Date(Date.now() + 600000) });
            response.send({
                login: own.Owner
            });

        } else {
            response.status(401);
            response.send();
        }
    }
    Latency(request: express.Request, response: express.Response): void {
        if (Connector.AuthValidate(MainController.parseCookies(request).Token)) {
            ping.sys.probe(host, function (isAlive) {
                response.cookie('Token', MainController.parseCookies(request).Token, { expires: new Date(Date.now() + 600000) });
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        } else {
            response.status(401);
            response.send();
        }

    }

    async Logout(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        if (Connector.AuthValidate(MainController.parseCookies(request).Token)) {
            Connector.DeleteUserToken(JSON.parse(request.query.all),
                await Connector.GetTokenInfo(MainController.parseCookies(request).Token));
            response.status(201);
            response.send();
        } else {
            response.status(400);
            response.send();
        }
    }
}

export default MainController;