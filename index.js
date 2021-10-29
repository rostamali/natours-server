const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
// cors connect
const cors = require('cors');
app.use(cors());
app.use(express.json());


// 
// 
// 
// 
// 

// mongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urhyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// DB operation
async function run() {

    try {
      await client.connect();
      const database = client.db("natours");
      const packageCollection = database.collection("travelPackage");

      // create a document to insert
      app.post('/service', async(req, res)=>{
        const newService = req.body;
        const result = await packageCollection.insertOne(newService);
        res.json(result);
      })
      // get service for the UI
      app.get('/services', async (req, res)=>{
        const query = packageCollection.find({});
        const services = await query.toArray();
        res.send(services);
      })

      // get service for the UI
      app.get('/services/:id', async (req, res)=>{

        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await packageCollection.findOne(query);
        res.send(service);
      })
      
    } finally {
    //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`DB connected ${uri}`)
})