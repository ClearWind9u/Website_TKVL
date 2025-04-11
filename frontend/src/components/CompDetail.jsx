import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SingleJob } from "./JobHome";
import logo1 from "/company/vnglogo.png";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocateOutline, IoLocationOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { PiListMagnifyingGlassLight } from "react-icons/pi";
import { GrLocationPin, GrStatusGood } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiGridAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import axios from "axios";

const CompDetail = () => {
  const [isReportOpen, setIsReportOpen] = useState(false); // Trạng thái mở/đóng modal báo cáo
  const [selectedReason, setSelectedReason] = useState(""); // Lý do báo cáo
  const [otherReason, setOtherReason] = useState(""); // Ghi chú cho lý do "Khác"
  const [evidence, setEvidence] = useState(null); // File minh chứng
  const { id } = useParams(); // Lấy id từ URL
  const [jobDetail, setJobDetail] = useState(null);
  const [jobRandom, setJobRamdom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false); // Trạng thái mở/đóng modal chọn CV
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cvList, setCVList] = useState([]); // Danh sách CV của người dùng
  const [selectedCVId, setSelectedCVId] = useState(null); // ID của CV được chọn
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    postId: "",
    title: "",
    content: "",
    salary: "",
    address: "",
    category: [],
  });
  const handleReportClick = () => {
    setIsReportOpen(true); // Mở modal báo cáo
  };

  const handleCloseModal = () => {
    setIsReportOpen(false); // Đóng modal báo cáo
    setSelectedReason("");
    setEvidence("");
  };

  const handleSubmitReport = () => {
    alert(`Đã báo cáo thành công!`);
    setIsReportOpen(false);
  };
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response1 = await axios.get(userInfo?.role === 'jobseeker' ?
          `http://localhost:5000/jobseeker/viewPost/${id}` : `http://localhost:5000/recruiter/viewPost/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobDetail(response1.data);
        const response2 = await axios.get(
          userInfo.role === "jobseeker"
            ? "http://localhost:5000/jobseeker/viewAllPosts"
            : "http://localhost:5000/recruiter/viewAllPosts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allJobs = Array.isArray(response2.data.data) ? response2.data.data : [];

        // Chọn ngẫu nhiên 7 công việc
        const randomJobs = allJobs.sort(() => Math.random() - 0.5).slice(0, 7);

        setJobRamdom(randomJobs);
        if (userInfo?.role === "jobseeker") {
          const cvResponse = await axios.get(
            "http://localhost:5000/jobseeker/getAllCV",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCVList(cvResponse.data.data || []); // Use data field from response
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id, userInfo?.role, token]);

  useEffect(() => {
    console.log("Job Detail:", jobDetail);
  }, [jobDetail]);

  const handleApplyClick = () => {
    setIsCVModalOpen(true);
  };

  const handleSubmitCV = async () => {
    if (!selectedCV) {
      alert("Vui lòng chọn một CV để nộp.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("job_id", id);
      formData.append("job_name", jobDetail.post.title);
      formData.append("cv", selectedCV); // URL or File object

      const response = await axios.post(
        "http://localhost:5000/jobseeker/applyForJob",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        alert("Nộp CV thành công!");
        setIsCVModalOpen(false);
        setSelectedCV(null);
      } else {
        alert(`Lỗi: ${response.data.message}`);
      }
    } catch (err) {
      alert(`Lỗi khi nộp CV: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCloseCVModal = () => {
    setIsCVModalOpen(false);
    setSelectedCVId(null);
  };
  const handleEditClick = (post) => {
    setFormData({
      postId: post._id,
      title: post.title,
      content: post.content,
      salary: post.salary,
      address: post.address,
      category: post.category || [],
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/recruiter/editPost",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Bài đăng đã được cập nhật thành công!");
      setIsEditModalOpen(false);
      navigate("/recruiter"); // Or refresh the current page
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category" ? value.split(",") : value,
    }));
  };

  const handleDeleteClick = async (postId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa mục này?");

    if (confirmDelete) {
      try {
        const response = await axios.post(
          `http://localhost:5000/recruiter/deletePost`,
          { postId },
          { headers: { Authorization: `Bearer ${token}` }, });

        alert("Mục đã được xóa thành công!");
        navigate("/recruiter");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
        alert(errorMessage);
      }
    }
  };

  const handleViewCandidatesClick = async () => {
    if (!id) {
      alert("ID của bài viết không tồn tại!");
      return;
    }
    setIsApplicationsModalOpen(true);
    setLoadingApplications(true);
    setApplicationsError(null);
    try {
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại!");
      }
      const response = await axios.get(
        `http://localhost:5000/recruiter/viewAllJobAppicationsByPostId/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(response.data.data);
      setLoadingApplications(false);
    } catch (error) {
      console.log(error);
      setApplicationsError(
        error.response?.data?.message || "Có lỗi xảy ra khi tải danh sách ứng viên!"
      );
      setLoadingApplications(false);
    }
  };

  const handleCloseApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
    setApplications([]);
    setApplicationsError(null);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  const description = jobDetail.post?.content || "";
  const request = jobDetail.post?.category[2] || "";
  const benefit = "";

  const splitTextToSentences = (text) => {
    return text
      .split(".")
      .map((sentence, index) => sentence.trim())
      .filter((sentence) => sentence !== "");
  };

  const descriptionSentences = splitTextToSentences(description);
  const requestSentences = splitTextToSentences(request);
  const benefitSentences = splitTextToSentences(benefit);

  return (
    <div className="w-[90%] m-auto mb-[30px] ">
      <div className="TitleJobsection text-[30px] flex mt-5 justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Chi tiết công việc</h1>
      </div>
      <div className="flex gap-[1.5rem] justify-around m-auto">
        <div className="jobContainer flex flex-wrap gap-[20px] items-center w-[40%] ">
          {jobRandom.map((job) => (
            <SingleJob
              key={job._id}
              id={job._id}
              title={job.title}
              content={job.content}
              salary={job.salary}
              address={job.address}
              category={job.category}
              user_id={job.user_id}
              companyName={job.companyName}
            />
          ))}
        </div>

        <div className="infoDetail flex-column flex-1 gap-10 justify-center flex-wrap items-center py-5 border-2 border-black p-4 rounded-[20px]">
          <div className="JobTitleBox text-[30px] flex justify-between items-center ml-4 font-bold">
            {jobDetail.post.title}
          </div>

          <div className="ChecklistBox mt-4">
            <div className="flex gap-20 items-center justify-center p-4">
              {/* Mức lương */}
              <div className="flex items-center gap-4">
                <RiMoneyDollarCircleLine className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Mức lương:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.post.salary}
                  </span>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="flex items-center gap-4">
                <IoLocationOutline className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Địa điểm:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.post.address}
                  </span>
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div className="flex items-center gap-4">
                <GiSandsOfTime className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Kinh nghiệm:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.post.category[3]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="ButtonDiv flex gap-5 m-4">
            {userInfo?.role === "jobseeker" ? (
              <>
                {/* Existing jobseeker buttons */}
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-[20px] hover:bg-blue-700 w-2/3"
                  onClick={handleApplyClick}
                >
                  <span className="block transition-transform duration-150 hover:scale-110">
                    Ứng tuyển ngay
                  </span>
                </button>
                <button className="border-2 border-black py-2 px-4 rounded-[20px] hover:text-white hover:bg-black w-1/3">
                  <span className="block transition-transform duration-150 hover:scale-110">
                    Yêu thích
                  </span>
                </button>
              </>
            ) : userInfo?.role === "recruiter" ? (
              <>
                {/* Sửa button */}
                <button
                  className="bg-yellow-500 text-white py-2 px-10 rounded-[20px] hover:bg-yellow-600"
                  onClick={() => handleEditClick(jobDetail.post)}
                >
                  Sửa
                </button>

                {/* Xóa button */}
                <button
                  onClick={() => handleDeleteClick(jobDetail.post._id)}
                  className="bg-red-500 text-white py-2 px-10 rounded-[20px] hover:bg-red-600"
                >
                  Xóa
                </button>

                {/* Danh sách ứng viên button */}
                <button
                  className="bg-green-500 text-white py-2 px-10 rounded-[20px] hover:bg-green-600"
                  onClick={handleViewCandidatesClick}
                >
                  Danh sách ứng viên
                </button>
              </>
            ) : null}
          </div>

          {/* CV Modal for Jobseekers */}
          {isCVModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] md:w-[500px] p-6 rounded-[20px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Chọn CV để nộp</h2>
                {cvList.length === 0 ? (
                  <p className="text-center">Bạn chưa có CV nào.</p>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {cvList.map((cv) => (
                      <div
                        key={cv._id}
                        className="p-2 mb-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedCV(cv.url)} // Assuming CV has a url field
                      >
                        <p>{cv.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Hoặc tải lên CV mới:</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => setSelectedCV(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseCVModal}
                  >
                    Hủy
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSubmitCV}
                  >
                    Nộp CV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] md:w-[600px] p-6 rounded-[20px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bài đăng</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nhập tiêu đề"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Mô tả công việc</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                    placeholder="Nhập mô tả công việc"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Mức lương</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nhập mức lương"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Địa điểm</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nhập địa điểm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Danh mục</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category.join(",")}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nhập danh mục, cách nhau bằng dấu phẩy"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseEditModal}
                  >
                    Hủy
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleEditSubmit}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
          {isApplicationsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] md:w-[700px] p-6 rounded-[20px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Danh sách ứng viên</h2>
                {loadingApplications ? (
                  <p className="text-center">Đang tải...</p>
                ) : applicationsError ? (
                  <p className="text-red-500 text-center">{applicationsError}</p>
                ) : applications.length === 0 ? (
                  <p className="text-center">Chưa có ứng viên nào cho bài đăng này.</p>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-4 mb-2 border border-gray-300 rounded-[10px]"
                      >
                        <p><strong>Tên ứng viên:</strong> {app.user_id?.name || "N/A"}</p>
                        <p><strong>Email:</strong> {app.user_id?.email || "N/A"}</p>
                        <p>
                          <strong>CV:</strong>{" "}
                          {app.cv_url ? (
                            <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Xem CV
                            </a>
                          ) : (
                            "Không có CV"
                          )}
                        </p>
                        <p>
                          <strong>Ngày ứng tuyển:</strong>{" "}
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseApplicationsModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="Chitiettuyendung text-xl font-bold flex justify-between items-center ml-4 mt-5">
            Chi tiết tuyển dụng
          </div>

          <div className="DescDiv flex flex-col gap-4 p-4">
            {/* Tiêu đề "Mô tả công việc" */}
            <div className="flex items-center text-xl ml-4 font-bold">
              <SlNote className="ml-2 text-gray-500 text-lg mr-2" />
              <span>Mô tả công việc</span>
            </div>

            {/* Nội dung bullet list */}
            <div className="flex-col gap-1 ml-10">
              {descriptionSentences.map((sentence, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-xl font-bold text-black mr-2">•</span>
                  <span>{sentence}</span>
                </div>
              ))}
              <div className="flex flex-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{jobDetail.post.category[4]}</span>
              </div>
              <div className="flex flex-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{jobDetail.post.category[5]}</span>
              </div>
            </div>
          </div>

          <div className="RequireDiv flex flex-col gap-4 p-4">
            {/* Tiêu đề*/}
            <div className="flex items-center text-xl ml-4 font-bold">
              <PiListMagnifyingGlassLight className="ml-2 text-gray-800 text-xl mr-2" />
              <span>Lĩnh vực</span>
            </div>

            {/* Nội dung bullet list */}
            <div className="flex-col gap-1 ml-10">
              <div className="flex flex-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{jobDetail.post.category[2]}</span>
              </div>
            </div>
          </div>

          <div className="InterestDiv flex flex-col gap-4 p-4">
            {/* Tiêu đề */}
            <div className="flex items-center text-xl ml-4 font-bold">
              <GrStatusGood className="ml-2 text-gray-500 text-l mr-2" />
              <span>Quyền lợi</span>
            </div>

            {/* Nội dung bullet list */}
            <div className="flex-col gap-1 ml-10">
              {benefitSentences.map((sentence, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-xl font-bold text-black mr-2">•</span>
                  <span>{sentence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-[10px] border-[2px] border-black rounded-[20px] h-fit ">
          <div className="w-[100px] h-[100px] mx-auto rounded-full border border-black flex items-center justify-center">
            <img
              src="https://picsum.photos/200/300"
              alt="Company Logo"
              className="w-[100%] h-[100%] object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold mt-4">
            {jobDetail.post.companyName}
          </h2>
          <div className="text-left mt-6">
            <div className="flex items-center gap-2 mb-3">
              <BiGridAlt className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Lĩnh vực:{" "}
                <span className="font-medium">Công nghệ thông tin</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Quy mô: <span className="font-medium">1000 nhân viên</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <IoLocationOutline className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Địa điểm:{" "}
                <span className="font-medium">268 Lý Thường Kiệt Quận 10</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompDetail;