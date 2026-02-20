import './App.css';
import { Routes, Route } from 'react-router-dom';
import Top from './pages/Top/Top';
import Card from './pages/Card/Card';
import Update from './pages/Update/Update';

function App() {
  return (
    <Routes>
      {/* トップページ：/ */}
      <Route path="/" element={<Top />} />
      
      {/* カードページ：/cards/{user_name}/ */}
      {/* :user_name とすることで、URLから名前を動的に取得できます */}
      <Route path="/cards/:user_name" element={<Card />} />
      
      {/* 更新画面ページ：/cards/{user_name}/update */}
      <Route path="/cards/:user_name/update" element={<Update />} />
    </Routes>
  );
}

export default App;