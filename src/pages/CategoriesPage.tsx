import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BACKEND_HOST } from '../env';


const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
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
            loai_sach: "",
            pageIndex: 0
          }
        });
        const response = await axios.post(`${BACKEND_HOST}/categories`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setCategories(response.data.data);
        } else {
          setError('Không lấy được danh sách thể loại');
          throw new Error('Không lấy được danh sách thể loại');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchCategories();
  }, [accessToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thể loại sách
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Khám phá thư viện đa dạng với các thể loại sách phong phú,
          từ văn học đến khoa học, từ kinh tế đến công nghệ
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.text}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.ten_loai}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {category.note}
                </p> 
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;