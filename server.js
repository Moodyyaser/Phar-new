const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Helloworld');
})

server.listen(process.env.PORT || 3000);
