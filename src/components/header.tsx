import React from "react";
import '../styles/header.css';
import { HpidLoginComponent } from './hpid-login/components/hpid-login/hpid-login.component'
// import { NavLink } from "react-router-dom";

export class Header extends React.PureComponent {

    render() {
        let thisIsLoggedIn = false;
        let thisIsloaded = true;
        return (
            <div className="toolbar" role="banner">
                <div className="logo"></div>
                <HpidLoginComponent isLoggedIn={thisIsLoggedIn} isLoaded={thisIsloaded} />
            </div>
        );
    }
}

// export default Header;