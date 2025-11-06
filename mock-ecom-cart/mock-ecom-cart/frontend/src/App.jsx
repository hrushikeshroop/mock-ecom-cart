import React, { useEffect, useState } from "react";
import { listProducts, getCart, addToCart, updateQty, removeFromCart, checkout } from "./api";

function ReceiptModal({ receipt, onClose }){
  if (!receipt) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Receipt</h2>
        <p className="muted">{new Date(receipt.timestamp).toLocaleString()}</p>
        <ul>
          {receipt.items.map(it => (
            <li key={it.id}>
              {it.name} × {it.qty} — ₹{it.price * it.qty}
            </li>
          ))}
        </ul>
        <h3>Total: ₹{receipt.total}</h3>
        <p className="muted">{receipt.note}</p>
        <div className="row" style={{justifyContent:'flex-end', marginTop: 12}}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Cart(){
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh(){
    const c = await getCart();
    setCart(c);
  }
  
  useEffect(() => {
  refresh(); // initial
  const handler = () => refresh();
  window.addEventListener('cart:updated', handler);
  return () => window.removeEventListener('cart:updated', handler);
}, []);

  async function onUpdate(productId, qty){
    const q = Math.max(1, Number(qty) || 1);
    await updateQty(productId, q);
    await refresh();
  }
  async function onRemove(productId){
    await removeFromCart(productId);
    await refresh();
  }
  async function onCheckout(){
    setLoading(true);
    try {
      const r = await checkout(name, email);
      setReceipt(r);
      setName(""); setEmail("");
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.items.length === 0 && <p className="muted">Cart is empty</p>}

      <div className="cart-table">
        <div className="cart-header row">
          <div className="cart-col name" style={{ fontWeight: 'bold' }}>Item</div>
          <div className="cart-col price" style={{ fontWeight: 'bold' }}>Price</div>
          <div className="cart-col qty" style={{ fontWeight: 'bold' }}>Quantity</div>
          <div className="cart-col action"></div>
        </div>

        {cart.items.map(it => (
          <div className="cart-row row" key={it.id}>
            <div className="cart-col name">{it.name}</div>
            <div className="cart-col price">₹{it.price}</div>

            <div className="cart-col qty">
              <button
                className="secondary"
                onClick={async () => {
                  const next = it.qty - 1;
                  if (next < 1) await removeFromCart(it.id);
                  else await updateQty(it.id, next);
                  await refresh();
                }}
              >–</button>

              <input
                className="input"
                type="number"
                min="1"
                value={it.qty}
                onChange={async e => {
                  const q = Math.max(1, Number(e.target.value) || 1);
                  await updateQty(it.id, q);
                  await refresh();
                }}
                style={{ width: 60, textAlign: "center" }}
              />

              <button
                className="secondary"
                onClick={async () => {
                  await updateQty(it.id, it.qty + 1);
                  await refresh();
                }}
              >+</button>
            </div>

            <div className="cart-col action">
              <button className="secondary" onClick={async () => {
                await removeFromCart(it.id);
                await refresh();
              }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>


      <div className="row" style={{marginTop:16}}>
        <strong>Total:</strong>
        <strong style={{marginLeft:30}}>₹{cart.total}</strong>
      </div>
      <div style={{marginTop:16}}>
        <h3>Checkout</h3>
        <div className="row" style={{ gap: 0 }}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{ width: 310, marginRight: 0 }} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: 340, marginLeft: -225 }} />
          <button onClick={onCheckout} disabled={loading || cart.items.length===0 || !name || !email}>
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}

function ProductGrid(){
  const [products, setProducts] = useState([]);
  const [adding, setAdding] = useState({});

  useEffect(() => {
    (async () => {
      const list = await listProducts();
      setProducts(list);
    })();
  }, []);


  async function add(id){
  setAdding(prev => ({...prev, [id]: true}));
  try { 
    await addToCart(id, 1);
    // notify others (Cart) to refresh
    window.dispatchEvent(new Event('cart:updated'));
  } finally { 
    setAdding(prev => ({...prev, [id]: false})); 
  }
}


  return (
    <div className="grid">
      {products.map(p => (
        <div key={p.id} className="card">
          <div style={{fontWeight:600}}>{p.name}</div>
          <div className="muted">₹{p.price}</div>
          <button onClick={() => add(p.id)} disabled={adding[p.id]}>
            {adding[p.id] ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function App(){
  return (
    <>
      <header>
        <h1>Mock E‑Com Cart</h1>
        <span className="muted">Vibe Commerce screening</span>
      </header>
      <div className="container">
        <ProductGrid />
        <Cart />
      </div>
    </>
  )
}
