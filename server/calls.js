const sql = require('mssql')
const dboConnect = sql.connect('mssql://sa:Pass1234@localhost/servprogsolutionsRest')

module.exports = {
    getRooms: async function () {
        try {
            await dboConnect
            const result = await sql.query`select * from dbo.rooms`
            return result.recordset
        } catch (err) {
            console.log(err)
        }
    },
    
    checkKey: async function (key, res) {
        try {
            await dboConnect
            const result = await sql.query(`SELECT apikey FROM dbo.apikeys where apikey = '${key}'`) 
            const keyResult = result.rowsAffected[0]

            if (keyResult > 0) {
                return true
            }
            else {
                res.writeHead(401)
                return false
            }
        } catch (err) {
            console.log(err)
        }
    },

    insertBooking: async function (data) {
        try {
            await dboConnect
            const result = await sql.query`INSERT INTO bookings(room_id, bookedBy, bookingDay) VALUES (${data.roomId}, ${data.bookedBy}, ${data.bookingDay})`
            result
        } catch (err) {
            console.log(err)
        }
    },

    getBookings: async function () {
        try {
            await dboConnect
            const result = await sql.query`SELECT * FROM bookings`
            return result.recordset
        } catch (err) {
            console.log(err)
        }
    },

    getBookingsWithDate: async function (date) {
        try {
            await dboConnect
            const result = await sql.query`SELECT * FROM bookings WHERE bookingDay like ${date}`
            return result.recordset
        } catch (err) {
            console.log(err)
        }
    }
}