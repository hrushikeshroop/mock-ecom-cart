const API_BASE = 'http://localhost:4000';

export async function listProducts(){
  const res = await fetch(`${API_BASE}/api/products`);
  return res.json();
}

export async function getCart(){
  const res = await fetch(`${API_BASE}/api/cart`);
  return res.json();
}

export async function addToCart(productId, qty=1){
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  return res.json();
}

export async function updateQty(productId, qty){
  const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  return res.json();
}

export async function removeFromCart(productId){
  const res = await fetch(`${API_BASE}/api/cart/${productId}`, { method: 'DELETE' });
  return res.json();
}

export async function checkout(name, email){
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  return res.json();
}
