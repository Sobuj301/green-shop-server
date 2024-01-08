const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udy85xl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Green Shop Server Is Running..................')
})

app.listen(port, () => {
    console.log(`running port ${port}`)
})

