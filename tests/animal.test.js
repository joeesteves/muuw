describe('animal', function () {
  var db = new PouchDB('test')
  var Animal;
  beforeEach(function(){
    module('app')
    inject(function(_Animal_){
      Animal = _Animal_;
    })
    spyOn(Animal.prototype,"save").and.callFake(function() {
      return db.post(this, {include_docs:true})
    });
  })

  it('saves an animal', function(done){
    a = new Animal()
    a.save().then((d) => {
      console.log(d);
      expect(d.ok).toBe(true)
      done()
    })
  })
})
