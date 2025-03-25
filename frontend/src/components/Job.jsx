import React, { useState, useEffect, useContext } from 'react';
import Search from './Search';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { SingleJob } from './JobHome'; // Import SingleJob từ JobHome
import axios from 'axios';
import { UserContext } from '../userContext/userContext';

const Job = () => {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("USER"));
  const token = localStorage.getItem("TOKEN");

  const fetchJobs = async () => {
    try {
      if (!userInfo) {
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
        <span>Việc làm tốt nhất</span>
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