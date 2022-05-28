const argumentos = process.argv.slice(2)

const tipoConsulta = argumentos[0]
const id1 = argumentos[1]
const id2 = argumentos[2]
const saldo = argumentos[3]
const fecha = argumentos[4]
const descripcion = argumentos[5]

module.exports = {tipoConsulta, id1, id2, saldo, fecha, descripcion }
