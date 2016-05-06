let prefijo_movimiento = '02-movimientos/views'
angular.module('app')
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: '02-movimientos/views/list.html'
  })
  .when('/:accionTipo/:accion/:id?', {
    controller: 'movimientosCtrl',
    templateUrl: ($routeParams) => {
      let {accionTipo, accion} = $routeParams
      return `${prefijo_movimiento}/${accionTipo}/${accion}.html`
    }
  })
  .otherwise({redirectTo: '/'})
})
