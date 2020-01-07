// import { Injectable, OnInit } from '@angular/core';
// import {
//   HttpErrorResponse,
//   HttpClient
// } from "@angular/common/http";
// import { catchError } from 'rxjs/operators';
// import { throwError, Subject, Observable, Subscription, interval } from 'rxjs';
// import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';
import { Proxy } from '../models/proxy.model';
import { ConfigurationModule } from '../configuration.module';
import { Version } from '../models/version.model';

// @Injectable({
//   providedIn: 'root'
// })

export class HpidProxyService{
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

  private SHORT_TIMER_INTERVAL_IN_MS: number = 60000;
  private LONG_TIMER_INTERVAL_IN_MS: number = 60 * 60000;
  private TIME_TO_SWITH_TIMER_INTERVAL: number = this.LONG_TIMER_INTERVAL_IN_MS + 60 * 60000;
  private _proxyServerUrl: string = "";
  private _proxy: Proxy = null;
  private _userObject: User = null;

  private _sessionSubscription: Subscription;
  private _hasStartedTimer: boolean = false;


  constructor(private http: HttpClient, 
              private cookieService: CookieService,
              private config: ConfigurationModule) { 
    console.log("hpid proxy constructor");
    this._proxyServerUrl = config.proxyUrl;
    console.log("config proxy url is " + this._proxyServerUrl);
    this.loadLoginLinks();
  }

  get isLoggedIn(): boolean {
    let cookie = this.cookieService.get(this.config.cookieName)
    return (cookie !== undefined && cookie != '');
  }

  get signInUrl(): string {
    return this._proxy.sign_in_url;
  }

  get signOutUrl(): string {
    return this._proxy.sign_out_url;
  }
  
  get createAccountUrl(): string {
    return this._proxy.create_account_url;
  }

  get user(): User {
    return this._userObject;
  }

  get currentUserEmail(): string {
    if (this._userObject != null) {
      console.log("userEmail is ");
      return this._userObject.client_email;
      ;
    }
    else
      return "";
  }

  get userSessionValidityInMs(): number {
    let reminderTime = -1;
    // read the cookie, then calculate, return -1 if you cannot find a cookie
    let expiryDateString = this.cookieService.get(this.config.proxyCookieName)
    if (expiryDateString && expiryDateString != "") {
      let expiryDateMiliseconds = parseFloat(expiryDateString);
      if (expiryDateMiliseconds) {
        let rightNow = new Date();
        reminderTime = expiryDateMiliseconds - rightNow.getTime();
      }
    }
    return reminderTime
  }

  get versionString(): string {
    return Version.version;
  }
  // Don't process the response here.  
  // The HTTP interceptor will process the response and determine what to do next
  refreshToken() {
    return this.http.jsonp(this._proxy.refresh_token_url, 'callback')
  }

  get loaded() {
    return this._isLoaded;
  }

  // Interceptor will call this function when it gets a successful refresh token response
  updateRefreshToken(data:string) {
    this.updateUser(data);
    console.log("New token is " + this.getAccessToken());
  }

  startSessionExpiryTimer() {
    if (!this._userObject.isLoggedIn) return;

    this.handleExpiryTimer();

    if (! this._hasStartedTimer) {
      if (this.isUserSessionExpiringIn(this.TIME_TO_SWITH_TIMER_INTERVAL))
        this.setShortExpiryTimer();
      else
        this.setLongExpiryTimer();
      this._hasStartedTimer = true;
    }
  }

  getAccessToken() {
    console.log("returning access token");
    if (this._userObject != null)
      return this._userObject.access_token;
   else
    return "";
  }

  doLogout() {
    window.location.href = this.signOutUrl;
  }

  ngOnDestroy() {
    if (this._sessionSubscription !== undefined) {
      this._sessionSubscription.unsubscribe();
    }
  }


  private loadLoginLinks() {
    this.http.jsonp(this._proxyServerUrl + '/auth/creds' , 'callback')
    .pipe(
      catchError(this.handleLoadLoginLinksError.bind(this))
    ).subscribe(data => {
      // console.log('data: ' + JSON.stringify(data));
      this._proxy = new Proxy(data);
      this.updateUser(data);
      this._isLoaded.next(true);
    });
  }


  private initLinks() {
    this._proxy = new Proxy({});
    this._proxy.sign_in_url = this._proxyServerUrl + '/auth/sign_in?redirect_url=' + window.location.href;
    this._proxy.sign_out_url = this._proxyServerUrl + '/auth/sign_out?redirect_url=' + window.location.href;
    this._proxy.create_account_url = this._proxyServerUrl + '/auth/create_account?redirect_url=' + window.location.href;
    this._proxy.refresh_token_url = this._proxyServerUrl + '/refresh_access_token';
  }

  private handleLoadLoginLinksError(error: HttpErrorResponse) {
    // assign defaults
    this.initLinks();
    this.updateUser({});
    this._isLoaded.next(true);
    return throwError('Failed to load login links from the _proxy service.  Defaults are assigned.');
  }

  private setLongExpiryTimer() {
    this._sessionSubscription = interval(this.LONG_TIMER_INTERVAL_IN_MS).subscribe(
      t => {
        this.handleExpiryTimer();
        if (this.isUserSessionExpiringIn(this.TIME_TO_SWITH_TIMER_INTERVAL)) {
          this._sessionSubscription.unsubscribe();
          this.setShortExpiryTimer();
        }
      }
    ); 
  }

  private isUserSessionExpiringIn(numberOfMs: number): boolean {
    let remiderTime = this.userSessionValidityInMs
    return (remiderTime <=0 || remiderTime <= numberOfMs)
  }

  private setShortExpiryTimer() {
    this._sessionSubscription = interval(this.SHORT_TIMER_INTERVAL_IN_MS).subscribe(
      t => {
        this.handleExpiryTimer();
      }
    );
  }
  
  private handleExpiryTimer() {
    let timeRemainingInMs = (this.userSessionValidityInMs);
    if (timeRemainingInMs <= 0) {
      if (this._sessionSubscription !== undefined) {
        this._sessionSubscription.unsubscribe();
      }  
    }
    this._timeRemainingInMs.next(timeRemainingInMs);
  }

  private updateUser(data) {
    this._userObject = new User(data);
    if (this._userObject.access_token) {
      this._userObject.isLoggedIn = true;
    } else {
      this._userObject.isLoggedIn = false;
    }
    console.log("login service update _isUserLoggedIn to " + this._userObject.isLoggedIn)
    this._isUserLoggedIn.next(this._userObject.isLoggedIn);
    this._currentUser.next(this._userObject);
  }

}