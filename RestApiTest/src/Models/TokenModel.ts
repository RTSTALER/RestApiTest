
export class Token {

    constructor(_token: string, _owner: string) {
        this.token = _token;
        this.CreateTime = Date.now();
        this.Owner = _owner

    }
    //Логин владельца токена
    Owner: string;

    token: string;

    CreateTime: number;

}

export default Token;