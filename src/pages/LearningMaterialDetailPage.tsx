import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningMaterials } from '../data/mockData';
import { ChevronLeft, Eye, Calendar, User, Play, Download, Share2 } from 'lucide-react';

const LearningMaterialDetailPage: React.FC = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  const material = learningMaterials.find(m => m.id === materialId);

  if (!material) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy học liệu</h1>
          <button
            onClick={() => navigate('/learning-materials')}
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
            Quay lại danh sách học liệu
          </button>
        </div>
      </div>
    );
  }

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

  const renderContent = () => {
    switch (material.type) {
      case 'video':
        return (
          <div className="bg-black rounded-xl overflow-hidden aspect-video">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg">Video Player</p>
                <p className="text-sm opacity-80">Trong ứng dụng thực tế, đây sẽ là trình phát video</p>
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={material.url}
              alt={material.title}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="bg-gray-100 rounded-xl p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audio Player</h3>
              <p className="text-gray-600 mb-6">Trong ứng dụng thực tế, đây sẽ là trình phát âm thanh</p>
              <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-4">
                  <button className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                    <Play className="h-6 w-6" />
                  </button>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2:35 / 8:42</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/learning-materials')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Quay lại học liệu</span>
      </button>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(material.type)}`}>
              {getTypeName(material.type)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {material.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{material.views.toLocaleString()} lượt xem</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(material.uploadDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>bởi {material.uploader}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {material.description}
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Đây là một tài liệu học tập chất lượng cao được tạo ra bởi các chuyên gia 
              trong lĩnh vực. Nội dung được trình bày một cách khoa học và dễ hiểu, 
              phù hợp cho việc học tập và nghiên cứu.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tương tác</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-5 w-5" />
              <span>Tải xuống</span>
            </button>
            <button className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              <Share2 className="h-5 w-5" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Related Materials */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Học liệu liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningMaterials
              .filter(m => m.id !== material.id && m.type === material.type)
              .slice(0, 2)
              .map((relatedMaterial) => (
                <div key={relatedMaterial.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {relatedMaterial.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {relatedMaterial.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {relatedMaterial.views.toLocaleString()} lượt xem
                    </span>
                    <button
                      onClick={() => navigate(`/learning-materials/${relatedMaterial.id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Xem →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterialDetailPage;