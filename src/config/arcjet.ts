import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";

if(!process.env.ARCJET_KEY && process.env.NODE_ENV !== 'test') {
  throw new Error('ARCJET_KEY env is required');
}

const aj = arcjet({
  // Get your site key from https://console.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY! ,
  rules: [
    // Shield protects your app from common attacks such as SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews such as Slack, Discord
      ],
    }),
    // Create a token 
    slidingWindow({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      interval: '2s', // Refill every 10 seconds
      max: 5
    }),
  ],
});

export default aj;