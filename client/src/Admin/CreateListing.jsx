import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, token } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");

  // Check if editing (data passed via state)
  const editingListing = location.state?.listing || null;

  const [formData, setFormData] = useState({
    name: editingListing?.name || "",
    description: editingListing?.description || "",
    price: editingListing?.price || "",
    discountPrice: editingListing?.discountPrice || "",
    securityDeposit: editingListing?.securityDeposit || "",
    listingType: editingListing?.listingType || "Direct Owner",
    brokerName: editingListing?.brokerName || "",
    brokerContact: editingListing?.brokerContact || "",
    brokeragePrice: editingListing?.brokeragePrice || "",
    ownerName: editingListing?.ownerName || "",
    ownerContact: editingListing?.ownerContact || "",
    propertyType: editingListing?.propertyType || "Room",
    roomType: editingListing?.roomType || "Single",
    category: editingListing?.category || "Room",
    location: editingListing?.location || "",
    image: editingListing?.image || [], // Pre-fill with existing images
    phoneNo: editingListing?.phoneNo || "",
    availability: editingListing?.availability || "Available",
    availableRooms: editingListing?.availableRooms || "",
    genderPreference: editingListing?.genderPreference || "Any",
    parkingAvailable: editingListing?.parkingAvailable || false,
    kitchen: editingListing?.kitchen || false,
    housekeeping: editingListing?.housekeeping || false,
    electricityBackup: editingListing?.electricityBackup || false,
    laundryServices: editingListing?.laundryServices || false,
    securityGuard: editingListing?.securityGuard || false,
    cctv: editingListing?.cctv || false,
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

  // Check authentication and role on mount
  useEffect(() => {
    if (!token || !currentUser) {
      setMessage("❌ Please log in to create a listing.");
      navigate("/sign-in");
      return;
    }

    const userRole = currentUser.role;
    if (!["admin", "superadmin"].includes(userRole)) {
      setMessage("❌ Only admins and superadmins can create listings.");
      navigate("/");
    }
  }, [currentUser, token, navigate]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setImageUploadError("Please select at least one image to upload.");
      return;
    }

    if (files.length + formData.image.length > 6) {
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
        image: [...prevData.image, ...urls],
      }));
      setFiles([]);
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
      formData.append("upload_preset", "heaven");

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
      image: formData.image.filter((_, i) => i !== index),
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
    setError(false);

    console.log("Form Data Before Submission:", formData);
    console.log("Current User:", currentUser);
    console.log("Token:", token);

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "price",
      "phoneNo",
      "category",
      "location",
      "listingType",
      "genderPreference",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0 || formData.image.length === 0) {
      setMessage(
        `❌ Please fill all required fields (${missingFields.join(
          ", "
        )}) and upload at least one image.`
      );
      setLoading(false);
      return;
    }

    if (!token) {
      setMessage("❌ Please log in to create a listing.");
      setLoading(false);
      navigate("/sign-in");
      return;
    }

    try {
      const url = editingListing
        ? `/api/user/listings/${editingListing._id}`
        : "/api/listings/create";
      const method = editingListing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Raw response:", text);
        throw new Error(text || `HTTP error ${res.status}`);
      }
      const data = await res.json();
      console.log("📌 Full Server Response:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to save listing");
      }

      setMessage(
        editingListing
          ? "🎉 Listing updated successfully!"
          : "🎉 Listing created successfully!"
      );
      navigate("/admin/listing"); // Navigate back to listings page
    } catch (error) {
      console.error("Submission Error:", error);
      setMessage(`❌ Error: ${error.message}`);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {editingListing ? "Edit Listing" : "Create Listing"}
      </h1>
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
            />
            <input
              type="tel"
              id="brokerContact"
              value={formData.brokerContact}
              placeholder="Broker Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
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
            />
            <input
              type="tel"
              id="ownerContact"
              value={formData.ownerContact}
              placeholder="Owner Contact No."
              onChange={handleChange}
              className="border p-2 rounded"
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
              Up to 6 images can be uploaded (required)
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
              required={formData.image.length === 0 && !editingListing}
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
          {formData.image.length > 0 && (
            <div className="space-y-2">
              {formData.image.map((url, index) => (
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
            {loading
              ? editingListing
                ? "Updating..."
                : "Creating..."
              : editingListing
              ? "Update Listing"
              : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
