angular.module('app')
.directive('appNav', function($location){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: '01-nav/nav.html',
    link: (scope) => {
      scope.menu = [
        {link: 'alta/recuento', label: 'Recuento'},
        {link: 'cambio/traslado', label: 'Traslado'},
        {link: 'cambio/cambio_de_categoria', label: 'CamCat'},
        {link: 'baja', label: 'Baja'}
      ]
      scope.$on("$locationChangeSuccess", () => {
        scope.opcion_activa = $location.path().split('/')[1]
      })
    }
  }
})
