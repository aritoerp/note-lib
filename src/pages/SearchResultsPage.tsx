import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_HOST } from '../env';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Eye, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFileUrl } from '../utils/fileUtils';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { accessToken, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);

   useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      if (!accessToken) {
        window.location.href = '/login';
        return;
      }
      try {
        const data = JSON.stringify({
          accessToken,
          memvars: {
            text: query,
            pageIndex: 0
          }
        });
        const response = await axios.post(`${BACKEND_HOST}/search`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          setSearchResults(response.data.data);
        } else {
          setError('Không lấy được danh sách tìm kiếm');
          throw new Error('Không lấy được danh sách tìm kiếm');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchSearchResults();
  }, [accessToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Kết quả tìm kiếm</h1>
        </div>
        <p className="text-gray-600">
          {searchResults.length > 0 
            ? `Tìm thấy ${searchResults.length} kết quả cho "${query}"`
            : `Không tìm thấy kết quả nào cho "${query}"`
          }
        </p>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((result) => (
              <div key={result.type + '-' + result.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={getFileUrl(accessToken, result.image_id, '/images/400x400.svg')}
                    alt={result.nhan_de}
                    className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={
                            result.api == 'Euresource' ? `/learning-materials/${result.type + '-' + result.id}`
                              : result.api == 'Ebook' ? `/books/${result.id}`
                                : result.api == 'Activities' ? `/news/${result.id}`
                                  : ''
                          }
                          className="block group"
                        >
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                            {result.nhan_de}
                          </h3>
                        </Link>
                        {/* <p className="text-gray-600 mb-2">bởi {result.author}</p> */}
                        <p className="text-gray-500 text-sm mb-3 line-clamp-3">
                          {result.note}
                        </p>
                        {/* <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{result.views.toLocaleString()} lượt xem</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{result.borrows.toLocaleString()} lượt mượn</span>
                          </div>
                          <span>Năm {result.publishYear}</span>
                        </div> */}
                        {/* <div className="flex flex-wrap gap-2">
                          {result.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div> */}
                      </div>
                      {/* <div className="flex flex-col space-y-2 ml-4">
                        {result.isFeatured && (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Nổi bật
                          </span>
                        )}
                        {result.isNew && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Mới
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thử sử dụng từ khóa khác hoặc kiểm tra lại chính tả
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Khám phá thể loại sách
            </Link>
          </div>
        )
      )}

      {/* Search Tips */}
      {searchResults.length === 0 && (
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Gợi ý tìm kiếm</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Kiểm tra lại chính tả của từ khóa</li>
            <li>• Thử sử dụng từ khóa ngắn gọn hơn</li>
            <li>• Tìm kiếm theo tên tác giả thay vì tên sách</li>
            <li>• Sử dụng từ khóa chung thay vì cụ thể</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;