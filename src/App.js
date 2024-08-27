import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Matching from './components/Matching';
import CompatibilityQuiz from './components/CompatibilityQuiz';

const theme = extendTheme({
  colors: {
    brand: {
      100: "#ff6b6b",
      200: "#4ecdc4",
      300: "#45b7d1",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/matching" element={<PrivateRoute><Matching /></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><CompatibilityQuiz /></PrivateRoute>} />
          </Routes>
        </Router>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;