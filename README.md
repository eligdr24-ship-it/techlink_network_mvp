# TechLink Network MVP

A first MVP for a B2B home-service technician marketplace.

## Included

- Publisher Dashboard
  - Search technicians by ZIP, city, state, category
  - Map coverage with Leaflet/OpenStreetMap
  - Create lead requests
  - Send leads to selected technicians
  - Lead history

- Technician Dashboard
  - Lead inbox
  - Scheduled job date and time shown on every lead
  - ZIP code shown on every lead
  - Customer details hidden until accepted
  - Accept / decline workflow
  - Accepted jobs history

- Admin Dashboard
  - Add technicians
  - Platform stats
  - Lead activity

## Run locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Deploy on Render

- Build command: `npm install`
- Start command: `npm start`
- Optional Persistent Disk path: `/opt/render/project/src/data`
- Optional env var: `DATA_DIR=/opt/render/project/src/data`

## Notes

This is an MVP prototype using JSON file storage. For a production marketplace, the next step is adding real login/accounts, PostgreSQL, notifications, Stripe, and role-based permissions.

## Latest update

Expanded the MVP from a small garage-door-focused category set to a broad home-service marketplace category set.

Included popular categories:
Garage Doors, Gates, Locksmith, HVAC, Air Duct Cleaning, Dryer Vent Cleaning, Plumbing, Electrical, Roofing, Appliance Repair, Pest Control, Handyman, Painting, Flooring, Windows & Doors, Glass & Mirrors, Masonry & Concrete, Landscaping, Tree Service, Irrigation & Sprinklers, Pool Service, Junk Removal, Moving, Cleaning Services, Carpet Cleaning, Water Damage Restoration, Mold Remediation, Fire Damage Restoration, Chimney & Fireplace, Security Cameras, Smart Home, Solar, Fencing, Decks & Patios, Siding, Gutter Cleaning, Pressure Washing, Septic, Excavation, General Contractor.

The category list is now used in the Publisher search filter, lead creation form, and technician category setup.
