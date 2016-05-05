angular.module('app')
// Cuando la app se inicia se cargan a la memoria colecciones para optimizar
.run(function($db, Mem){
  Mem.load(['animales'])

})
.factory('$db', function(pouchDB){
  return pouchDB('pruebilla');
})
.factory('Mem', function($db,$q){
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
  return Mem
})
