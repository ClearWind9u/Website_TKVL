import React, { useState, useEffect, useContext } from 'react';
import { IoHeartCircleOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { IoHeartCircle } from "react-icons/io5";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Để lấy thông tin vị trí trang hiện tại
import logo1 from '/company/vnglogo.png';
import { UserContext } from '../userContext/userContext';

const SingleJob = ({ id, title, salary, address, category, user_id }) => {
  const [isHoveredLove, setIsHoveredLove] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  // const { userInfo, token } = useContext(UserContext);

  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(userInfo.role === "jobseeker"
          ? `http://localhost:5000/jobseeker/viewUser/${user_id}`
          : `http://localhost:5000/recruiter/viewUser/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        setUserName(response.data?.data.userName || "Không xác định");
      } catch (error) {
        console.error("Lỗi khi lấy userName:", error);
        setUserName("Không xác định");
      }
    };

    if (user_id) {
      fetchUserName();
    }
  }, [user_id]);

  const handleJobClick = () => {
    if (userInfo.role === "jobseeker") {
      navigate(`/jobseeker/jobDetail/${id}`);
    } else {
      navigate(`/recruiter/jobDetail/${id}`);
    }
  };

  return (
    <div
      className="singleJob w-[280px] h-auto p-[15px] bg-white rounded-[20px] border border-black cursor-pointer shadow-[4px_4px_6px_rgba(0,_0,_0,_0.3)]"
      onClick={handleJobClick}
    >
      <div className="com_top flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <span
          className="text-xl"
          onMouseEnter={() => setIsHoveredLove(true)}
          onMouseLeave={() => setIsHoveredLove(false)}
        >
          {isHoveredLove ? <IoHeartCircle /> : <IoHeartCircleOutline />}
        </span>
      </div>

      <div className="com_bot flex items-center">
        <div className="w-[60px] h-[60px] mr-2">
          <img src={logo1} alt="Company Logo" className="w-full h-full object-contain" />
        </div>
        <div className="border-l-2 border-gray-500 h-[60px] mx-2"></div>
        <div className="com_right ml-2">
          <div className='text-left'> 
            <p className='text-sm font-medium mb-1 text-gray-500'>{userName}</p>
          </div> 
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium"><RiMoneyDollarCircleLine /></span>
            <p className="text-sm ml-2">{salary}</p>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium"><IoLocationOutline /></span>
            <p className="text-sm ml-2"> {address} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobHome = () => {
  const [jobs, setJobs] = useState([]); // State lưu danh sách công việc
  const [loading, setLoading] = useState(true); // State theo dõi trạng thái loading
  const [error, setError] = useState(null); // State lưu lỗi nếu có
  const [selectedFilter, setSelectedFilter] = useState(''); // Bộ lọc đã chọn
  const [showOptions, setShowOptions] = useState(false);  // Điều khiển việc hiển thị lựa chọn bộ lọc
  const [selectedOptions, setSelectedOptions] = useState([]);  // Lưu các lựa chọn đã chọn
  const {  token, isLoggedIn } = useContext(UserContext);
  const userInfo = localStorage.getItem("USER");
  const location = useLocation();
  //const isHomePage = location.pathname === '/';

  // Các bộ lọc có thể chọn
  const filters = ["Kinh nghiệm", "Địa điểm", "Mức lương", "Lĩnh vực", "Phương thức làm việc", "Hình thức làm việc"];

  // Tùy chọn của từng bộ lọc
  const filterOptions = {
    "Kinh nghiệm": ["Intern", "Fresher", "Junior", "Senior", "Leader", "Manager"],
    "Địa điểm": ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"],
    "Mức lương": ["Dưới 10 triệu", "10 - 20 triệu", "20 - 50 triệu", "Trên 50 triệu"],
    "Lĩnh vực": ["Software Engineer", "AI", "DevOps", "An ninh mạng", "Tester", "IOT", "Quản trị hệ thống và mạng", "Business Analyst"],
    "Phương thức làm việc": ["On-site", "Remote", "Hybrid", "Online", "Offline"],
    "Hình thức làm việc": ["Full-time", "Part-time", "Freelance", "Contract", "Project"]
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => {
      let newSelected;
      if (prev.includes(option)) {
        newSelected = prev.filter((item) => item !== option);
      } else {
        newSelected = [...prev, option];
      }

      if (selectedFilter === "Lĩnh vực") {
        fetchJobsByCategory(newSelected);
      }

      return newSelected;
    });
  };

  const handleCloseFilter = () => {
    setSelectedFilter('');
    setShowOptions(false);
    setSelectedOptions([]);
  };

  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  const fetchJobsByCategory = async (categories) => {
    try {
      if (!isLoggedIn || !userInfo) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      if (categories.length === 0) {
        fetchJobs(); // Nếu không có danh mục, gọi API lấy tất cả công việc
        return;
      }

      setLoading(true);
      const endpoint =
        userInfo.role === "jobseeker"
          ? `http://localhost:5000/jobseeker/viewPostsByCategory/${categories.join(",")}`
          : `http://localhost:5000/recruiter/viewPostsByCategory/${categories.join(",")}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data?.data);
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      if (!isLoggedIn || !userInfo) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await axios.get(
        userInfo.role === "jobseeker"
          ? "http://localhost:5000/jobseeker/viewAllPosts"
          : "http://localhost:5000/recruiter/viewAllPosts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data?.data);
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect duy nhất để gọi API
  useEffect(() => {
    if (!selectedOptions || selectedOptions.length === 0) {
      fetchJobs();
    } else {
      fetchJobsByCategory(selectedOptions);
    }
  }, [selectedOptions, isLoggedIn, userInfo, token]);
  // console.log(localStorage.getItem("TOKEN"));
  return (
    <div className='w-[90%] m-auto'>
      <div className='TitleJobsection text-[30px] flex mt-5 justify-between items-center'>
        {/* Hiển thị "Việc làm tốt nhất" nếu ở trang chủ, nếu không hiển thị "Yêu thích của tôi" */}
        <span>Các công việc hiện tại</span>
        <span className='Dieuhuong flex items-center'>
          {/* Icon left */}
          <div
            className='cursor-pointer'
            onMouseEnter={() => setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
          >
            {hoverLeft ? <IoIosArrowDropleftCircle /> : <IoIosArrowDropleft />}
          </div>

          {/* Icon right */}
          <div
            className='cursor-pointer ml-2'
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
          >
            {hoverRight ? <IoIosArrowDroprightCircle /> : <IoIosArrowDropright />}
          </div>
        </span>
      </div>

      <div className="Filter-Total">
        {/* Bộ lọc tổng */}
        <div className="filter-container text-[30px] flex mt-5 justify-between items-center w-full border-2 border-black rounded-[20px] p-3">
          {/* Lọc theo */}
          <li className="filter-list p-2 text-[25px]">Lọc theo:</li>

          {/* Các bộ lọc có thể chọn */}
          {filters.map((filter, index) => (
            <li
              key={index}
              className="filter-list hover:text-blue-500 p-2 text-[25px] cursor-pointer"
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </li>
          ))}
        </div>

        {/* Hiển thị khi người dùng chọn bộ lọc */}
        {showOptions && selectedFilter && (
          <div className="filter-container flex items-center justify-between mt-3">
            {/* Div 1: Lọc theo và bộ lọc đã chọn */}
            <div className="flex items-center">
              <li className="filter-list p-2 text-[25px]">Lọc theo:</li>
              <li className="filter-list p-2 text-[25px]">{selectedFilter}</li>
              <AiOutlineCloseCircle
                className="cursor-pointer text-red-500 text-[15px]"
                onClick={handleCloseFilter}
              />
            </div>

            {/* Div 2: Các tùy chọn bộ lọc */}
            <div className="overflow-x-auto flex space-x-3 py-2">
              {filterOptions[selectedFilter].map((option, index) => (
                <div
                  key={index}
                  className={`filter-option p-2 cursor-pointer text-[19px] rounded-[20px] border-2 ${selectedOptions.includes(option) ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='jobContainer flex gap-10 justify-center flex-wrap items-center py-5'>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          error === "No posts found in these categories" ? (
            <div>Không có công việc phù hợp</div> // Xử lý lỗi không có bài đăng
          ) : (
            <div className="text-red-500">Có lỗi khi lấy dữ liệu: {error.message}</div> // Xử lý lỗi khác
          )
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <SingleJob
              key={job._id}
              title={job.title}
              content={job.content}
              salary={job.salary}
              address={job.address}
              category={job.category}
              user_id={job.user_id}
            />
          ))
        ) : (
          <div>Không có công việc phù hợp</div> // Trường hợp không có dữ liệu
        )}
      </div>
    </div>
  );
};

export default JobHome;
export { SingleJob };