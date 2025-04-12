import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Signup } from './pages/Signup';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/blog/title/:title" element={<Blog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/publish" element={<Publish />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
