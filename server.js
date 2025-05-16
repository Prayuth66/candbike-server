require('dotenv').config(); // <-- ADD THIS LINE FIRST
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Candbike Booking Server is running.');
});

app.post('/create-checkout-session', async (req, res) => {
  const data = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'thb',
          product_data: {
            name: `Candbike Tour - ${data.tour}`,
          },
          unit_amount: data.totalPrice * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://candbike.com/thank-you',
      cancel_url: 'https://candbike.com/booking',
      metadata: {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
