import React, { useState } from 'react';
//npm install react-icons
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
//classname icon at aioutlinesearch when hover is click
import AdvSearch from './AdvSearch';

const Search = () => {
  const [inputValue, setInputValue] = useState(""); // State để theo dõi giá trị trong input

  const handleChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị khi nhập vào
  };

  const handleClear = () => {
    setInputValue(""); // Xóa giá trị trong input khi nhấn icon
  };

  //Nhấn tìm kiếm nâng cao
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); 
  };

  return (
    <div className='searchDiv grid gp-10 bg-greyIsh rounded-[30px] p-[1rem] w-[90%] m-auto '>
      <form action=''></form>
      <div className='firstDiv flex justify-between items-center rounded-[30px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700'>
        {/*Div chứa tìm kiếm nâng cao*/}
          <div className="advancedSearch flex flex-col items-center justify-center bg-black rounded-[30px] text-center text-white p-2 w-[130px] cursor-pointer hover:bg-gray-500">
            <button onClick={toggleModal}>Tìm kiếm nâng cao</button>
          </div>

          {/* Overlay and AdvSearch Modal */}
          {isModalOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={toggleModal} // Close modal when clicking outside
              ></div>

              {/* Modal */}
              <div
                className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-300 opacity-100"
              >
                <AdvSearch setIsModalOpen={setIsModalOpen} /> {/* Truyền setIsModalOpen cho AdvSearch */}
              </div>
            </>
          )}

        {/* Line dọc ngăn cách giữa tìm kiếm và advanced search */}
        <div className='border-l-2 border-black h-[40px] mx-2'></div>
        {/* Div chứa input */}
        <div className='inputDiv flex items-center w-full border-2 border-black rounded-[20px]'>
            <input 
              type='text' 
              className='bg-transparent focus:outline-none w-full p-2' 
              placeholder='Tìm kiếm'
              value={inputValue} // Gắn giá trị của state vào input
              onChange={handleChange} // Khi nhập, cập nhật giá trị
            />
            {inputValue && (
              <AiOutlineCloseCircle 
                className='text-[30px] flex-grow mr-[0.5rem] text-[#a5a6a6] hover:text-textColor icon'
                onClick={handleClear} // Xóa giá trị khi click vào icon
              />
            )}
        </div>
        {/* Div chứa icon tìm kiếm */}
        <div className='iconDiv flex items-center justify-center w-[50px] h-[40px] bg-black rounded-full cursor-pointer hover:bg-gray-500'>
          <AiOutlineSearch className='text-white text-[20px]' />
        </div>
      </div>
    </div>

  )
}

export default Search
