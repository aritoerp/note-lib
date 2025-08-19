import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// ...existing code...
import { ChevronLeft, Eye, Download, Calendar, Building, BookOpen, ShoppingCart, FileText } from 'lucide-react';
import axios from 'axios';

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { user, addToBorrowed, addToRead, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBook = async () => {
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
            loai_sach: '',
            id: bookId,
            pageIndex: 0
          }
        });
        const response = await axios.post('https://thuvien.truongso.vn/web/ebooks', data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setBook(response.data.data[0]);
        } else {
          setError('Không tìm thấy sách');
          throw new Error('Không tìm thấy sách');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchBook();
  }, [accessToken, bookId]);

  const isAlreadyBorrowed = user?.borrowedBooks.includes(book?.id?.toString()) || false;

  const handleReadBook = () => {
    if (book?.id) {
      addToRead(book.id.toString());
      navigate(`/books/${book.id}/read`);
    }
  };

  const handleBorrowBook = () => {
    if (!isAlreadyBorrowed && book?.id) {
      addToBorrowed(book.id.toString());
      alert('Sách đã được thêm vào danh sách mượn. Hệ thống sẽ sinh phiếu mượn và gửi về trang quản lý.');
    }
  };

  const getImageUrl = (image_id: string | null | undefined) => {
    if (image_id && accessToken) {
      const tokenPart = accessToken.split(".")[2];
      return `https://api2dev.arito.vn/api/v1/DownloadFile0/${image_id}/${tokenPart}`;
    }
    return 'https://placehold.co/400x400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Quay lại</span>
      </button>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : !book ? (
        <div className="text-center py-12 text-gray-500">Không tìm thấy sách</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={getImageUrl(book.image_id)}
                  alt={book.text || 'Không có tên'}
                  className="w-full h-96 object-cover"
                />
                <div className="p-6 space-y-4">
                  <div className="relative group">
                    <button
                      onClick={book.file_id ? handleReadBook : undefined}
                      disabled={!book.file_id}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${book.file_id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      style={!book.file_id ? { pointerEvents: 'none' } : undefined}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Đọc sách</span>
                    </button>
                    {!book.file_id && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                        Sách chưa được upload PDF
                      </div>
                    )}
                  </div>
                  <div className="relative group">
                    <button
                      disabled
                      className="w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors bg-gray-300 text-gray-500 cursor-not-allowed"
                      style={{ pointerEvents: 'none' }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Mượn sách</span>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                      Tính năng đang được phát triển
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Không có isFeatured/isNew từ API, có thể bổ sung nếu backend trả về */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FileText className="h-3 w-3 mr-1" />
                  {book.loai_sach || 'N/A'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.text || 'Không có tên'}</h1>
              <p className="text-xl text-gray-600 mb-6">bởi {book.tac_gia || 'N/A'}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{book.view_yn || 0} lượt xem</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{book.so_lan || 0} lượt mượn</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{book.ngay_bh ? new Date(book.ngay_bh).getFullYear() : 'N/A'}</span>
                </div>
                {/* <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{book.nxb || 'N/A'}</span>
                </div> */}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sách</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {book.note || ''}
                </p>
              </div>
            </div>

            {/* Book Information */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tác giả</dt>
                    <dd className="text-lg text-gray-900">{book.tac_gia || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Năm xuất bản</dt>
                    <dd className="text-lg text-gray-900">{book.ngay_bh ? new Date(book.ngay_bh).getFullYear() : 'N/A'}</dd>
                  </div>
                  {/*
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nhà xuất bản</dt>
                    <dd className="text-lg text-gray-900">{book.nxb || 'N/A'}</dd>
                  </div>
                  */}
                </div>
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Định dạng</dt>
                    <dd className="text-lg text-gray-900">{book.loai_sach || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lượt xem</dt>
                    <dd className="text-lg text-gray-900">{book.view_yn || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lượt mượn</dt>
                    <dd className="text-lg text-gray-900">{book.so_lan || 0}</dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thể loại</h2>
              <div className="flex flex-wrap gap-3">
                {book.ten_loai ? (
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                    {book.ten_loai}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium">
                    N/A
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;