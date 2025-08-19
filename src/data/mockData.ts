export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publishYear: number;
  publisher: string;
  categories: string[];
  views: number;
  borrows: number;
  coverImage: string;
  isFeatured: boolean;
  isNew: boolean;
  fileType: 'PDF' | 'ePub';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  bookCount: number;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  thumbnail?: string;
  views: number;
  uploadDate: string;
  uploader: string;
}

export const books: Book[] = [
  {
    id: '1',
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử',
    publishYear: 1936,
    publisher: 'Simon & Schuster',
    categories: ['self-help', 'psychology'],
    views: 1250,
    borrows: 890,
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    isFeatured: true,
    isNew: false,
    fileType: 'PDF'
  },
  {
    id: '2',
    title: 'Sapiens: Lược sử loài người',
    author: 'Yuval Noah Harari',
    description: 'Câu chuyện về sự tiến hóa của loài người từ thời tiền sử đến hiện đại',
    publishYear: 2011,
    publisher: 'Harvill Secker',
    categories: ['history', 'science'],
    views: 2100,
    borrows: 1200,
    coverImage: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
    isFeatured: true,
    isNew: true,
    fileType: 'ePub'
  },
  {
    id: '3',
    title: 'Cấu trúc dữ liệu và giải thuật',
    author: 'Robert Sedgewick',
    description: 'Giáo trình về cấu trúc dữ liệu và các thuật toán cơ bản',
    publishYear: 2018,
    publisher: 'Addison-Wesley',
    categories: ['technology', 'education'],
    views: 980,
    borrows: 650,
    coverImage: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    isFeatured: false,
    isNew: true,
    fileType: 'PDF'
  },
  {
    id: '4',
    title: 'Tôi thấy hoa vàng trên cỏ xanh',
    author: 'Nguyễn Nhật Ánh',
    description: 'Tiểu thuyết về tuổi thơ và những kỷ niệm đẹp đẽ',
    publishYear: 2010,
    publisher: 'NXB Trẻ',
    categories: ['literature', 'vietnamese'],
    views: 1800,
    borrows: 1100,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
    isFeatured: true,
    isNew: false,
    fileType: 'PDF'
  },
  {
    id: '5',
    title: 'Kinh tế học vĩ mô',
    author: 'N. Gregory Mankiw',
    description: 'Giáo trình cơ bản về kinh tế học vĩ mô',
    publishYear: 2019,
    publisher: 'Cengage Learning',
    categories: ['economics', 'education'],
    views: 750,
    borrows: 420,
    coverImage: 'https://images.pexels.com/photos/1370304/pexels-photo-1370304.jpeg',
    isFeatured: false,
    isNew: false,
    fileType: 'PDF'
  }
];

export const categories: Category[] = [
  { id: 'literature', name: 'Văn học', description: 'Sách văn học trong và ngoài nước', bookCount: 150 },
  { id: 'science', name: 'Khoa học', description: 'Sách khoa học tự nhiên và ứng dụng', bookCount: 89 },
  { id: 'technology', name: 'Công nghệ', description: 'Sách về công nghệ thông tin và kỹ thuật', bookCount: 76 },
  { id: 'economics', name: 'Kinh tế', description: 'Sách về kinh tế và quản trị kinh doanh', bookCount: 45 },
  { id: 'history', name: 'Lịch sử', description: 'Sách lịch sử Việt Nam và thế giới', bookCount: 67 },
  { id: 'psychology', name: 'Tâm lý học', description: 'Sách về tâm lý và phát triển bản thân', bookCount: 34 },
  { id: 'self-help', name: 'Phát triển bản thân', description: 'Sách kỹ năng sống và phát triển cá nhân', bookCount: 58 },
  { id: 'education', name: 'Giáo dục', description: 'Sách giáo khoa và tài liệu học tập', bookCount: 123 },
  { id: 'vietnamese', name: 'Văn học Việt Nam', description: 'Tác phẩm văn học của các tác giả Việt Nam', bookCount: 92 }
];

export const news: News[] = [
  {
    id: '1',
    title: 'Thư viện số mở rộng bộ sưu tập sách điện tử',
    summary: 'Thư viện vừa bổ sung hơn 500 đầu sách điện tử mới thuộc nhiều lĩnh vực khác nhau',
    content: 'Trong nỗ lực không ngừng phát triển và hiện đại hóa dịch vụ, thư viện số của chúng tôi vừa chính thức bổ sung hơn 500 đầu sách điện tử mới...',
    date: '2025-01-15',
    image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
    author: 'Thu Thủy'
  },
  {
    id: '2',
    title: 'Workshop "Kỹ năng nghiên cứu và tra cứu tài liệu"',
    summary: 'Buổi workshop hướng dẫn sinh viên cách tìm kiếm và sử dụng tài liệu nghiên cứu hiệu quả',
    content: 'Nhằm hỗ trợ sinh viên trong việc nghiên cứu và học tập, thư viện tổ chức workshop về kỹ năng tra cứu tài liệu...',
    date: '2025-01-10',
    image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg',
    author: 'Minh Đức'
  },
  {
    id: '3',
    title: 'Gia hạn thời gian mượn sách trong kỳ thi',
    summary: 'Thư viện gia hạn thời gian mượn sách để hỗ trợ sinh viên trong mùa thi cuối kỳ',
    content: 'Để tạo điều kiện thuận lợi cho việc học tập và ôn thi của sinh viên, thư viện quyết định gia hạn thời gian mượn sách...',
    date: '2025-01-08',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    author: 'Lan Anh'
  },
  {
    id: '4',
    title: 'Bookstores in OKC',
    summary: 'What do you look for in a good bookstore? Well, a wide selection of books, of course! Maybe a cozy corner to curl up with a newly purchased book? How about a cup of coffee to grab before you start',
    content: 'What do you look for in a good bookstore? Well, a wide selection of books, of course! Maybe a cozy corner to curl up with a newly purchased book? How about a cup of coffee to grab before you start?',
    date: '2025-01-08',
    image: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_600,q_75,w_950/v1/clients/oklahoma/Untitled_design_38__581e7f0f-5578-43df-a90a-a7167a8f270d.png',
    author: 'Vũ Duy'
  }
];

export const learningMaterials: LearningMaterial[] = [
  {
    id: '1',
    title: 'Bài giảng: Lập trình Python cơ bản',
    description: 'Video hướng dẫn lập trình Python từ cơ bản đến nâng cao',
    type: 'video',
    url: '#',
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    views: 1250,
    uploadDate: '2025-01-05',
    uploader: 'TS. Nguyễn Văn A'
  },
  {
    id: '2',
    title: 'Sơ đồ tư duy: Cách mạng công nghiệp 4.0',
    description: 'Infographic về các công nghệ chủ chốt của cuộc cách mạng công nghiệp 4.0',
    type: 'image',
    url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    views: 890,
    uploadDate: '2025-01-03',
    uploader: 'PGS. Trần Thị B'
  },
  {
    id: '3',
    title: 'Podcast: Lịch sử Việt Nam thế kỷ 20',
    description: 'Chương trình audio về các sự kiện lịch sử quan trọng của Việt Nam',
    type: 'audio',
    url: '#',
    views: 650,
    uploadDate: '2024-12-28',
    uploader: 'ThS. Lê Văn C'
  }
];