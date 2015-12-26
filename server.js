// startup-nahuel-fe.js

var express = require('express');
var path    = require('path');
var session = require('express-session');
var url     = require('url');
var request = require('request');
var fs = require('fs');
var openid  = require('openid');
var request = require('request');

var app = express();
app.use(
    session(
        { secret: 'B3tt3rN3rfIr3l14',
          resave: true,
          saveUninitialized: true
        })
    );

var config = require('/etc/nodejs-config/it-assets');

function isAuthenticated(req, res, next) {
  if (req.session.uid){
    console.log("paso");
    return next();
  }
  else{
    var urlPath = url.parse(req.url).pathname;
    console.log(urlPath);
    if(urlPath != '/connect' && urlPath != '/openid/return'){
      console.log(req.url);
      res.redirect('/connect');
    }
    else
      next();
  }
}

app.use('/test', function(req, res, next) {
  res.send('Ok');
})

// app.use('/backend', function(req, res, next) {
//   req.pipe(request(config.backend.url+req.url)).pipe(res);
// });

// serving static files
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
 // app.use('/index.html', express.static(path.join(__dirname, 'app', 'index.html')));
app.use('/images', express.static(path.join(__dirname, 'app', 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'app', 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'app', 'styles')));
app.use('/views', express.static(path.join(__dirname, 'app', 'views')));
app.get('/',isAuthenticated, express.static(path.join(__dirname, 'app')));

app.get('/favicon.ico', function(req, res, next){
//  res.set('Content-Type','text/html');
  res.send(fs.readFileSync('app/favicon.ico'));
});
// app.use('/', isAuthenticated, express.static(path.join(__dirname, 'app')));
// app.use('/', express.static(path.join(__dirname, 'app')));
// app.use('/', isAuthenticated, express.static(path.join(__dirname, 'app')));


var host = config.host + ":" + config.port ;

// OpenID extensions
var extensions = [
    new openid.SimpleRegistration(
        {
            "nickname" : true,
            "email" : true
        }),
    new openid.AttributeExchange(
        {
            "http://axschema.org/contact/email": "required",
            "http://axschema.org/namePerson/friendly": "required",
        })
];

// OpenID relying party.
var relyingParty = new openid.RelyingParty(
    "http://" + host + '/openid/return', // my verification URL
    null,    //realm for openID authentication, optional
    false,   // Use stateless verification
    false,   // Strict mode
    extensions
);

// my verification URL
app.get('/openid/return', function(req, res, next) {
    // Verify identity assertion
    relyingParty.verifyAssertion(req, function(err, result) {
      // if authenticated, redirect to home page
      if(!err && result.authenticated) {
        console.log(result);
        req.session.uid = result.nickname;
        res.redirect('/#/');
      }
      else
        console.log(err);
    });
});

// user request for authentication
app.get('/connect', function(req, res, next) {
    //relyingParty.authenticate("https://yulid.unc.edu.ar/openid2/",
    relyingParty.authenticate(config.openid.url,
    false,
    function(error, authURL) {
      res.redirect(authURL);
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
    });
}*/

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
      console.log(err);
});

var server = app.listen(config.port, function() {
  console.log('Frontend de la aplicaciôn de gestiôn de activos informâticos iniciada en puerto ' + config.port);
});
