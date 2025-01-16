import React from "react";
import AdminSignIn from './components/AdminSignIn';
import VerifyArtworks from './components/VerifyArtworks';
import VerifyArtworkDetails from './components/VerifyArtworkDetails';
import AdminControlPanel from './components/AdminControlPanel';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import FeaturedPaintings from "./components/FeaturedPaintings";
import OpenAuctions from "./components/OpenAuctions";  
import FeaturedArtists from "./components/FeaturedArtists";
import CustomerReviews from "./components/CustomerReviews";
import ExploreOptions from "./components/ExploreOptions";
import UserArtist from './components/UserArtist';  
import UserBuyer from './components/UserBuyer'; 
import BuyerCart from './components/BuyerCart'; 
import UserArtistPublic from './components/UserArtistPublic';  
import UserBuyerPublic from './components/UserBuyerPublic';
import UploadArtwork from './components/UploadArtwork';
import BuyerAuction from './components/BuyerAuction'; 
import UploadArtworkFinal from './components/UploadArtworksFinal';
import ArtistArtworks from './components/ArtistArtworks';
import AuctionBidding from './components/AuctionBidding';
import Upload from './components/Upload';
/*
import UserArtist from "./components/UserArtist"
import UserBuyer from "./components/UserBuyer";
import UserArtistPublic from "./components/UserArtistPublic";
import UserBuyerPublic from "./components/UserBuyerPublic";
/cart/${buyer.BuyerID}
*/
import HeroSection from "./components/HeroSection"; 
import Footer from "./components/Footer";
import { AuthProvider } from './components/AuthContext';
import './index.css';
import ViewAuctionDetails from "./components/ViewAuctionDetails";
import Auctions from "./components/Auctions";
import CategoryDropdown from "./components/CategoryDropdown";





const RareThingsPage = () => <div>Rare Things Collection</div>;
const PaintingsPage = () => <div>More Paintings Gallery</div>;
const DrawingsPage = () => <div>More Drawings</div>;
const SculpturePage = () => <div>More Sculptures</div>;
const ArtistsPage = () => <div>More Artists Details</div>;
const AuctionsPage = () => <div>More Auction Details</div>;  
const ReviewsPage = () => <div>More Reviews</div>;


function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={
          <main>
            <HeroSection /> 
            <ExploreOptions />
            <OpenAuctions />  
            { /* <FeaturedArtists />
           { /*<FeaturedPaintings />*/
           /* <CustomerReviews /> */}
          </main>
        } />
        <Route path="/admin" element={<AdminSignIn />} />
        <Route path="/admin/controlpanel" element={<AdminControlPanel />} />
        <Route path="/admin/verify/artwork" element={<VerifyArtworks />} />
        <Route path="/admin/verify/artwork/:artworkID" element={<VerifyArtworkDetails />} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/rare-things" element={<RareThingsPage />} />
        <Route path="/paintings" element={<PaintingsPage />} />
        <Route path="/drawings" element={<DrawingsPage />} />
        <Route path="/sculpture" element={<SculpturePage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/public/artist/:artistID" element={<UserArtistPublic />} />  
        <Route path="/public/buyer/:buyerID" element={<UserBuyerPublic />} /> 
        <Route path="/user/artist/:artistID" element={<UserArtist/>} />  
        <Route path="/user/buyer/:buyerID" element={<UserBuyer />} /> 
        <Route path="/auctions" element={<Auctions />} />  
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/auction/:id" element={<ViewAuctionDetails />} /> 
        <Route path="/artists/:artistID/upload-artwork" element={<UploadArtwork />} /> 
        <Route path="/artists/:artistID/upload-artwork/:artworkID" element={<UploadArtworkFinal />} />
        <Route path="/user/artists/:artistID/artworks" element={<ArtistArtworks />} />
        <Route path="/auction-bidding/:id" element={<AuctionBidding />} />
        <Route path="/catagories" element={<CategoryDropdown />} />
        <Route path="/cart/:buyerID"element={<BuyerCart />}/>
        <Route path="/your-auctions/:buyerID"element={<BuyerAuction />}/>
      </Routes>

      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
