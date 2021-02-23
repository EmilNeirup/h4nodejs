var http = require('http');
var fs = require('fs');
const sql = require('mssql')

async function getRooms() {
    try {
        await sql.connect('mssql://sa:Pass1234@localhost/servprogsolutionsRest')
        const result = await sql.query`select * from dbo.rooms`
        return result.recordset
    } catch (err) {
        console.log(err)
    }
}

http.createServer(async (req, res) => {
    var rooms = await getRooms()
    console.log(rooms)

    var path = req.url.split('?')[0];

    if (path === '/') { 
        path = 'index.html' 
    }
    else {
        path = req.url.substring(1);
    };


    fs.readFile(path, (err, data) => {

        if (err) {
            console.log(err)
            data = '404 data not found';
        }
        res.write(data)
        return res.end()
  });
}).listen(8080);