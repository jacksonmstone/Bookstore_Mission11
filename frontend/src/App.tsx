import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import Cart from './components/Cart';

function App() {
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
    </CartProvider>
  );
}

export default App;
