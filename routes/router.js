const express = require('express');
const router = express.Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const jwt_secrete = "Malay@345@#$";
const iatacode = async (name) => {
    const response = await fetch(`https://airlabs.co/api/v9/suggest?q=${name}&api_key=9d7d9191-144e-419b-ab7b-3fb892263ecf`, {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json"
        }
    });
    const json = await response.json();
    const iata = json.response.cities[0].city_code;
    if (iata) {
        return iata;
    }
    else {
        return "error";
    }
}
const details = async (from, to, date) => {
    const url = `https://flight-fare-search.p.rapidapi.com/v2/flight/?from=${from}&to=${to}&date=${date}&adult=1&type=economy&currency=INR`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '96f03ccd7fmsh1e14f00fc71eda5p164b69jsn59f65bf274a0',
            'X-RapidAPI-Host': 'flight-fare-search.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const results = await result.results;
        return results;
    } catch (error) {
        console.error(error);
    }

}
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user = User.create({
            name: name,
            email: email,
            password: hash,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_secrete);
        res.json({ authToken });
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Some error occured");
    })
})
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const passwordCompare = bcrypt.compareSync(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, jwt_secrete);
        res.json({ authToken });
    }
    ).catch((err) => {
        console.log(err);
        res.status(500).send("Some error occured");
    })
})
router.post('/prices', fetchuser, async (req, res) => {
    const { source, destination, date } = req.body;
    console.log(source, destination, date)

})
module.exports = router;