
export class DbUser {

    constructor(_login:string, password: string, _isEmail : boolean, _isPhone : boolean) {
        this.login = _login;
        this._password = password;
        this.isPhone = _isPhone;
        this.isEmail = _isEmail;
    }

    login: string;

    _password: string;

    isEmail: boolean = false;

    isPhone : boolean = false;
}