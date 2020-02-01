import * as express from 'express';
import MainController from './Controllers/MainController';
import { MongoHelper as MongoHelper1 } from "./Workers/MongoHelper";
import  Connector from "./Workers/connector";
var bodyParser = require('body-parser')

class App {
    public app: express.Application;
    public port: number;
    public router: express.Router;
    public Maincontroller: MainController;
    constructor(port, _router) {
        this.app = express();
        this.port = port;
        this.router = _router;
        this.initMidleWare();
        this.Maincontroller = new MainController(this.router);
        this.initRouter();
        this.SettingCORS();
    }
    private initRouter() {
        this.app.use('/', this.router);
    }
    private async initMidleWare() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    private SettingCORS() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
            this.app.options('*', (req, res) => {
                res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
                res.send();
            });
        });
    }

    public async listen() {
        this.app.listen(this.port, async () => {
            try {
                await Connector.Connect(
                    "mongodb+srv://root:12345@cluster0-gc9nu.gcp.mongodb.net/users?retryWrites=true&w=majority");
            } catch (err) {
                console.log("ERROR!! - "+ err);
            }  
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
