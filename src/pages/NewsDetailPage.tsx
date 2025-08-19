import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { news } from '../data/mockData';
import { ChevronLeft, Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

const NewsDetailPage: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();

  const newsItem = news.find(n => n.id === newsId);

  if (!newsItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy tin tức</h1>
          <button
            onClick={() => navigate('/news')}
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/news')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Quay lại tin tức</span>
      </button>

      <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="p-8 lg:p-12">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(newsItem.date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>bởi {newsItem.author}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {newsItem.title}
          </h1>

          {/* Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {newsItem.summary}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              {newsItem.content}
            </p>
            
            {/* Extended content for demo */}
            <p className="text-gray-700 leading-relaxed mb-6">
              Thư viện số của chúng tôi không ngừng cải tiến và mở rộng để phục vụ tốt hơn 
              nhu cầu học tập và nghiên cứu của độc giả. Việc bổ sung các đầu sách mới 
              được thực hiện một cách có hệ thống, đảm bảo chất lượng và tính cập nhật 
              của thông tin.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Các đầu sách mới được lựa chọn kỹ lưỡng từ những nhà xuất bản uy tín, 
              bao gồm cả sách tiếng Việt và tiếng nước ngoài. Đặc biệt, chúng tôi 
              chú trọng việc số hóa những tác phẩm kinh điển và tài liệu quý hiếm 
              để bảo tồn và lan tỏa giá trị văn hóa.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Lợi ích của thư viện số</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Truy cập 24/7 từ mọi nơi có kết nối internet</li>
              <li>Tìm kiếm nhanh chóng và chính xác</li>
              <li>Không lo hết sách hoặc hỏng sách</li>
              <li>Hỗ trợ nhiều định dạng file khác nhau</li>
              <li>Tiết kiệm thời gian và chi phí</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              Chúng tôi cam kết tiếp tục phát triển và hoàn thiện hệ thống để mang đến 
              trải nghiệm đọc sách tuyệt vời nhất cho tất cả người dùng.
            </p>
          </div>

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Chia sẻ bài viết:</span>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Sao chép link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related News */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tin tức liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.filter(n => n.id !== newsId).slice(0, 2).map((relatedNews) => (
            <div key={relatedNews.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <img
                src={relatedNews.image}
                alt={relatedNews.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {relatedNews.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {relatedNews.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(relatedNews.date).toLocaleDateString('vi-VN')}
                  </span>
                  <button
                    onClick={() => navigate(`/news/${relatedNews.id}`)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Đọc thêm →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;