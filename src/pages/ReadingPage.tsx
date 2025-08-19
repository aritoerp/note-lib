import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, RotateCcw, ZoomIn, ZoomOut, Bookmark } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // <-- THÊM IMPORT NÀY

// --- Cấu hình Worker cho react-pdf ---
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs`;

// FIX 1: TẠO CUSTOM HOOK `useDebounce` (Giữ nguyên)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// Định nghĩa kiểu dữ liệu cho sách từ API
interface BookData {
    id: number;
    text: string;
    tac_gia: string;
    file_id: string;
    // Thêm các thuộc tính khác nếu cần
}


const ReadingPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth(); // <-- Lấy accessToken từ context

  // --- States ---
  const [book, setBook] = useState<BookData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdf, setPdf] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(String(currentPage));
  const debouncedInputValue = useDebounce(inputValue, 800);

  const [zoom, setZoom] = useState(100);
  const [pageWidth, setPageWidth] = useState(500);
  const [pageHeight, setPageHeight] = useState(700);
  const [mainAreaHeight, setMainAreaHeight] = useState(0);

  // --- Refs ---
  const flipBookRef = useRef<any>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // --- Logic mới: Lấy dữ liệu sách và URL PDF từ API ---
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!accessToken || !bookId) {
        setApiError("Thông tin xác thực hoặc ID sách không hợp lệ.");
        setLoading(false);
        // Tùy chọn: Điều hướng về trang đăng nhập nếu không có token
        // navigate('/login');
        return;
      }

      setLoading(true);
      setApiError(null);

      try {
        const payload = {
          accessToken,
          memvars: {
            loai_sach: "",
            id: bookId,
            pageIndex: 0
          }
        };

        const response = await axios.post('https://thuvien.truongso.vn/web/ebooks', payload, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data?.code === 200 && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const bookData: BookData = response.data.data[0];
          setBook(bookData);

          // Xây dựng URL để tải PDF
          if (bookData.file_id) {
            const tokenPart = accessToken.split(".")[2];
            const finalPdfUrl = `https://thuvien.truongso.vn/web/download-pdf?pdfUrl=https://api2dev.arito.vn/api/v1/DownloadFile0/${bookData.file_id}/${tokenPart}`;
            setPdfUrl(finalPdfUrl);
          } else {
            setApiError('Sách này không có file đính kèm.');
          }
        } else {
          setApiError(response.data?.messageText || 'Không tìm thấy thông tin sách.');
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
        setApiError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
        logout(); // <-- Thêm logout nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, accessToken, navigate]);

  
  // --- Logic tính toán layout (Giữ nguyên) ---
  useEffect(() => {
    const updateLayout = () => {
      if (!headerRef.current) return;
      const headerHeight = headerRef.current.offsetHeight;
      const footerHeight = footerRef.current?.offsetHeight || 0;
      const mainHeight = window.innerHeight - headerHeight - footerHeight; 
      setMainAreaHeight(mainHeight > 0 ? mainHeight : 0);

      const containerPadding = 32;
      const availableHeightForBook = mainHeight - containerPadding;
      const availableWidthForBook = window.innerWidth - containerPadding;
      const aspectRatio = Math.sqrt(2);

      let newPageHeight = availableHeightForBook;
      let newPageWidth = newPageHeight / aspectRatio;
      if (newPageWidth * 2 > availableWidthForBook) {
        newPageWidth = availableWidthForBook / 2;
        newPageHeight = newPageWidth * aspectRatio;
      }
      setPageWidth(Math.floor(newPageWidth));
      setPageHeight(Math.floor(newPageHeight));
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    if (footerRef.current) {
      const resizeObserver = new ResizeObserver(updateLayout);
      resizeObserver.observe(footerRef.current);
      return () => {
        window.removeEventListener('resize', updateLayout);
        resizeObserver.disconnect();
      };
    }
    return () => window.removeEventListener('resize', updateLayout);
  }, [numPages]);

  // --- Handlers (Giữ nguyên và điều chỉnh) ---
  const onDocumentLoadSuccess = (loadedPdf: any) => { setNumPages(loadedPdf.numPages); setPdf(loadedPdf); };
  const onDocumentLoadError = (error: any) => { setApiError('Không thể tải file PDF. File có thể bị lỗi hoặc không được hỗ trợ.'); console.error("PDF Load Error:", error); };
  
  const handlePrevPage = () => flipBookRef.current?.pageFlip().flipPrev();
  const handleNextPage = () => flipBookRef.current?.pageFlip().flipNext();
  const handleFlip = (e: { data: number }) => setCurrentPage(e.data + 1);
  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 50));
  const handleResetZoom = () => setZoom(100);
  const goToPage = (page: number) => {
    if (!isNaN(page) && page >= 1 && numPages && page <= numPages && page !== currentPage) {
      flipBookRef.current?.pageFlip().flip(page - 1);
      setCurrentPage(page);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      goToPage(parseInt(inputValue, 10));
      e.currentTarget.blur();
    }
  };

  // --- Effects đồng bộ hóa (Giữ nguyên) ---
  useEffect(() => {
    const pageNum = parseInt(debouncedInputValue, 10);
    if (!isNaN(pageNum)) { goToPage(pageNum); }
  }, [debouncedInputValue, numPages]);

  useEffect(() => { setInputValue(String(currentPage)); }, [currentPage]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName.toLowerCase() === 'input') return;
      if (e.key === 'ArrowRight') handleNextPage();
      else if (e.key === 'ArrowLeft') handlePrevPage();
      else if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Tải Document ẩn để lấy thông tin số trang, chỉ khi có pdfUrl */}
      {pdfUrl && (
         <div style={{ display: 'none' }}>
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} />
         </div>
      )}
     
      <header ref={headerRef} className="bg-gray-800 border-b border-gray-700 p-4 flex-shrink-0 z-20">
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="h-6 w-6" /></button>
              <div>
                <h1 className="text-lg font-bold">{book?.text || 'Đang tải...'}</h1>
                <p className="text-gray-400 text-sm">bởi {book?.tac_gia || 'Không rõ'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                <button onClick={handleZoomOut} className="p-2 hover:bg-gray-600 rounded"><ZoomOut className="h-4 w-4" /></button>
                <span className="text-sm px-2 w-12 text-center">{zoom}%</span>
                <button onClick={handleZoomIn} className="p-2 hover:bg-gray-600 rounded"><ZoomIn className="h-4 w-4" /></button>
                <button onClick={handleResetZoom} className="p-2 hover:bg-gray-600 rounded"><RotateCcw className="h-4 w-4" /></button>
              </div>
              {numPages && (
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-sm">Trang</span>
                  <input type="number" value={inputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} className="w-16 bg-gray-600 text-center rounded px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min={1} max={numPages} />
                  <span className="text-sm">/ {numPages}</span>
                </div>
              )}
              <button className="p-2 hover:bg-gray-700 rounded-lg"><Bookmark className="h-6 w-6" /></button>
            </div>
         </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center relative" style={{ height: mainAreaHeight > 0 ? `${mainAreaHeight}px` : 'auto', }}>
        {loading && <div className="text-center">Đang tải thông tin sách...</div>}
        {apiError && <div className="text-red-400 text-center">{apiError}</div>}
        
        {!loading && !apiError && pdf && numPages && (
          <div style={{ transform: `scale(${zoom / 120})` }}>
            <div style={{ width: pageWidth * 2, height: pageHeight+140, backgroundColor:"transparent"}}>
              <HTMLFlipBook 
                ref={flipBookRef} 
                width={pageWidth} 
                height={pageHeight+140} 
                size="fixed" 
                showCover={true} 
                mobileScrollSupport={true} 
                onFlip={handleFlip} 
                startPage={currentPage - 1} 
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <div className="page bg-white" key={`page_${index + 1}`}>
                    <Page 
                      pdf={pdf} 
                      pageNumber={index + 1} 
                      width={pageWidth} 
                      height={pageHeight}
                      renderAnnotationLayer={false} 
                      renderTextLayer={false}  
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        )}

        {/* Hiển thị nút điều hướng chỉ khi sách đã tải xong */}
        {pdf && numPages && (
          <>
            <button onClick={handlePrevPage} className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 hover:bg-gray-700 rounded-full transition-colors z-30"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={handleNextPage} className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 hover:bg-gray-700 rounded-full transition-colors z-30"><ChevronRight className="h-6 w-6" /></button>
          </>
        )}
      </main> 
    </div>
  );
};

export default ReadingPage;