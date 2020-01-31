import * as express from 'express';
import JsonHelpers from '../Helpers/JsonHelper';
import Connector from '../Workers/connector';
import { Token } from "../Models/TokenModel";

var ping = require('ping');
const host = "google.com";

export class MainController {
    public router = express.Router();
    _connector = new Connector();
    constructor() {
        this.intializeRoutes();
    }
    
    public intializeRoutes() {
        this.router.post("/singin", this.Signin);
        this.router.post("/signup", this.Signup);
        this.router.get("/info", this.Info);
        this.router.get("/latency", this.Latency);
        this.router.get("/logout:all", this.Logout);
    }

    Signin(request: express.Request, response: express.Response): void {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (this._connector.LogIn(user)) {
            let token = this._connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Signup(request: express.Request, response: express.Response): void {
        let user = JsonHelpers.JsonReg2User(request.body);
        if (!this._connector.AddUser(user)) {
            let token = this._connector.CreateToken(user.login);
            response.cookie('Token', token, { expires: new Date(Date.now() + 600000) });
        }
    }
    Info(request: express.Request, response: express.Response): void {
        if (this._connector.AuthValidate(request.cookies.Token as string)) {
            response.send({ login: this._connector.GetTokenInfo(request.cookies.Token as string).Owner});
        }
    }
    Latency(request: express.Request, response: express.Response): void {
        if (this._connector.AuthValidate(request.cookies.Token as string)) {
            ping.sys.probe(host, function (isAlive) {
                var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                response.send({ ping: msg });
            });
        }
      
    }

    Logout(request: express.Request, response: express.Response, next: express.NextFunction): void {
        if (this._connector.AuthValidate(request.cookies.Token as string)) {
            this._connector.DeleteUserToken(JsonHelpers.Url2QueryParams(request.baseUrl),
                this._connector.GetTokenInfo(request.cookies.Token as string));
        }
    }
}

export default MainController;