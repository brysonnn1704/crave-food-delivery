# Crave — Food Delivery & Restaurant Discovery

**Crave** is a complete, polished, responsive food delivery web application inspired by modern Indian restaurant discovery platforms such as Zomato and Swiggy.

Powered by **75 real restaurant records** collected from **OpenStreetMap** via the Overpass API under the **Open Database License (ODbL) 1.0**, paired with **444 authentic menu items** from the **Indian Food 101 (CC0 1.0 Universal)** and **Free Food Menus (MIT)** open datasets.

---

## Features

- **Professional Indian Food Delivery UI**: Crave brand red accents (`#e23744`), warm gray secondary surfaces, clean restaurant cards with rounded photos, clear ₹ INR pricing, and responsive layouts.
- **Real Restaurant Data**: Genuine establishments, street addresses, localities, coordinates, and contact details in Mumbai (Colaba, Fort, Bandra West), Delhi (Connaught Place), and Bengaluru (Indiranagar).
- **Ethical Data Ingestion Pipeline**:
  - `npm run data:discover`: Probes permitted endpoints and documents terms.
  - `npm run data:scrape`: Collects restaurant nodes via Overpass API with multi-mirror failover and caching.
  - `npm run data:normalize`: Standardizes schema, validates coordinates, and pairs authentic recipes.
  - `npm run data:validate`: Verifies schema, coordinate bounds, and foreign-key relations.
  - `npm run data:import`: Master pipeline orchestrator.
- **10 Core Food Categories**: Pizza, Burgers, Biryani, Chinese, South Indian, North Indian, Desserts, Healthy Food, Bakery, Beverages.
- **Search & Filters**: Dual restaurant and dish search, pure-veg filter toggle, 4.0+ rating filter, price sorting, fast delivery (<30m) filter, and locality dropdown.
- **Restaurant Details & Menu Catalog**: Categorized dishes, search within menu, authentic recipe descriptions and ingredients, and dietary indicators (Veg green dot / Non-veg brown triangle).
- **Dish Customization Modal**: Dish descriptions, optional demo add-ons (raita, cheese toppings, dips), and cooking instructions note editor.
- **Functional Shopping Cart**:
  - Add, remove, update quantities, edit cooking notes.
  - Multi-restaurant conflict prompt (asks before replacing cart).
  - Configurable demo coupon discounts (`WELCOME50`, `CRAVEFEAST`, `FREEDEL`).
  - Bill breakdown with Subtotal, Discounts, Delivery Fee (free above ₹500), and 5% GST calculation.
  - Saved in browser `localStorage`.
- **Checkout & Simulated Payments**:
  - Saved addresses manager (Home, Work, Other) with add/edit/delete modal.
  - Delivery instructions field.
  - Simulated payment methods (Cash on Delivery, UPI Instant Demo, Credit/Debit Card Demo).
- **Order Confirmation & Tracking**:
  - Unique demo order IDs (`CRV-XXXX-X`).
  - 5-stage simulated delivery tracking timeline (Order Placed -> Preparing Food -> Ready for Pickup -> Out for Delivery -> Delivered).
  - Interactive "Advance to Next Stage" simulator.
- **Order History & Reorder**: Persistent order history with one-click Reorder capability.
- **Favourites & Profile**: Saved favorite restaurants, dining preferences (Pure-veg toggle), and address manager.
- **Data Transparency ("About Data")**: Complete documentation in Settings and footer detailing source provenance, licenses, and fields obtained.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Run Automated Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## Data Pipeline Commands

```bash
# Verify permitted data sources
npm run data:discover

# Scrape OpenStreetMap restaurant nodes
npm run data:scrape

# Normalize datasets
npm run data:normalize

# Validate dataset integrity
npm run data:validate

# Run end-to-end import
npm run data:import
```

---

## Data Provenance & Licenses

- **OpenStreetMap Data**: © OpenStreetMap contributors, licensed under the **Open Database License (ODbL) 1.0**.
- **Indian Food 101 Dataset**: Dedicated to the public domain under **Creative Commons CC0 1.0 Universal**.
- **Free Food Menus Catalog**: Licensed under the **MIT License**.
- **Notice**: Ratings, kitchen dispatch, and payment transactions are demonstration simulations clearly disclosed in the application interface.
