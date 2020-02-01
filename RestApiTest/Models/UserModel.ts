import { IsEmail, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity()
export class DbUser {

    constructor(_login:string, password: string, _isEmail : boolean, _isPhone : boolean) {
        this.login = _login;
        this._password = password;
        this.isPhone = _isPhone;
        this.isEmail = _isEmail;
    }

    @Column()
    login: string;

    @Column({
        length: 100
    })
    @MinLength(6)
    _password: string;

    @Column()
    isEmail: boolean = false;

    @Column()
    isPhone : boolean = false;
}