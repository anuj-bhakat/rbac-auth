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
  const recordsPerPage = 9;

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
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-600 text-white p-4 md:px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </nav>

      <main className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-8 px-4 md:px-6 space-y-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, Admin!</h2>

        {/* Add New Record Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Record</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input
              type="text"
              placeholder="Product Name"
              className="flex-1 border border-gray-300 rounded-md p-2"
              value={newRecord.productName}
              onChange={(e) =>
                setNewRecord((prev) => ({ ...prev, productName: e.target.value }))
              }
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Price"
              min={0}
              className="w-32 border border-gray-300 rounded-md p-2"
              value={newRecord.price}
              onChange={(e) =>
                setNewRecord((prev) => ({ ...prev, price: e.target.value }))
              }
              disabled={loading}
            />
            <button
              onClick={addNewRecord}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              Add
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-700 font-semibold">Loading...</div>
        )}

        {apiError && (
          <div className="bg-red-200 text-red-800 p-4 rounded-lg w-full text-center mb-4 max-w-4xl">
            {apiError}
          </div>
        )}

        {apiSuccess && (
          <div className="bg-green-200 text-green-800 p-4 rounded-lg w-full text-center mb-4 max-w-4xl">
            {apiSuccess}
          </div>
        )}

        {/* Records Grid */}
        {records.length === 0 && !loading && (
          <p className="text-gray-500 text-center">No records available.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {currentRecords.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col"
            >
              {editingRecordId === record._id ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 mb-3"
                    value={editData.productName}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, productName: e.target.value }))
                    }
                    placeholder="Product Name"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md p-2 mb-3"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="Price"
                    min={0}
                    disabled={loading}
                  />

                  <div className="flex space-x-3">
                    <button
                      onClick={() => saveEdit(record._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex-1"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{record.productName}</h3>
                  <p className="text-blue-700 font-semibold text-xl mb-4">₹{record.price}</p>
                  <div className="mt-auto flex space-x-3">
                    <button
                      onClick={() => startEdit(record)}
                      className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex-1 cursor-pointer"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRecord(record._id)}
                      className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex-1 cursor-pointer"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8 w-full max-w-6xl">
            <button
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
              className="bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-800 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              Last
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
