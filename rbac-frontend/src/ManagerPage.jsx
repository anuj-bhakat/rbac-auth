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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 md:px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manager Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </nav>

      <main className="flex flex-col items-center justify-center py-8 md:py-12 px-4 md:px-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, Manager!</h2>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleAddRecord}
            className="bg-indigo-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 transition"
          >
            Add New Record
          </button>
        </div>

        {/* Main page errors */}
        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        <div className="w-full max-w-6xl space-y-6 mt-6">
          {currentRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-blue-50 shadow-lg rounded-lg p-6 flex flex-col items-center relative transform transition-transform duration-300 hover:scale-105"
                >
                  <span className="absolute top-2 right-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm">
                    ₹{record.price}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-4">{record.productName}</h3>

                  <button
                    onClick={() => handleModifyRecord(record)}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-md"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No records available.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-blue-600 text-white py-2 px-6 rounded-md disabled:opacity-50"
          >
            Last
          </button>
        </div>

        {/* Edit/Add Modal */}
        {(editingRecord || isAdding) && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {isAdding ? "Add New Record" : "Modify Record"}
              </h3>
              <div className="space-y-6">
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-md"
                  placeholder="Product Name"
                  value={modifiedRecord.productName}
                  onChange={(e) =>
                    setModifiedRecord({
                      ...modifiedRecord,
                      productName: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  className="w-full p-4 border border-gray-300 rounded-md"
                  placeholder="Price"
                  min={0}
                  value={modifiedRecord.price}
                  onChange={(e) =>
                    setModifiedRecord({
                      ...modifiedRecord,
                      price: e.target.value,
                    })
                  }
                />
                {validationError && (
                  <div className="bg-yellow-200 text-yellow-800 p-4 rounded-lg mb-4">
                    {validationError}
                  </div>
                )}
                {editErrorMessage && (
                  <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-4">
                    {editErrorMessage}
                  </div>
                )}
                <div className="flex justify-between space-x-4">
                  {isAdding ? (
                    <button
                      onClick={handleSaveNewRecord}
                      className="bg-green-600 text-white py-3 px-6 rounded-md w-full"
                    >
                      Add Record
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveModifiedRecord(editingRecord._id)}
                      className="bg-blue-600 text-white py-3 px-6 rounded-md w-full"
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingRecord(null);
                      setIsAdding(false);
                      setModifiedRecord({ productName: "", price: "" });
                    }}
                    className="bg-gray-600 text-white py-3 px-6 rounded-md w-full"
                  >
                    Cancel
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
