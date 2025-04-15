import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting jobseekers
import Search from './Search';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { SingleJob } from './JobHome';
import axios from 'axios';

const Job = () => {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For redirecting
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");
  const API_URL = 'https://it-job-search-be.vercel.app';

  const fetchJobs = async () => {
    try {
      // Check if user is logged in
      if (!userInfo || !token) {
        setError({ message: "Vui lòng đăng nhập để xem công việc." });
        setLoading(false);
        return;
      }

      // Restrict jobseekers from accessing this page
      if (userInfo.role !== "recruiter") {
        setError({ message: "Bạn không có quyền truy cập trang này." });
        setLoading(false);
        // Optionally redirect jobseekers
        navigate('/'); // Adjust the redirect path as needed
        return;
      }

      setLoading(true);
      const response = await axios.get(`${API_URL}/recruiter/viewOwnPost`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the API returns { success: true, posts: [...] }
      if (response.data.success) {
        setJobs(response.data.posts);
      } else {
        setError({ message: response.data.message || "Không tìm thấy bài đăng." });
      }
    } catch (error) {
      console.error("Lỗi Axios:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSort = (criteria) => {
    setSelectedSort(criteria);
    let sortedJobs = [...jobs];

    switch (criteria) {
      case 'datePosted':
        sortedJobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
        break;
      case 'dateUpdated':
        sortedJobs.sort((a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated));
        break;
      case 'salary':
        sortedJobs.sort((a, b) => b.salary - a.salary);
        break;
      default:
        break;
    }

    setJobs(sortedJobs);
  };

  return (
    <div className='w-[90%] m-auto'>
      <div className='TitleJobsection text-[30px] flex mt-5 mb-3 justify-between items-center'>
        <span>Công việc của bạn</span> {/* Updated title to reflect recruiter's own jobs */}
        <span className='Dieuhuong flex items-center'>
          <div className='cursor-pointer' onMouseEnter={() => setHoverLeft(true)} onMouseLeave={() => setHoverLeft(false)}>
            {hoverLeft ? <IoIosArrowDropleftCircle /> : <IoIosArrowDropleft />}
          </div>
          <div className='cursor-pointer ml-2' onMouseEnter={() => setHoverRight(true)} onMouseLeave={() => setHoverRight(false)}>
            {hoverRight ? <IoIosArrowDroprightCircle /> : <IoIosArrowDropright />}
          </div>
        </span>
      </div>
      <Search jobs={jobs} />

      <div className="sortjob flex gap-10 mt-5">
        <span className="text-2xl">Ưu tiên hiển thị theo:</span>
        {['datePosted', 'dateUpdated', 'salary'].map((criteria) => (
          <div
            key={criteria}
            className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${selectedSort === criteria ? 'bg-blue-100' : ''}`}
            onClick={() => handleSort(criteria)}
          >
            <div className={`w-4 h-4 border-2 rounded-full mr-2 ${selectedSort === criteria ? 'bg-blue-600' : 'bg-white border-gray-400'}`}></div>
            <span>{criteria === 'datePosted' ? 'Ngày đăng' : criteria === 'dateUpdated' ? 'Ngày cập nhật' : 'Lương'}</span>
          </div>
        ))}
      </div>

      <div className='jobContainer flex gap-10 justify-center flex-wrap items-center py-5'>
        {loading ? (
          <p>Đang tải công việc...</p>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job) => (
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
          ))
        ) : (
          <p>Không có công việc nào.</p>
        )}
      </div>
    </div>
  );
};

export default Job;