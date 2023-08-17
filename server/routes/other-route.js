const express = require('express')

const router = express.Router()

router.get('/prime-test', (req, res) => {
    try {
        res.render('others/prime-test', { title: "prime number calculator" });
    } catch (error) {
        console.log(error);
    }
});

router.get('/flocking-simulation', (req, res) => {
    try {
        res.render('others/flocking', { title: 'Flocking simulation' });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;