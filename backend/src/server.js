const http = require('http');

const app = require('./app');

function startServer() {
  const port = Number(process.env.PORT || 4000);
  const server = http.createServer(app);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

module.exports = { startServer };

