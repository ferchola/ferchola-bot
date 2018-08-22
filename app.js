/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['DefaultEndpointsProtocol=https;AccountName=cs2cebb1550e9eax4fe0xb26;AccountKey=ovRqhAdheU6BmtSi+1oLw/C+fcKn3uUhSX7uu4rvB5d/eOf1wgHytJU2Oi2dGCc0PcExrFDnEnGtOTVzmidTEg==;EndpointSuffix=core.windows.net']);
//DefaultEndpointsProtocol=https;AccountName=cs2cebb1550e9eax4fe0xb26;AccountKey=ovRqhAdheU6BmtSi+1oLw/C+fcKn3uUhSX7uu4rvB5d/eOf1wgHytJU2Oi2dGCc0PcExrFDnEnGtOTVzmidTEg==;EndpointSuffix=core.windows.net/botdata
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, 'cs2cebb1550e9eax4fe0xb26', 'ovRqhAdheU6BmtSi+1oLw/C+fcKn3uUhSX7uu4rvB5d/eOf1wgHytJU2Oi2dGCc0PcExrFDnEnGtOTVzmidTEg==');
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('You reached the default message handler \n or something went REALLY WRONG. \nYou said \'%s\'.', session.message.text);
});

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
//var luisAppId = process.env.LuisAppId;
var luisAppId = '6c014a02-316c-4229-a46a-8c5283a2ff1e';
//var luisAPIKey = process.env.LuisAPIKey;
var luisAPIKey = 'c0b2267baa0448daac1e46f52fc0c9dd';
//var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('GreetingDialog',
    (session) => {
        session.send('Hello Mr. consultant! You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
})

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
})

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
    })

bot.dialog('AskWeatherDialog',
    (session) => {
        session.send('The weather in Santiago is: 24 degrees Celsius! You question was\%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'AskWeather'
    })

bot.dialog('AskBestGamingPlatform',
    (session) => {
        session.send('PS4 obviously!');
        session.endDialog();
    }
).triggerAction({
    matches: 'AskBestGamingPlatform'
})

bot.dialog('Insult',
    (session) => {
        session.send('El %s sos vos! Yo solo soy un chatbot...' , session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Insult'
})
