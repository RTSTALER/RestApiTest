import { Column } from 'typeorm';

export class Token {

    constructor(_token: string, _owner: string) {
        this.token = _token;
        this.CreateTime = Date.now();
        this.Owner = _owner

    }
    //Логин владельца токена
    @Column()
    Owner: string;

    @Column()
    token: string;

    @Column()
    CreateTime: number;

}

export default Token;