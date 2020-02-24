var express = require('express');
var bodyParser = require('body-parser'); //对post请求的请求体进行解析模块
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析request中body的 urlencoded字符，只支持utf-8的编码的字符，也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
var hostName = '127.0.0.1'; //ip
var port = 3000; //端口

var sess = ["itemname", "username"];

var session = require("express-session");
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('X-Powered-By', 'nodejs');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CPTbtptp96',
    database: '701'
});


app.put("/addItem", (req, res) => {
    var itemname = req.body.itemName;
    var qty = req.body.quantity;
    var username = req.body.userName;
    var priority = req.body.priority;



    var sql = 'SELECT * FROM list WHERE item_name= ? AND username= ? AND item_status=0';
    var params = [itemname, username];
    var newResult;
    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        newResult = result;
        console.log('------------------------------------------------------------\n\n');
        if (newResult.length > 0) {//the item exists
            sql = 'UPDATE list SET quantity=quantity+ ? WHERE item_name= ? AND username= ? AND item_status=0';
            params = [qty, itemname, username];
            connection.query(sql, params, function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }

                console.log('--------------------------UPDATE----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
            });
        } else {
            sql = 'INSERT INTO list(item_name,quantity,priority,username,item_status) VALUES(?,?,?,?,0)';
            params = [itemname, qty, priority, username];
            connection.query(sql, params, function (err, result) {
                if (err) {
                    console.log(err.message);
                    return;
                }

                console.log('--------------------------INSERT----------------------------');
                console.log(result);
                console.log('------------------------------------------------------------\n\n');
            });
        }
        sql = 'SELECT * FROM list';
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            console.log('--------------------------SELECT----------------------------');
            console.log(result);
            res.send(result);
            console.log('------------------------------------------------------------\n\n');
        });
    });
})

app.put("/oneItem", (req, res) => {
    var itemname = req.body.itemName;
    var username = req.body.username;
    var sql = 'SELECT * FROM list WHERE item_name= ? AND username= ? AND item_status=0';
    var params = [itemname, username];
    sess[0] = itemname;
    sess[1] = username;

    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result[0].item_name);
        res.send(result);
        console.log('------------------------------------------------------------\n\n');
    });
});

app.put("/change", (req, res) => {
    var itemname = req.body.itemname;
    var qty = req.body.quantity;
    var priority = req.body.priority;
    if (!itemname) { itemname = sess[0] }
    var sql = 'SELECT * FROM list WHERE item_name= ? AND username= ? AND item_status=0';
    var params = [sess[0], sess[1]];

    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
        if (!qty) { qty = result[0].quantity }
        if (!priority) { priority = result[0].priority }
        sql = 'UPDATE list SET item_name= ?, quantity=?,priority=?  WHERE item_name= ? AND username= ? AND item_status=0';
        params = [itemname, qty, priority, sess[0], sess[1]];
        connection.query(sql, params, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            sql = 'SELECT * FROM list';
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }

                console.log('--------------------------SELECT----------------------------');
                console.log(result);
                res.send(result);
                console.log('------------------------------------------------------------\n\n');
            });
        })
    })
});

app.put("/delete", (req, res) => {
    var itemname = req.body.itemname;
    var username = req.body.username;
    var sql = 'UPDATE list SET item_status=1 WHERE item_name= ? AND username= ? AND item_status=0';
    var params = [itemname, username];
    connection.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        sql = 'SELECT * FROM list';
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            console.log('--------------------------SELECT----------------------------');
            console.log(result);
            res.send(result);
            console.log('------------------------------------------------------------\n\n');
        });
    })
})


app.listen(port, hostName, function () {

    console.log(`Server is running at http://${hostName}:${port}`);

});
