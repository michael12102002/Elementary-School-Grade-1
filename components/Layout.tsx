
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  stars: number;
}

const Layout: React.FC<LayoutProps> = ({ children, stars }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white p-4 sticky top-0 z-50 shadow-md border-b-4 border-[#FF85A1]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FFB347] rounded-xl flex items-center justify-center text-white text-xl shadow-sm">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h1 className="text-xl font-black text-gray-700 tracking-wider">
              小一學堂 <span className="text-[#FF85A1]">快樂學習趣</span>
            </h1>
          </div>
          <div className="bg-[#FFF0F3] px-4 py-1.5 rounded-full flex items-center space-x-2 border-2 border-[#FFD1DC]">
            <span className="text-lg font-black text-[#FF85A1]">{stars}</span>
            <span className="text-xl">⭐</span>
          </div>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t-2 border-gray-100 p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <p className="text-gray-400 font-bold text-sm">陪伴孩子在遊戲中學習成長 ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
