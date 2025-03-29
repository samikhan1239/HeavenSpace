import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // React Router for navigation
import {
  Home,
  Building2,
  Building,
  MapPin,
  Phone,
  User,
  UserPlus,
  DollarSign,
  Shield,
  Calendar,
  Users,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Info,
  AlertCircle,
  Briefcase,
  Bed,
  ParkingSquare,
  ChefHat,
  Sparkles,
  Zap,
  Shirt,
  ShieldCheck,
  Camera,
} from "lucide-react";

export default function CreateListing() {
  const navigate = useNavigate(); // Replace useRouter with useNavigate
  const { id } = useParams(); // Use useParams to get listing ID for editing (optional)
  const [files, setFiles] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Mock user data - in a real app, this would come from authentication
  const [currentUser, setCurrentUser] = useState({
    _id: "user123",
    role: "admin",
  });
  const [token, setToken] = useState("mock-token");

  // For demo purposes, simulate editing mode based on id param
  const [isEditing, setIsEditing] = useState(!!id);
  const [editingListing, setEditingListing] = useState(null);

  useEffect(() => {
    // Simulate authentication check
    setCurrentUser({ _id: "user123", role: "admin" });
    setToken("mock-token");

    // If editing, fetch the listing data (mocked for demo)
    if (isEditing) {
      const mockEditingListing = {
        name: "Luxury Apartment",
        description: "A beautiful apartment with modern amenities",
        price: "1500",
        discountPrice: "1400",
        securityDeposit: "1000",
        listingType: "Direct Owner",
        ownerName: "John Doe",
        ownerContact: "1234567890",
        propertyType: "Flat",
        roomType: "2 BHK",
        category: "Flat",
        location: "Downtown",
        image: ["/placeholder.svg?height=300&width=400&text=Sample Image"],
        phoneNo: "9876543210",
        availability: "Available",
        genderPreference: "Any",
        parkingAvailable: true,
        kitchen: true,
        housekeeping: false,
        electricityBackup: true,
        laundryServices: true,
        securityGuard: true,
        cctv: true,
      };
      setEditingListing(mockEditingListing);
      setFormData(mockEditingListing);
    }
  }, [id]);

  // Check authentication and role on mount
  useEffect(() => {
    if (!token || !currentUser) {
      setMessage("❌ Please log in to create a listing.");
      setMessageType("error");
      // In a real app, redirect to login
      // navigate("/sign-in");
      return;
    }

    const userRole = currentUser.role;
    if (!["admin", "superadmin"].includes(userRole)) {
      setMessage("❌ Only admins and superadmins can create listings.");
      setMessageType("error");
      // In a real app, redirect to home
      // navigate("/");
    }
  }, [currentUser, token, navigate]);

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
    image: [],
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

  const [imageUploadError, setImageUploadError] = useState("");
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

    if (files.length + formData.image.length > 6) {
      setImageUploadError("You can only upload up to 6 images per listing.");
      return;
    }

    setUploading(true);
    setImageUploadError("");

    try {
      const promises = Array.from(files).map((file, index) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              `/placeholder.svg?height=300&width=400&text=Image ${
                formData.image.length + index + 1
              }`
            );
          }, 1000);
        });
      });

      const urls = await Promise.all(promises);

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...urls],
      }));
      setFiles(null);

      const fileInput = document.getElementById("images");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setImageUploadError("Image upload failed (2 MB max)");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      image: formData.image.filter((_, i) => i !== index),
    });
  };

  const handleChange = (id, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };

      if (
        id === "propertyType" &&
        typeof value === "string" &&
        roomTypeOptions[value]
      ) {
        newData.roomType = roomTypeOptions[value][0];
        newData.category = value;
        if (value === "Flat") {
          newData.availableRooms = "";
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);
    setError(false);

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
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const url = isEditing
        ? `/api/user/listings/${editingListing?._id}`
        : "/api/listings/create";
      const method = isEditing ? "PUT" : "POST";

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResponse = {
        success: true,
        message: isEditing
          ? "Listing updated successfully"
          : "Listing created successfully",
        data: {
          ...formData,
          _id: isEditing ? editingListing?._id : "new_listing_123",
          userRef: currentUser?._id,
        },
      };

      console.log("📌 Form Data Submitted:", formData);
      console.log("📌 Full Server Response:", mockResponse);

      setMessage(
        isEditing
          ? "🎉 Listing updated successfully!"
          : "🎉 Listing created successfully!"
      );
      setMessageType("success");

      // Redirect to listings page
      // navigate("/admin/listing");
    } catch (error) {
      console.error("Submission Error:", error);
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setMessageType("error");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "parkingAvailable":
        return <ParkingSquare className="h-4 w-4" />;
      case "kitchen":
        return <ChefHat className="h-4 w-4" />;
      case "housekeeping":
        return <Sparkles className="h-4 w-4" />;
      case "electricityBackup":
        return <Zap className="h-4 w-4" />;
      case "laundryServices":
        return <Shirt className="h-4 w-4" />;
      case "securityGuard":
        return <ShieldCheck className="h-4 w-4" />;
      case "cctv":
        return <Camera className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-3xl font-bold text-white">
            {isEditing
              ? "Edit Property Listing"
              : "Create New Property Listing"}
          </h1>
          <p className="text-blue-100 mt-2">
            Fill in the details below to{" "}
            {isEditing ? "update your" : "create a new"} property listing
          </p>
        </div>

        {message && (
          <div
            className={`mx-6 mt-6 p-4 rounded-lg flex items-center ${
              messageType === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {messageType === "error" ? (
              <AlertCircle className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="p-6">
          <div className="w-full">
            <div className="grid grid-cols-4 mb-8">
              {["details", "property", "contact", "images"].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-b-2 border-transparent hover:border-blue-500"
                  onClick={() =>
                    document
                      .getElementById(tab)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div id="details" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Home className="h-4 w-4" /> Property Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter property name"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Building className="h-4 w-4" /> Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="Describe the property"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" /> Price{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        placeholder="Enter price"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="discountPrice"
                          className="text-sm font-medium"
                        >
                          Discount Price
                        </label>
                        <input
                          id="discountPrice"
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            handleChange("discountPrice", e.target.value)
                          }
                          placeholder="Enter discount"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="securityDeposit"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" /> Security Deposit
                        </label>
                        <input
                          id="securityDeposit"
                          type="number"
                          value={formData.securityDeposit}
                          onChange={(e) =>
                            handleChange("securityDeposit", e.target.value)
                          }
                          placeholder="Enter deposit"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="listingType"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" /> Listing Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="listingType"
                        value={formData.listingType}
                        onChange={(e) =>
                          handleChange("listingType", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Direct Owner">Direct Owner</option>
                        <option value="Broker">Broker</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formData.listingType === "Broker" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                    <h3 className="text-blue-800 font-medium mb-4 flex items-center gap-2">
                      <UserPlus className="h-5 w-5" /> Broker Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="brokerName"
                          className="text-sm font-medium"
                        >
                          Broker Name
                        </label>
                        <input
                          id="brokerName"
                          value={formData.brokerName}
                          onChange={(e) =>
                            handleChange("brokerName", e.target.value)
                          }
                          placeholder="Enter broker name"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brokerContact"
                          className="text-sm font-medium"
                        >
                          Broker Contact
                        </label>
                        <input
                          id="brokerContact"
                          value={formData.brokerContact}
                          onChange={(e) =>
                            handleChange("brokerContact", e.target.value)
                          }
                          placeholder="Enter broker contact"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="brokeragePrice"
                          className="text-sm font-medium"
                        >
                          Brokerage Price
                        </label>
                        <input
                          id="brokeragePrice"
                          type="number"
                          value={formData.brokeragePrice}
                          onChange={(e) =>
                            handleChange("brokeragePrice", e.target.value)
                          }
                          placeholder="Enter brokerage price"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.listingType === "Direct Owner" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
                    <h3 className="text-green-800 font-medium mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" /> Owner Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="ownerName"
                          className="text-sm font-medium"
                        >
                          Owner Name
                        </label>
                        <input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) =>
                            handleChange("ownerName", e.target.value)
                          }
                          placeholder="Enter owner name"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="ownerContact"
                          className="text-sm font-medium"
                        >
                          Owner Contact
                        </label>
                        <input
                          id="ownerContact"
                          value={formData.ownerContact}
                          onChange={(e) =>
                            handleChange("ownerContact", e.target.value)
                          }
                          placeholder="Enter owner contact"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() =>
                      document
                        .getElementById("property")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Next: Property Info
                  </button>
                </div>
              </div>

              <div id="property" className="space-y-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="propertyType"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4" /> Property Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="propertyType"
                        value={formData.propertyType}
                        onChange={(e) =>
                          handleChange("propertyType", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Room">Room</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Flat">Flat</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="roomType"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Bed className="h-4 w-4" /> Room Type
                      </label>
                      <select
                        id="roomType"
                        value={formData.roomType}
                        onChange={(e) =>
                          handleChange("roomType", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roomTypeOptions[formData.propertyType].map(
                          (option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {(formData.propertyType === "Room" ||
                      formData.propertyType === "Hostel") && (
                      <div>
                        <label
                          htmlFor="availableRooms"
                          className="text-sm font-medium"
                        >
                          Available Rooms
                        </label>
                        <input
                          id="availableRooms"
                          type="number"
                          value={formData.availableRooms}
                          onChange={(e) =>
                            handleChange("availableRooms", e.target.value)
                          }
                          placeholder="Enter number of rooms"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="location"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" /> Location{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        placeholder="Enter location"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="phoneNo"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" /> Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneNo"
                        value={formData.phoneNo}
                        onChange={(e) =>
                          handleChange("phoneNo", e.target.value)
                        }
                        placeholder="Enter phone number"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="availability"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" /> Availability
                      </label>
                      <select
                        id="availability"
                        value={formData.availability}
                        onChange={(e) =>
                          handleChange("availability", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="genderPreference"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" /> Gender Preference{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="genderPreference"
                        value={formData.genderPreference}
                        onChange={(e) =>
                          handleChange("genderPreference", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border mt-6">
                  <h3 className="text-gray-800 font-medium mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "parkingAvailable",
                      "kitchen",
                      "housekeeping",
                      "electricityBackup",
                      "laundryServices",
                      "securityGuard",
                      "cctv",
                    ].map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={amenity}
                          checked={formData[amenity]}
                          onChange={(e) =>
                            handleChange(amenity, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={amenity}
                          className="flex items-center gap-2 text-sm"
                        >
                          {getAmenityIcon(amenity)}
                          {amenity.charAt(0).toUpperCase() +
                            amenity
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                              .trim()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() =>
                      document
                        .getElementById("details")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Next: Contact Details
                  </button>
                </div>
              </div>

              <div id="contact" className="space-y-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="phoneNo"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" /> Contact Phone{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneNo"
                        value={formData.phoneNo}
                        onChange={(e) =>
                          handleChange("phoneNo", e.target.value)
                        }
                        placeholder="Enter contact phone number"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This number will be displayed to potential
                        tenants/buyers
                      </p>
                    </div>

                    {formData.listingType === "Direct Owner" && (
                      <div>
                        <label
                          htmlFor="ownerName"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <User className="h-4 w-4" /> Owner Name
                        </label>
                        <input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) =>
                            handleChange("ownerName", e.target.value)
                          }
                          placeholder="Enter owner name"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {formData.listingType === "Broker" && (
                      <div>
                        <label
                          htmlFor="brokerName"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <UserPlus className="h-4 w-4" /> Broker Name
                        </label>
                        <input
                          id="brokerName"
                          value={formData.brokerName}
                          onChange={(e) =>
                            handleChange("brokerName", e.target.value)
                          }
                          placeholder="Enter broker name"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {formData.listingType === "Direct Owner" && (
                      <div>
                        <label
                          htmlFor="ownerContact"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" /> Owner Contact
                        </label>
                        <input
                          id="ownerContact"
                          value={formData.ownerContact}
                          onChange={(e) =>
                            handleChange("ownerContact", e.target.value)
                          }
                          placeholder="Enter owner contact"
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {formData.listingType === "Broker" && (
                      <>
                        <div>
                          <label
                            htmlFor="brokerContact"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4" /> Broker Contact
                          </label>
                          <input
                            id="brokerContact"
                            value={formData.brokerContact}
                            onChange={(e) =>
                              handleChange("brokerContact", e.target.value)
                            }
                            placeholder="Enter broker contact"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="brokeragePrice"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <DollarSign className="h-4 w-4" /> Brokerage Fee
                          </label>
                          <input
                            id="brokeragePrice"
                            type="number"
                            value={formData.brokeragePrice}
                            onChange={(e) =>
                              handleChange("brokeragePrice", e.target.value)
                            }
                            placeholder="Enter brokerage fee"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>
                    Make sure all contact information is accurate and
                    up-to-date. This information will be used by potential
                    tenants/buyers to reach out.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() =>
                      document
                        .getElementById("property")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() =>
                      document
                        .getElementById("images")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Next: Images
                  </button>
                </div>
              </div>

              <div id="images" className="space-y-6 mt-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5" /> Upload Images
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Up to 6 images, required)
                    </span>
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                      type="file"
                      id="images"
                      onChange={(e) => setFiles(e.target.files)}
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleImageSubmit}
                      disabled={uploading || !files || files.length === 0}
                      className={`px-4 py-2 rounded-md ${
                        uploading
                          ? "border border-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        "Upload Images"
                      )}
                    </button>
                  </div>

                  {imageUploadError && (
                    <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg mb-4 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{imageUploadError}</span>
                    </div>
                  )}

                  {formData.image.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {formData.image.map((url, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                          <span className="absolute top-2 left-2 bg-white text-black px-2 py-1 rounded-full text-xs">
                            Image {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-4">
                      <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No images uploaded yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Upload at least one image (required)
                      </p>
                    </div>
                  )}

                  <hr className="my-6" />

                  <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">
                        Image Guidelines
                      </h4>
                      <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                        <li>Upload clear, high-quality images</li>
                        <li>Include images of all rooms and amenities</li>
                        <li>Maximum file size: 2MB per image</li>
                        <li>Supported formats: JPG, PNG</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 min-w-[150px] flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditing ? (
                      "Update Listing"
                    ) : (
                      "Create Listing"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
