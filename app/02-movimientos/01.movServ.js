angular.module('app')
.factory('Movimiento', function($q, $db, $location, Item, Animal, Tools, Mem){
  class Movimiento {
    constructor(obj) {
      this._id = obj._id || new Date().toISOString()
      this._rev = obj._rev
      this.doc_type = obj.doc_type || 'movimiento'
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
  Movimiento.categorias = function(accion) {
    return Mem.opciones
    .then(i => i[accion].map(i=>i.categoria))
    // Mem.opciones[accion].map((i) => i.categoria)
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
        console.log(res)
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
