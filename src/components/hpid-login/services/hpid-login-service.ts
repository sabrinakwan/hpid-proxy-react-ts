const axios = require('axios-jsonp-pro');
import { AxiosPromise } from "axios";

export interface Proxy {
    sign_in_url: string,
    sign_out_url: string,
    create_account_url: string,
    refresh_token_url: string,
    client_email: string
}

export enum HpidLinks {
    Signin,
    Signout,
    Refresh,
    Create
}

const emptyProxy = (): Proxy => ({
    sign_in_url: '',
    sign_out_url: '',
    create_account_url: '',
    refresh_token_url: '',
    client_email:''
});

const proxyServerUrl: string = 'https://mylinks-staging.linkcreationstudio.com';
const proxyUrl: string = proxyServerUrl + '/auth/creds';

export class HpidLoginProxyService {

    location: string = '';
    static loadedHpidLinks = false;
    static theProxy: Proxy;
    defaultProxy: Proxy = {
        sign_in_url: proxyServerUrl + '/auth/sign_in?redirect_url=' + this.location,
        sign_out_url: proxyServerUrl + '/auth/sign_out?redirect_url=' + this.location,
        create_account_url: proxyServerUrl + '/auth/create_account?redirect_url=' + this.location,
        refresh_token_url: proxyServerUrl + '/refresh_access_token' + this.location,
        client_email:''
    };
    
    apiClient = axios.jsonp.create({
        baseURL: proxyUrl,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // static async getSignInUrl(): Promise<string> {
    //     let link = await HpidLoginProxyService.checkLoginLinks();
    //     return link;
    // };

    // static async checkLoginLinks(linkType: HpidLinks): Promise<string> {
    //     if (!HpidLoginProxyService.loadedHpidLinks) {
    //         console.log("calling jsonp");
    //         HpidLoginProxyService.getProxyApiClient().then(
    //             (proxy: Proxy) => {
    //                 HpidLoginProxyService.loadedHpidLinks = true;
    //                 HpidLoginProxyService.theProxy = proxy;
    //                 console.log("checkLoginLinks:Proxy sign in url: " + proxy.sign_in_url);
    //                 return HpidLoginProxyService.theProxy.sign_in_url;
    //             }
    //         );

    //     } else {
    //         return HpidLoginProxyService.theProxy.sign_in_url;
    //     }

    // }

    // static async getProxyApiClient(): Promise<Proxy> {
    static async getProxyApiClient() {
            return axios.jsonp(
                proxyUrl
                // { headers:  {
                //     "REFERER": "https://workflow-local.linkcreationstudio.com"
                // }
                // }
            )
                .then(function (response: Proxy) {
                    console.log(response);
                    let thisProxy = response;
                    // let thisProxy: Proxy = new Proxy(response);
                    console.log("In getProxyCLient: " + thisProxy.sign_in_url)
                    return thisProxy;
                })
                .catch(function (error: string) {
                    console.log(error);
                    return emptyProxy();
                });
        }
  

}