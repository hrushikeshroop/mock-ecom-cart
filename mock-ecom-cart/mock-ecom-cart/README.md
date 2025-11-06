# Mock E‑Com Cart (Full‑Stack)

Basic e‑commerce cart flow for Vibe Commerce screening. React frontend + Node/Express backend + MongoDB. No real payments. REST APIs only.

## Quick Start
### Prereqs
- Node 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# update MongoDB URL in .env file
# Ensure MongoDB is running and URI in .env is correct
npm run seed
npm run dev
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open http://localhost:5173


## API Summary
- `GET /api/products` → list of mock items
- `POST /api/cart` `{ productId, qty }` → add to cart
- `PATCH /api/cart/:id` `{ qty }` → update quantity
- `DELETE /api/cart/:id` → remove item
- `GET /api/cart` → current cart + total
- `POST /api/checkout` `{ name, email }` → mock receipt

## Notes
- Single demo user (no auth). Cart stored in MongoDB.
- Products are seeded via `npm run seed`.
- Responsive layout with simple CSS. No design libs.
