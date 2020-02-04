
export class RegisterUser {
    constructor(_login: any, _password: any) {
        this.login = _login;
        this.password = _password;
    }
    login: string;
    password: string;
}