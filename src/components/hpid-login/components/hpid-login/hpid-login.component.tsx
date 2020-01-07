// import React from "react";
import React, { FunctionComponent } from 'react';
import './hpid-login.component.css'

type LoginProps = {
    label: string
}

export const Login: FunctionComponent<LoginProps> = ({ label }) => <aside>
    <div className="nav-menu">
        <a  className="btn btn-primary">{label}</a>
    </div >
</aside>

// const el = <Login label="Login"  />
export interface HpidLoginComponentProps { isLoggedIn: boolean; isLoaded: boolean; }

export class HpidLoginComponent extends React.Component<HpidLoginComponentProps, {}> {

    render() {
        return (
            <div>
                {this.props.isLoggedIn && <Login label="Sign Out" />}  
                {!this.props.isLoggedIn && <Login label="Sign In" />} 
            </div>
        
        );
    }
}