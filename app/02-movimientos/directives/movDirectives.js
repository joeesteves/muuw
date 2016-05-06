angular.module('app')
.directive('itemDetalle', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '02-movimientos/directives/item_detalle.html'
  }
})
.directive('encabezado', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '02-movimientos/directives/encabezado.html'
  }
})
.directive('mapa', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '02-movimientos/directives/mapa.html'
  }
})
.directive('categoriasDisponibles', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '02-movimientos/directives/categorias_disponibles.html'
  }
})
.directive('mapaDisponibles', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '02-movimientos/directives/mapa_disponibles.html'
  }
})
