import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import productRouter from "./routers/productRouter.js"; 
import filterRouter  from "./routers/filterRoute.js";
import Stripe from 'stripe';
import { databaseConnect } from "./dbConfig/database.js";
import orderInfo from "./routers/orderInfo.js";

// Initialize dotenv to load environment variables
dotenv.config();
databaseConnect()
// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount the product router at "/api/product"
app.use("/api/product", productRouter);
app.use("/api/product/filter",filterRouter)
app.use("/api",orderInfo)







// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



const stripe = new Stripe("sk_test_51PWscOL3BkBJk9RpLl0RojVbDLL5k1fzCtG9cetkJ1uH6Hd2LsfnTYSUC2Icqq5m9MQfRQWmNlcqIAnjUpVCDFZH00N1nAm0W7")

app.post('/create-checkout-session', async (req, res) => {
  const productArray = req.body;
  const lineItem = productArray.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item?.name,
        images: [item?.image],
        metadata: {
          email: item.email,
          state: "processing",
        }
      },
      unit_amount: Math.round(item?.price * 100),
    },
    quantity: item?.quantity
  }))

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItem,
      mode: "payment",
      success_url: `http://localhost:5173/pament-succesfully?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/pament-cancell"
    })
    res.json(session)
  } catch (error) {
    console.log(error)
  }

});




