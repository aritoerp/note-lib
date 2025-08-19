import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

// --- Các interface không thay đổi ---
interface User {
  id: string;
  name: string;
  username: string; // Đúng với API
  dateOfBirth: string;
  class?: string;
  department?: string;
  isAdmin: boolean;
  borrowedBooks: string[];
  readBooks: string[];
  accessToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  addToBorrowed: (bookId: string) => void;
  removeFromBorrowed: (bookId: string) => void;
  addToRead: (bookId: string) => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- AuthProvider đã được cập nhật ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('library_user');
    localStorage.removeItem('library_access_token');
    window.location.href = '/login';
  };

  const addToBorrowed = (bookId: string) => {
    if (user && !user.borrowedBooks.includes(bookId)) {
      const updatedUser = {
        ...user,
        borrowedBooks: [...user.borrowedBooks, bookId]
      };
      setUser(updatedUser);
      localStorage.setItem('library_user', JSON.stringify(updatedUser));
    }
  };
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect để khôi phục session từ localStorage khi khởi động app (giữ nguyên)
  useEffect(() => {
    const savedUser = localStorage.getItem('library_user');
    const savedToken = localStorage.getItem('library_access_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://thuvien.truongso.vn/web/login', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.code === 200 && response.data.data) {
        const { accessToken, userInfo } = response.data.data;
        const loggedInUser: User = {
          id: userInfo.user_id?.toString() || '',
          name: userInfo.nickname || userInfo.username || '',
          username: userInfo.username || '',
          dateOfBirth: userInfo.ngay_sinh || '',
          class: userInfo.lop || '',
          department: userInfo.ma_bp || '',
          isAdmin: userInfo.admin === 1,
          borrowedBooks: [],
          readBooks: [],
          accessToken: accessToken,
        };
        setUser(loggedInUser);
        setAccessToken(accessToken);
        localStorage.setItem('library_user', JSON.stringify(loggedInUser));
        localStorage.setItem('library_access_token', accessToken);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setIsLoading(false);
      return false;
    }
  };
  const removeFromBorrowed = (bookId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        borrowedBooks: user.borrowedBooks.filter(id => id !== bookId)
      };
      setUser(updatedUser);
      localStorage.setItem('library_user', JSON.stringify(updatedUser));
    }
  };

  const addToRead = (bookId: string) => {
    if (user && !user.readBooks.includes(bookId)) {
      const updatedUser = {
        ...user,
        readBooks: [...user.readBooks, bookId]
      };
      setUser(updatedUser);
      localStorage.setItem('library_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        addToBorrowed,
        removeFromBorrowed,
        addToRead,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};