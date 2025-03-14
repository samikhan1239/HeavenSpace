import React, { useState } from "react";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    securityDeposit: "",
    listingType: "Direct Owner",
    brokerName: "",
    brokerContact: "",
    brokeragePrice: "",
    ownerName: "",
    ownerContact: "",
    propertyType: "Room", // Default selection
    roomType: "Single", // Default based on propertyType
    category: "Room", // Auto-updates based on propertyType
    location: "",
    image: null,
    phoneNo: "",
    availability: "Available",
    availableRooms: "",
    genderPreference: "Any",
    parkingAvailable: false,
    kitchen: false,
    electricityBackup: false,
    cctv: false,
  });

  const [message, setMessage] = useState("");

  // Room Type Options based on Property Type
  const roomTypeOptions = {
    Room: ["Single", "Double", "Triple"],
    Hostel: ["Single", "Double", "Triple"],
    Flat: ["1 BHK", "2 BHK", "3 BHK", "4 BHK"],
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      // Auto-update room type and category when property type changes
      ...(id === "propertyType" && {
        roomType: roomTypeOptions[value][0],
        category: value,
        availableRooms: value === "Flat" ? "" : prevData.availableRooms, // Reset availableRooms if Flat is selected
      }),
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create listing");

      setMessage("🎉 Listing created successfully!");
      setFormData({}); // Reset form
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Listing</h1>
      {message && <p className="text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Name, Description, Price */}
        <input
          type="text"
          id="name"
          placeholder="Property Name"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          id="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          id="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          id="discountPrice"
          placeholder="Discount Price"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Security Deposit */}
        <input
          type="number"
          id="securityDeposit"
          placeholder="Security Deposit"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Listing Type: Broker vs Owner */}
        <label>Listing Type:</label>
        <select
          id="listingType"
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Direct Owner">Direct Owner</option>
          <option value="Broker">Broker</option>
        </select>

        {/* Broker Fields */}
        {formData.listingType === "Broker" && (
          <>
            <input
              type="text"
              id="brokerName"
              placeholder="Broker Name"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              id="brokerContact"
              placeholder="Broker Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              id="brokeragePrice"
              placeholder="Brokerage Price"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </>
        )}

        {/* Owner Fields */}
        {formData.listingType === "Direct Owner" && (
          <>
            <input
              type="text"
              id="ownerName"
              placeholder="Owner Name"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              id="ownerContact"
              placeholder="Owner Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </>
        )}

        {/* Property Type Selection */}
        <label>Property Type:</label>
        <select
          id="propertyType"
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Room">Room</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
        </select>

        {/* Room Type (Auto-updates based on Property Type) */}
        <label>Room Type:</label>
        <select
          id="roomType"
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {roomTypeOptions[formData.propertyType].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Show "Available Rooms" only if Room or Hostel */}
        {(formData.propertyType === "Room" ||
          formData.propertyType === "Hostel") && (
          <>
            <label>Available Rooms:</label>
            <input
              type="number"
              id="availableRooms"
              placeholder="No. of Available Rooms"
              value={formData.availableRooms}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </>
        )}

        {/* Location */}
        <input
          type="text"
          id="location"
          placeholder="Location"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Availability */}
        <select
          id="availability"
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        {/* Boolean Features */}
        <label>
          <input
            type="checkbox"
            id="parkingAvailable"
            onChange={handleChange}
          />{" "}
          Parking Available
        </label>
        <label>
          <input type="checkbox" id="kitchen" onChange={handleChange} /> Kitchen
        </label>
        <label>
          <input type="checkbox" id="housekeeping" onChange={handleChange} />{" "}
          HouseKeeping
        </label>
        <label>
          <input
            type="checkbox"
            id="electricityBackup"
            onChange={handleChange}
          />{" "}
          Electricity Backup
        </label>
        <label>
          <input type="checkbox" id="laundryServices" onChange={handleChange} />{" "}
          Laundry Services
        </label>
        <label>
          <input type="checkbox" id="securityGuard" onChange={handleChange} />{" "}
          Security Guard
        </label>
        <label>
          <input type="checkbox" id="cctv" onChange={handleChange} /> CCTV
        </label>
        {/* Image Upload */}
        <div className="flex flex-col  flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              {" "}
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              required
            />
            <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
