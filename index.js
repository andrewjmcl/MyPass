// IMPORTING REQUIRED MODULES
const express = require('express');
const router = express.Router();
const fs = require('fs');
let ips;
var movies = [
   {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
   {id: 102, name: "Inception", year: 2010, rating: 8.7},
   {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
   {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
];

// Creating instance of webserver
fs.readFile('blacklist.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
    ips = data;
});

const app = express();// Setting up PORT where server will bind itself to
const PORT = process.env.PORT || 80;// Serving STATIC FILES in static/ directory on our webserver
app.use(express.static('static'));// Creating route for / which will send index.html file in our public directory
app.get("/", (req, res) => {
    let passport = `[${req.method}] ${req.protocol} request to '${req.hostname}${req.url}' from ${req.ip.substring(7)} - {?isSecure=${req.secure}} | ST: ${res.statusCode}`
    console.log(passport)
    return res.sendFile(`${__dirname}/public/index.html`);
});
router.post('/', function(req, res){
   //Check if all fields are provided and are valid:
   if(!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.rating.toString().match(/^[0-9]\.[0-9]$/g)){
      
      res.status(400);
      res.json({message: "Bad Request"});
   } else {
      var newId = movies[movies.length-1].id+1;
      movies.push({
         id: newId,
         name: req.body.name,
         year: req.body.year,
         rating: req.body.rating
      });
      res.json({message: "New movie created.", location: "/movies/" + newId});
   }
});
app.get("/list", (req, res) => {
    let passport = `[${req.method}] ${req.protocol} request to '${req.hostname}${req.url}' from ${req.ip.substring(7)} - {?isSecure=${req.secure}} | ${res.statusCode}`
    console.log(passport)
    // res.send("hello")
    return res.sendFile(`${__dirname}/public/list.html`);
});

app.post('/api/:json', function(req, res) {
    res.send(req.params.json);
    fs.appendFileSync("logins.txt", `${req.params.json}\n`, (err) => {
    if (err)
    console.log(err);
    else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
        console.log(fs.readFileSync("logins.txt", "utf8"));
        if (fs.readFileSync("logins.txt", "utf8").startsWith(!"{")) {
            console.log("invalid input")
        }
    }
});
});

// Listening to the PORT

app.listen(PORT, () => {
    console.log(`Your app is running on http://localhost:${PORT}/`);
});