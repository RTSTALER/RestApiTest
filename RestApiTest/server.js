"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const MainController_1 = require("./Controllers/MainController");
const app = new app_1.default([
    new MainController_1.default(),
], 1337);
app.listen();
//# sourceMappingURL=server.js.map