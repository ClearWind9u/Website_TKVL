import React, { useState } from 'react'; // Import useState để quản lý state
import Search from './Search';
import { IoHeartCircleOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoHeartCircle } from "react-icons/io5";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoIosArrowDropleft, IoIosArrowDropright, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { SingleJob } from './JobHome'; // Import SingleJob từ JobHome
import logo1 from '/company/vnglogo.png';
import { IoLocateOutline, IoLocationOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { PiListMagnifyingGlassLight } from "react-icons/pi";
import { GrLocationPin, GrStatusGood } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiGridAlt } from 'react-icons/bi'; // Icon lĩnh vực
import { FaUsers } from 'react-icons/fa'; // Icon quy mô
import { FaFlag } from 'react-icons/fa';

const Data = [
  {
    id: 1,
    image: logo1,
    title: 'Software Engineer',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
  {
    id: 2,
    image: logo1,
    title: 'DevOps',
    company: 'Công ty cổ phần VNG',
    salary: '20 - 50 triệu đồng',
    location: 'Hà Nội'
  },
];

const Job = () => {
  // Khai báo state hoverLeft và hoverRight
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selectedSort, setSelectedSort] = useState(''); // Trạng thái lưu lựa chọn hiện tại

  const handleSort = (criteria) => {
    setSelectedSort(criteria); // Cập nhật lựa chọn khi người dùng chọn một tiêu chí
  };

  return (
    <div className='w-[90%] m-auto'>
      <div className='TitleJobsection text-[30px] flex mt-5 mb-3 justify-between items-center'> 
        {/* Hiển thị "Việc làm tốt nhất" nếu ở trang chủ, nếu không hiển thị "Yêu thích của tôi" */}
        <span>Việc làm tốt nhất</span>
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

      <Search/>

      <div className="sortjob flex gap-10 mt-5">
      <span className="text-2xl">Ưu tiên hiển thị theo:</span>

      {/* Chọn theo Ngày đăng */}
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${selectedSort === 'datePosted' ? 'bg-blue-100' : ''}`}
        onClick={() => handleSort('datePosted')}
      >
        <div 
          className={`w-4 h-4 border-2 rounded-full mr-2 ${selectedSort === 'datePosted' ? 'bg-blue-600' : 'bg-white border-gray-400'}`}
        ></div>
        <span>Ngày đăng</span>
      </div>

      {/* Chọn theo Ngày cập nhật */}
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${selectedSort === 'dateUpdated' ? 'bg-blue-100' : ''}`}
        onClick={() => handleSort('dateUpdated')}
      >
        <div 
          className={`w-4 h-4 border-2 rounded-full mr-2 ${selectedSort === 'dateUpdated' ? 'bg-blue-600' : 'bg-white border-gray-400'}`}
        ></div>
        <span>Ngày cập nhật</span>
      </div>

      {/* Chọn theo Lương */}
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-lg ${selectedSort === 'salary' ? 'bg-blue-100' : ''}`}
        onClick={() => handleSort('salary')}
      >
        <div 
          className={`w-4 h-4 border-2 rounded-full mr-2 ${selectedSort === 'salary' ? 'bg-blue-600' : 'bg-white border-gray-400'}`}
        ></div>
        <span>Lương</span>
      </div>
    </div>

      <div className='jobContainer flex gap-10 justify-center flex-wrap items-center py-5'>
          {Data.map(({ id, image, title, company, salary, location }) => (
            <SingleJob 
              key={id}
              image={image}
              title={title}
              company={company}
              salary={salary}
              location={location}
            />
          ))}
        </div>

    </div>
  );
}

export default Job;
