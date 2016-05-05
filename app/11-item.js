angular.module('app')
.factory('Item', function(){
    class Item {
      constructor(obj){
        this.id = new Date().toISOString()
        this.buildItem(obj)
        this.ids = obj.ids || []
      }

      buildItem(obj) {
        if(obj.hasOwnProperty('origen') && obj.hasOwnProperty('destino')){
          this.tipo = 'cambio'
        } else if (obj.hasOwnProperty('origen')) {
          this.tipo = 'baja'
        } else if (obj.hasOwnProperty('destino')) {
          this.tipo = 'alta'
        }
        function SubItem(obj) {
          return obj
        }
        switch (this.tipo) {
          case 'cambio':
            this.origen = new SubItem(obj.origen);
            this.destino = new SubItem(obj.destino);
            break
          case 'baja':
            this.origen = new SubItem(obj.origen);
            break
          case 'alta':
            this.destino = new SubItem(obj.destino);
            break
        }
      }
    }
  return Item
})
