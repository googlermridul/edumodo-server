const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwqvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

app.get("/", (req, res) => {
   res.send("Edumodo Server!");
});

client.connect((err) => {
   const courseCollection = client.db("edumodo").collection("courses");
   const cartOrderCollection = client.db("edumodo").collection("cartOrders");
   const orderCollection = client.db("edumodo").collection("orders");
   const bookingCollection = client.db("edumodo").collection("bookings");
   const userCollection = client.db("edumodo").collection("users");

   // add a single menu by admin
   app.post("/addCourse", async (req, res) => {
      const result = await courseCollection.insertOne(req.body);
      res.send(result);
   });
   // load all menus showed in home page
   app.get("/courses", async (req, res) => {
      const result = await courseCollection.find({}).toArray();
      res.send(result);
   });
   // delete menu
   app.delete("/deleteCourse/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
   });

   // add to cart
   app.post("/addCartOrder", async (req, res) => {
      const result = await cartOrderCollection.insertOne(req.body);
      res.send(result);
   });
   // load all cart order
   app.get("/cartOrders", async (req, res) => {
      const result = await cartOrderCollection.find({}).toArray();
      res.send(result);
   });
   // load a specific cart order
   app.get("/cartOrders/:email", async (req, res) => {
      const result = await cartOrderCollection
         .find({ email: req.params.email })
         .toArray();
      res.send(result);
   });
   // delete cart order
   app.delete("/deleteCartOrder/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await cartOrderCollection.deleteOne(query);
      res.send(result);
   });
   // delete all cart order
   app.delete("/deleteAllCartOrder/:id", async (req, res) => {
      const query = { email: req.params.id };
      const result = await cartOrderCollection.deleteMany(query);
      res.send(result);
   });

   // add order
   app.post("/addOrder", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
   });
   // load all orders
   app.get("/orders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
   });
   // load a specific order
   app.get("/orders/:email", async (req, res) => {
      const result = await orderCollection
         .find({ email: req.params.email })
         .toArray();
      res.send(result);
   });
   // delete order
   app.delete("/deleteOrder/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
   });
   // update order status
   app.put("/orders/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
         $set: {
            status: "Delivered",
         },
      };
      const result = await orderCollection.updateOne(
         filter,
         updateDoc,
         options
      );
      res.send(result);
   });

   // add to cart
   app.post("/addBooking", async (req, res) => {
      const result = await bookingCollection.insertOne(req.body);
      res.send(result);
   });
   // load all cart order
   app.get("/bookings", async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
   });
   // load a specific cart order
   app.get("/bookings/:email", async (req, res) => {
      const result = await bookingCollection
         .find({ email: req.params.email })
         .toArray();
      res.send(result);
   });
   // delete cart order
   app.delete("/deleteBooking/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
   });
   // update bookings status
   app.put("/bookings/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
         $set: {
            status: "Approved",
         },
      };
      const result = await bookingCollection.updateOne(
         filter,
         updateDoc,
         options
      );
      res.send(result);
   });

   // add user data
   app.post("/addUser", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
   });
   app.get("/users", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
   });
   app.put("/addUser", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
   });
   // make an admin
   app.put("/addUser/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result);
   });
   // check whether admin
   app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
         isAdmin = true;
      }
      res.send({ admin: isAdmin });
   });

   app.delete("/deleteUser/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
   });
});

app.listen(port, () => console.log("listening at", port));
