const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js'
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development'),
      PORT: JSON.stringify('9090'),
      GREETING_MESSAGE: JSON.stringify('API Running In Development Environment'),
      API_WORKS_MESSAGE: JSON.stringify('API_WORKS_MESSAGE'),
      DB_USERNAME: JSON.stringify('DB_USERNAME'),
      DB_PASSWORD: JSON.stringify('DB_PASSWORD'),
      DB_CONNECTION_STR: JSON.stringify('DB_CONNECTION_STR'),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};