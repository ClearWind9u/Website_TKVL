import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nội dung trang */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold">
          Chào mừng bạn đến với trang IT Job Search
        </h1>
        <p className="text-gray-600 mt-2">
          Tính năng tìm kiếm và danh sách công việc sẽ sớm có mặt.
        </p>
      </div>
    </div>
  );
};

export default Home;
