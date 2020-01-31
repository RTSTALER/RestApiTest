"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const e = require("express");
let router = e.Router();
const app = new app_1.default(1337, router);
app.listen();
//# sourceMappingURL=server.js.map