import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ListingDetail = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log("Fetching listing for ID:", id);
        console.log("Token used:", token);
        const url = `/api/user/listings/${id}`; // Match your backend route
        console.log("Request URL:", url);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response Status:", res.status);
        console.log("Response Headers:", Object.fromEntries(res.headers));

        const text = await res.text();
        console.log("Raw Response:", text);

        const data = JSON.parse(text);
        console.log("Parsed Response:", data);

        if (!res.ok) {
          throw new Error(data.message || `HTTP error! Status: ${res.status}`);
        }
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch listing");
        }

        // Check if the response has 'listing' or 'listings'
        if (data.listing) {
          setListing(data.listing); // Single listing
        } else if (data.listings && data.listings.length > 0) {
          // If it returns an array, find the listing with the matching ID
          const matchedListing = data.listings.find(
            (item) => item._id === id || item.id === id
          );
          if (matchedListing) {
            setListing(matchedListing);
          } else {
            throw new Error("Listing not found in response");
          }
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(`Error: ${err.message}`);
      }
    };
    fetchListing();
  }, [id, token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{listing.name}</h1>
      <p>{listing.description}</p>
      <p>Price: ₹{listing.price}</p>
      {listing.image && (
        <img
          src={listing.image[0]}
          alt="Listing"
          className="w-full h-64 object-cover"
        />
      )}
    </div>
  );
};

export default ListingDetail;
