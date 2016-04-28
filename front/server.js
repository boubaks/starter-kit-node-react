var express         = require('express');
var request         = require('request');
var ejs             = require('ejs');

var port            = process.env.PORT || 80;
var proxyMiddleware = require('http-proxy-middleware');
var configDir       = process.argv[2] && process.argv[2] == '--prod' ? '/dist/' : '/.tmp/';
var configDirImage  = process.argv[2] && process.argv[2] == '--prod' ? '/dist/' : '/app/';
var apiUrl          = process.argv[2] && process.argv[2] == '--prod' ? '' : 'http://localhost:3000'; // api url

var context = '/api';
var options = {
    target: 'http://localhost:3000', // target host
    changeOrigin: true,              // needed for virtual hosted sites
    ws: true,                        // proxy websockets
    pathRewrite: {
        '/api/' : '/'                // rewrite paths
    },
    proxyTable: {
        'http://localhost:3000' : 'http://localhost:9000'
    }
};

// instantiate app
var app = express();
// create the proxy
var proxy = proxyMiddleware(context, options);

// initialize app
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views/');
app.use(proxy);
app.use('/styles', express.static(__dirname + configDir + 'styles/'));
app.use('/scripts', express.static(__dirname + configDir + 'scripts/'));
app.use('/images', express.static(__dirname + configDirImage + 'images/'));
app.use('/robots.txt', express.static(__dirname + '/robots.txt'));

// HTML index page
var ifndef = '<!doctype html><!--[if IE 8]><html class="ie8"><![endif]--><!--[if IE 9]><html class="ie9"><![endif]--><!--[if gt IE 9]><!--> <html> <!--<![endif]-->';
var beforeHtml = '<head><meta charset="utf-8"><meta content="ie=edge" http-equiv="x-ua-compatible"><meta content="width=device-width, initial-scale=1" name="viewport"><title>Starter Kit</title><link rel="icon" type="image/png" href="/images/favicon.png" /><link rel="stylesheet" href="/styles/main.css">';
var afterHtml = '</head><body><main id="main-root"></main><script src="https://maps.googleapis.com/maps/api/js?libraries=places&language=en"></script><script src="/scripts/bundle.js"></script><script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic("reattach_activator");ic("update",intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="https://widget.intercom.io/widget/intercomID";var x=d.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent("onload",l);}else{w.addEventListener("load",l,false);}}})()</script></body></html>';
var index = ifndef + beforeHtml + afterHtml;

// head manager with openGraph & twitter infos
function generateHTML(datas) {
    var htmlGenerated = ifndef + beforeHtml;    

    if (!datas) { datas = {}; }
    datas.url = datas.url ? datas.url : ''; // home page url (ex: http://www.google.com)
    var canonical = '<link rel="canonical" href="' + datas.url + '">';
    htmlGenerated += canonical.toString();
    var twitterCard = [
        {name: 'twitter:card', content: 'photo'},
        {name: 'twitter:site', content: '@boubaks'}, // to complete @username
        {name: 'twitter:creator', content: datas.user && datas.user.username ? '@' + datas.user.username : '@boubaks'}, // user creator
        {name: 'twitter:title', content: datas.title},
        {name: 'twitter:url', content: datas.url},
        {name: 'twitter:description', content: datas.description ? datas.description : ''},
        {name: 'twitter:image', content: datas.picture ? datas.picture : ''},
    ];

    var facebookCard = [
        {property: 'og:title', content: datas.title},
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: datas.gif ? datas.gif : datas.url},
        {property: 'og:image', content: datas.picture ? datas.picture : ''},
        {property: 'og:description', content: datas.description ? datas.description : ''},
        {property: 'og:site_name', content: ''}, // to complete ex : boubaks.com
        {property: 'fb:app_id', content: ''}, // to complete
    ];
    for (iterator in twitterCard) {
        var meta = '<meta name="' + twitterCard[iterator].name
                    + '" content="' + twitterCard[iterator].content + '">';
        htmlGenerated += meta.toString();
    }
    for (iterator in facebookCard) {
        var meta = '<meta property="' + facebookCard[iterator].property
                    + '" content="' + facebookCard[iterator].content + '">';
        htmlGenerated += meta.toString();
    }
    htmlGenerated += afterHtml;
    return (htmlGenerated);
}

var routes = {
    home: '/',
};

app.get(routes['home'], function(req, res) {
    var htmlGenerated = generateHTML({
        user: {},
        title: 'Starter Kit',
        description: 'Develop more faster with this starter kit',
        url: 'http://boubaks.com'
    });
    res.setHeader('Content-Type', 'text/html');
    res.end(ejs.render(htmlGenerated));
});


app.listen(port);
console.log('Front server started on port ' + port);