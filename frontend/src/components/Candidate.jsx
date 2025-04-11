import React, { useState, useEffect } from "react";
import axios from "axios";

const Candidate = () => {
  const [items, setItems] = useState([]);
  const [inputValues, setInputValues] = useState({ name: "", cv: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("TOKEN");

  // Fetch initial CVs from the backend
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        const response = await axios.get(
          "http://localhost:5000/recruiter/viewAllCV",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Map backend data to frontend format
        const fetchedItems = response.data.data.map((app) => ({
          _id: app._id, // Keep _id for backend actions
          name: app.applicant_id?.userName || "N/A",
          cv: app.cv,
          status: app.status === "accepted"
            ? "Đã chấp nhận"
            : app.status === "rejected"
            ? "Đã từ chối"
            : "Chưa xem",
        }));
        setItems(fetchedItems);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra khi tải danh sách CV!"
        );
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const addItem = () => {
    if (inputValues.name.trim() !== "" && inputValues.cv.trim() !== "") {
      setItems([...items, { ...inputValues, status: "Chưa xem" }]);
      setInputValues({ name: "", cv: "" });
    }
  };

  const removeItem = async (index) => {
    const item = items[index];
    if (item._id) {
      // API-fetched item, call deleteApplication
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        await axios.delete(
          `http://localhost:5000/recruiter/deleteApplication/${item._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(items.filter((_, i) => i !== index));
        alert("Đơn ứng tuyển đã được xóa!");
      } catch (error) {
        alert(
          error.response?.data?.message || "Có lỗi xảy ra khi xóa đơn ứng tuyển!"
        );
      }
    } else {
      // Locally added item, remove locally
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleStatusChange = async (index, newStatus) => {
    const item = items[index];
    const updatedItems = [...items];
    
    if (item._id) {
      // API-fetched item, call backend endpoint
      try {
        if (!token) {
          throw new Error("Vui lòng đăng nhập lại!");
        }
        const endpoint =
          newStatus === "Đồng ý"
            ? `/recruiter/acceptApplication/${item._id}`
            : `/recruiter/rejectApplication/${item._id}`;
        const backendStatus = newStatus === "Đồng ý" ? "accepted" : "rejected";
        await axios.post(
          `http://localhost:5000${endpoint}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updatedItems[index].status = newStatus === "Đồng ý" ? "Đã chấp nhận" : "Đã từ chối";
        setItems(updatedItems);
        alert(`Ứng viên đã được ${newStatus === "Đồng ý" ? "chấp nhận" : "từ chối"}!`);
      } catch (error) {
        alert(
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!"
        );
      }
    } else {
      // Locally added item, update locally
      updatedItems[index].status = newStatus;
      setItems(updatedItems);
    }
  };

  const handleViewCV = (index, cv) => {
    setSelectedCV(cv);
    setSelectedIndex(index);
    setIsModalOpen(true);
    // Update status to "Đã xem" only for local items or if not yet accepted/rejected
    const updatedItems = [...items];
    if (updatedItems[index].status === "Chưa xem") {
      updatedItems[index].status = "Đã xem";
      setItems(updatedItems);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCV(null);
    setSelectedIndex(null);
  };

  const columns = [
    { label: "Tên người ứng tuyển", key: "name" },
    { label: "CV người ứng tuyển", key: "cv" },
    { label: "Trạng thái", key: "status" },
    { label: "Quyết định", key: "action" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100  shadow-md rounded-lg p-8 w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Danh Sách</h1>
        {/* <div className="grid grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            name="name"
            value={inputValues.name}
            onChange={handleChange}
            placeholder="Tên người ứng tuyển"
            className="border border-gray-300 rounded-lg px-6 py-3 w-full text-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            name="cv"
            value={inputValues.cv}
            onChange={handleChange}
            placeholder="Link file CV"
            className="border border-gray-300 rounded-lg px-6 py-3 w-full text-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          onClick={addItem}
          className="mb-6 w-full bg-blue-600 text-white rounded-lg px-6 py-3 text-xl hover:bg-blue-700 transition"
        >
          Thêm Mục
        </button> */}
        {loading ? (
          <p className="text-center text-lg">Đang tải...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <table className="table-auto w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="border border-gray-300 px-8 py-4 text-lg"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="border border-gray-300 px-8 py-4 text-lg">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item._id || index} // Use _id for API items, index for local
                  className="odd:bg-gray-100 even:bg-white"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="border border-gray-300 px-8 py-4 text-lg"
                    >
                      {column.key === "cv" ? (
                        <button
                          onClick={() => handleViewCV(index, item.cv)}
                          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                          disabled={!item.cv}
                        >
                          Xem CV
                        </button>
                      ) : column.key === "action" ? (
                        item.status !== "Đã chấp nhận" &&
                        item.status !== "Đã từ chối" ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(index, "Đồng ý")}
                              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 ml-4"
                            >
                              Đồng ý
                            </button>
                            <button
                              onClick={() => handleStatusChange(index, "Từ chối")}
                              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 ml-4"
                            >
                              Từ chối
                            </button>
                          </>
                        ) : null
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-8 py-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal to view CV */}
      {isModalOpen && selectedCV && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-3xl max-h-full overflow-auto">
            <button
              onClick={closeModal}
              className="text-red-600 font-bold text-xl mb-6 inline-block"
            >
              Đóng
            </button>
            <div>
              {selectedCV.endsWith(".pdf") ? (
                <iframe
                  src={selectedCV}
                  title="CV"
                  className="w-full h-[500px]"
                />
              ) : (
                <img src={selectedCV} alt="CV" className="w-full h-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidate;