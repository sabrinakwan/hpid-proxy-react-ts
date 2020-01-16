import { Proxy } from "../models/proxy.model"
// import { Axios } from 'axios-jsonp-pro';
const axios = require('axios');
const jsonpAdapter = require('axios-jsonp');
const proxyServerUrl: string = 'https://mylinks-staging.linkcreationstudio.com';
const proxyUrl: string = proxyServerUrl + '/auth/creds';
const apiClient = axios.create({
    baseURL: proxyUrl,
    adapter: jsonpAdapter,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json'
    }
});

const createProxy = async (newProxy: Proxy) => {
    try {
        const response = await apiClient.get('/', newProxy);
        const proxy = response.data;
        return proxy;
    } catch (err) {
        if (err && err.response) {
            // const axiosError = err as AxiosError<ServerError>
            // return axiosError.response.data;
            return err;
        }

        throw err;
    }
};

export class HpidProxyService {
    private _proxyServerUrl: string = proxyServerUrl;
    // private _proxyUrl: string = this._proxyServerUrl + '/auth/creds';
    private _proxy: Proxy = new Proxy({});

    loadLoginLinks() {
        this.initLinks();
        // createProxy(this._proxy);

    }

    get proxy() {
        return createProxy;
    }

    private initLinks() {
        // this._proxy = new Proxy({});
        this._proxy.sign_in_url = this._proxyServerUrl + '/auth/sign_in?redirect_url=' + window.location.href;
        this._proxy.sign_out_url = this._proxyServerUrl + '/auth/sign_out?redirect_url=' + window.location.href;
        this._proxy.create_account_url = this._proxyServerUrl + '/auth/create_account?redirect_url=' + window.location.href;
        this._proxy.refresh_token_url = this._proxyServerUrl + '/refresh_access_token';
    }
}

export default axios.jsonp(proxyUrl)
    .then(function (response: any) {
        console.log(response);
    })
    .catch(function (error: any) {
        console.log(error);
    });
