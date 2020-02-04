"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenModel_1 = require("../../Models/TokenModel");
require('dotenv').config();
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
class Connector {
    constructor() {
        this.Connect = this.Connect.bind(this);
        this.AddUser = this.AddUser.bind(this);
        this.CreateToken = this.CreateToken.bind(this);
        this.DeleteUserToken = this.DeleteUserToken.bind(this);
        this.RepeatedUser = this.RepeatedUser.bind(this);
        this.FindUser = this.FindUser.bind(this);
        this.AuthValidate = this.AuthValidate.bind(this);
        this.LogIn = this.LogIn.bind(this);
        this.GetTokenInfo = this.GetTokenInfo.bind(this);
    }
    Connect(host, username, password) {
        const mongo = require('mongodb').MongoClient;
        mongo.connect("mongodb+srv://" + username + ":" + password + "@" + host + "/users?retryWrites=true&w=majority", { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log("ERROR -" + err);
            }
            else {
                Connector.client = client;
                Connector.users = client.db('db_users').collection('users');
                Connector.tokens = client.db('db_tokens').collection('tokens');
                console.log("Connected to MongoDB");
            }
        });
    }
    AddUser(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            var repeated = yield this.RepeatedUser(_user);
            if (!repeated) {
                Connector.users.insertOne(_user, (err, result) => {
                    if (err) {
                        console.log('Unable insert user: ', err);
                        throw err;
                    }
                });
                return true;
            }
            else {
                return false;
            }
        });
    }
    CreateToken(_owner) {
        let tmpToken = tokgen.generate();
        Connector.tokens.insertOne(new TokenModel_1.Token(tmpToken, _owner), (err, result) => {
            if (err) {
                console.log('Unable insert token: ', err);
                throw err;
            }
        });
        return tmpToken;
    }
    DeleteUserToken(all, _token) {
        if (all)
            Connector.tokens.deleteMany({ Owner: _token.Owner }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
        else
            Connector.tokens.deleteOne({ token: _token.token }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
    }
    RepeatedUser(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Connector.users.findOne({ login: _user.login });
            return result !== null;
        });
    }
    FindUser(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Connector.users.findOne({ login: _user.login });
            return result;
        });
    }
    AuthValidate(_token) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Connector.tokens.findOne({ token: _token });
            return result;
        });
    }
    LogIn(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Connector.users.findOne({ login: _user.login, _password: _user._password });
            return result !== null;
        });
    }
    GetTokenInfo(_token) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield Connector.tokens.findOne({ token: _token });
            return result;
        });
    }
}
exports.default = new Connector();
//# sourceMappingURL=connector.js.map