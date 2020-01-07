import React from 'react';
import { Header } from './header'
import { Version } from './hpid-login/models/version.model'

import '../styles/index.css';

class App extends React.PureComponent {
    render() {
        return (
            <div>
                <Header />
                <h1>Hello World! version { Version.version }</h1>
            </div>
        );
    }
}

export default App;