function esPrimo(n) {
	var i = 2;
	if (n == 2) return true;
	for (; i < n; ++i) {
		if (n % i == 0) {
            return false;
		}
	}
	return true;
}

self.onmessage = function(event) {
    var resultado = esPrimo(event.data);
    var message = resultado ? "Es primo" : "no es primo";
    self.postMessage(message);
};
