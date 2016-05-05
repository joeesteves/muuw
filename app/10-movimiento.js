angular.module('app')
.factory('Movimiento', function($q, $db, $location, Item, Animal, Tools, Mem){
  class Movimiento {
    constructor(obj) {
      this.doc_type = obj.doc_type || 'movimiento'
      this._id = obj._id || new Date().toISOString()
      this._rev = obj._rev
      this.fecha = obj.fecha || new Date()
      this.tipo = obj.tipo
      this.items = obj.items || []
      this.observacion = obj.observacion || ''
    }

    addItem(item) {
      let newItem = new Item(item)
      this.items.push(newItem)
      return newItem
    }

    updateItem(updatedItem) {
      let i = this.items.findIndex((item) => updatedItem.id === item.id )
      this.items[i] = updatedItem
      return updatedItem
    }

    drop() {
      this.items.forEach(item => Animal.drop(item.ids))
      return $db.remove(this)
      .then(() => {
        console.log('documento borrado')
        $db.put(Mem.animales)
        .then((res) => {
          Mem.animales._rev = res.rev
          console.log('animales borrados')
        })
      })
    }

    save() {
      Movimiento.get(this._id)
      .then((doc) => {
        this.items.forEach(item => {
          let dbItem = doc.items.find(itemOrig => itemOrig.id === item.id),
            qty = item.destino.cantidad
          if(dbItem){
            let dif = item.destino.cantidad - dbItem.destino.cantidad
            console.log(dif)
            if(dif > 0){
              item.ids = item.ids.concat(Animal.create(dif).map(an=>an.id))
            } else if(dif < 0){
             let idsToRemove = dbItem.ids.splice(dif)
              console.log('borro' + idsToRemove)
              console.log('quedan' + dbItem.ids)
              Animal.drop(idsToRemove)
              item.ids = dbItem.ids
            }
          } else {
            item.ids = Animal.create(qty).map(an=>an.id)
          }
        })
      })
      .catch((e) => {
        if(e.status === 404){
          this.items.forEach( item => {
            let qty = item.destino.cantidad;
            if(item.ids.length === 0){
              item.ids = Animal.create(qty).map(an=>an.id)
            }
          })
        }
      })
      .finally(()=> {
        $db.put(this)
        .then((a) => {
          this._rev = a.rev
          $location.path('/')
          $db.put(Mem.animales, {include_docs:true})
          .then((res) => {
            Mem.animales._rev = res.rev
            console.log('Documento y animales guardados correctamente')
          })
        })
        .catch(e => {
          console.log('error')
          Mem.load(['animales'])
        })
      })

    }
  } // Termina la def de la clase
  Movimiento.get = function(id){
    return $db.get(id)
  }
  Movimiento.all = function(){
    return $db.query('listado/movimientos',{include_docs:true})
  }
  Movimiento.categorias = function() {
    return $q(function(resolve,reject){
      $db.query('listado/categorias',{group:true})
      .then(data => {
        data = data.rows.map(i=>Tools.codificar(i.key))
        resolve(data.unique())
      })
    })
  }
  Movimiento.mapa = function() {
    return {
      "San Jose": {
        "Rodeo 1": {
          movimientos: []
        }
      },
      "El Altillo": {
        "Rodeo 2": {
          movimientos: []
        }
      }
    }

  }
  Movimiento.mapaDisponible = function(){
    let ary = [], ids = [], obj = {}
    return $q((resolve,reject) => {
      $db.query('listado/movimientos',{include_docs:true, descending:true})
      .then((res)=>{
        res.rows.forEach(function(i){
          let val = i.value
          val.items.forEach(function(item){
            let d = item.destino
            if(d) {
              item.ids.forEach(function(id){
                ary.push({id , establecimiento: d.establecimiento, rodeo: d.rodeo, categoria: d.categoria })
              })
            }
          })
        })
      ary.forEach(item => {
        if (ids.indexOf(item.id) === -1){
          let establecimiento = item.establecimiento, rodeo = item.rodeo, categoria = item.categoria,
            caso
          caso = (function(){
                    if(!obj[establecimiento]){
                      return 1
                    } else if(!obj[establecimiento][rodeo]){
                      return 2
                    } else if(!obj[establecimiento][rodeo][categoria]){
                      return 3
                    } else {
                      return 4
                    }
                  })()

          switch(caso){
            case 1:
              obj[establecimiento] = {}
              /* falls through */
            case 2:
              obj[establecimiento][rodeo] = {}
              /* falls through */
            case 3:
              obj[establecimiento][rodeo][categoria] = [item.id]
              break
            case 4:
              obj[establecimiento][rodeo][categoria].push(item.id)
            }
            ids.push(item.id)
          }
        })
        resolve(obj)
      })
    })
  }


  return Movimiento
})
.controller('movimientosCtrl', function(Movimiento, $scope, $routeParams, $q, Tools){
  let id = $routeParams.id
  if(!id) {
    $scope.movimiento = new Movimiento({tipo: $routeParams.accion})
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
  console.log($scope.mapa)

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

  Movimiento.categorias()
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
