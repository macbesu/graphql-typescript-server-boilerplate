const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/index');
const route =  require('./utils/route');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      route(req, res, filePath, this.conf);
    });
    
  }
}