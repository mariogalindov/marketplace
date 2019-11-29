require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection(keys.mysql);

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id: " + connection.threadId);
    readTable();
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
        itemToPurchase(ids,res)
    })
}

function itemToPurchase(ids, res) {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Which item would you like to buy?",
            choices: ids
        },
        {
            type: "input",
            name: "qty",
            message: "How many would you like to buy?"
        }
    ]).then(function(answers) {
        // console.log(res);
        var idNum = parseInt(answers.itemID)
        res.forEach( element => {
            // var itemIdentified = false
            if (idNum == element.item_id) {
                if (answers.qty < element.stock_quantity) {
                    connection.query(`UPDATE products SET ? WHERE ?`, [{stock_quantity: element.stock_quantity - answers.qty}, {item_id: answers.itemID}], function (err, res) {
                        if (err) throw err
                        console.log(`The remaining stock for this article is ${element.stock_quantity - answers.qty}`);
                    })
                } 
            }
        })
        connection.end();
    })
}
