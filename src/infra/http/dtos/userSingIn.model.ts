export class UserSingIn {
    static password: string;
    static email: string;

    constructor(params: { password: string, email: string }) {
        console.log("params",params)
        UserSingIn.email = params.email;
        UserSingIn.password = params.password
    }

}