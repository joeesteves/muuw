Array.prototype.unique = function(){
	let n = {}, r = []
	for(let i = 0, l = this.length; i < l; i++){
		if (!n[this[i]])
		{
			n[this[i]] = true;
			r.push(this[i]);
		}
	}
	return r;
}
