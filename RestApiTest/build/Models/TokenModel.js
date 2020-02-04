"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(_token, _owner) {
        this.token = _token;
        this.CreateTime = Date.now();
        this.Owner = _owner;
    }
}
exports.Token = Token;
exports.default = Token;
//# sourceMappingURL=TokenModel.js.map