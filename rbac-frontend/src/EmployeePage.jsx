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
  const [showAddForm, setShowAddForm] = useState(false);
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
        setNewRecord({ productName: "", price: "" });
        setSuccessMessage("Record added successfully!");
        setShowAddForm(false);
        // Auto fetch records after adding
        handleAPI(`${BASE_URL}/records/records`);
        setTimeout(() => setSuccessMessage(""), 2500);
      })
      .catch((error) => {
        console.log("Error creating record:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddRecordClick = () => {
    setShowAddForm(!showAddForm);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <nav className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Employee Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome, Employee! 👨‍💼
          </h2>
          <p className="text-gray-600 text-lg">View and manage your records efficiently</p>
        </div>

        {/* Add Record Button */}
        <div className="w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <button
              onClick={handleAddRecordClick}
              className="w-full py-4 px-6 text-center font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>{showAddForm ? 'Hide Add Form' : 'Add New Record'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Add Record Form */}
        {showAddForm && (
          <div className="w-full max-w-2xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Create New Record</h3>
              </div>
              <div className="space-y-6">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                  placeholder="Product Name"
                  value={newRecord.productName}
                  onChange={(e) => setNewRecord({ ...newRecord, productName: e.target.value })}
                  disabled={loading}
                />
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                  placeholder="Price"
                  value={newRecord.price}
                  onChange={(e) => setNewRecord({ ...newRecord, price: e.target.value })}
                  disabled={loading}
                />
                <button
                  onClick={handleCreateRecord}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl w-full transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <span>Create Record</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-6 rounded-2xl w-full text-center backdrop-blur-sm shadow-lg max-w-4xl">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 p-6 rounded-2xl w-full text-center backdrop-blur-sm shadow-lg max-w-4xl">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Records Section */}
        <div className="w-full max-w-6xl space-y-6">

          {/* Render Paginated Records as Cards */}
          {records.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {getPaginatedRecords().map((record) => (
                <div
                  key={record._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col items-center relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={{ minHeight: "160px" }}
                >
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ₹{record.price}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-6 text-center leading-tight">{record.productName}</h3>
                  <div className="mt-auto">
                    <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {records.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5m8 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No records available</h3>
              <p className="text-gray-500">Click refresh to load records or add new ones</p>
            </div>
          )}

          {/* Pagination Controls */}
          {records.length > RECORDS_PER_PAGE && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={handlePrevPage}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                disabled={currentPage === 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Previous</span>
              </button>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl shadow-lg">
                <span className="font-semibold">{`Page ${currentPage}`}</span>
              </div>
              <button
                onClick={handleNextPage}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                disabled={currentPage * RECORDS_PER_PAGE >= records.length}
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeePage;
