const express = require('express');
const cors = require('cors')

const AuctionsRoutes = require('./routes/Auctions');
const AdminsRoutes = require('./routes/Admins');
const AdminActionsRoutes = require('./routes/AdminActions');
const ArtistsRoutes = require('./routes/Artists');
const ArtworkRoutes = require('./routes/Artworks');
const EmailRoutes = require('./routes/Emails');
const BuyersRoutes = require('./routes/Buyers');
const CartsRoutes = require('./routes/Carts');
const CatagoriesRoutes = require('./routes/Catagories');
const IndexRoutes = require('./routes/Index');
const ReviewsRoutes = require('./routes/Reviews');
const LoggedInRoutes = require('./routes/LoggedIn');
const UploadRoutes = require('./routes/Upload'); 
 
const app = express();
//app.use(express.json());
app.use(express.json({ limit: '10mb' })) 
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors()); 
 

app.use('/api/auctions', AuctionsRoutes);
app.use('/api/admin', AdminsRoutes);
app.use('/api/admin/actions', AdminActionsRoutes);
app.use('/api/artists', ArtistsRoutes);
app.use('/api/artworks', ArtworkRoutes);
app.use('/api/emails', EmailRoutes);
app.use('/api/buyers', BuyersRoutes);
app.use('/api/carts', CartsRoutes);
app.use('/api/categories', CatagoriesRoutes);
app.use('/api/', IndexRoutes);
app.use('/api/reviews', ReviewsRoutes );
app.use('/api/loggedin', LoggedInRoutes );
app.use('/api/upload', UploadRoutes );



app.get('/',(req,res)=>{
    res.send("this is main page");
})

port = 8000
app.listen(process.env.PORT||port,()=>{
    console.log(`connected to port ${port}`);
});

