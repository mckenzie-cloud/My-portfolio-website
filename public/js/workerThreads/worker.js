
function mod_exp(b, e, m) {
	if (m === 1n) {
		return 0;
	}

	let result = 1n;
	b = b % m
	while (e > 0n) {
		if (e % 2n === 1n) {
			result = (result * b) % m
		}
		b = (b * b) % m
		e = e >> 1n
	}
	return result
}

function factor_of_n(n) {
	let i = 1n;
	let n_minus_one = n-1n

	const factor = {
		s: 0,
		d: 0 
	}

	while (true) {
		if (n_minus_one % (2n**i) == 0)
		{
			factor.s++;
		} else {
			break;
		}
		i++;
	}
	factor.d = n_minus_one / (2n**BigInt(factor.s));
	return factor;
}

function miller_rabin(inputValue) {
    const n = BigInt(inputValue);
    const { s, d } = factor_of_n(n);
    const k = 3;
    const fixed_bases = [2n, 3n, 5n];

    for (let i=0; i<k; i++) {
        let a = fixed_bases[i];
        let x = mod_exp(a, d, n);

        for (let j=0; j<s; j++) {
            y = mod_exp(x, 2n, n);
            
            if (y === 1 && x !== 1 && x !== (n-1n)) {
                return false;
            }
            x = y;
        }
        if (x !== 1n) {
            return false;
        }
    }
    return true;
}

onmessage = function(e) {
	console.log('Data received');
	const r = miller_rabin(e.data);
	postMessage(r);
};