angular.module('app')
.directive('appNav', function($location){
  return {
    replace: true,
    restrict: 'E',
    templateUrl: 'nav/nav.html',
    link: (scope) => {
      scope.menu = {
        alta: {'link': 'alta', label: 'Alta'},
        cambio: {link: 'cambio', label: 'Cambio'},
        baja: {link: 'baja', label: 'Baja'}
      };
      // scope.opcion_activa = 'alta'; // opcion default
      scope.$on("$locationChangeSuccess", () => {
        scope.opcion_activa = $location.path().split('/')[1]
      });
    }
      // scope.op_activa = $location.path().split('/')[1]
      // scope.opciones_de_menu = ['Ventas', 'Compras', 'Productos', 'Organizaciones']})
  };
})
