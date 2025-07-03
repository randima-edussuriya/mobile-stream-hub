import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.query = util.promisify(db.query);

export default db;