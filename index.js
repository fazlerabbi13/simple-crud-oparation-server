const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// simpleCrudOparation
// yzQZDRF2EHdDZHyh
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://simpleCrudOparation:yzQZDRF2EHdDZHyh@cluster0.nruv7rx.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usertDB").collection("user")

    app.post('/users',async(req,res) =>{
        const user = req.body;
        console.log('new user',user)
        const result = await database.insertOne(user);
        res.send(result);
    })

    app.get('/users', async(req,res) =>{
        const cursor = database.find()
        const  result = await cursor.toArray();
        res.send(result)

    })

    app.get('/users/:id',async(req,res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const user = await database.findOne(query);
        res.send(user);
    })

    app.put('/users/:id', async(req,res) =>{
        const id = req.params.id;
        const user = req.body;
        console.log(user)
        const filter = {_id: new ObjectId(id)}
        const options = {upsert:true}
        const updated = {
            $set:{
                name:user.name,
                email:user.email

            }
          
        }
        console.log(updated)
        const result = await database.updateOne(filter,updated,options)
        res.send(result)
    })

    app.delete('/users/:id', async(req,res) =>{
        const id = req.params.id
        console.log('id delete from data base', id)
    
        const query ={ _id: new ObjectId(id)}
        const result = await database.deleteOne(query);
        res.send(result)
    
    
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('simple crud is running')
})

app.listen(port,() =>{
    console.log(`simple crud is running on port ${port}`)
})