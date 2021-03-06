'use strict';

const colors = require('colors/safe');

const logDebug = (tag, msg) => console.log(`${colors.blue(tag)} ${msg}`);
const logInfo = (tag, msg) => console.log(`${colors.green(tag)} ${msg}`);
const logWarn = (tag, msg) => console.log(`${colors.yellow(tag)} ${msg}`);
const logError = (tag, msg) => console.log(`${colors.red(tag)} ${msg}`);

module.exports.logDebug = logDebug;
module.exports.logInfo = logInfo;
module.exports.logWarn = logWarn;
module.exports.logError = logError;

module.exports.sendAmqMessage = function(host, port, queue, msg, callback)
{
    const Stomp = require('stomp-client');
    //const client = new Stomp(host, port, "", "", '1.0', null, {retries: 3, delay: 100});
    const client = new Stomp(host, port);
    client.connect(sessionId => {
        logDebug('AMQ', `${host}:${port}/${queue} connected`);
        client.publish('/queue/' + queue, msg);
        client.disconnect(callback);
    },
    callback);
};

module.exports.genAppResult = function(taskId, errmsg = '', link = null)
{
    const status = errmsg? "FAIL": "SUCCESS";
    return {
        taskId,
        status,
        message: (typeof errmsg == "string")? errmsg: JSON.stringify(errmsg),
        link,
    };
}
