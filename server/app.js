var http = require('http');
var fs = require('fs');

http.createServer((req, res) => {
    var path = req.url;
    if (path === '/') { 
        path = 'index.html' 
    }
    else {
        path = path.substring(1);
    };

    fs.readFile(path, (err, data) => {

        if (err) {
            console.log(err)
            data = '404 data not found';
        }

        res.write(data);
        return res.end();
  });
}).listen(8080);