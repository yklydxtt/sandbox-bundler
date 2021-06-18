function reactTmpl(){
    return '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><meta name="theme-color" content="#000000"><title>React App</title><script src="https://unpkg.com/react@17/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div><script><%- staticAsset %><%- code %></script></body></html>';
}

exports.reactTmpl=reactTmpl;