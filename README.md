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
