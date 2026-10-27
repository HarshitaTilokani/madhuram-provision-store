# Madhuram Provision Store

Production-oriented MERN e-commerce for Madhuram Provision Store (Beawar, Rajasthan).

Owners: Raju Jeswani (+91 9462498113), Tulsi Jeswani (+91 9414259167).

## Design
Matches the provided Figma (soft green/mint palette, product cards, hero, categories, promos, footer). No fruits/vegetables.

## Stack
- Client: React + Vite + TypeScript + Tailwind + Framer Motion + Zustand + React Router
- Server: Node + Express + TypeScript + Mongoose + JWT
- Payments: Razorpay architecture ready
- Images: Cloudinary architecture ready

## Quick start
1. cp server/.env.example server/.env  (edit MongoDB URI + JWT secrets)
2. cd server && npm install && npm run seed
3. cd ../client && npm install
4. Run: server `npm run dev` and client `npm run dev`

Demo admin: admin@madhuram.local / Admin@12345

All seed products are DEMO DATA only. Replace with real catalog later.

See full README content in repo for architecture, security, and remaining work.
