import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { books } from '../data/mockData';
import { User, Calendar, GraduationCap, Building, BookOpen, Trash2, ExternalLink, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, removeFromBorrowed } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Vui lòng đăng nhập</h1>
        </div>
      </div>
    );
  }

  const borrowedBooks = books.filter(book => user.borrowedBooks.includes(book.id));
  const readBooks = books.filter(book => user.readBooks.includes(book.id));

  const handleRegisterBorrow = () => {
    // In real app, this would call API to generate a slip and redirect
    alert('Hệ thống đã sinh phiếu mượn sách và gửi về trang quản lý!');
    window.open('http://dev.arito.vn:8080/NOTELIB/noteapp/login', '_blank');
  };

  const handleRemoveFromBorrowed = (bookId: string) => {
    if (confirm('Bạn có chắc muốn xóa sách này khỏi danh sách mượn?')) {
      removeFromBorrowed(bookId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.username}</p>
              {user.isAdmin && (
                <div className="flex items-center space-x-1 mt-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Quản trị viên</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày sinh</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                {user.class && (
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Lớp</p>
                      <p className="font-medium text-gray-900">{user.class}</p>
                    </div>
                  </div>
                )}

                {user.department && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phòng ban</p>
                      <p className="font-medium text-gray-900">{user.department}</p>
                    </div>
                  </div>
                )}
              </div>

              {user.isAdmin && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/admin"
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Vào trang quản trị</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Borrowed Books */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Sách đã đăng ký mượn ({borrowedBooks.length})
                </h2>
                {borrowedBooks.length > 0 && (
                  <button
                    onClick={handleRegisterBorrow}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Đăng ký mượn</span>
                  </button>
                )}
              </div>

              {borrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${book.id}`} className="group">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Đăng ký ngày: {new Date().toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromBorrowed(book.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có sách nào được đăng ký mượn</p>
                  <Link
                    to="/categories"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                  >
                    Khám phá sách →
                  </Link>
                </div>
              )}
            </div>

            {/* Read Books */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Sách đã đọc ({readBooks.length})
              </h2>

              {readBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {readBooks.map((book) => (
                    <div key={book.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${book.id}`} className="group">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Đọc lần cuối: {new Date().toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa đọc sách nào</p>
                  <Link
                    to="/categories"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                  >
                    Bắt đầu đọc →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;