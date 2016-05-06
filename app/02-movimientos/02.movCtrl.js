angular.module('app')
.controller('movimientosCtrl', function(Movimiento, $scope, $routeParams, $q, Tools){
  let {id,accion,accionTipo} = $routeParams
  if(!id) {
    $scope.movimiento = new Movimiento({tipo: `${accionTipo}/${accion}`})
  } else {
    Movimiento.get(id)
    .then(obj => {
      obj.fecha = new Date(obj.fecha)
      $scope.movimiento = new Movimiento(obj)
      completarMapa()
    })
    .catch(e => console.log(e))
  }
  $scope.mapa = Movimiento.mapa()

  completarMapa = () => {
    let items = $scope.movimiento.items,
      m = $scope.mapa
    if (items.length > 0) {
      items.forEach(item => {
        d = item.destino
        m[d.establecimiento][d.rodeo].movimientos.push(item)
      })
    }
  }

  $scope.onDropComplete = (e,r,data) => {
    let item = $scope.movimiento.addItem({ids: data.ids, destino: {establecimiento: e, rodeo: r, categoria: data.categoria}})
    $scope.editItem(item, 'new')
    console.log(data.ids)
  }

  $scope.editItem = (item, accion) => {
    $scope.itemActivo = angular.copy(item)
    $scope.accion = accion
    $('#itemDetalle').modal('show')
  }

  $scope.confirmItem = (validForm, accion) => {
    let item = $scope.itemActivo,
      d = item.destino, rodeo = $scope.mapa[d.establecimiento][d.rodeo].movimientos
    if(validForm){
      item.ids.splice(item.destino.cantidad)
      console.log(item.ids)
      $scope.movimiento.updateItem(item)
      $('#itemDetalle').modal('hide')
      if(accion === 'new'){
        rodeo.push(item)
      } else {
        let i = rodeo.findIndex((rodeoItem) => rodeoItem.id === item.id )
        rodeo.splice(i,1,item)
      }
    }
  }


  $scope.save = () => $scope.movimiento.save()

  Movimiento.categorias(accion)
  .then(data => $scope.categorias = data)
  .catch((e) => console.log(e))

  Movimiento.mapaDisponible().then(i=> {
    console.log(i)
    $scope.mapaDisponible = i
  })

})

.controller('listCtrl', function($scope, Movimiento){
  $scope.remove = function(id, index){
    console.time('Borrar')
    if(confirm('Borrar documento?')){
      Movimiento.get(id)
      .then(obj => {
        obj.fecha = new Date(obj.fecha)
        new Movimiento(obj).drop()
        .then(() => {
          console.timeEnd('Borrar')
          $scope.collection.splice(index,1)
        })
      })
    }
  }
  Movimiento.all()
  .then((data) => {
    $scope.collection = data.rows.map(i=> i.doc);
  })
  .catch(e => console.log(e))
})
