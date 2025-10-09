import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeePage = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newRecord, setNewRecord] = useState({
    productName: "",
    price: "",
  });
  const [activeTab, setActiveTab] = useState("view");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const RECORDS_PER_PAGE = 9;

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleAPI = (endpoint) => {
    setLoading(true);
    axios
      .get(endpoint, { withCredentials: true })
      .then((response) => {
        setRecords(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateRecord = () => {
    if (!newRecord.productName || !newRecord.price) {
      setErrorMessage("Both fields are required!");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    axios
      .post(`${BASE_URL}/records/records`, newRecord, { withCredentials: true })
      .then((response) => {
        setRecords([...records, response.data]);
        setNewRecord({ productName: "", price: "" });
        setSuccessMessage("Record added successfully!");
        setTimeout(() => setSuccessMessage(""), 2500);
      })
      .catch((error) => {
        console.log("Error creating record:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Pagination Logic
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginatedRecords = () => {
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    const endIndex = startIndex + RECORDS_PER_PAGE;
    return records.slice(startIndex, endIndex);
  };

  useEffect(() => {
    handleAPI(`${BASE_URL}/records/records`);
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </nav>

      <main className="flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, Employee!</h2>

        {/* Tabs for Switching Views */}
        <div className="w-full max-w-md flex border-b-2 border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 py-2 text-center font-semibold ${activeTab === "view" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600"}`}
          >
            View All Records
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-2 text-center font-semibold ${activeTab === "add" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600"}`}
          >
            Add New Record
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "view" && (
          <div className="w-full max-w-4xl space-y-6">
            {/* View Records Section */}
            <button
              onClick={() => handleAPI(`${BASE_URL}/records/records`)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
            >
              Refresh Records
            </button>

            {/* Render Paginated Records as Cards */}
            {records.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPaginatedRecords().map((record) => (
                  <div
                    key={record._id}
                    className="bg-blue-50 shadow-lg rounded-lg p-6 flex flex-col items-center relative"
                    style={{ minHeight: "150px", height: "auto" }}
                  >
                    <span className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      ₹{record.price}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-4">{record.productName}</h3>
                  </div>
                ))}
              </div>
            )}

            {records.length === 0 && (
              <p className="text-gray-500 text-center">No records available. Please try again later.</p>
            )}

            {/* Pagination Controls */}
            {records.length > RECORDS_PER_PAGE && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handlePrevPage}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-lg text-gray-600 self-center">{`Page ${currentPage}`}</span>
                <button
                  onClick={handleNextPage}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md"
                  disabled={currentPage * RECORDS_PER_PAGE >= records.length}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="w-full max-w-md p-6 mb-4">
            {/* Create New Record Form */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Record</h3>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Product Name"
                value={newRecord.productName}
                onChange={(e) => setNewRecord({ ...newRecord, productName: e.target.value })}
              />
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Price"
                value={newRecord.price}
                onChange={(e) => setNewRecord({ ...newRecord, price: e.target.value })}
              />
              <button
                onClick={handleCreateRecord}
                className="bg-blue-600 text-white py-2 px-4 rounded-md w-full"
              >
                {loading ? "Creating..." : "Create Record"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePage;
