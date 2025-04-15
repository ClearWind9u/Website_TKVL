import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SingleJob } from "./JobHome";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { PiListMagnifyingGlassLight } from "react-icons/pi";
import { GrStatusGood } from "react-icons/gr";
import { BiGridAlt } from "react-icons/bi";
import { FaUsers, FaFlag } from "react-icons/fa";
import axios from "axios";

const CompDetail = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [evidence, setEvidence] = useState(null);
  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState(null);
  const [jobRandom, setJobRandom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cvList, setCVList] = useState([]);
  const [selectedCVId, setSelectedCVId] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSubmittingCV, setIsSubmittingCV] = useState(false); // New loading state for CV submission
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
  const API_URL = 'https://it-job-search-be.vercel.app';

  useEffect(() => {
    const fetchJobDetailAndStatus = async () => {
      try {
        // Fetch job details
        const response1 = await axios.get(
          userInfo?.role === "jobseeker"
            ? `${API_URL}/jobseeker/viewPost/${id}`
            : `${API_URL}/recruiter/viewPost/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJobDetail(response1.data);

        // Fetch random jobs
        const response2 = await axios.get(
          userInfo.role === "jobseeker"
            ? `${API_URL}/jobseeker/viewAllPosts`
            : `${API_URL}/recruiter/viewAllPosts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allJobs = Array.isArray(response2.data.data) ? response2.data.data : [];
        const randomJobs = allJobs.sort(() => Math.random() - 0.5).slice(0, 7);
        setJobRandom(randomJobs);

        // Check if jobseeker has applied (only for jobseekers)
        if (userInfo?.role === "jobseeker" && userInfo?._id) {
          try {
            const applyResponse = await axios.get(
              `${API_URL}/jobseeker/checkApplication/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setHasApplied(applyResponse.data.hasApplied || false);
          } catch (applyError) {
            console.error("Check Application Error:", applyError.response?.data || applyError.message);
            setHasApplied(false);
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Truy cập dữ liệu thất bại!");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetailAndStatus();
  }, [id, userInfo?.role, userInfo?._id, token]);

  useEffect(() => {
    if (userInfo?.role !== "jobseeker") return;

    const fetchCVList = async () => {
      try {
        const cvResponse = await axios.get(
          `${API_URL}/jobseeker/getAllCV`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cvData = cvResponse.data.data || [];
        setCVList(cvData);
      } catch (cvErr) {
        console.error("CV Fetch Error:", cvErr.response?.data || cvErr.message);
      }
    };
    fetchCVList();
  }, [userInfo?.role, token]);

  const handleApplyClick = () => {
    if (hasApplied) {
      alert("Bạn đã ứng tuyển công việc này!");
      return;
    }
    setIsCVModalOpen(true);
    setSelectedCVId(null);
    setUploadedCV(null);
  };

  const handleSubmitCV = async () => {
    if (!selectedCVId && !uploadedCV) {
      alert("Vui lòng chọn một CV hoặc tải lên file CV mới.");
      return;
    }

    setIsSubmittingCV(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("job_id", id);
      formData.append("job_name", jobDetail.post.title);
      // formData.append("created_at", new Date().toISOString());

      if (selectedCVId) {
        const selectedCV = cvList.find((cv) => cv._id === selectedCVId);
        if (!selectedCV) {
          alert("CV không hợp lệ.");
          setIsSubmittingCV(false); // Stop loading
          return;
        }
        const response = await fetch(selectedCV.cvLink);
        if (!response.ok) {
          throw new Error("Không thể tải CV từ URL.");
        }
        const blob = await response.blob();
        const file = new File([blob], `${selectedCV.cvName}.pdf`, { type: blob.type });
        formData.append("cv", file);
      } else if (uploadedCV) {
        formData.append("cv", uploadedCV);
      }

      const response = await axios.post(
        `${API_URL}/jobseeker/applyForJob`,
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
        setSelectedCVId(null);
        setUploadedCV(null);
        setHasApplied(true);
      } else {
        alert(`Lỗi: ${response.data.message}`);
      }
    } catch (err) {
      alert(`Lỗi khi nộp CV: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmittingCV(false); // Stop loading
    }
  };

  const handleCloseCVModal = () => {
    setIsCVModalOpen(false);
    setSelectedCVId(null);
    setUploadedCV(null);
    setIsSubmittingCV(false); // Reset loading state
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
      const response = await axios.get(
        `${API_URL}/recruiter/viewAllJobAppicationsByPostId/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const applicationsData = Array.isArray(response.data.data) ? response.data.data : [];

      const applicationsWithUsers = await Promise.all(
        applicationsData.map(async (app) => {
          try {
            const userResponse = await axios.get(
              `${API_URL}/recruiter/viewUser/${app.applicant_id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...app,
              applicant: userResponse.data.data,
            };
          } catch (userError) {
            console.error(`Error fetching user ${app.applicant_id}:`, userError.response?.data || userError.message);
            return {
              ...app,
              applicant: { userName: "N/A", userEmail: "N/A", dayofBirth: "N/A" },
            };
          }
        })
      );
      setApplications(applicationsWithUsers);
      setForceRender((prev) => !prev);
      setLoadingApplications(false);
    } catch (error) {
      console.error("Applications Fetch Error:", error.response?.data || error.message);
      setApplicationsError(
        error.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!"
          : error.response?.data?.message || "Có lỗi xảy ra khi tải danh sách ứng viên!"
      );
      setLoadingApplications(false);
    }
  };

  const handleCloseApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
    setApplications([]);
    setApplicationsError(null);
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
        `${API_URL}/recruiter/editPost`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Bài đăng đã được cập nhật thành công!");
      setIsEditModalOpen(false);
      navigate("/recruiter");
    } catch (error) {
      alert(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
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
    if (window.confirm("Bạn có chắc muốn xóa mục này?")) {
      try {
        await axios.post(
          `${API_URL}/recruiter/deletePost`,
          { postId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Mục đã được xóa thành công!");
        navigate("/recruiter");
      } catch (error) {
        alert(
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
        );
      }
    }
  };

  const handleReportClick = () => {
    setIsReportOpen(true);
  };

  const handleCloseModal = () => {
    setIsReportOpen(false);
    setSelectedReason("");
    setOtherReason("");
    setEvidence(null);
  };

  const handleSubmitReport = () => {
    alert("Đã báo cáo thành công!");
    setIsReportOpen(false);
    setSelectedReason("");
    setOtherReason("");
    setEvidence(null);
  };

  const handleFileUpload = (e) => {
    setEvidence(e.target.files[0]);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;

  const description = jobDetail.post?.content || "";
  const request = jobDetail.post?.category[2] || "";
  const benefit = "";

  const splitTextToSentences = (text) =>
    text
      .split(".")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence !== "");

  const descriptionSentences = splitTextToSentences(description);
  const requestSentences = splitTextToSentences(request);
  const benefitSentences = splitTextToSentences(benefit);

  return (
    <div className="w-[90%] m-auto mb-[30px]">
      <div className="TitleJobsection text-[30px] flex mt-5 justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Chi tiết công việc</h1>
      </div>
      <div className="flex gap-[1.5rem] justify-around m-auto">
        <div className="jobContainer flex flex-wrap gap-[20px] items-center w-[40%]">
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
              <div className="flex items-center gap-4">
                <RiMoneyDollarCircleLine className="text-3xl flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Mức lương:</span>
                  <span className="text-md text-gray-500">{jobDetail.post.salary}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IoLocationOutline className="text-3xl flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Địa điểm:</span>
                  <span className="text-md text-gray-500">{jobDetail.post.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <GiSandsOfTime className="text-3xl flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Kinh nghiệm:</span>
                  <span className="text-md text-gray-500">{jobDetail.post.category[3]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ButtonDiv flex gap-5 m-4">
            {userInfo?.role === "jobseeker" ? (
              <>
                <button
                  className={`${
                    hasApplied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                  } text-white py-2 px-6 rounded-[20px] w-2/3`}
                  onClick={handleApplyClick}
                  disabled={hasApplied}
                >
                  <span className="block transition-transform duration-150 hover:scale-110">
                    {hasApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
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
                <button
                  className="bg-yellow-500 text-white py-2 px-10 rounded-[20px] hover:bg-yellow-600"
                  onClick={() => handleEditClick(jobDetail.post)}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteClick(jobDetail.post._id)}
                  className="bg-red-500 text-white py-2 px-10 rounded-[20px] hover:bg-red-600"
                >
                  Xóa
                </button>
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
                {isSubmittingCV ? (
                  <p className="text-center text-blue-500">Vui lòng đợi...</p>
                ) : (
                  <>
                    {cvList.length === 0 ? (
                      <p className="text-center">Bạn chưa có CV nào.</p>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto">
                        {cvList.map((cv) => (
                          <div
                            key={cv._id}
                            className={`p-2 mb-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 ${
                              selectedCVId === cv._id ? "bg-blue-100" : ""
                            }`}
                            onClick={() => {
                              setSelectedCVId(cv._id);
                              setUploadedCV(null);
                            }}
                          >
                            <p>{cv.cvName || "CV không có tên"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Hoặc tải lên CV mới:</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          setUploadedCV(e.target.files[0]);
                          setSelectedCVId(null);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                        disabled={isSubmittingCV}
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseCVModal}
                    disabled={isSubmittingCV}
                  >
                    Hủy
                  </button>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSubmitCV}
                    disabled={isSubmittingCV}
                  >
                    Nộp CV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Applications Modal */}
          {isApplicationsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] md:w-[700px] p-6 rounded-[20px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Danh sách ứng viên</h2>
                {loadingApplications ? (
                  <p className="text-center">Đang tải...</p>
                ) : applicationsError ? (
                  <div className="text-center">
                    <p className="text-red-500">{applicationsError}</p>
                    <button
                      className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={handleViewCandidatesClick}
                    >
                      Thử lại
                    </button>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-center">Chưa có ứng viên nào cho bài đăng này.</p>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-4 mb-2 border border-gray-300 rounded-[10px]"
                      >
                        <p><strong>Tên ứng viên:</strong> {app.applicant?.userName || "N/A"}</p>
                        <p><strong>Email:</strong> {app.applicant?.userEmail || "N/A"}</p>
                        <p>
                          <strong>Ngày sinh:</strong>{" "}
                          {app.applicant?.dayofBirth
                            ? new Date(app.applicant.dayofBirth).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>CV:</strong>{" "}
                          {app.cv ? (
                            <a href={app.cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Xem CV
                            </a>
                          ) : (
                            "Không có CV"
                          )}
                        </p>
                        <p>
                          <strong>Ngày ứng tuyển:</strong>{" "}
                          {app.appliedAt
                            ? new Date(app.appliedAt).toLocaleDateString()
                            : "N/A"}
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
                    className="py-2 px-4 bg-gray-400 rounded hover:bg-gray-500"
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

          {/* Report Modal */}
          {isReportOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-[90%] md:w-[500px] p-6 rounded-[20px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Báo cáo công ty</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Lý do báo cáo:</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="Lừa đảo">Lừa đảo</option>
                    <option value="Thông tin không đúng sự thật">Thông tin không đúng sự thật</option>
                    <option value="Khác">Khác (vui lòng ghi rõ)</option>
                  </select>
                </div>
                {selectedReason === "Khác" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Vui lòng ghi rõ:</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="2"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Nhập lý do khác..."
                    ></textarea>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Minh chứng:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  />
                  {evidence && (
                    <p className="mt-2 text-sm text-gray-600">File: {evidence.name}</p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </button>
                  <button
                    className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={handleSubmitReport}
                  >
                    Gửi báo cáo
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="Chitiettuyendung text-xl font-bold flex justify-between items-center ml-4 mt-5">
            Chi tiết tuyển dụng
          </div>

          <div className="DescDiv flex flex-col gap-4 p-4">
            <div className="flex items-center text-xl ml-4 font-bold">
              <SlNote className="ml-2 text-gray-500 text-lg mr-2" />
              <span>Mô tả công việc</span>
            </div>
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
            <div className="flex items-center text-xl ml-4 font-bold">
              <PiListMagnifyingGlassLight className="ml-2 text-gray-800 text-xl mr-2" />
              <span>Lĩnh vực</span>
            </div>
            <div className="flex-col gap-1 ml-10">
              <div className="flex flex-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{jobDetail.post.category[2]}</span>
              </div>
            </div>
          </div>

          <div className="InterestDiv flex flex-col gap-4 p-4">
            <div className="flex items-center text-xl ml-4 font-bold">
              <GrStatusGood className="ml-2 text-gray-500 text-l mr-2" />
              <span>Quyền lợi</span>
            </div>
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

        <div className="p-[10px] border-[2px] border-black rounded-[20px] h-fit relative">
          <button
            onClick={handleReportClick}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
          >
            <FaFlag className="text-2xl" />
          </button>
          <div className="w-[100px] h-[100px] mx-auto rounded-full border border-black flex items-center justify-center">
            <img
              src="https://picsum.photos/200/300"
              alt="Company Logo"
              className="w-[100%] h-[100%] object-cover rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold mt-4">{jobDetail.post.companyName}</h2>
          <div className="text-left mt-6">
            <div className="flex items-center gap-2 mb-3">
              <BiGridAlt className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Lĩnh vực: <span className="font-medium">Công nghệ thông tin</span>
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
                Địa điểm: <span className="font-medium">268 Lý Thường Kiệt Quận 10</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompDetail;