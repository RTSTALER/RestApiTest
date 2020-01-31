import { DbUser } from "../Models/UserModel";
import { Token } from "../Models/TokenModel";
import { MongoHelper } from "./MongoHelper";
import * as mongo from 'mongodb';
const mongo = require('mongodb').MongoClient;

let tokens;
let users;
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();

export class Connector {
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

    public connect(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            mongo.MongoClient.connect(url, { useNewUrlParser: true }, (err, client: mongo.MongoClient) => {
                if (err) {
                    reject(err);
                } else {
                    this.client = client;
                    resolve(client);
                    tokens = client.db('db_users').collection('tokens');
                    users = client.db('db_users').collection('users');
                }
            });
        });
    }
    public client: mongo.MongoClient;
    public  tokens;
    public users;

    public AddUser(_user: DbUser): boolean {
        if (!this.RepeatedUser(_user)) {
            users.insertOne(_user,
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
            this.tokens.insertOne(new Token(tmpToken, _owner),
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
                this.tokens.deleteMany({ owner: _token.Owner },
                    (err, result) => {
                        if (err) {
                            console.log('Unable delete user: ', err)
                            throw err
                        }
                    });
            else
                this.tokens.deleteOne({ token: _token.token },
                    (err, result) => {
                        if (err) {
                            console.log('Unable delete user: ', err)
                            throw err
                        }
                    });
    }

    public RepeatedUser(_user: DbUser): boolean {
        
        let result = users.find({ _login: _user.login }).findOne();
            return result;
    }

    public FindUser(_user: DbUser): any {
      
        let result = this.users.find({ _login: _user.login }).findOne();
            return result;
    }

    public AuthValidate(_token: string): boolean {

        let result = this.tokens.findOne({ token: _token });
            return result;
        }

    public LogIn(_user: DbUser): boolean {
        let result = this.tokens.findOne({ _login: _user.login, _password: _user._password });
        return result;
    }

    public GetTokenInfo(_token: string): Token {
        let result = this.tokens.findOne({ token: _token }) as Token;
        return result;
        }
}

export default new Connector();




