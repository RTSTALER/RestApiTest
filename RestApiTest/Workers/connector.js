"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenModel_1 = require("../Models/TokenModel");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:<12345>@cluster0-gc9nu.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let db;
let users;
let tokens;
client.connect(function (err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db('db_users');
    users = db.createCollection('users');
    tokens = db.createCollection('tokens');
    // �������������� � ����� ������
});
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
class Connector {
    AddUser(_user) {
        return client.connect(err => {
            if (!this.RepeatedUser(_user)) {
                users.insertOne(_user, (err, result) => {
                    if (err) {
                        console.log('Unable insert user: ', err);
                        throw err;
                    }
                });
                client.close();
                return true;
            }
            else {
                client.close();
                return false;
            }
        });
    }
    CreateToken(_owner) {
        let tmpToken = tokgen.generate();
        tokens.insertOne(new TokenModel_1.Token(tmpToken, _owner), (err, result) => {
            if (err) {
                console.log('Unable insert token: ', err);
                throw err;
            }
        });
        return tmpToken;
    }
    DeleteUserToken(all, _token) {
        if (all)
            tokens.deleteMany({ owner: _token.Owner }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
        else
            tokens.deleteOne({ token: _token.token }, (err, result) => {
                if (err) {
                    console.log('Unable delete user: ', err);
                    throw err;
                }
            });
    }
    RepeatedUser(_user) {
        return users.find({ _login: _user.login }).findOne();
    }
    FindUser(_user) {
        return users.find({ _login: _user.login }).findOne();
    }
    AuthValidate(_token) {
        return tokens.findOne({ token: _token });
    }
    LogIn(_user) {
        return tokens.findOne({ _login: _user.login, _password: _user._password });
    }
    GetTokenInfo(_token) {
        return tokens.findOne({ token: _token });
    }
}
exports.Connector = Connector;
exports.default = Connector;
//# sourceMappingURL=connector.js.map