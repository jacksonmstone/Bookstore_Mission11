import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import Cart from './components/Cart';
import AdminBooks from './components/AdminBooks';

function StoreFront() {
  const [view, setView] = useState<'books' | 'cart'>('books');

  return (
    <CartProvider>
      {/* Keep BookList mounted so pagination/category state persists when returning from cart */}
      <div style={{ display: view === 'books' ? 'block' : 'none' }}>
        <BookList onViewCart={() => setView('cart')} />
      </div>
      <div style={{ display: view === 'cart' ? 'block' : 'none' }}>
        <Cart onContinueShopping={() => setView('books')} />
      </div>
      <div className="container mb-3">
        <Link to="/adminbooks" className="text-muted small">Admin</Link>
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
