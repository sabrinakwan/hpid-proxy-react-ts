const axios = require('axios-jsonp-pro');
import { throwError, Subject, Observable, Subscription, interval } from 'rxjs';
import { AxiosPromise } from "axios";
import { User } from './../models/user.model'
// import { Proxy } from '../models/proxy.model';
import { ConfigurationModule } from './../configuration.module';

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
    private _isLoaded: Subject<boolean> = new Subject<boolean>();
    public isLoadedObserver: Observable<boolean> = this._isLoaded.asObservable();
    private _isUserLoggedIn: Subject<boolean> = new Subject<boolean>();
    public isUserLoggedInObserver: Observable<boolean> = this._isUserLoggedIn.asObservable();
    private _currentUser: Subject<User> = new Subject<User>();
    public currentUserObserver: Observable<User> = this._currentUser.asObservable();
    private _timeRemainingInMs: Subject<number> = new Subject<number>();
    /**
     *  The sessionTimeRemainingInMsObserver updates the value at the following rates.
     *  - per hour when the session has more than 2 hours remaining
     *  - per minute when the session has less than 2 hours remaining
     */
    public sessionTimeRemainingInMsObserver: Observable<number> = this._timeRemainingInMs.asObservable();
    location = window.location;
    defaultProxy: Proxy = {
        sign_in_url: proxyServerUrl + '/auth/sign_in?redirect_url=' + this.location,
        sign_out_url: proxyServerUrl + '/auth/sign_out?redirect_url=' + this.location,
        create_account_url: proxyServerUrl + '/auth/create_account?redirect_url=' + this.location,
        refresh_token_url: proxyServerUrl + '/refresh_access_token' + this.location,
        client_email: ''
    };

    private SHORT_TIMER_INTERVAL_IN_MS: number = 60000;
    private LONG_TIMER_INTERVAL_IN_MS: number = 60 * 60000;
    private TIME_TO_SWITH_TIMER_INTERVAL: number = this.LONG_TIMER_INTERVAL_IN_MS + 60 * 60000;
    private _proxyServerUrl: string = proxyServerUrl;
    private _proxy: Proxy = this.defaultProxy;
    private _userObject: User = new User({});

    private _sessionSubscription: Subscription;
    private _hasStartedTimer: boolean = false;

    static loadedHpidLinks = false;
    static theProxy: Proxy;
    config: Config;
    
    apiClient = axios.jsonp.create({
        baseURL: proxyUrl,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    constructor() {
       this.config = new ConfigurationModule();
        this._proxyServerUrl = this.config.proxyUrl;
        console.log("config proxy url is " + this._proxyServerUrl);
        this.loadLoginLinks();
    }

    private loadLoginLinks() {
        this.http.jsonp(this._proxyServerUrl + '/auth/creds', 'callback')
            .pipe(
                catchError(this.handleLoadLoginLinksError.bind(this))
            ).subscribe(data => {
                // console.log('data: ' + JSON.stringify(data));
                this._proxy = new Proxy(data);
                this.updateUser(data);
                this._isLoaded.next(true);
            });
    }
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