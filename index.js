import express from "express";
import bodyParser from "body-parser";
import userController from './controller/userController.js';
import testController from './controller/testController.js';
import * as config from './config/serverconfig'

const app = express();
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

app.all('*', function (req, res, next) {
    /**
     * Response settings
     * @type {Object}
     */
    const responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };
    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", 
    responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",
     responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers",
     (req.headers['access-control-request-headers']) ? 
     req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods",
     (req.headers['access-control-request-method']) ?
      req.headers['access-control-request-method'] :
       responseSettings.AccessControlAllowMethods);
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.use('/user', userController);
app.use('/test', testController);

app.listen(config.port, () => {
    console.log('Start server at port ' + config.port)
});

