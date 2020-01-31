import App from './app';
import MainController from './Controllers/MainController';
import { Connector } from "./Workers/connector";

const app = new App(
    [
        new MainController(),
    ],
    1337
);

app.listen();