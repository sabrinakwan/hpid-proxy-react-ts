export class Proxy {
    sign_in_url: string = "";
    sign_out_url: string = "";
    create_account_url: string = "";
    refresh_token_url: string = "";
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
