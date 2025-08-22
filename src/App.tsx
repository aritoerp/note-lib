import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryBooksPage from './pages/CategoryBooksPage';
import BookDetailPage from './pages/BookDetailPage';
import ReadingPage from './pages/ReadingPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import LearningMaterialsPage from './pages/LearningMaterialsPage';
import LearningMaterialDetailPage from './pages/LearningMaterialDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:categoryId" element={<CategoryBooksPage />} />
            <Route path="books/:bookId" element={<BookDetailPage />} />
            <Route path="books/:bookId/read" element={<ReadingPage />} />
            {/* --Chưa làm-- */}
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:newsId" element={<NewsDetailPage />} />
            <Route path="learning-materials" element={<LearningMaterialsPage />} />
            <Route path="learning-materials/:materialCode" element={<LearningMaterialDetailPage />} />
            {/* --Chưa làm-- */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="search" element={<SearchResultsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;