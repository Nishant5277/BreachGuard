require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  hibpApiUrl: 'https://api.pwnedpasswords.com/range',
  nodeEnv: process.env.NODE_ENV || 'development'
};
