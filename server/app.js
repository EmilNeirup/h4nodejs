var http = require('http')
var fs = require('fs')
const sql = require('mssql')
const url = require('url')
var calls = require('./calls.js')
var Cookies = require('cookies')

var keys = ['keyboard cat']

const createRequest = async (req, res) => {
    var cookies = new Cookies(req, res, { keys: keys })

    var cookie1 = cookies.get('cookie1', { signed: true })
    var cookie2 = cookies.get('cookie2', { signed: true })

    cookies.set('cookie1', 'foo', { signed: true })
    cookies.set('cookie2', 'bar', { signed: true })

    var message = 'Welcome back'
 
    if (!cookie1 && !cookie2) {
        res.write(JSON.stringify(message))
    } else {
        var cookie1 = cookies.get('cookie1', { signed: true })
        var cookie2 = cookies.get('cookie2', { signed: true })
        
        var resuly = {message, cookie1, cookie2}
        
        res.write(JSON.stringify(resuly))
    }

    var path = req.url.split('?')[0]
    var q = url.parse(req.url, true).query;
    var hasAccess = await calls.checkKey(req.headers['apikey'], res)

    if (q.name) {
        console.log("dit name er: " + q.name)
    }

    if(hasAccess) {
        if (path === '/rooms') {
            var rooms = await calls.getRooms()
            res.write(JSON.stringify(rooms))
            return res.end()
        }
        else if (path === '/add' && req.method === 'POST') {
            calls.insertBooking(req.body)
            return res.end()
        }
        else if (path ==='/bookings') {
            var bookings = 'test'
            if (q.date) bookings = await calls.getBookingsWithDate(q.date)
            else bookings = await calls.getBookings()
            res.write(JSON.stringify(bookings))
            return res.end()
        }
        else {
            path = req.url.substring(1);
        };
    }

    fs.readFile(path, (err, data) => {
    
        if (err) {
            console.log(err)
            data = ''
        }
        res.write(data)
        return res.end()
  });
};

const readBody = async (req, res) => {
    let body = []
    return req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        if (body) req.body = JSON.parse(body);
        return createRequest(req, res)
    });
}

http.createServer(readBody).listen(8081);