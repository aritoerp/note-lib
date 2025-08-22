import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Eye, Calendar, User, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BACKEND_HOST } from '../env';
import { getFileUrl } from '../utils/fileUtils';
import { getTypeIcon, getTypeName, getTypeColor, MaterialType, types } from '../utils/materialTypeUtils';

const LearningMaterialsPage: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [selectedType, setSelectedType] = useState<MaterialType>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
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
            type: '',
            id: '',
            pageIndex: 0
          }
        });
        const response = await axios.post(`${BACKEND_HOST}/euresource`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          setMaterials(response.data.data);
        } else {
          setError('Không lấy được danh sách học liệu');
          throw new Error('Không lấy được danh sách học liệu');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchMaterials();
  }, [accessToken]);

  useEffect(() => {
    const handleFilter = async () => {
      const filterMats = materials.filter(material => {
        const matchesType = selectedType === '' || material.type === selectedType;
        const matchesSearch = material.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            material.note.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
      });

      setFilteredMaterials(filterMats);
    };
    handleFilter();
  }, [materials, selectedType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Học liệu điện tử
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Kho tài nguyên học tập đa phương tiện với video, hình ảnh và sách nói chất lượng cao
        </p>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm học liệu theo tên, mô tả..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as MaterialType)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>{getTypeName(type)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as MaterialType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${selectedType == type ? `bg-${getTypeColor(selectedType)}-600 text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {getTypeIcon(type, '4')}
                  <span>{getTypeName(type)} ({materials.filter(m => type === '' || m.type === type).length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material) => (
              <Link
                key={material.type + '-' + material.id}
                to={`/learning-materials/${material.type + '-' + material.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {material.type === 'IMAGE' ? (
                      <img
                        src={getFileUrl(accessToken, material.image_id, '/images/400x400.svg')}
                        alt={material.text}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-${getTypeColor(material.type)}-100 text-${getTypeColor(material.type)}-600`}>
                            {getTypeIcon(material.type)}
                          </div>
                          <p className="text-gray-600 font-medium">{getTypeName(material.type)}</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${getTypeColor(material.type)}-100 text-${getTypeColor(material.type)}-800`}>
                        {getTypeIcon(material.type)}
                        <span className="ml-1">{getTypeName(material.type)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {material.text}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {material.note}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="h-3 w-3"/>
                      <span>{material.tac_gia || 'Không rõ'}</span>
                    </div>

                    {/* <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4"/>
                        <span>0 lượt xem</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4"/>
                        <span>{new Date(material.uploadDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto"/>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy học liệu nào
              </h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}

          {/* Statistics */}
          {/* <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Thống kê học liệu</h2>
              <p className="text-emerald-100">Kho tài nguyên học tập đa dạng và phong phú</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {materials.filter(m => m.type === 'VIDEO').length}
                </div>
                <div className="text-emerald-100">Video</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {materials.filter(m => m.type === 'IMAGE').length}
                </div>
                <div className="text-emerald-100">Hình ảnh</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {materials.filter(m => m.type === 'AUDIO').length}
                </div>
                <div className="text-emerald-100">Sách nói</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {materials.reduce((sum, m) => sum + 0, 0).toLocaleString()}
                </div>
                <div className="text-emerald-100">Lượt xem</div>
              </div>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default LearningMaterialsPage;