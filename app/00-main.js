angular.module('app',['ngRoute','ngDraggable','pouchdb'])
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'list.html'
  })
  .when('/:accion/:id?', {
    templateUrl: ($routeParams) => { return $routeParams.accion + '.html'}
  })
  .otherwise({redirectTo: '/'})
})
.run(function($db){
  $db.sync('http://localhost:5984/muuuu',{live: true})
})
