const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
 app.use(cors());
 app.use(express.json())

// user : myDbuser1
// pass : ql2Q7b9X6frxGdgV 
// 
const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l1qze.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// database connection

async function run(){
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        // GET APi
        app.get('/services', async(req,res)=>{
            // sob data load korar jomo .find({}) ..empty 
            const cursor = servicesCollection.find({})
            const services =await cursor.toArray();
            res.send(services);
        });
        // GET single item
        app.get('/services/:id' , async(req ,res)=>{
            const id = req.params.id;
            console.log('getting hit service',id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })


        // post api
        app.post('/services',async(req,res)=>{
            const service = req.body;
            console.log('hit the post',service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // delete api
        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })



    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/',(req ,res)=>{
    res.send('Running Genious Server')
})
app.get('/hello',(req,res)=>{
    res.send('hello updated here')
})

app.listen(port ,()=>{
    console.log('Running Genius Server on port server ',port);
})

/*
one time 
1. heroku account open
2. heroku software install

Every project
1. git init
2. .gitignore (node_module.env)
3. push every thing to git 
4. make sure you have this script : "start" :" node index.js",
5 . make sure : put process.env.PORT in front of your port number
6 . heroku login
7. heroku create (only one time for a project)

8. command:  git push heroku main
-------
update : 
1. git add , git commit
. 


*/
