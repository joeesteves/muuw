angular.module('app')
.factory('Tools', function() {
  return {
    codificar: function(nombre){
      nombre = nombre.replace(/( O | Y | DE |, | AL | EL)/gi," ")
      if (nombre) {
        nombre = nombre.split(" ")
        pp = nombre[0][0];
        switch (nombre.length) {
          case 1:
          pp = nombre[0].substr(0,3)
          sp = ""
          up = nombre[0].substr(-1)
          break
          case 2:
          sp = nombre[1].substr(0,2)
          up = nombre[1].substr(-1)
          break
          default:
          sp = nombre[1][0]
          up = nombre[2][0] + nombre[2].substr(-1)
          break
        }
        codigo = pp + sp + up
      } else {
        codigo = "DEBE INGRESAR UN NOMBRE"
      }
      return codigo
    }
  }
})
