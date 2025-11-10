import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManagerPage = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // New state for Add Modal
  const [modifiedRecord, setModifiedRecord] = useState({
    productName: "",
    price: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // For main page errors
  const [editErrorMessage, setEditErrorMessage] = useState(""); // For edit/add modal errors
  const [validationError, setValidationError] = useState(""); // For form validation errors
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(9);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchRecords = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get(`${BASE_URL}/records/records`, {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        setErrorMessage("Invalid data format received.");
      }
    } catch (error) {
      setErrorMessage("Failed to load records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleModifyRecord = (record) => {
    setEditingRecord(record);
    setIsAdding(false);
    setModifiedRecord({
      productName: record.productName || "",
      price: record.price || "",
    });
    setValidationError("");
    setEditErrorMessage("");
  };

  const handleAddRecord = () => {
    setIsAdding(true);
    setEditingRecord(null);
    setModifiedRecord({ productName: "", price: "" });
    setValidationError("");
    setEditErrorMessage("");
  };

  const handleSaveModifiedRecord = async (id) => {
    if (!modifiedRecord.productName || modifiedRecord.price === "") {
      setValidationError("Both fields are required.");
      return;
    }

    setValidationError("");
    setEditErrorMessage("");

    try {
      await axios.put(
        `${BASE_URL}/records/records/${id}`,
        {
          productName: modifiedRecord.productName,
          price: Number(modifiedRecord.price),
        },
        { withCredentials: true }
      );

      await fetchRecords();

      setEditingRecord(null);
      setModifiedRecord({ productName: "", price: "" });
    } catch (error) {
      setEditErrorMessage("Failed to update the record. Please try again.");
    }
  };

  const handleSaveNewRecord = async () => {
    if (!modifiedRecord.productName || modifiedRecord.price === "") {
      setValidationError("Both fields are required.");
      return;
    }

    setValidationError("");
    setEditErrorMessage("");

    try {
      await axios.post(
        `${BASE_URL}/records/records`,
        {
          productName: modifiedRecord.productName,
          price: Number(modifiedRecord.price),
        },
        { withCredentials: true }
      );

      await fetchRecords();

      setIsAdding(false);
      setModifiedRecord({ productName: "", price: "" });
    } catch (error) {
      setEditErrorMessage("Failed to add the record. Please try again.");
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Manager Dashboard</h1>
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

      <main className="flex flex-col items-center justify-center py-8 md:py-12 px-4 md:px-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, Manager! 💼
          </h2>
          <p className="text-gray-600 text-lg">Efficiently manage and view your records</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAddRecord}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 px-8 rounded-2xl shadow-xl transition-all duration-200 flex items-center space-x-3 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span className="text-lg font-semibold">Add New Record</span>
          </button>
        </div>

        {/* Main page errors */}
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

        <div className="w-full max-w-7xl space-y-6 mt-6">
          {currentRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col items-center relative hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ₹{record.price}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 pt-6 text-center leading-tight">{record.productName}</h3>

                  <button
                    onClick={() => handleModifyRecord(record)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105 mt-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Edit Record</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5m8 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No records available</h3>
              <p className="text-gray-500">Click "Add New Record" to get started</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-3 mt-12 max-w-4xl w-full">
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
            <span>First</span>
          </button>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Previous</span>
          </button>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl shadow-lg">
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <span>Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <span>Last</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Edit/Add Modal */}
        {(editingRecord || isAdding) && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-sm w-full max-w-2xl p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isAdding
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isAdding ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    )}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isAdding ? "Add New Record" : "Modify Record"}
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                    placeholder="Enter product name"
                    value={modifiedRecord.productName}
                    onChange={(e) =>
                      setModifiedRecord({
                        ...modifiedRecord,
                        productName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
                    placeholder="Enter price"
                    min={0}
                    value={modifiedRecord.price}
                    onChange={(e) =>
                      setModifiedRecord({
                        ...modifiedRecord,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                {validationError && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <span className="font-medium">{validationError}</span>
                    </div>
                  </div>
                )}
                {editErrorMessage && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800 p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="font-medium">{editErrorMessage}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-center space-x-4 pt-4">
                  {isAdding ? (
                    <button
                      onClick={handleSaveNewRecord}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl w-full max-w-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Add Record</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveModifiedRecord(editingRecord._id)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl w-full max-w-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Save Changes</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingRecord(null);
                      setIsAdding(false);
                      setModifiedRecord({ productName: "", price: "" });
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl w-full max-w-xs transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerPage;
