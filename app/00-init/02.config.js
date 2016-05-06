angular.module('app')
.run(function($db){
  let config = {
    "_id": "config",
    "estados":{
       1: {nombre: "Al pie"},
       2: {nombre: "Señalado"},
       3: {nombre: "Destetado"},
      11: {nombre: "Recria"},
      16: {nombre: "Produccion"},
      21: {nombre: "Servicio"},
      22: {nombre: "Descanso"},
      23: {nombre: "Descarte"},
      31: {nombre: "Preñada"},
      32: {nombre: "Preñada venta"},
      33: {nombre: "Vacia"},
      36: {nombre: "C.U.T."},
      37: {nombre: "Seca"}
    },
    "eventos": [
      {nombre: "recepcion"},
      {nombre: "recuento"},
      {nombre: "traslado"},
      {nombre: "cambio_de_categoria"},
      {nombre: "destete", grupos: ["Cria"], origen: [1,2], destino: [3]},
      {nombre: "tacto", grupos: ["Rep. Hembra"], origen: [21], destino: [23,31,32,33,36]},
      {nombre: "yerra", grupos: ["Cria"], origen: [1], destino: [2]},
      {nombre: "despacho"},
      {nombre: "muerte"},
      {nombre: "consumo"},
    ],
    "grupos": [
      {nombre: "Rep. Hembra", categorias: [1,2], estados: [21,23,31,32,33,36,37]},
      {nombre: "Rep. Macho", categorias: [3,4], estados:[21,22,23]},
      {nombre: "Invernada", categorias: [5], estados:[16]},
      {nombre: "Recria", categorias: [6,7,8], estados: [11]},
      {nombre: "Cria", categorias: [9,10,11], estados: [1,2,3]}
    ],
    "categorias": {
       1: { nombre: "Vaca"},
       2: { nombre: "Vaquillona"},
       3: { nombre: "Toro"},
       4: { nombre: "Torito"},
       5: { nombre: "Novillo"},
       6: { nombre: "Novillito"},
       7: { nombre: "Ternero recria"},
       8: { nombre: "Ternera recria"},
       9: { nombre: "Ternero"},
      10: { nombre: "Ternera"},
      11: { nombre: "Orejano"}
    }
  }

  $db.get('config').then(i => {
    let changes = false, checkpoints = ['estados','eventos','grupos','categorias']
    checkpoints.forEach(k => {
      if(JSON.stringify(i[k]) !== JSON.stringify(config[k])){
        changes = true
        return
      }
    })
    if (changes){
      config._rev = i._rev
      $db.put(config)
      .then(()=> console.log('Configuracion actualizada'))
    }
  }).catch(() => {
    $db.put(config)
    .then(()=> console.log('Configuracion creada'))
    .catch(e => console.log(e) )
  })
});
