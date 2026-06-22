const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function seedData() {
  return {
    technicians: [
      {
        id: 'tech_1',
        company: 'Prime Garage Door Pros',
        contact: 'Mike Johnson',
        phone: '(215) 555-0188',
        email: 'prime@example.com',
        categories: ['Garage Doors', 'Gates', 'Garage Door Openers'],
        city: 'Philadelphia',
        state: 'PA',
        zips: ['19116', '19115', '19020', '19053'],
        emergency: true,
        hours: 'Mon-Sun 7:00 AM - 9:00 PM',
        rating: 4.9,
        jobsCompleted: 124,
        responseTime: '12 min',
        description: 'Reliable garage door repair crew covering Philadelphia and nearby suburbs.',
        coverage: [[40.128,-75.102],[40.137,-74.965],[40.033,-74.962],[40.006,-75.146],[40.082,-75.207]]
      },
      {
        id: 'tech_2',
        company: 'Tri-State Overhead Network',
        contact: 'Daniel Cohen',
        phone: '(302) 555-0134',
        email: 'tristate@example.com',
        categories: ['Garage Doors', 'Commercial Doors', 'Loading Docks'],
        city: 'Wilmington',
        state: 'DE',
        zips: ['19809', '19810', '19703', '19803'],
        emergency: true,
        hours: '24/7 Emergency Available',
        rating: 4.7,
        jobsCompleted: 89,
        responseTime: '18 min',
        description: 'Garage door and overhead door team for Delaware and nearby PA/NJ areas.',
        coverage: [[39.830,-75.650],[39.845,-75.430],[39.685,-75.410],[39.650,-75.630]]
      },
      {
        id: 'tech_3',
        company: 'Metro Locksmith & Doors',
        contact: 'Alex Smith',
        phone: '(718) 555-0199',
        email: 'metro@example.com',
        categories: ['Locksmith', 'Garage Doors', 'Smart Home'],
        city: 'Brooklyn',
        state: 'NY',
        zips: ['11223', '11214', '11235', '11229'],
        emergency: false,
        hours: 'Mon-Sat 8:00 AM - 7:00 PM',
        rating: 4.8,
        jobsCompleted: 211,
        responseTime: '22 min',
        description: 'Locksmith and garage door service provider covering Brooklyn and south Queens.',
        coverage: [[40.640,-74.055],[40.650,-73.890],[40.565,-73.855],[40.555,-74.030]]
      },
      {
        id: 'tech_4',
        company: 'Elite HVAC & Air Services',
        contact: 'Chris Miller',
        phone: '(516) 555-0162',
        email: 'elitehvac@example.com',
        categories: ['HVAC', 'Air Duct Cleaning', 'Dryer Vent Cleaning'],
        city: 'Garden City',
        state: 'NY',
        zips: ['11530', '11550', '11001', '11753'],
        emergency: true,
        hours: 'Mon-Sun 7:00 AM - 8:00 PM',
        rating: 4.8,
        jobsCompleted: 156,
        responseTime: '20 min',
        description: 'HVAC, duct cleaning, dryer vent and indoor air quality team for Long Island.',
        coverage: [[40.760,-73.720],[40.760,-73.520],[40.635,-73.515],[40.625,-73.735]]
      },
      {
        id: 'tech_5',
        company: 'Rapid Plumbing & Drain',
        contact: 'Sam Rivera',
        phone: '(201) 555-0170',
        email: 'rapidplumbing@example.com',
        categories: ['Plumbing', 'Water Damage Restoration', 'Septic'],
        city: 'Jersey City',
        state: 'NJ',
        zips: ['07302', '07306', '07030', '07087'],
        emergency: true,
        hours: '24/7 Emergency Available',
        rating: 4.6,
        jobsCompleted: 98,
        responseTime: '16 min',
        description: 'Plumbing, drain cleaning and emergency water service coverage in North Jersey.',
        coverage: [[40.800,-74.085],[40.795,-73.985],[40.690,-73.985],[40.680,-74.115]]
      },
      {
        id: 'tech_6',
        company: 'Summit Roofing & Exterior',
        contact: 'Brian Lee',
        phone: '(484) 555-0155',
        email: 'summitroofing@example.com',
        categories: ['Roofing', 'Gutter Cleaning', 'Siding', 'Windows & Doors'],
        city: 'West Chester',
        state: 'PA',
        zips: ['19380', '19382', '19087', '19341'],
        emergency: false,
        hours: 'Mon-Fri 8:00 AM - 6:00 PM',
        rating: 4.7,
        jobsCompleted: 77,
        responseTime: '35 min',
        description: 'Roofing, siding, gutters, windows and exterior repair coverage for Chester County.',
        coverage: [[40.090,-75.700],[40.090,-75.450],[39.900,-75.455],[39.900,-75.720]]
      }
    ],
    publishers: [
      { id: 'pub_1', name: 'LeadBridge Media', contact: 'Publisher Admin', phone: '(800) 555-0100', rating: 4.9, leadsSent: 42 }
    ],
    leads: [
      {
        id: 'lead_1',
        publisherId: 'pub_1',
        service: 'Garage Doors',
        jobType: 'Broken Spring',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11223',
        scheduledDate: '2026-06-25',
        scheduledTime: '10:00 AM - 12:00 PM',
        urgency: 'Scheduled',
        customerName: 'Hidden until accepted',
        customerPhone: 'Hidden until accepted',
        customerAddress: 'Hidden until accepted',
        realCustomerName: 'John Smith',
        realCustomerPhone: '(555) 123-4567',
        realCustomerAddress: '123 Main Street, Brooklyn, NY 11223',
        notes: 'Customer says the garage door is stuck halfway.',
        status: 'Pending',
        sentTo: ['tech_3'],
        acceptedBy: null,
        createdAt: new Date().toISOString()
      }
    ],
    ratings: []
  };
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(seedData(), null, 2));
}
function readDb() { ensureDb(); return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeDb(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`; }

app.get('/api/data', (req, res) => res.json(readDb()));

app.post('/api/technicians', (req, res) => {
  const db = readDb();
  const tech = { id: uid('tech'), rating: 5, jobsCompleted: 0, responseTime: 'New', ...req.body };
  tech.categories = Array.isArray(tech.categories) ? tech.categories : String(tech.categories || '').split(',').map(x => x.trim()).filter(Boolean);
  tech.zips = Array.isArray(tech.zips) ? tech.zips : String(tech.zips || '').split(',').map(x => x.trim()).filter(Boolean);
  db.technicians.push(tech); writeDb(db); res.json(tech);
});

app.post('/api/leads', (req, res) => {
  const db = readDb();
  const lead = {
    id: uid('lead'),
    publisherId: 'pub_1',
    status: 'Pending',
    acceptedBy: null,
    createdAt: new Date().toISOString(),
    sentTo: [],
    ...req.body
  };
  lead.customerName = 'Hidden until accepted';
  lead.customerPhone = 'Hidden until accepted';
  lead.customerAddress = 'Hidden until accepted';
  lead.realCustomerName = req.body.customerName || '';
  lead.realCustomerPhone = req.body.customerPhone || '';
  lead.realCustomerAddress = req.body.customerAddress || '';
  db.leads.unshift(lead); writeDb(db); res.json(lead);
});

app.post('/api/leads/:id/send', (req, res) => {
  const db = readDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  const techIds = req.body.techIds || [];
  lead.sentTo = Array.from(new Set([...(lead.sentTo || []), ...techIds]));
  lead.status = 'Sent';
  writeDb(db); res.json(lead);
});

app.post('/api/leads/:id/accept', (req, res) => {
  const db = readDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  lead.status = 'Accepted';
  lead.acceptedBy = req.body.techId;
  lead.acceptedAt = new Date().toISOString();
  lead.customerName = lead.realCustomerName;
  lead.customerPhone = lead.realCustomerPhone;
  lead.customerAddress = lead.realCustomerAddress;
  writeDb(db); res.json(lead);
});

app.post('/api/leads/:id/decline', (req, res) => {
  const db = readDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  lead.declinedBy = Array.from(new Set([...(lead.declinedBy || []), req.body.techId]));
  writeDb(db); res.json(lead);
});

app.post('/api/leads/:id/status', (req, res) => {
  const db = readDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  lead.status = req.body.status || lead.status;
  writeDb(db); res.json(lead);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`TechLink Network MVP running on port ${PORT}`));
