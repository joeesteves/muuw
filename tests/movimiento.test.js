describe('Movimiento', () => {
  beforeEach(()=> {
    module('app')
    inject(function(_Movimiento_){
      Movimiento = _Movimiento_
    })
    spyOn(Movimiento.prototype,"save").and.callFake(function() {
      return db.post(this)
    });
  })

  it('genera alta con item destino y crea animales', () => {
    movimiento = new Movimiento('alta')
    movimiento.cantidad = 5

    expect(movimiento.items.length).toEqual(1)

  });

});
