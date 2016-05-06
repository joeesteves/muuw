angular.module('app')
.run(function($db){
  let categorias = {
    _id: 'categorias',
    doc_type: 'categorias',
    collection: ['Novillo', 'Vaca', 'Vaquillona', 'Ternero', 'Ternera', 'Orejano', 'Toro']
  }
  $db.get('categorias').then(i=>{
    if (JSON.stringify(i.collection) !== JSON.stringify(categorias.collection)){
      categorias._rev = i._rev
      $db.put(categorias)
      .then(()=> console.log('Categorias actualizadas'))
    }
  }).catch(() => {
    $db.put(categorias)
    .then(()=> console.log('Categorias creadas'))
  })
});
