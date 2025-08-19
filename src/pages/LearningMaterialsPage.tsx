import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { learningMaterials } from '../data/mockData';
import { Play, Image, Headphones, Eye, Calendar, User, Filter } from 'lucide-react';

const LearningMaterialsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = learningMaterials.filter(material => {
    const matchesType = selectedType === 'all' || material.type === selectedType;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'audio':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'image':
        return 'Hình ảnh';
      case 'audio':
        return 'Sách nói';
      default:
        return type;
    }
  };

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
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'video' | 'image' | 'audio')}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="video">Video</option>
              <option value="image">Hình ảnh</option>
              <option value="audio">Sách nói</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Tất cả ({learningMaterials.length})</span>
          </button>
          <button
            onClick={() => setSelectedType('video')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'video'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Play className="h-4 w-4" />
            <span>Video ({learningMaterials.filter(m => m.type === 'video').length})</span>
          </button>
          <button
            onClick={() => setSelectedType('image')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'image'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image className="h-4 w-4" />
            <span>Hình ảnh ({learningMaterials.filter(m => m.type === 'image').length})</span>
          </button>
          <button
            onClick={() => setSelectedType('audio')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'audio'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Headphones className="h-4 w-4" />
            <span>Sách nói ({learningMaterials.filter(m => m.type === 'audio').length})</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMaterials.map((material) => (
          <Link
            key={material.id}
            to={`/learning-materials/${material.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                {material.type === 'image' ? (
                  <img
                    src={material.url}
                    alt={material.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        material.type === 'video' ? 'bg-red-100 text-red-600' :
                        material.type === 'audio' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getTypeIcon(material.type)}
                      </div>
                      <p className="text-gray-600 font-medium">{getTypeName(material.type)}</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                    {getTypeIcon(material.type)}
                    <span className="ml-1">{getTypeName(material.type)}</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {material.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {material.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{material.views.toLocaleString()} lượt xem</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(material.uploadDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span>bởi {material.uploader}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-16 w-16 mx-auto" />
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
      <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Thống kê học liệu</h2>
          <p className="text-emerald-100">Kho tài nguyên học tập đa dạng và phong phú</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {learningMaterials.filter(m => m.type === 'video').length}
            </div>
            <div className="text-emerald-100">Video</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {learningMaterials.filter(m => m.type === 'image').length}
            </div>
            <div className="text-emerald-100">Hình ảnh</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {learningMaterials.filter(m => m.type === 'audio').length}
            </div>
            <div className="text-emerald-100">Sách nói</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {learningMaterials.reduce((sum, m) => sum + m.views, 0).toLocaleString()}
            </div>
            <div className="text-emerald-100">Lượt xem</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterialsPage;