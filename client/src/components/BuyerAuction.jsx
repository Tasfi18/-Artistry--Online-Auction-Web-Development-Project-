import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BuyerAuction.css';

const Auction = () => {
const { buyerID } = useParams();

const navigate = useNavigate();
const [auctions, setAuctions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchClosedAuctions = async () => {
    try {
        console.log("buyerID:", buyerID);
        const response = await axios.get(`http://localhost:8000/api/buyers/auction/${buyerID}`);
        setAuctions(response.data);
        setLoading(false);
    } catch (err) {
        setError('Error fetching auctions');
        setLoading(false);
    }
    };

    fetchClosedAuctions();
}, [buyerID]);

const handleClaim = async (auctionID) => {
    try {

    //await axios.post(`http://localhost:8000/api/auctions/claim`, { auctionID });
    navigate(`/auction/${auctionID}`)
    } catch (err) {
    alert('Error going to the auction');
    }
};

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

return (
    <div className="Auction-container">
    <h1>Your Auction House</h1>
    {auctions.length === 0 ? (
        <p>No closed auctions to claim.</p>
    ) : (
        <table className="auction-table">
        <thead>
            <tr>
            <th>Auction ID</th>
            <th>Artwork </th>
            <th>Your Bid</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {auctions.map((auction) => (
            <tr key={auction.AuctionID & auction.ArtworkID}>
                <td>{auction.AuctionID}</td>
                <td>{auction.Title}</td>
                <td>${auction.MaxBid}</td>
                <td>
                <button
                    className="claim-button"
                    onClick={() => handleClaim(auction.AuctionID)}
                >
                    View Auction
                </button>
                </td>
            </tr>
            ))}
        </tbody>  
        </table>
    )}
    </div>
);
};

export default Auction;
