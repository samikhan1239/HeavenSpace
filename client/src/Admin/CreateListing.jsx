import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
    propertyType: "Room",
    roomType: "Single",
    category: "Room",
    location: "",
    imageUrls: [],
    phoneNo: "",
    availability: "Available",
    availableRooms: "",
    genderPreference: "Any",
    parkingAvailable: false,
    kitchen: false,
    housekeeping: false,
    electricityBackup: false,
    laundryServices: false,
    securityGuard: false,
    cctv: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const roomTypeOptions = {
    Room: ["Single", "Double", "Triple"],
    Hostel: ["Single", "Double", "Triple"],
    Flat: ["1 BHK", "2 BHK", "3 BHK", "4 BHK"],
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setImageUploadError("Please select at least one image to upload.");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload up to 6 images per listing.");
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const promises = Array.from(files).map((file) => storeImage(file));

    try {
      const urls = await Promise.all(promises);
      setFormData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, ...urls],
      }));
      setFiles([]);
      setImageUploadError(false);
    } catch (err) {
      setImageUploadError("Image upload failed (2 MB max)");
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "heaven"); // Replace with your Cloudinary upload preset

      fetch("https://api.cloudinary.com/v1_1/dgdgowdls/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) resolve(data.secure_url);
          else reject(new Error("Upload failed"));
        })
        .catch((error) => reject(error));
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value.trim(),
      ...(id === "propertyType" &&
        roomTypeOptions[value] && {
          roomType: roomTypeOptions[value][0],
          category: value,
          availableRooms: value === "Flat" ? "" : prevData.availableRooms,
        }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    console.log("Form Data Before Submission:", formData);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.phoneNo ||
      !formData.category ||
      !formData.location ||
      !formData.listingType ||
      !formData.genderPreference ||
      formData.imageUrls.length === 0
    ) {
      setMessage(
        "❌ Please fill all required fields and upload at least one image."
      );
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "imageUrls" && value.length > 0) {
        formDataToSend.append("images", JSON.stringify(value));
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    console.log("FormData to be sent:");
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          // Include JWT token in Authorization header (assuming it's stored in localStorage)
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create listing");
      }

      const listingId = data.listing?._id || data.listing?.id;
      if (!listingId) {
        throw new Error("No listing ID returned from server");
      }

      console.log("Server Response:", data);

      navigate(`/listing/${listingId}`);
      setMessage("🎉 Listing created successfully!");

      setFormData({
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
        propertyType: "Room",
        roomType: "Single",
        category: "Room",
        location: "",
        imageUrls: [],
        phoneNo: "",
        availability: "Available",
        availableRooms: "",
        genderPreference: "Any",
        parkingAvailable: false,
        kitchen: false,
        housekeeping: false,
        electricityBackup: false,
        laundryServices: false,
        securityGuard: false,
        cctv: false,
      });
      setFiles([]);
      setError(false);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Listing</h1>
      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("Error") || message.includes("❌")
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          id="name"
          value={formData.name}
          placeholder="Property Name"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          id="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          id="price"
          value={formData.price}
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          id="discountPrice"
          value={formData.discountPrice}
          placeholder="Discount Price"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          id="securityDeposit"
          value={formData.securityDeposit}
          placeholder="Security Deposit"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <label>Listing Type:</label>
        <select
          id="listingType"
          value={formData.listingType}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="Direct Owner">Direct Owner</option>
          <option value="Broker">Broker</option>
        </select>

        {formData.listingType === "Broker" && (
          <>
            <input
              type="text"
              id="brokerName"
              value={formData.brokerName}
              placeholder="Broker Name"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              id="brokerContact"
              value={formData.brokerContact}
              placeholder="Broker Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              id="brokeragePrice"
              value={formData.brokeragePrice}
              placeholder="Brokerage Price"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </>
        )}

        {formData.listingType === "Direct Owner" && (
          <>
            <input
              type="text"
              id="ownerName"
              value={formData.ownerName}
              placeholder="Owner Name"
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              id="ownerContact"
              value={formData.ownerContact}
              placeholder="Owner Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </>
        )}

        <label>Property Type:</label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Room">Room</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
        </select>

        <label>Room Type:</label>
        <select
          id="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {roomTypeOptions[formData.propertyType].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {(formData.propertyType === "Room" ||
          formData.propertyType === "Hostel") && (
          <input
            type="number"
            id="availableRooms"
            placeholder="No. of Available Rooms"
            value={formData.availableRooms}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        )}

        <input
          type="text"
          id="location"
          value={formData.location}
          placeholder="Location"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="tel"
          id="phoneNo"
          value={formData.phoneNo}
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          id="availability"
          value={formData.availability}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        <label>Gender Preference:</label>
        <select
          id="genderPreference"
          value={formData.genderPreference}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="parkingAvailable"
              checked={formData.parkingAvailable}
              onChange={handleChange}
              className="mr-2"
            />
            Parking Available
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="kitchen"
              checked={formData.kitchen}
              onChange={handleChange}
              className="mr-2"
            />
            Kitchen
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="housekeeping"
              checked={formData.housekeeping}
              onChange={handleChange}
              className="mr-2"
            />
            Housekeeping
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="electricityBackup"
              checked={formData.electricityBackup}
              onChange={handleChange}
              className="mr-2"
            />
            Electricity Backup
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="laundryServices"
              checked={formData.laundryServices}
              onChange={handleChange}
              className="mr-2"
            />
            Laundry Services
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="securityGuard"
              checked={formData.securityGuard}
              onChange={handleChange}
              className="mr-2"
            />
            Security Guard
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              id="cctv"
              checked={formData.cctv}
              onChange={handleChange}
              className="mr-2"
            />
            CCTV
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              Up to 6 images can be uploaded
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              disabled={uploading}
              required
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading || !files || files.length === 0}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 && (
            <div className="space-y-2">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
