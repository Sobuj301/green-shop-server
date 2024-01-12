const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;



// middleware

app.use(cors())
app.use(express.json())



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

    const serviceCollection = client.db('green-shop').collection('services')
    const bookingCollection = client.db('green-shop').collection('booking')
    await client.connect();




    app.get('/services', async (req, res) => {
      // console.log(req.query.service_name)
      let query = {};
      // let sortObj={};
      const serviceName = req.query.service_name;
      // const sortField = req.query.sortField;
      // const sortOrder = req.query.sortOrder;
      let option = {}
      if (req.query.email) {
        option = {
          email: req.params.email
        }
      }

      if (serviceName) {
        query = {
          service_name: req.query.service_name
        }
      }
      // if(sortField && sortOrder){
      //    sortObj[sortField]=sortOrder
      // }
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query);
      res.send(result)
    })

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })


    // ADD SERVICE

    app.post('/addService', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service)
      res.send(result)
    })


    // MANAGE SERVICES
    app.get('/allServices', async (req, res) => {
      const email = req.query.email;
      const query ={email:email}
      
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    // delete service

    app.delete('/allServices/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await serviceCollection.deleteOne(query);
      res.send(result)
    })

    app.patch('/update/:id',async(req,res) =>{
      const service = req.body;
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const options = { upsert: true };
      const update ={
        $set:{
          serviceName:service.serviceName,
          photo:service.photo,
          email:service.email,
          price:service.price,
          name:service.name,
          area:service.area,
          description:service.description
        }
      }
      const result= await serviceCollection.updateOne(filter,update,options);
      res.send(result)
      
    })


    // booking service related 

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking)
      const result = await bookingCollection.insertOne(booking)
      res.send(result)
    })


    app.get('/bookings',async(req,res) =>{
      const userEmail = req.query.userEmail;
      const query ={userEmail:userEmail};
      const cursor = bookingCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

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

