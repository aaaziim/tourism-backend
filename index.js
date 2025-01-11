const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9e8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();


    const database = client.db("TourismDB");
    const spotsCollection = database.collection("spots");
    const mySpotsCollection = database.collection("mySpots");
    const usersCollection = database.collection("users");


    app.get("/allspot", async(req, res)=>{
      const result = await spotsCollection.find().toArray();
      res.send(result)
    })


    app.get("/spot/:id", async(req, res)=>{
      const { id } = req.params;
      const result = await spotsCollection.findOne({_id : new ObjectId(id)}) 
      res.send(result)
    })


    app.post("/addspot", async(req, res)=>{
      const result = await spotsCollection.insertOne(req.body);
      res.send(result)
    })


    app.put("/spot/:id", async(req, res)=>{
      const { id } = req.params; 
      const updatedSpot = req.body;
      const result = await spotsCollection.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedSpot } 
      );
      res.send(result)
    })

    app.delete("/delete/:id", async(req, res)=>{
      const { id } = req.params;
      const result = await spotsCollection.deleteOne({_id: new ObjectId(id)});
      res.send(result)

    })


    app.get("/myspot", async(req, res)=>{
      const result = await spotsCollection.find().toArray();
      res.send(result)
    })





     //User Related Api's 

     app.post("/addusers", async(req, res)=>{
      const result = await usersCollection.insertOne(req.body);
      res.send(result)
    })








    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}
run();

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
