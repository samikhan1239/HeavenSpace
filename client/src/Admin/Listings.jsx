import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserListings = () => {
  const { token } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/user/listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setListings(data.listings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [token]);

  const handleEditForm = (listing) => {
    navigate("/admin/create-listing", { state: { listing } });
  };

  const handleInlineEdit = (listing) => {
    setEditId(listing._id);
    setEditData({
      phoneNo: listing.phoneNo,
      availableRooms: listing.availableRooms,
      availability: listing.availability,
    });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/user/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setListings(listings.map((l) => (l._id === id ? data.listing : l)));
      setEditId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      const res = await fetch(`/api/user/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Listings
      </h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 uppercase text-sm font-semibold">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Owner/Broker</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Rooms</th>
                <th className="p-4 text-left">Availability</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-4">{listing.name}</td>
                  <td className="p-4">{listing.description}</td>
                  <td className="p-4">₹{listing.price}</td>
                  <td className="p-4">
                    {listing.listingType === "Direct Owner" ? (
                      listing.ownerName || "N/A"
                    ) : (
                      <span>
                        {listing.brokerName || "N/A"}{" "}
                        {listing.brokeragePrice
                          ? `(₹${listing.brokeragePrice})`
                          : ""}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editId === listing._id ? (
                      <input
                        type="tel"
                        name="phoneNo"
                        value={editData.phoneNo}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      listing.phoneNo
                    )}
                  </td>
                  <td className="p-4">
                    {editId === listing._id ? (
                      <input
                        type="number"
                        name="availableRooms"
                        value={editData.availableRooms}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      listing.availableRooms || "N/A"
                    )}
                  </td>
                  <td className="p-4">
                    {editId === listing._id ? (
                      <select
                        name="availability"
                        value={editData.availability}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                          listing.availability === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {listing.availability}
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editId === listing._id ? (
                      <>
                        <button
                          onClick={() => handleSave(listing._id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-200"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleInlineEdit(listing)}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition duration-200"
                        >
                          Quick Edit
                        </button>
                        <button
                          onClick={() => handleEditForm(listing)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200"
                        >
                          Edit Form
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListings;
