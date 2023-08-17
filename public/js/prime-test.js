
/**
 * Factor the number in terms of some base 2 number 's' multiply by some odd number 'd' (2^s*d), 
 * where s is a positive integer and d is an odd positive integer.
 */
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

/**
 * This method for calculating fast modular exponentiation uses the Right-to-Left Binary method.
 */
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

function miller_rabin(n) {
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

function isPrime_TD(num) {
    if (num <= 1) return false;
    if (num === 2) return true;

    var sqrt = num ** 0.5;

    for (var i = 2; i <= sqrt; i++) 
      if (num % i === 0) return false;
    return true;
}

/** Trial-div is Deterministic, Miller-Rabin is Probabilistic. */
const testType = {
    miller_rabin: 'Probably Prime',
    trial_div: 'Proven Prime'
}

function verify() {
    let inputValue = document.getElementById('inputValue').value;

    /** Remove whitespace */
    const reg  = new RegExp('^[1-9]$|^[1-9][0-9]+$');
    
    if (inputValue && reg.test(inputValue)) {

        /** If the number is even and larger than 2, output a message immediately. There is no point of checking. */
        if (BigInt(inputValue) > 2n && BigInt(inputValue) % 2n == 0n) {
            message('Not Prime');
            return;
        }

        /** A 6000-digit number is the maximum number that this program can handle. */
        if (inputValue.length <= 6000 ) {
            /** If the number is larger than or equal to a thousand-digit, 
             * perform the miller-rabin in the different thread. */
            if (inputValue.length >= 1000) {
                document.getElementById('loading').style.visibility = 'visible';
                runWebWorker(inputValue);
                return;
            }
            else {
                const trial_div_lim = 2n**32n;

                // convert the inputValue into BigInteger type.
                const val_n = BigInt(inputValue);

                /** if the number is below unsigned__int32 (4,294,967,296), 
                 * perform the trial-division. */
                if (val_n <= trial_div_lim) {
                    const a = performance.now();
                    const r = isPrime_TD(Number(inputValue));
                    const b = performance.now();
                    showMessage(r, (b-a), testType.trial_div);
                    return;
                }
                /** If the number is larger than unsigned__int32 (4,294,967,296) but below a thousand-digit, 
                 * perform the miller-rabin in the main-thread. */
                else {
                    const a = performance.now();
                    const r = miller_rabin(val_n);
                    const b = performance.now();
                    showMessage(r, (b-a), testType.miller_rabin);
                    return;
                }
            }
        } 
        else {
            message('Too large')
        }
    }
    else {
        message('Invalid input!')
    }
}


function runWebWorker(input) {
    if (window.Worker) {
        const worker = new Worker('/js/workerThreads/worker.js');
    
        const a = performance.now();
        worker.postMessage(input);

        worker.onmessage = function(e) {
            const r = e.data;
            const b = performance.now();
            showMessage(r, (b-a), testType.miller_rabin);
            worker.terminate();
            document.getElementById('loading').style.visibility = 'hidden';
            return;
        }
        worker.onerror = function(e) {
            showMessage('An error encountered');
            worker.terminate();
            document.getElementById('loading').style.visibility = 'hidden';
            return;
        }
    }
}

function showMessage(result, time_elapsed, type) {
	if (result) {
        message(`${type} (Time - ${time_elapsed.toFixed(2)} ms)`);
        return;
    } else {
        message(`Not Prime (Time - ${time_elapsed.toFixed(2)} ms)`);
        return;
    }
}

function message(msg) {
    document.getElementById('message').style.visibility = 'visible';
    document.getElementById('verdict').innerText = msg;
    setTimeout(() => {
        document.getElementById('message').style.visibility = 'hidden';
        document.getElementById('verdict').innerText = '';
    }, 2000);
}