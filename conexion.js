const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: '12616027',
  database: 'banco_db',
  port: 5432,
})
module.exports = pool
