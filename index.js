var Express = require("express");
var bodyParser = require("body-parser");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require("mongodb").MongoClient;

const { request, response } = require("express");
const consts = require('./appConstants');
var CONNECTION_STRING = consts.APP_CONSTANTS.MONGO_DB_CON_STR;

var cors = require('cors');

app.use(cors())


var DATABASE = consts.APP_CONSTANTS.DB_NAME;
var database;

app.listen(49146, () => {

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
    })

});

// Home API
app.get('/', (request, response) => {
    response.json('Hello World');
})


// Habit get API
app.get('/api/habit', (request, response) => {
    console.log('Getting habits');
    database.collection("habit").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }
        response.send(result);
    })
});

// Habit add Api. 
app.post('/api/habit', (request, response) => {
    console.log('Adding habit');
    // Check if it already exists. 
    // TO-DO
    // If not add it. 
    database.collection("habit").insertOne({
        name: request.body['name'],
        logo: request.body['logo']
    });

    response.json("Added Successfully");

})

// Habit delete Api. 

app.delete('/api/habit/:id', (request, response) => {
    console.log('Deleting habit' + request.params.id );
    database.collection("habit").deleteOne({
        _id: request.params.id
    });

    response.json("Deleted Successfully");
})





app.get('/api/department', (request, response) => {

    database.collection("Department").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })

})

app.post('/api/department', (request, response) => {

    database.collection("Department").count({}, function (error, numOfDocs) {
        if (error) {
            console.log(error);
        }

        database.collection("Department").insertOne({
            DepartmentId: numOfDocs + 1,
            DepartmentName: request.body['DepartmentName']
        });

        response.json("Added Successfully");
    })

})


app.put('/api/department', (request, response) => {

    database.collection("Department").updateOne(
        //Filter Criteria
        {
            "DepartmentId": request.body['DepartmentId']
        },
        //Update
        {
            $set:
            {
                "DepartmentName": request.body['DepartmentName']
            }

        }
    );

    response.json("Updated Successfully");
})



app.delete('/api/department/:id', (request, response) => {

    database.collection("Department").deleteOne({
        DepartmentId: parseInt(request.params.id)
    });

    response.json("Deleted Successfully");
})



app.get('/api/employee', (request, response) => {

    database.collection("Employee").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })

})

app.post('/api/employee', (request, response) => {

    database.collection("Employee").count({}, function (error, numOfDocs) {
        if (error) {
            console.log(error);
        }

        database.collection("Employee").insertOne({
            EmployeeId: numOfDocs + 1,
            EmployeeName: request.body['EmployeeName'],
            Department: request.body['Department'],
            DateOfJoining: request.body['DateOfJoining'],
            PhotoFileName: request.body['PhotoFileName'],
        });

        response.json("Added Successfully");
    })

})


app.put('/api/employee', (request, response) => {

    database.collection("Employee").updateOne(
        //Filter Criteria
        {
            "EmployeeId": request.body['EmployeeId']
        },
        //Update
        {
            $set:
            {
                EmployeeName: request.body['EmployeeName'],
                Department: request.body['Department'],
                DateOfJoining: request.body['DateOfJoining'],
                PhotoFileName: request.body['PhotoFileName'],
            }

        }
    );

    response.json("Updated Successfully");
})



app.delete('/api/employee/:id', (request, response) => {

    database.collection("Employee").deleteOne({
        EmployeeId: parseInt(request.params.id)
    });

    response.json("Deleted Successfully");
})


app.post('/api/employee/savefile', (request, response) => {

    fs.writeFile("./Photos/" + request.files.file.name,
        request.files.file.data, function (err) {
            if (err) {
                console.log(err);
            }

            response.json(request.files.file.name);
        }
    )
})