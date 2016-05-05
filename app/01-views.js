angular.module('app')
.run(function($db){
  let listados = {
    _id: '_design/listado',
    views: {
      unwind: {
        map: function(doc) {
          if(doc.doc_type === 'movimiento'){
            var items = doc.items;
            items.forEach(function(item){
              if(item.destino){
                var d = item.destino;
                item.ids.forEach(function(id){
                  var reg = {id: id, establecimiento: d.establecimiento, rodeo: d.rodeo, categoria: d.categoria}
                  emit(doc._id, reg);
                });
              }
            });
          }
        }.toString()
      },
      movimientos: {
        map: function(doc) {
          if(doc.doc_type === 'movimiento'){
            emit(doc._id, doc);
          }
        }.toString()
      },
      categorias: {
        map: function(doc) {
          var categorias = [];
          switch(doc.doc_type){
            case 'movimiento':
              doc.items.forEach(function(i){
                var categoria = i.destino.categoria;
                if(categoria){
                  categorias.push(categoria);
                }
              });
              break;
            case 'categorias':
              categorias = categorias.concat(doc.collection);
              break;
          }
          categorias.forEach(function(i) {
            emit(i)
          });
        }.toString(),
        reduce: function(k,v){
          return true;
        }.toString()
      }
    }
  };
  $db.get('_design/listado').then(i=>{
    if (JSON.stringify(i.views) !== JSON.stringify(listados.views)){
      listados._rev = i._rev
      $db.put(listados)
      .then(()=> console.log('Vista actualizada'))
    }
  }).catch(() => {
    $db.put(listados)
    .then(()=> console.log('Vista Creada'))
  })
});
