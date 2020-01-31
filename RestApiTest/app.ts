import * as express from 'express';
import MainController from './Controllers/MainController';
import { MongoHelper as MongoHelper1 } from "./Workers/MongoHelper";
import { Connector } from "./Workers/connector";
var bodyParser = require('body-parser')

class App {
    public app: express.Application;
    public port: number;
    public router: express.Router;
    public Maincontroller: MainController;;
    constructor(port, _router) {
        this.app = express();
        this.port = port;
        this.router = _router;
        this.initMidleWare();
        this.Maincontroller = new MainController(this.router);
        this.initRouter();

    }
    private initRouter() {
        this.app.use('/', this.router);
    }
    private async initMidleWare() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    public async listen() {
        this.app.listen(this.port, async () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
