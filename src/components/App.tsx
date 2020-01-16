import React from 'react';
import { Header } from './header'
import { Version } from './hpid-login/models/version.model'
import '../styles/index.css';
import uuidv1 from 'uuid';

class App extends React.PureComponent {
    render() {
        return (
            <div>
                <Header />
                <h1>Hello World! version { Version.version }</h1>
                <p>this { uuidv1.v4() }</p>
            </div>
        );
    }
}

export default App;