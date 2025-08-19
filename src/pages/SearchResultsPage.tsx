import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';
import { Search, Eye, Download } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase()) ||
    book.description.toLowerCase().includes(query.toLowerCase())
  );

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
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {searchResults.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
              <div className="flex items-start space-x-6">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={`/books/${book.id}`}
                        className="block group"
                      >
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">bởi {book.author}</p>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-3">
                        {book.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{book.views.toLocaleString()} lượt xem</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{book.borrows.toLocaleString()} lượt mượn</span>
                        </div>
                        <span>Năm {book.publishYear}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {book.categories.map((category) => (
                          <span
                            key={category}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {book.isFeatured && (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Nổi bật
                        </span>
                      )}
                      {book.isNew && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Mới
                        </span>
                      )}
                    </div>
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