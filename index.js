const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/category');
const ordersRoutes = require('./routes/orders');
const orderedItemsRoutes = require('./routes/orderedItems');
const userRotues = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cors());


//connexion mongo
mongoose.connect('Lien Connection MongoDB')
.then(() => console.log('Connexion à mongo réussie'))
.catch(err => console.error('Erreur cnx mongo : ', err));

//api Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/ordered-items', orderedItemsRoutes);
app.use('/api/user', userRotues);

//Start server
const port = 3000;
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});