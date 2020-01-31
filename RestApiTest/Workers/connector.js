"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenModel_1 = require("../Models/TokenModel");
const mongo = require('mongodb').MongoClient;
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
class Connector {
    constructor() {
        this.AddUser = this.AddUser.bind(this);
        this.CreateToken = this.CreateToken.bind(this);
        this.DeleteUserToken = this.DeleteUserToken.bind(this);
        this.RepeatedUser = this.RepeatedUser.bind(this);
        this.FindUser = this.FindUser.bind(this);
        this.AuthValidate = this.AuthValidate.bind(this);
        this.LogIn = this.LogIn.bind(this);
        this.GetTokenInfo = this.GetTokenInfo.bind(this);
    }
    connect(url) {
        return new Promise((resolve, reject) => {
            mongo.MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.client = client;
                    resolve(client);
                }
            });
        });
    }
    AddUser(_user) {
        let tokens = this.client.db('db_users').collection('tokens');
        let users = this.client.db('db_users').collection('users');
        if (!this.RepeatedUser(_user)) {
            users.insertOne(_user, (err, result) => {
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
    }
    CreateToken(_owner) {
        let tmpToken = tokgen.generate();
        this.tokens.insertOne(new TokenModel_1.Token(tmpToken, _owner), (err, result) => {
            if (err) {
                console.log('Unable insert token: ', err);
                throw err;
            }
        });
        return tmpToken;
    }
    DeleteUserToken(all, _token) {
        if (all)
            this.tokens.deleteMany({ owner: _token.Owner }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
        else
            this.tokens.deleteOne({ token: _token.token }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
    }
    RepeatedUser(_user) {
        let tokens = this.client.db('db_users').collection('tokens');
        let users = this.client.db('db_users').collection('users');
        let result = users.find({ _login: _user.login }).findOne();
        return result;
    }
    FindUser(_user) {
        let result = this.users.find({ _login: _user.login }).findOne();
        return result;
    }
    AuthValidate(_token) {
        let result = this.tokens.findOne({ token: _token });
        return result;
    }
    LogIn(_user) {
        let result = this.tokens.findOne({ _login: _user.login, _password: _user._password });
        return result;
    }
    GetTokenInfo(_token) {
        let result = this.tokens.findOne({ token: _token });
        return result;
    }
}
exports.Connector = Connector;
exports.default = new Connector();
//# sourceMappingURL=connector.js.map