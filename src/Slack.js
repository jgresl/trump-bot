const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: 'xoxb-919861223334-993623735377-KB9SgCy5j99ZHgbCwRI9d1fB',
  signingSecret: 'c865622026ac42e48f1ad2b7d8e53227'
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

app.message('@trump', ({message, say}) => {
  say(`Hey there <@${message.user}>!`);
});
