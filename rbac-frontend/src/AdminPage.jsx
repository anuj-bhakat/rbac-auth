import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editData, setEditData] = useState({ productName: "", price: "" });

  const [newRecord, setNewRecord] = useState({ productName: "", price: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(9);
  const recordCountOptions = [9, 15, 30, 90];

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all records
  const fetchRecords = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await axios.get(`${BASE_URL}/records/records`, {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        setApiError("Invalid data received from server.");
      }
    } catch (error) {
      setApiError("Failed to load records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  // Handle record count change
  const handleRecordsPerPageChange = (newCount) => {
    setRecordsPerPage(newCount);
    setCurrentPage(1); // Reset to first page
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  // Start editing record
  const startEdit = (record) => {
    setEditingRecordId(record._id);
    setEditData({ productName: record.productName, price: record.price });
    setApiError(null);
    setApiSuccess(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingRecordId(null);
    setEditData({ productName: "", price: "" });
  };

  // Save updated record
  const saveEdit = async (id) => {
    if (!editData.productName || editData.price === "") {
      setApiError("Product name and price are required.");
      return;
    }
    setLoading(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      await axios.put(
        `${BASE_URL}/records/records/${id}`,
        {
          productName: editData.productName,
          price: Number(editData.price),
        },
        { withCredentials: true }
      );
      setApiSuccess("Record updated successfully.");
      setEditingRecordId(null);
      setEditData({ productName: "", price: "" });
      await fetchRecords();
    } catch (error) {
      setApiError("Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      await axios.delete(`${BASE_URL}/records/records/${id}`, { withCredentials: true });
      setApiSuccess("Record deleted successfully.");
      await fetchRecords();
    } catch (error) {
      setApiError("Failed to delete record.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new record
  const addNewRecord = async () => {
    if (!newRecord.productName || newRecord.price === "") {
      setApiError("Product name and price are required.");
      setApiSuccess(null);
      return;
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      await axios.post(
        `${BASE_URL}/records/records`,
        {
          productName: newRecord.productName,
          price: Number(newRecord.price),
        },
        { withCredentials: true }
      );
      setApiSuccess("Record added successfully.");
      setNewRecord({ productName: "", price: "" });
      await fetchRecords();
      setCurrentPage(Math.ceil((records.length + 1) / recordsPerPage));
    } catch (error) {
      setApiError("Failed to add new record.");
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const changePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
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

      <main className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-4 px-4 md:px-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome, Admin! 👋
          </h2>
          <p className="text-gray-600">Manage your records efficiently</p>
        </div>

        {/* Add New Record Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Add New Record</h3>
            </div>
            
            {/* Records per page selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                value={recordsPerPage}
                onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                disabled={loading}
              >
                {recordCountOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">records per page</span>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm text-sm"
                value={newRecord.productName}
                onChange={(e) =>
                  setNewRecord((prev) => ({ ...prev, productName: e.target.value }))
                }
                disabled={loading}
              />
            </div>
            <div className="w-32">
              <input
                type="number"
                placeholder="Price"
                min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 backdrop-blur-sm text-sm"
                value={newRecord.price}
                onChange={(e) =>
                  setNewRecord((prev) => ({ ...prev, price: e.target.value }))
                }
                disabled={loading}
              />
            </div>
            <button
              onClick={addNewRecord}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>{loading ? "Adding..." : "Add Record"}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading records...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 p-4 rounded-xl w-full text-center backdrop-blur-sm shadow-md max-w-4xl">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium text-sm">{apiError}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {apiSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-4 rounded-xl w-full text-center backdrop-blur-sm shadow-md max-w-4xl">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium text-sm">{apiSuccess}</span>
            </div>
          </div>
        )}

        {/* Records Cards */}
        {records.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5m8 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No records available</h3>
            <p className="text-gray-500 text-sm">Start by adding your first record using the form above</p>
          </div>
        ) : (
          <div className="w-full max-w-7xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 flex flex-col items-center relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={{ minHeight: "180px" }}
                >
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ₹{record.price}
                  </span>
                  
                  {editingRecordId === record._id ? (
                    <div className="w-full space-y-3 pt-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                        value={editData.productName}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, productName: e.target.value }))
                        }
                        placeholder="Product Name"
                        disabled={loading}
                      />
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-sm"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, price: e.target.value }))
                        }
                        placeholder="Price"
                        min={0}
                        disabled={loading}
                      />
                      <div className="flex justify-center space-x-2 mt-4">
                        <button
                          onClick={() => saveEdit(record._id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-md text-sm font-medium"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm font-medium"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pt-4 text-center leading-tight">{record.productName}</h3>
                      
                      <div className="mt-auto flex justify-center space-x-2 w-full">
                        <button
                          onClick={() => startEdit(record)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg text-sm font-medium"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteRecord(record._id)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg text-sm font-medium"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                  
                  <div className="w-10 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-3"></div>
                </div>
              ))}
            </div>
            
            {/* Records info */}
            {records.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 text-center">
                <p className="text-sm text-gray-600">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, records.length)} of {records.length} records
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8 w-full max-w-4xl">
            <button
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 shadow-md text-sm"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
              </svg>
              <span>First</span>
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 shadow-md text-sm"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Prev</span>
            </button>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg shadow-md">
              <span className="font-semibold text-sm">
                {currentPage} / {totalPages}
              </span>
            </div>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 shadow-md text-sm"
            >
              <span>Next</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-1 shadow-md text-sm"
            >
              <span>Last</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
