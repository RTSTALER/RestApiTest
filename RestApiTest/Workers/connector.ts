import { DbUser } from "../Models/UserModel";
import { Token } from "../Models/TokenModel";
import { MongoHelper } from "./MongoHelper";
import * as mongo from 'mongodb';

const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();

export class Connector {
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

     public Connect(url: string): Promise<any> {
         return new Promise<any>((resolve, reject) => {
             const mongo = require('mongodb').MongoClient;
             mongo.connect(url, { useUnifiedTopology: true }, (err, client: mongo.MongoClient) => {
                 if (err) {
                     console.log("ERROR -" + err)
                     reject(err);
                 } else {
                     Connector.client = client;
                     Connector.users = client.db('db_users').collection('users');
                     Connector.tokens = client.db('db_tokens').collection('tokens');
                     console.log("Connected to MongoDB")
                     resolve(client);
                 }
             });
         });
     }

    public static client: mongo.MongoClient;
    public static tokens;
    public static users;

    public async AddUser(_user: DbUser): Promise<boolean> {
        var repeated = await this.RepeatedUser(_user)
        if (!repeated) {
            Connector.users.insertOne(_user,
                (err, result) => {
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
    public CreateToken(_owner: string): string {

        let tmpToken = tokgen.generate();
        Connector.tokens.insertOne(new Token(tmpToken, _owner),
            (err, result) => {
                if (err) {
                    console.log('Unable insert token: ', err);
                    throw err;
                }
            });
        return tmpToken;
    }

    public DeleteUserToken(all: boolean, _token: Token) {

        if (all)
            Connector.tokens.deleteMany({ Owner: _token.Owner },
                (err, result) => {
                    if (err) {
                        console.log('Unable delete user: ', err)
                        throw err
                    }
                });
        else
            Connector.tokens.deleteOne({ token: _token.token },
                (err, result) => {
                    if (err) {
                        console.log('Unable delete user: ', err)
                        throw err
                    }
                });
    }

    public async RepeatedUser(_user: DbUser): Promise<boolean> {

        let result = await Connector.users.findOne({ login: _user.login });
        return result !== null;
    }

    public async FindUser(_user: DbUser): Promise<any> {

        let result = await Connector.users.findOne({ login: _user.login });
        return result;
    }

    public async AuthValidate(_token: string): Promise<boolean> {

        let result = await Connector.tokens.findOne({ token: _token });
        return result;
    }

    public async LogIn(_user: DbUser): Promise<boolean> {
        let result = await Connector.users.findOne({ login: _user.login, _password: _user._password });
        return result !== null;
    }

    public async GetTokenInfo(_token: string): Promise<Token> {

        let result = await Connector.tokens.findOne({ token: _token });
        return result;
    }
}

export default new Connector();




