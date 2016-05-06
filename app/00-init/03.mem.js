angular.module('app')
// Cuando la app se inicia se cargan a la memoria colecciones para optimizar
.run(function($db, Mem){
  Mem.load(['animales'])

})
.factory('$db', function(pouchDB){
  return pouchDB('pruebilla');
})
.factory('Mem', function($db, $q, Tools){
  class Mem {}
  Mem.load = (collections) => {
    let promises = []
    collections.forEach((collection) =>{
       promises.push(Mem.getCollection(collection))
    })
    $q.all(promises)
    .then(()=>console.log('Loaded...'))
    .catch((e)=>console.log(e))
  }

  Mem.getCollection = (collection_id) => {
    return $db.get(collection_id)
    .then((collection) => {
      Mem[collection_id] = collection
    })
    .catch(e => {
      console.log(e)
      $db.put({_id: 'animales', collection: []})
      console.log('reinicie')
    })
  }
  function parseEstados(objeto, estados_ids){
      let ary = []
      estados_ids.forEach(id =>{
        ary.push(objeto[id])
      })
      return ary
  }
  function keyToIdAndAlias(obj) {
  	for (let key in obj) {
      if(typeof(obj[key]) ==='object'){
        obj[key].id = parseInt(key)
        if(obj[key].hasOwnProperty('nombre') && typeof(obj[key].nombre) ==='string'){
          obj[key].alias = Tools.codificar(obj[key].nombre)
        }
      }
    }
    return obj
  }



  Mem.opciones = function() {
    let deferred = $q.defer()
    $db.get('config')
    .then((d)=>{
      let {eventos, grupos} = d,
        estados = keyToIdAndAlias(d.estados),
        categorias =  keyToIdAndAlias(d.categorias)
        opEventos = {}

      eventos.forEach(evento => {
        opEventos[evento.nombre] = []
        if(!evento.grupos){
          grupos.forEach(grupo =>{
            grupo.categorias.forEach((categoriaId)=> {
              let categoria = categorias[categoriaId]
                estadosDisponibles = parseEstados(estados, grupo.estados)
              opEventos[evento.nombre].push({categoria, origen: estadosDisponibles, destino: estadosDisponibles})
            })
          })
        } else {
          let gruposPermitidos = grupos.filter(grupo => evento.grupos.includes(grupo.nombre))
          gruposPermitidos.forEach(grupo => {
            grupo.categorias.forEach((categoriaId)=> {
              let estadosDestino = grupo.estados.filter(e => evento.destino.includes(e)),
                estadosOrigen = grupo.estados.filter(e => evento.origen.includes(e)),
                categoria = categorias[categoriaId]

              opEventos[evento.nombre].push({categoria, origen: parseEstados(estados, estadosOrigen), destino: parseEstados(estados, estadosDestino) })
            })
          })
        }
      })
      deferred.resolve(opEventos)
    })
    return deferred.promise
  }()

  return Mem
})
