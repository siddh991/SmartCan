var express = require('express');
const logger = require("morgan");
var cookieParser = require('cookie-parser');
var multer  = require('multer')
var upload = multer({ dest: './images/' })
const child_process = require('child_process');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();
var path = require('path');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.cookie('user' , req.body.user);
    res.cookie('pass' , req.body.pass).send('Cookie is set');
    if(good) {
    	res.status(200).send("good");
    }
    else {
    	res.status(403).send("bad");
    }
});  

app.post('/photo', upload.single('eagle.png'), function(req, res, next){
    console.log(req.user);
    //log in to postgreSQL info
    const client = new Client({
        user: 'postgres',
        host: '34.73.8.59',
        database:'users',
        password: 'abc123',
        port: 5432,
    })
    client.connect()

    // var itemCount = 0;
    var trial = 'INSERT INTO persons (username, password, garbage, organic, recycling) VALUES ("Siddharth_S", "123456", 0, 0, 0)';
    var trial_2 = 'INSERT INTO persons (username, password, garbage, organic, recycling) VALUES ("Srishti_A", "654321", 0, 0, 0)';


    console.log('POST /');
    console.log(req.body.filetoupload);
    
    var child = require('child_process').spawn('python', ['deep_learning_with_opencv.py' , '--image' , 'deep_images/eagle.png', '--prototxt', 'bvlc_googlenet.prototxt', '--model', 'bvlc_googlenet.caffemodel', '--labels', 'synset_words.txt'])
    // runs when script closes
    child.on("close", (code, signal) => {


        if (code == 1){
            console.log("organic")
            const text = `SELECT organic FROM persons WHERE username = ${getCookie("user")}`;
            text++
            var youtube = `UPDATE persons SET organic =` + text + `WHERE username = ${getCookie("user")}`

        }
        else if (code == 2){
            console.log("recycling")
            const text = `SELECT recycle FROM persons WHERE username = ${getCookie("user")}`;
            text++
            var youtube = `UPDATE persons SET recycling =` + text + `WHERE username = ${getCookie("user")}`
        } 
        else{
            console.log("garbage")
            const text = `SELECT garbage FROM persons WHERE username = ${getCookie("user")}`;
            text++
            var youtube = `UPDATE persons SET garbage =` + text + `WHERE username = ${getCookie("user")}`
        }

    })    

    client.query(text, (err, res) => {
        if (err) {
            // res.status(403).send("bad");
            return false
        }
        else {
            // res.status(200).send("good");
            itemCount = res + 1
        }
    })


    // runs if script throws an error
    child.on("error", (err) => {
        console.log("ERROR:");
        console.error(err);
    })
});

port = 3000;
app.listen(port);
console.log('Listening at localhost:' + port)


// only code that works
// // var child = require('child_process').spawn('python', ['deep_learning_with_opencv.py'])
// var child = require('child_process').spawn('python', ['deep_learning_with_opencv.py' , '--image' , 'images/eagle.png', '--prototxt', 'bvlc_googlenet.prototxt', '--model', 'bvlc_googlenet.caffemodel', '--labels', 'synset_words.txt'])
// // runs when script closes
// child.on("close", (code, signal) => {
//     // console.log("return code: " + code);

//     if (code == 1){
//         console.log("organic")
//     }
//     else if (code == 2){
//         console.log("recycling")
//     } 
//     else{
//         console.log("garbage")
//     }
// })

// // runs if script throws an error
// child.on("error", (err) => {
//     console.log("ERROR:");
//     console.error(err);
// })