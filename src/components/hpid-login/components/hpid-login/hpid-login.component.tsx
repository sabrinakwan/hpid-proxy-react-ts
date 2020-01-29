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
    /*
    async componentDidMount() {
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
    */

    componentDidMount() {
        // subscribe to home component messages
        this.subscription = messageService.getMessage().subscribe(message => {
            if (message) {
                // add message to local state if not empty
                this.setState({ messages: [...this.state.messages, message] });
            } else {
                // clear messages when empty message received
                this.setState({ messages: [] });
            }
        });
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
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