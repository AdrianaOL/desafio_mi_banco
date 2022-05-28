const pool = require('./conexion')
const Cursor = require('pg-cursor')
const {
  tipoConsulta,
  id1,
  id2,
  saldo,
  fecha,
  descripcion,
} = require('./argumentos')

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
const saldoActual = async (newPool) => {
  const consulta = new Cursor('select * from cuentas where id = $1', [id1])
  const cursor = newPool.client.query(consulta)
  cursor.read(1, (err, rows) => {
    console.log(rows)
    cursor.close()
    newPool.release()
  })
}
const crearPool = async () => {
  return new Promise((resolve, reject) => {
    pool.connect(async (errorConexion, client, release) => {
      if (errorConexion) {
        reject(errorConexion)
      } else {
        resolve({ client, release, pool })
      }
    })
  })
}
const main = async () => {
  try {
    const newPool = await crearPool()
    if (tipoConsulta == 'transaccion') {
      await transaccion(newPool)
    } else if (tipoConsulta == 'consultas') {
      await diezRegistros(newPool)
    } else if (tipoConsulta == 'saldo-actual') {
      await saldoActual(newPool)
    } else {
      console.log('Consulta invalida')
    }
    newPool.pool.end()
  } catch (e) {
    console.error(e)
  }
}
main()
