import { useCart } from '../context/CartContext';

interface CartProps {
  onContinueShopping: () => void;
}

function Cart({ onContinueShopping }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container my-4">
        <h1 className="mb-4">Shopping Cart</h1>
        <div className="alert alert-info" role="alert">
          Your cart is empty.
        </div>
        <button className="btn btn-primary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h1 className="mb-4">Shopping Cart</h1>

      <div className="row">
        <div className="col-12">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th className="text-end">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.book.bookId}>
                  <td>{item.book.title}</td>
                  <td>{item.book.author}</td>
                  <td className="text-end">${item.book.price.toFixed(2)}</td>
                  <td className="text-center" style={{ width: '150px' }}>
                    <div className="input-group input-group-sm justify-content-center">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.book.bookId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="input-group-text">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.book.bookId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-end">
                    ${(item.book.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.book.bookId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-secondary fw-bold">
                <td colSpan={4} className="text-end">Total:</td>
                <td className="text-end">${cartTotal.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <button className="btn btn-primary" onClick={onContinueShopping}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
