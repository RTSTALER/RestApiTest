"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../Models/UserModel");
const RegisterUser_1 = require("../Entities/RegisterUser");
const validatePhoneNumber = require('validate-phone-number-node-js');
const validator = require("email-validator");
class JsonHelpers {
    static JsonReg2User(_json) {
        return this.RgisterUser2dbUser(this.Json2RegisterUser(_json));
    }
    static Json2RegisterUser(_json) {
        return new RegisterUser_1.RegisterUser(_json.login, _json.password);
    }
    static RgisterUser2dbUser(_user) {
        return new UserModel_1.DbUser(_user.login, _user.password, validator.validate(_user.login), validatePhoneNumber.validate(_user.login));
    }
    static Url2QueryParams(Url) {
        const querystring = require('querystring');
        return querystring.parse(Url, null, null, { decodeURIComponent });
    }
}
exports.default = JsonHelpers;
//# sourceMappingURL=JsonHelper.js.map