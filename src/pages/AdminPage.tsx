import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { books, news, learningMaterials } from '../data/mockData';
import { Shield, BookOpen, Newspaper, Play, Users, TrendingUp, Calendar, Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'news' | 'materials' | 'users'>('overview');

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Không có quyền truy cập</h1>
          <p className="text-gray-600 mt-2">Bạn không có quyền truy cập trang quản trị</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalBooks: books.length,
    totalNews: news.length,
    totalMaterials: learningMaterials.length,
    totalUsers: 127, // Mock data
    totalViews: books.reduce((sum, book) => sum + book.views, 0),
    totalBorrows: books.reduce((sum, book) => sum + book.borrows, 0)
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'books', label: 'Quản lý sách', icon: BookOpen },
    { id: 'news', label: 'Quản lý tin tức', icon: Newspaper },
    { id: 'materials', label: 'Học liệu', icon: Play },
    { id: 'users', label: 'Người dùng', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Trang quản trị</h1>
            <p className="text-emerald-100">Quản lý và điều hành hệ thống thư viện</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Tổng số sách</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-600 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-emerald-600">Người dùng</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Lượt xem</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Người dùng mới đăng ký: Nguyễn Văn B</span>
                    <span className="text-gray-400">2 giờ trước</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Sách mới được thêm: "Machine Learning cơ bản"</span>
                    <span className="text-gray-400">5 giờ trước</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Tin tức mới được đăng</span>
                    <span className="text-gray-400">1 ngày trước</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Quản lý sách ({books.length})</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Thêm sách mới
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sách
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tác giả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt mượn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.slice(0, 5).map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-10 h-12 object-cover rounded mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book.categories.join(', ')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.borrows.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Chỉnh sửa
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs would have similar content structure */}
          {activeTab !== 'overview' && activeTab !== 'books' && (
            <div className="text-center py-12 text-gray-500">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Tính năng đang được phát triển</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;