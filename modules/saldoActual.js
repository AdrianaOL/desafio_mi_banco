const Cursor = require('pg-cursor')
const { id1 } = require('../argumentos')
const saldoActual = async (newPool) => {
  const consulta = new Cursor('select * from cuentas where id = $1', [id1])
  const cursor = newPool.client.query(consulta)
  cursor.read(1, (err, rows) => {
    console.log(rows)
    cursor.close()
    newPool.release()
  })
}

module.exports = saldoActual
