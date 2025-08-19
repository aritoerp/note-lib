import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomePage: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [newBooks, setNewBooks] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getImageUrl = (image_id: string | null | undefined) => {
    if (image_id && accessToken) {
      const tokenPart = accessToken.split(".")[2];
      return `https://api2dev.arito.vn/api/v1/DownloadFile0/${image_id}/${tokenPart}`;
    }
    return 'https://placehold.co/400x400';
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const featuredRes = await axios.post('https://thuvien.truongso.vn/web/featured', JSON.stringify({
          accessToken,
          memvars: { loai_sach: '', pageIndex: 0 }
        }), { headers: { 'Content-Type': 'application/json' } });

        const newRes = await axios.post('https://thuvien.truongso.vn/web/recent', JSON.stringify({
          accessToken,
          memvars: { loai_sach: '', pageIndex: 0 }
        }), { headers: { 'Content-Type': 'application/json' } });

        const popRes = await axios.post('https://thuvien.truongso.vn/web/popular', JSON.stringify({
          accessToken,
          memvars: { loai_sach: '', pageIndex: 0 }
        }), { headers: { 'Content-Type': 'application/json' } });


        if(featuredRes.data.code!=200||newRes.data.code!=200||popRes.data.code!=200) {
          throw new Error('Lỗi khi tải dữ liệu');
        }

        setFeaturedBooks(featuredRes.data?.data || []);
        setNewBooks(newRes.data?.data || []);
        setPopularBooks(popRes.data?.data || []);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu'); 
        logout();
      }
      setLoading(false);
    };
    fetchAll();
  }, [accessToken]);

  return (
    <div className="space-y-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* === Sách nổi bật === */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                Sách nổi bật
              </h2>
              <p className="text-gray-600 mt-2">Những cuốn sách được chọn lọc, nổi bật nhất</p>
            </div>
            <Link
              to="/categories"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {loading || error ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.slice(0, 10).map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="block h-full group">
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <img
                      src={getImageUrl(book.image_id)}
                      alt={book.text}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col justify-between flex-1 p-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{book.text}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{book.tac_gia}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* === Sách mới nhất === */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                Sách mới nhất
              </h2>
              <p className="text-gray-600 mt-2">Khám phá những cuốn sách vừa được cập nhật</p>
            </div>
          </div>
          {loading || error ? null : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {newBooks.slice(0, 10).map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="block h-full group">
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <img
                      src={getImageUrl(book.image_id)}
                      alt={book.text}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col justify-between flex-1 p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{book.text}</h3>
                      <p className="text-gray-600 text-sm mb-1 line-clamp-2">{book.tac_gia}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* === Sách mượn nhiều nhất === */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-8 w-8 text-orange-500 mr-3" />
                Sách mượn nhiều nhất
              </h2>
              <p className="text-gray-600 mt-2">Top sách được mượn nhiều nhất trong thư viện</p>
            </div>
          </div>
          {loading || error ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularBooks.slice(0, 10).map((book) => (
                <Link key={book.id} to={`/books/${book.id}`} className="block h-full group">
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <img
                      src={getImageUrl(book.image_id)}
                      alt={book.text}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex flex-col justify-between flex-1 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{book.text}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{book.tac_gia}</p>
                      <div className="text-sm text-gray-500">Số lần mượn: {book.so_lan}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
