import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// import UserContext from "../userContext/userContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
var CVProfile2= [
  {
    _id: "1",
    name: "Frontend CV",
    cvFile: {
      contentType: "application/pdf",
      data: "JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwvTGluZWFyaXplZCAxL0wgMTA4NjIvTyA2L0UgNjI4ODQvTiAyL1QgMTAyMzYvSCBbIDM3MSAxMDZdPj4KZW5kb2JqCj..."
    }
  },
  {
    _id: "2",
    name: "Backend CV",
    cvFile: {
      contentType: "application/pdf",
      data: "JVBERi0xLjUKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlL1BhcmVudCAxIDAgUi9SZXNvdXJjZXMgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdPj4KZW5kb2JqC..."
    }
  }
]
const Profile = () => {
  // const {userInfo} = useContext(UserContext);
  // const [profile, setProfile] = useState(profileLocal);
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const navigate = useNavigate();
  const [CVProfile, setCVProfile] = useState(CVProfile2);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const API_URL = 'https://it-job-search-be.vercel.app';
  // const handleUploadSuccess = async (newCV) => {
  //   try {
  //     const token = localStorage.getItem("TOKEN");
  //     const response = await axios.post(`http://localhost:5000/jobseeker/addCV`,{
  //       cv: newCV
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (response.success === "OK") {
  //       setCVProfile(response.data.CVs);
  //       alert("Thêm CV thành công!");
  //     }
  //   } catch (err) {
  //     setError(err.response.message || "Có lỗi xảy ra khi thêm CV.");
  //   }
  // };
  
  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Vui lòng chọn một tệp CV để tải lên.");
      return;
    }
    const formData = new FormData();
    formData.append("cv", selectedFile);
    // console.log(formData.get("cv"));
    handleUploadSuccess(formData);
  };
  // const handleUploadSuccess = async (formData) => {
  //   try {
  //     const token = localStorage.getItem("TOKEN");
  
  //     const response = await axios.post(
  //       "http://localhost:5000/jobseeker/addCV",
  //       formData,
  //       {
  //         headers: {
  //           "Authorization": `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     if (response.statusText === "OK") {
  //       setCVProfile(response.data.CVs);
  //       // alert("Thêm CV thành công!");
  //       Swal.fire({
  //         icon: "success",
  //         title: "Thêm CV thành công!",
  //         showConfirmButton: false,
  //         timer: 3000
  //       });
  //     } else {
  //       setError("Upload thất bại.");
  //     }
  //   } catch (err) {
  //     setError(err?.response?.data?.message || "Có lỗi xảy ra khi thêm CV.");
  //   }
  // };
  const handleUploadSuccess = async (formData) => {
    try {
      const token = localStorage.getItem("TOKEN");
  
      // Hiển thị loading
      Swal.fire({
        title: "Đang tải lên CV...",
        text: "Vui lòng đợi trong giây lát.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      const response = await axios.post(
        `${API_URL}/jobseeker/addCV`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200 || response.statusText === "OK") {
        setCVProfile(response.data.CVs);
        Swal.fire({
          icon: "success",
          title: "Thêm CV thành công!",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Upload thất bại.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err?.response?.data?.message || "Có lỗi xảy ra khi thêm CV.",
      });
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi thêm CV.");
    }
  };
  
    // const reader = new FileReader();
  // reader.onloadend = () => {
  //   // const base64Data = reader.result.split(',')[1]; // bỏ phần data:xxx;base64,
  //   // const newCV = {
  //   //   _id: Date.now().toString(), // ID tạm thời
  //   //   name: selectedFile.name,
  //   //   cvFile: {
  //   //     contentType: selectedFile.type,
  //   //     data: base64Data,
  //   //   }
  //   // };
  // };
  // reader.readAsDataURL(selectedFile);

    // const formData = new FormData();
    // formData.append("cvFile", selectedFile);
    // formData.append("name", selectedFile.name);

    // try {
    //   setUploadError("");
    //   setUploadSuccess("");
    //   const response = await axios.post(
    //     "http://localhost:5000/jobseeker/info/uploadCV",
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //       withCredentials: true,
    //     }
    //   );
    //   setUploadSuccess("Tải lên CV thành công!");
    //   setProfile((prevProfile) => ({
    //     ...prevProfile,
    //     CVProfile: [...(prevProfile.CVProfile || []), response.data.newCV],
    //   }));
    // } catch (error) {
    //   setUploadError("Có lỗi xảy ra khi tải lên CV. Vui lòng thử lại.");
    //   console.error(error);
    // }

  // Xử lý xóa CV
  // const handleDeleteCV = async (cvId) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/jobseeker/info/deleteCV/${cvId}`,
  //       { withCredentials: true }
  //     );
  //     // Cập nhật lại profile sau khi xóa
  //     setProfile((prevProfile) => ({
  //       ...prevProfile,
  //       CVProfile: prevProfile.CVProfile.filter((cv) => cv.id !== cvId),
  //     }));
  //     alert("Xóa CV thành công!");
  //     navigate("/recruiter");
  //   } catch (error) {
  //     setUploadError("Có lỗi xảy ra khi xóa CV. Vui lòng thử lại.");
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const fecthCV = async (e) => {
      const token = localStorage.getItem("TOKEN");
  
      try {
        const response = await axios.get(`${API_URL}/jobseeker/getAllCV`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setCVProfile(response.data.data)
        }
      } catch (err) {
        setError(err.response?.data?.message || "Truy cập dữ liệu thất bại!");
      }
    };
    fecthCV();
  },[CVProfile]);
  
    // try {
    //   setCVProfile((prevCVs) => prevCVs.filter((cv) => cv._id !== cvId));
    //   alert("Xóa CV thành công!");
    // } catch (error) {
    //   console.error(error);
    //   setUploadError("Có lỗi xảy ra khi xóa CV.");
    // }
    const handleDeleteCV =  (cvId) => {
      Swal.fire({
        title: "Bạn muốn xóa CV này?",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vâng, xóa nó!",
        cancelButtonText: "Hủy",
      }).then(async( result) => {
        // if (result.isConfirmed) {
        //   try {
        //     const token = localStorage.getItem("TOKEN");
        //     const response = await axios.post(`http://localhost:5000/jobseeker/removeCV`,{
        //       cvId: cvId
        //     }, {
        //       headers: { "Authorization": `Bearer ${token}` },
        //     });
        //     // const response = await axios.post(`http://localhost:5000/jobseeker/removeCV`, 
        //     //   headers: { Authorization: `Bearer ${token}` },
        //     //   data: { cvId: cvId }, 
        //     // );
        //     console.log(response);
        //     if (response.data.success === "OK") {
        //       // alert("Xóa CV thành công!");
        //       Swal.fire({
        //         title: "Deleted!",
        //         text: "Your file has been deleted.",
        //         icon: "success",
        //         timer: 3000,
        //       });
        //       setCVProfile(response.data.data.CVs);
        //     }
        //   } catch (err) {
        //     setError(err.response.data.message || "Có lỗi xảy ra khi xóa CV.");
        //   }
          
        // }
        if (result.isConfirmed) {
          // Swal.fire({
          //   title: "Đang xóa CV...",
          //   text: "Vui lòng đợi trong giây lát.",
          //   allowOutsideClick: false,
          //   didOpen: () => {
          //     Swal.showLoading();
          //   }
          // });
        
          try {
            const token = localStorage.getItem("TOKEN");
            // const response = await axios.post(
            //   `http://localhost:5000/jobseeker/removeCV`,
            //   { cvId: cvId },
            //   {
            //     headers: { Authorization: `Bearer ${token}` },
            //   }
            // );
            const response = await axios.post(`${API_URL}/jobseeker/removeCV`,{
              cvId: cvId
            }, {
              headers: { "Authorization": `Bearer ${token}` },
            });
            console.log(response);
            if (response.status == 200) {
              setCVProfile(response.data.data.CVs);
        
              Swal.fire({
                title: "Đã xóa!",
                text: "CV của bạn đã được xóa.",
                icon: "success",
              });
            } else {
              throw new Error("Xóa không thành công");
            }
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: err?.response?.data?.message || "Có lỗi xảy ra khi xóa CV.",
            });
          }
        }
        
      });
      
    };

  return (
    <div className="flex flex-col w-full items-center text-[#3C3C3C] border-[#00000000] gap-10 mb-3">
      <h1 className="text-[32px] font-bold mt-8 text-center">
        Thông Tin Tài Khoản
      </h1>

      <div className="flex flex-col w-[600px] gap-4">
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Họ và tên:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.userName || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Email:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.userEmail || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Vai trò:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.role || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Địa chỉ:</label>
          <div className="p-4 border-2 rounded-md">{userInfo.address || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Ngày sinh:</label>
          <div className="p-4 border-2 rounded-md">
            {userInfo.BoD ? new Date(userInfo.BoD).toLocaleDateString() : "Chưa cập nhật"}
          </div>
        </div>
      </div>

      {/* CV Profile */}
      <div className="flex flex-col w-[600px] gap-4">
        <h2 className="font-bold text-[20px]">Thông tin CV:</h2>
        {/* {userInfo.CVProfile && userInfo.CVProfile.length > 0 ? (
          userInfo.CVProfile.map((cv, index) => (
            <div key={index} className="flex flex-col gap-2 border p-4 rounded-md">
              <p className="font-semibold">Tên CV: {cv?.name || "Chưa có tên CV"}</p>
              <p className="font-semibold">ID: {cv?._id}</p>
              <a
                href={`data:${cv?.cvFile?.contentType};base64,${cv?.cvFile?.data}`}
                download={`${cv?.name || "CV"}.pdf`}
                className="text-blue-500 underline"
              >
                Tải xuống CV
              </a>
              <button
                onClick={() => handleDeleteCV(cv._id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Xóa CV
              </button>
            </div>
          ))
        ) : (
          <p>Chưa có CV nào được tải lên.</p>
        )} */}
        {CVProfile && CVProfile.length > 0 ? (
          CVProfile.map((cv, index) => (
            <div key={index} className="flex flex-col gap-2 border p-4 rounded-md">
              {/* Hiển thị tên CV và id */}
              <p className="font-semibold">Tên CV: {cv?.cvName || "Chưa có tên CV"}</p>
              <p className="font-semibold">ID: {cv?._id}</p>
              <div className="flex gap-4">
                <a className="text-blue-500 underline" href={`${cv.cvLink}`} download>
                  Tải CV
                </a>

                <a className="text-blue-500 underline" href={`${cv.cvLink}`} target="_blank" rel="noopener noreferrer">
                  Xem CV
                </a>
              </div>
              
              <button
                onClick={() => handleDeleteCV(cv._id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Xóa CV
              </button>
            </div>
          ))
        ) : (
          <p>Chưa có CV nào được tải lên.</p>
        )}
      </div>

      {/* Upload CV */}
      <div className="flex flex-col w-[600px] gap-4">
        <h2 className="font-bold text-[20px]">Tải lên CV mới:</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-2 border rounded-md p-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Tải lên
        </button>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        {uploadSuccess && <p className="text-green-500">{uploadSuccess}</p>}
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="text-red-500 mt-4">
          Lỗi: {error}
        </div>
      )}
    </div>
  );
};

export default Profile;
