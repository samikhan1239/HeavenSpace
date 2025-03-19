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
      [id]: type === "checkbox" ? checked : value,
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
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {editingListing ? "Edit Listing" : "Create Listing"}
      </h1>
      {message && (
        <p
          className={`text-center mb-6 p-3 rounded-lg ${
            message.includes("Error") || message.includes("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Property Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              placeholder="Enter property name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              placeholder="Describe the property"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-32 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              placeholder="Enter price"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Discount Price
            </label>
            <input
              type="number"
              id="discountPrice"
              value={formData.discountPrice}
              placeholder="Enter discount price"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Security Deposit
            </label>
            <input
              type="number"
              id="securityDeposit"
              value={formData.securityDeposit}
              placeholder="Enter security deposit"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Listing Type
            </label>
            <select
              id="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="Direct Owner">Direct Owner</option>
              <option value="Broker">Broker</option>
            </select>
          </div>

          {formData.listingType === "Broker" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                  Broker Name
                </label>
                <input
                  type="text"
                  id="brokerName"
                  value={formData.brokerName}
                  placeholder="Enter broker name"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                  Broker Contact
                </label>
                <input
                  type="tel"
                  id="brokerContact"
                  value={formData.brokerContact}
                  placeholder="Enter broker contact"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                  Brokerage Price
                </label>
                <input
                  type="number"
                  id="brokeragePrice"
                  value={formData.brokeragePrice}
                  placeholder="Enter brokerage price"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </>
          )}

          {formData.listingType === "Direct Owner" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  value={formData.ownerName}
                  placeholder="Enter owner name"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                  Owner Contact
                </label>
                <input
                  type="tel"
                  id="ownerContact"
                  value={formData.ownerContact}
                  placeholder="Enter owner contact"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="Room">Room</option>
              <option value="Hostel">Hostel</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Room Type
            </label>
            <select
              id="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              {roomTypeOptions[formData.propertyType].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {(formData.propertyType === "Room" ||
            formData.propertyType === "Hostel") && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
                Available Rooms
              </label>
              <input
                type="number"
                id="availableRooms"
                placeholder="Enter number of rooms"
                value={formData.availableRooms}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              placeholder="Enter location"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNo"
              value={formData.phoneNo}
              placeholder="Enter phone number"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Availability
            </label>
            <select
              id="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-1">
              Gender Preference
            </label>
            <select
              id="genderPreference"
              value={formData.genderPreference}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="parkingAvailable"
                checked={formData.parkingAvailable}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Parking
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="kitchen"
                checked={formData.kitchen}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Kitchen
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="housekeeping"
                checked={formData.housekeeping}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Housekeeping
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="electricityBackup"
                checked={formData.electricityBackup}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Backup
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="laundryServices"
                checked={formData.laundryServices}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Laundry
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="securityGuard"
                checked={formData.securityGuard}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Security
            </label>
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                id="cctv"
                checked={formData.cctv}
                onChange={handleChange}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              CCTV
            </label>
          </div>
        </div>

        {/* Full Width Image Section */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Upload Images
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Upto 6 images, required)
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded-lg w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg uppercase font-semibold hover:from-green-600 hover:to-green-700 transition duration-200  whitespace-nowrap"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-600 text-sm mb-4">{imageUploadError}</p>
          )}
          {formData.image.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {formData.image.map((url, index) => (
                <div
                  key={url}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 font-semibold uppercase hover:text-red-800 transition duration-200"
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
            className="mt-6 w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg uppercase font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading
              ? editingListing
                ? "Updating..."
                : "Creating..."
              : editingListing
              ? "Update Listing"
              : "Create Listing"}
          </button>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
