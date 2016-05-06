angular.module('app',['ngRoute','ngDraggable','pouchdb'])
.run(function($db){
  $db.sync('http://localhost:5984/muuuu',{live: true})
})
