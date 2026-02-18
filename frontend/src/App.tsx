import './App.css';
import { Routes, Route } from 'react-router-dom';
import Top from './pages/Top/Top';
import Update from './pages/Update/Update';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Top />} />
      <Route path="/update" element={<Update />} />
    </Routes>
  );
}

export default App;
