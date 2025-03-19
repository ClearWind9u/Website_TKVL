import React, { useState } from "react";

const Candidate = () => {
  const [items, setItems] = useState([
    { name: "Người A", cv: "/path/to/image1.jpg", status: "Chưa xem" },
    { name: "Người B", cv: "/path/to/image2.jpg", status: "Chưa xem" },
    { name: "Người C", cv: "/path/to/image3.jpg", status: "Chưa xem" },
  ]);
  
  const [inputValues, setInputValues] = useState({ name: "", cv: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Track the index of the selected CV

  const addItem = () => {
    if (inputValues.name.trim() !== "" && inputValues.cv.trim() !== "") {
      setItems([...items, { ...inputValues, status: "Chưa xem" }]);
      setInputValues({ name: "", cv: "" }); // Reset the form input
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedItems = [...items];
    updatedItems[index].status = newStatus;
    setItems(updatedItems);
  };

  const handleViewCV = (index, cv) => {
    setSelectedCV(cv); // Set the selected CV file/path
    setSelectedIndex(index); // Track the index of the selected CV
    setIsModalOpen(true); // Open the modal to view CV
    // Change the status to "Đã xem" when the CV is viewed
    const updatedItems = [...items];
    updatedItems[index].status = "Đã xem";
    setItems(updatedItems);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedCV(null); // Clear the selected CV
    setSelectedIndex(null); // Reset the selected index
  };

  // Define the column names and their corresponding properties
  const columns = [
    { label: "Tên người ứng tuyển", key: "name" },
    { label: "CV người ứng tuyển", key: "cv" },
    { label: "Trạng thái", key: "status" },
    { label: "Quyết định", key: "action" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Danh Sách</h1>
        <div className="grid grid-cols-2 gap-6 mb-6">
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
        </button>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="border border-gray-300 px-8 py-4 text-lg">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100 even:bg-white">
                {columns.map((column) => (
                  <td key={column.key} className="border border-gray-300 px-8 py-4 text-lg">
                    {column.key === "cv" ? (
                      <button
                        onClick={() => handleViewCV(index, item.cv)}
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                      >
                        Xem CV
                      </button>
                    ) : column.key === "action" ? (
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
      </div>

      {/* Modal to view CV */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-3xl max-h-full overflow-auto">
            <button
              onClick={closeModal}
              className="text-red-600 font-bold text-xl mb-6 inline-block"
            >
              Đóng
            </button>
            <div>
              <img src={selectedCV} alt="CV" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidate;
