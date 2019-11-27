var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js")

var connection = mysql.createConnection(keys.mysql);

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);
    readTable();
    connection.end();
});

function readTable() {
    var ids = [];
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        res.forEach(element => {
            console.log(element.item_id + " | " + "Product name: " + element.product_name + " | " + "Department: " + element.department_name + " | " + "Price: " + element.price);
            ids.push(element.item_id);
        });
        console.log(ids)
        itemToPurchase(ids)
    })
}

function itemToPurchase(ids) {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Which item would you like to buy?",
            choices: items
        },
        {
            type: "input",
            name: "qty",
            message: "How many would you like to buy?"
        }
    ]).then(function(answers) {
        console.log(answers.itemID)
    })
}
