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

const transaccion = async () => {
  pool.connect(async (errorConexion, client, release) => {
    if (errorConexion) return console.error(errorConexion)
    await client.query('BEGIN')
    try {
      const inserTransaccion =
        'INSERT INTO transacciones (descripcion, fecha, monto, cuenta) values ($1, $2, $3, $4) RETURNING*'
      const ultimaTRansaccion = await client.query(inserTransaccion, [
        descripcion,
        fecha,
        saldo,
        id1,
      ])
      const descontar = 'UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2'
      await client.query(descontar, [saldo, id1])
      const acreditar = 'UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2'
      await client.query(acreditar, [saldo, id2])
      await client.query('COMMIT')
      console.log(ultimaTRansaccion.rows)
    } catch (e) {
      await client.query('ROLLBACK')
      console.log('Error código: ' + e.code)
      console.log('Detalle del error: ' + e.detail)
      console.log('Tabla originaria del error: ' + e.table)
      console.log('Restricción violada en el campo: ' + e.constraint)
    }
    release()
    pool.end()
  })
}

const diezRegistros = async () => {
  pool.connect((errorConexion, client, release) => {
    if (errorConexion) {
      console.error(errorConexion)
    } else {
      const consulta = new Cursor(
        'select * from transacciones where cuenta = $1',
        [id1]
      )
      const cursor = client.query(consulta)
      cursor.read(10, (err, rows) => {
        console.log(rows)
        cursor.close()
        release()
        pool.end()
      })
    }
  })
}
const saldoActual = async () => {
  pool.connect((errorConexion, client, release) => {
    if (errorConexion) {
      console.error(errorConexion)
    } else {
      const consulta = new Cursor('select * from cuentas where id = $1', [id1])
      const cursor = client.query(consulta)
      cursor.read(10, (err, rows) => {
        console.log(rows)
        cursor.close()
        release()
        pool.end()
      })
    }
  })
}

if (tipoConsulta == 'transaccion') {
  transaccion()
} else if (tipoConsulta == 'consultas') {
  diezRegistros()
} else if (tipoConsulta == 'saldo-actual') {
  saldoActual()
} else {
  console.log('Consulta invalida')
}
