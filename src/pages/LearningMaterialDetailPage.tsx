import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, Calendar, User, Play, Download, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BACKEND_HOST } from '../env';
import { getFileUrl } from '../utils/fileUtils';
import { getTypeName, getTypeColor } from '../utils/materialTypeUtils';
import AudioPlayer from '../components/AudioPlayer';

const LearningMaterialDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { materialCode } = useParams<{ materialCode: string }>();
  const { accessToken, logout } = useAuth();
  
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [material, setMaterial] = React.useState<any | null>(null);
  const [relateMaterials, setRelateMaterials] = React.useState<any[]>([]);

  const materialtype = materialCode?.split('-')[0], materialId = materialCode != undefined ? parseInt(materialCode?.split('-')[1]) : 0;

  useEffect(() => {
    const fetchMaterial = async () => {
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
            type: materialtype,
            id: materialId,
            pageIndex: 0
          }
        });
        const response = await axios.post(`${BACKEND_HOST}/euresource`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          setMaterial(response.data.data[0]);
        } else {
          setError('Không lấy được học liệu');
          throw new Error('Không lấy được học liệu');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
      setLoading(false);
    };
    fetchMaterial();
  }, [accessToken, materialCode]);

  useEffect(() => {
    const fetchRelateMaterials = async () => {
      setError(null);
      if (!accessToken) {
        window.location.href = '/login';
        return;
      }
      try {
        const data = JSON.stringify({
          accessToken,
          memvars: {
            type: materialtype,
            id: 0,
            pageIndex: 1
          }
        });
        const response = await axios.post(`${BACKEND_HOST}/euresource`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
          setRelateMaterials(response.data.data);
        } else {
          setError('Không lấy được học liệu liên quan');
          throw new Error('Không lấy được học liệu liên quan');
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
        logout();
      }
    };
    fetchRelateMaterials();
  }, [accessToken, materialCode]);

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
  
  const renderContent = () => {
    const fileUrl = getFileUrl(accessToken, material.image_id, material.type == 'IMAGE' ? '/images/400x400.svg' : '');
    switch (material.type) {
      case 'VIDEO':
      case 'ELEARNING':
        return (
          <div className="bg-black rounded-xl overflow-hidden aspect-video">
            <video
              className="w-full h-full flex items-center justify-center text-white"
              src={fileUrl}
              controls
              autoPlay={true}
            />
          </div>
        );
      case 'IMAGE':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={fileUrl}
              alt={material.text}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        );
      case 'AUDIO':
        return (
          <AudioPlayer src={fileUrl}/>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Quay lại học liệu</span>
      </button>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-${getTypeColor(material.type)}-100 text-${getTypeColor(material.type)}-800`}>
              {getTypeName(material.type)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {material.text}
          </h1>
          {/* <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
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
          </div> */}
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
              {material.note}
            </p>
          </div>
        </div>

        {/* Actions */}
        {/*
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
        */}

        {/* Related Materials */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Học liệu liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relateMaterials
              .filter(m => m.id !== material.id)
              .slice(0, 2)
              .map((rMat) => (
                <div key={rMat.type + '-' + rMat.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {rMat.text}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {rMat.note}
                  </p>
                  <div className="flex items-center justify-between">
                    {/* <span className="text-xs text-gray-500">
                      {rMat.views.toLocaleString()} lượt xem
                    </span> */}
                    <button
                      onClick={() => navigate(`/learning-materials/${rMat.type + '-' + rMat.id}`)}
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