const express = require('express');
const path = require('path');
const app = express();
const connect = require('./db');
require('dotenv').config();
const cors = require('cors')
app.use(cors())
const port = process.env.PORT || 3000;
const host = "127.0.0.1";
connect();
app.use(express.json());
app.use('/api/auth', require('./routes/router'))
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.urlencoded({ extended: true }));
// app.get('/', (req, res) => {
//     res.render('index');
// })
// const iatacode = async (name) => {
//     const response = await fetch(`https://airlabs.co/api/v9/suggest?q=${name}&api_key=9d7d9191-144e-419b-ab7b-3fb892263ecf`, {
//         "method": "GET",
//         "headers": {
//             "Content-Type": "application/json"
//         }
//     });
//     const json = await response.json();
//     const iata = json.response.cities[0].city_code;
//     if (iata) {
//         return iata;
//     }
//     else {
//         return "error";
//     }
// }
// const details = async (from, to, date) => {
//     const url = `https://flight-fare-search.p.rapidapi.com/v2/flight/?from=${from}&to=${to}&date=${date}&adult=1&type=economy&currency=INR`;
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '79abd8b51amsh29ccf17bd8fe3ddp1aa0cbjsn11bc3e33c41a',
//             'X-RapidAPI-Host': 'flight-fare-search.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result.results);
//     } catch (error) {
//         console.error(error);
//     }

// }
// app.post("/flight-prices", async (req, res) => {
//     try {
//         const { source, destination, date } = req.body;
//         console.log(date);
//         const from = await iatacode(source);
//         const to = await iatacode(destination);
//         details(from, to, date);

//     } catch (error) {
//         console.log(error);
//     }
// })
app.listen(port, () => {
    console.log(`server is running at http://${host}:${port}/`);
})
