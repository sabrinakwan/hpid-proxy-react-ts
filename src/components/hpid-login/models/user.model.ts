export class User {
    accessToken: string = "";
    storedTime: string = "";
    client_email: string = "";
    client_id: string = "";
    access_token: string = "";
    isLoggedIn: boolean = false;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
