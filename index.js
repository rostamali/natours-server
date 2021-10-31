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

// mongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urhyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// DB operation
async function run() {

    try {
      await client.connect();
      const database = client.db("natours");
      const packageCollection = database.collection("travelPackage");
      const orderCollection = database.collection("Orders");
      const reviewCollection = database.collection("reviews");

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

      // create orders
      app.post('/order', async (req, res) =>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
      })

      // send my order to the UI
      app.get('/orders', async (req, res)=>{
        const query = orderCollection.find({});
        const orders = await query.toArray();
        res.send(orders);
      })

      // delete my orders
      app.delete('/order/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.send(result);
      })

      // update data
      app.put('/order/:id', async (req, res)=>{
        const id = req.params.id;
        const updateDoc = req.body.status;
        const query = {_id: ObjectId(id)};
        const result = await orderCollection.updateOne(
          query, 
          {$set:
            {
              status : "Active"
            }
          }
        );
        res.send(result);
      })

      // send review to the UI
      app.get('/reviews', async (req, res)=>{
        const query = reviewCollection.find({});
        const  reviews = await query.toArray();
        res.send(reviews);
      })
      
    } finally {
    //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`DB connected`);
})