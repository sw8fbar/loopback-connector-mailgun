var Mailgun = require('mailgun-js'),
  Promise = require('bluebird'),
  lo = require('lodash'),
  mailComposer = require('mailcomposer');

module.exports = Connector;

/**
 * Configure and create an instance of the connector
 */

function Connector(settings) {
  this.mailgun = Mailgun({apiKey : settings.apikey, domain : settings.domain});
}

Connector.initialize = function (dataSource, callback) {

  dataSource.connector = new Connector(dataSource.settings);
  callback();
};

Connector.prototype.DataAccessObject = Mailer;

function Mailer() {

}

Mailer.mailComposer = mailComposer;

Mailer.send = function (options) {
  var _this = this;
  return new Promise(function (resolve,reject){
    var dataSource = _this.dataSource,
      settings = dataSource && dataSource.settings,
      connector = dataSource.connector,
      mailgunMessage = {};

    if (options.__data) {
      options = lo.clone(options.__data);
    }
    else {
      options = lo.clone(options);
    }

    var fn = function (err, result) {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    };

    if (lo.isString(options.from)) {
      mailgunMessage.from = options.from
    }
    else if (lo.isObject(options.from)) {
      mailgunMessage.from = options.from.name + '<' + options.from.email + '>';
    }
    else {
      var from = [];
      if (options.from_name) {
        from.push(options.from_name || undefined);
      }
      if (options.from) {
        from.push('<' + options.from + '>' || undefined);
      }
      mailgunMessage.from = from;
    }
    delete options.from;

    if (lo.isString(options.to)) {
      mailgunMessage.to = options.to;

    }
    else if (lo.isObject(options.to)) {
      mailgunMessage.to =  options.to.name + '<' + options.to.email + '>';
    }
    else {
      mailgunMessage.to = options.to;
    }
    delete options.to;

    mailgunMessage.subject = options.subject || null;
    mailgunMessage.html = options.html || null;
    mailgunMessage.text = options.text || null;
    if (options.replyTo){
      mailgunMessage['h:Reply-To'] = options.replyTo;
    }

    connector.mailgun.messages().send(mailgunMessage, function (err,body) {
      fn(null, body);
    }, function (err) {
      fn(err, null);
    });

  });
};

/**
 * Send an email instance using instance
 */
Mailer.prototype.send = function (fn) {
  return this.constructor.send(this, fn);
};

Mailer.compose = function (mail) {
  this.mail = this.mailComposer({
    from: 'you@samples.mailgun.org',
    to: 'mm@samples.mailgun.org',
    subject: 'Test email subject',
    body: 'Test email text',
    html: '<b> Test email text </b>'
  });

  return this;
};

Mailer.build = function (callback) {
  this.mail.build(function(mailBuildError, message) {

    callback(mailBuildError,message);
  });
}
