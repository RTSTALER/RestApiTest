"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoHelper {
    constructor() {
    }
    disconnect() {
        MongoHelper.client.close();
    }
}
exports.MongoHelper = MongoHelper;
//# sourceMappingURL=MongoHelper.js.map