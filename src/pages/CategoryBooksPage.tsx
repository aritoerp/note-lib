import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// (removed duplicate component and code)
const CategoryBooksPage: React.FC = () => {
  // Helper to get image url from image_id
  const { accessToken, logout } = useAuth();
  const getImageUrl = (image_id: string | null | undefined) => {
    if (image_id && accessToken) {
      const tokenPart = accessToken.split(".")[2];
      return `https://api2dev.arito.vn/api/v1/DownloadFile0/${image_id}/${tokenPart}`;
    }
    return 'https://placehold.co/400x400';
  };
  const { categoryId } = useParams<{ categoryId: string }>();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchBooks = async () => {
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
            loai_sach: categoryId,
            id: '',
            pageIndex: 0
          }
        });
        const response = await axios.post('https://thuvien.truongso.vn/web/ebooks', data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          setBooks(response.data.data);
        } else {
          setError('Không lấy được danh sách sách');
          throw new Error('Không lấy được danh sách sách');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchBooks();
  }, [accessToken, categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Trang chủ</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-gray-700">Thể loại sách</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{categoryId}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-start space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Danh sách sách</h1>
        </div> 
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sách nào trong thể loại này</h3>
          <p className="text-gray-600">Hãy quay lại sau hoặc khám phá các thể loại khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img
                  src={getImageUrl(book.image_id)}
                  alt={book.text}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{book.text}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{book.note}</p>
                  <div className="text-sm text-gray-500 mb-1">Tác giả: {book.tac_gia || 'Không rõ'}</div>
                  <div className="text-xs text-gray-400">Ngày: {book.ngay_bh ? new Date(book.ngay_bh).toLocaleDateString() : ''}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryBooksPage;