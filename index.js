const pool = require('./conexion')
const transaccion = require('./modules/transaccion')
const diezRegistros = require('./modules/diezRegistros')
const saldoActual = require('./modules/saldoActual')
const { tipoConsulta } = require('./argumentos')

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
