const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if(req.url === '/'){
    res.write('Hello, World!\n');
    res.end();
  }
  
  if(req.url === '/nodejs_test'){
      res.write('nodejs_test');
      res.end();
  }
  else
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

