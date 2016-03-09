## loopback-connector-mailgun

Loopback connector module which allow to send emails via Mailgun.

## 1. Installation

````sh
npm install loopback-connector-mailgun --save
````

## 2. Configuration

datasources.json

    {
        "mailgun": {
            "connector": "loopback-connector-mailgun",
            "apikey": "[your api key here]",
            "domain": "[your domain here]"
        }
    }

model-config.json

    {
        "Email": {
            "dataSource": "mailgun",
            "public": false
        }
    }

Additionaly you can set defaults

    {
        "mailgun": {
            "connector": "loopback-connector-mailgun",
            "apikey": "[your api key here]",
            "defaults": {
                "someSettings": "SomeSettingsValues"
            }
        }
    }

## 3. Use

Basic option same as built in Loopback. Returns a Promise

    loopback.Email.send({
        to: "to@to.com",
        from: "fron@from.com",
        subject: "subject",
        text: "text message",
        html: "html <b>message</b>"
    })
    .then(function(response){})
    .catch(function(err){});