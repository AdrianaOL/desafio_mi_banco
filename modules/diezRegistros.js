const Cursor = require('pg-cursor')
const { id1 } = require('../argumentos')

const diezRegistros = async (newPool) => {
  const consulta = new Cursor('select * from transacciones where cuenta = $1', [
    id1,
  ])
  const cursor = newPool.client.query(consulta)
  cursor.read(10, (err, rows) => {
    console.log(rows)
    cursor.close()
    newPool.release()
  })
}
module.exports = diezRegistros
