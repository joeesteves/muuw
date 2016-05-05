angular.module('app')
.directive('itemDetalle', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'item_detalle.html'
  }
})
.directive('encabezado', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'encabezado.html'
  }
})
.directive('mapa', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'mapa.html'
  }
})
.directive('categoriasDisponibles', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'categorias_disponibles.html'
  }
})
.directive('mapaDisponibles', function(){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'mapa_disponibles.html'
  }
})
