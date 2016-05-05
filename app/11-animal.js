angular.module('app')
.factory('Animal', function($db, Mem){
  class Animal {
    constructor(id){
      this.id = id
    }
  }
  Animal.drop = (ids) => {
    Mem.animales.collection = Mem.animales.collection.filter((animal) => {
      if(ids.indexOf(animal.id) === -1){
        return animal
      }
    })
    return ids
  }

  Animal.create = (qty) => {
    let animales = Mem.animales.collection,
      len = animales.length,
      firstId = 1,
      newAnimals = []
    if(len > 0){
      firstId = animales[len-1].id + 1
    }
    while(qty--){
      newAnimals.push(new Animal(firstId))
      firstId++
    }
    Mem.animales.collection = animales.concat(newAnimals)
    return newAnimals
  }
  return Animal
})
