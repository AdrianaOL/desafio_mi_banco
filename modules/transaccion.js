const { id1, id2, saldo, fecha, descripcion } = require('../argumentos')

const transaccion = async (newPool) => {
  await newPool.client.query('BEGIN')
  try {
    const inserTransaccion =
      'INSERT INTO transacciones (descripcion, fecha, monto, cuenta) values ($1, $2, $3, $4) RETURNING*'
    const ultimaTRansaccion = await newPool.client.query(inserTransaccion, [
      descripcion,
      fecha,
      saldo,
      id1,
    ])
    const descontar = 'UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2'
    await newPool.client.query(descontar, [saldo, id1])
    const acreditar = 'UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2'
    await newPool.client.query(acreditar, [saldo, id2])
    await newPool.client.query('COMMIT')
    console.log(ultimaTRansaccion.rows)
  } catch (e) {
    await newPool.client.query('ROLLBACK')
    console.log('Error código: ' + e.code)
    console.log('Detalle del error: ' + e.detail)
    console.log('Tabla originaria del error: ' + e.table)
    console.log('Restricción violada en el campo: ' + e.constraint)
  }
  newPool.release()
}

module.exports = transaccion
