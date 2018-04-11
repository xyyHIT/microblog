module.exports = {
    cookieSecret: 'xyyHITMicoBlog',
    mongodb_url: 'mongodb://127.0.0.1:27002/microblog?replicaSet=testdb',
    redis: {
        port: 6379,
        host: '127.0.0.1',
        pwd: 'crs-lodfe5ga:TFH2016yijia'
    },
    log4js: {
        appenders: [
            { type: 'console' },
            {
                type: 'file',
                filename: 'logs/access.log',
                maxLogSize: 1024 * 1024,
                backups: 3
            }]
    }
}