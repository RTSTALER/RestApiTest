"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbUser {
    constructor(_login, password, _isEmail, _isPhone) {
        this.isEmail = false;
        this.isPhone = false;
        this.login = _login;
        this._password = password;
        this.isPhone = _isPhone;
        this.isEmail = _isEmail;
    }
}
exports.DbUser = DbUser;
//# sourceMappingURL=UserModel.js.map