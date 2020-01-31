import { DbUser } from "../Models/UserModel";
import { RegisterUser } from "../Entities/RegisterUser";

class JsonHelpers {
    public static JsonReg2User(_json: any): DbUser {
        return this.RgisterUser2dbUser(this.Json2RegisterUser(_json));
    }

    public static Json2RegisterUser(_json: any): RegisterUser {
        return new RegisterUser(_json.login, _json.password);
    }

    public static RgisterUser2dbUser(_user: RegisterUser): DbUser {
        return new DbUser(_user.login, _user.password);
    }

    public static Url2QueryParams(Url: string): boolean {
        const querystring = require('querystring');
        return querystring.parse(Url,
            null,
            null,
            { decodeURIComponent }) as boolean;
    }
}


export default JsonHelpers