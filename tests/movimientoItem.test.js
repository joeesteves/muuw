describe('Item', function () {
  beforeEach(module('app'))
  it('genera items cambio con origen y destino', inject(function(Item) {
    let cambio = new Item('cambio')
    expect(cambio.hasOwnProperty('origen')).toBe(true)
    expect(cambio.hasOwnProperty('destino')).toBe(true)
  }));
  it('genera items baja, con origen y sin destino', inject(function(Item) {
    let baja = new Item('baja')
    expect(baja.hasOwnProperty('origen')).toBe(true)
    expect(baja.hasOwnProperty('destino')).not.toBe(true)
  }));
  it('genera items alta, con destino y sin origen', inject(function(Item) {
    let alta = new Item('alta')
    expect(alta.hasOwnProperty('destino')).toBe(true)
    expect(alta.hasOwnProperty('origen')).not.toBe(true)
  }));

});
