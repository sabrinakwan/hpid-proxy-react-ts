import React from "react";
// import React, { FunctionComponent } from 'react';
import {Proxy, HpidLoginProxyService } from '../../services/hpid-login-service'
import './hpid-login.component.css'
export interface HpidLoginComponentProps { isLoggedIn: boolean; isLoaded: boolean; }

export class HpidLoginComponent extends React.Component<HpidLoginComponentProps, {}> {
    static hpidProxy: Proxy;
    static isSignedIn: string;
    isLoggedIn: boolean;

    constructor(props: HpidLoginComponentProps) {
        super(props);
        this.isLoggedIn = false;
        this.state = { data: [] };
    }

    async userIsLoggedin(proxy: Proxy) {
                if (proxy.client_email != '' && proxy.client_email !== undefined) {
                    console.log("setting isLoggedIn to true");
                    HpidLoginComponent.isSignedIn = "proxy.client_email";
                    this.setState({ isLoggedIn: true });
                    this.isLoggedIn = true;
                }
    }
    async componentDidMount() {
        // const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
        // const response = await fetchJsonp(proxyUrl);
        // const json = await axios.jsonp(proxyUrl);
        const json = await HpidLoginProxyService.getProxyApiClient();
        console.log("this" + json);
        // const json = await response.json();
        if (json.client_email != '' && json.client_email !== undefined) {
            console.log("setting isLoggedIn to true");
            json.logged_in = true;
        } else {
            json.logged_in = false;
        }
        this.setState(json);
        console.log(json);
        HpidLoginComponent.hpidProxy = json;
    }

    handleSignIn(e:any) {
    //    e.preventDefault();
        console.log('Sign In was clicked' + HpidLoginComponent.hpidProxy.sign_in_url);

        window.location.href = HpidLoginComponent.hpidProxy.sign_in_url;
    }

    handleSignOut(e:any) {
        e.preventDefault();
        console.log('Sign Out was clicked' + HpidLoginComponent.hpidProxy.sign_out_url);   
        window.location.href = HpidLoginComponent.hpidProxy.sign_out_url;  
    }
        

        render() {
            return (
                <div>
                    {this.state.logged_in && <a onClick={this.handleSignOut}>Sign Out</a>}
                    {this.state.logged_in && <p>{this.state.client_email}</p>}
                    {!this.state.logged_in && <a onClick={this.handleSignIn}>Sign In</a>}
                </div>
            );
        }

}