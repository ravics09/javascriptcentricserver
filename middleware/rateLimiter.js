const rateLimit = require("express-rate-limit");

const signInLimiter = rateLimit({
  windowMs: 1*60*1000,
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    code: 429,
    message: "Too many SignIn request. Please try again",
  },
});

const apiLimiter = rateLimit({
  windowMs: 5000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    code: 429,
    message: "Too many requests, Server is busy. Please try again",
  },
});

module.exports = {
  signInLimiter,
  apiLimiter
};
