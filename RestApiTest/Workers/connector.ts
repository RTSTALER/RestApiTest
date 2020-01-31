import { DbUser } from "../Models/UserModel";
import { Token } from "../Models/TokenModel";
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
    // взаимодействие с базой данных
});

const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();

export class Connector {

    public AddUser(_user: DbUser): boolean {

        return client.connect(err => {

            if (!this.RepeatedUser(_user)) {
                users.insertOne(_user,
                    (err, result) => {
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
        }) as boolean;
    }
    public CreateToken(_owner: string): string {
        return client.connect(err => {
            let tmpToken = tokgen.generate();
            tokens.insertOne(new Token(tmpToken, _owner),
                (err, result) => {
                    if (err) {
                        console.log('Unable insert token: ', err);
                        throw err;
                    }
                });
            client.close();
            return tmpToken;
        }) as string;
    }

    public DeleteUserToken(all: boolean, _token: Token) {
        return client.connect(err => {
            if (all)
                tokens.deleteMany({ owner: _token.Owner },
                    (err, result) => {
                        if (err) {
                            console.log('Unable delete user: ', err)
                            throw err
                        }
                    });
            else
                tokens.deleteOne({ token: _token.token },
                    (err, result) => {
                        if (err) {
                            console.log('Unable delete user: ', err)
                            throw err
                        }
                    });
            client.close();
        });
    }

    private RepeatedUser(_user: DbUser): boolean {
        return client.connect(err => {
            let result = users.find({ _login: _user.login }).findOne();
            client.close();
            return result;
        }) as boolean;
    }

    private FindUser(_user: DbUser): any {
        return client.connect(err => {
            let result = users.find({ _login: _user.login }).findOne();
            client.close();
            return result;
        }) as boolean;
    }

    public AuthValidate(_token: string): boolean {

        return client.connect(err => {
            let result = tokens.findOne({ token: _token });
            client.close();
            return result;
        }) as boolean;
    }

    public LogIn(_user: DbUser): boolean {
        return client.connect(err => {
            let result = tokens.findOne({ _login: _user.login, _password: _user._password });
            client.close();
            return result;
        }) as boolean;
    }

    public GetTokenInfo(_token: string): Token {
        return client.connect(err => {
            let result = tokens.findOne({ token: _token }) as Token;
            client.close();
            return result;
        }) as Token;
    }
}

export default Connector;




