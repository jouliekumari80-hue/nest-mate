const express = require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const connectDB = require('./config/db');
const { router } = require('./routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
connectDB();



app.get('/',(req,res)=>{
  res.send(`NestMate Backend running successfully `);
});

app.use('/api/auth', router);

const listingRoutes = require('./routes/listingRoutes');
app.use('/api/listings', listingRoutes);

const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);

const savedRoutes = require('./routes/savedRoutes');
app.use('/api/saved', savedRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
