import React from 'react';
import { Link } from 'react-router-dom';
import { news } from '../data/mockData';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

const NewsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <Newspaper className="h-10 w-10 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">Tin tức thư viện</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Cập nhật những thông tin mới nhất về hoạt động và sự kiện từ thư viện
        </p>
      </div>

      <div className="space-y-8">
        {/* Featured News */}
        {news.length > 0 && (
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={news[0].image}
                  alt={news[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 lg:p-12">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(news[0].date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{news[0].author}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {news[0].title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {news[0].summary}
                </p>
                <Link
                  to={`/news/${news[0].id}`}
                  className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Đọc chi tiết
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Other News */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(1).map((newsItem) => (
            <article key={newsItem.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(newsItem.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{newsItem.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {newsItem.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {newsItem.summary}
                </p>
                <Link
                  to={`/news/${newsItem.id}`}
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                  Đọc thêm
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Đăng ký nhận tin tức</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Nhận thông báo về những tin tức mới nhất, sự kiện và hoạt động của thư viện
            qua tài khoản của bạn
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="text"
              placeholder="Nhập tên đăng nhập của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;