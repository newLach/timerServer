const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn.js");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get((req, res) => {
	console.log("in /record")
	let db_connect = dbo.getDb("blogs");
	db_connect
		.collection("blogs")
		.find({})
		.toArray((err, result) => {
			if (err) throw err;
			res.json(result);
		});
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect
		.collection("blogs")
		.findOne(myquery, function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post((req, response) => {
	let db_connect = dbo.getDb();
	let myobj = {
		blogText: req.body.blogText,
		creationDate: req.body.creationDate,
		project: req.body.project,
	};
	db_connect.collection("blogs").insertOne(myobj, (err, res)=> {
		if (err) throw err;
		response.json(res);
	});
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {
		$set: {
			name: req.body.name,
			position: req.body.position,
			level: req.body.level,
		},
	};
	db_connect
		.collection("blogs")
		.updateOne(myquery, newvalues, function (err, res) {
			if (err) throw err;
			console.log("1 document updated");
			response.json(res);
		});
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("blogs").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});

module.exports = recordRoutes;
