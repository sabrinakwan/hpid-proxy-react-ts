let axios = require('axios');
let jsonpAdapter = require('axios-jsonp');

axios({
    url: 'https://mylinks-staging.linkcreationstudio.com/auth/creds',
    adapter: jsonpAdapter,
    callbackParamName: 'c' // optional, 'callback' by default
}).then((res: any) => {
    console.log(res);

});