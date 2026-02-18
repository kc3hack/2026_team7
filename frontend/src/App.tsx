import './App.css';
import { Routes, Route } from 'react-router-dom';
import Top from './pages/Top/Top';
import Card from './pages/Card/Card';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/card" element={<Card />} />
    </Routes>
  );
}

export default App;
