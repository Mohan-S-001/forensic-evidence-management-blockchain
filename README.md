# 🔗 ForensicChain — Blockchain Evidence Management System

A professional React frontend application for managing forensic evidence using blockchain concepts and digital signatures, with a tamper-proof chain of custody.

---

## 🌐 Live Demo

🚀 **Try the deployed application on Vercel**

👉 **[Open ForensicChain Platform](https://forensic-platform.vercel.app)**

Clicking the link above will open the live deployed version of the project.

---

## 🚀 Quick Start

````bash
# 1. Extract the zip and enter the directory
cd forensic-chain

# 2. Install dependencies# 🔗 ForensicChain — Blockchain Evidence Management System

A professional React frontend application for managing forensic evidence using blockchain concepts and digital signatures, with a tamper-proof chain of custody.

---

## 🚀 Quick Start

```bash
# 1. Extract the zip and enter the directory
cd forensic-chain

# 2. Install dependenciess
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 🔐 Demo Login Credentials

All passwords: `pass123`

| Role | Username | Badge |
|------|----------|-------|
| Crime Scene Officer | `officer.james` | CSO-4521 |
| Transport Officer | `transport.chen` | TO-7823 |
| Forensic Scientist | `sci.patel` | FS-3341 |
| Investigator | `inv.morgan` | INV-2209 |
| Court Official | `court.hayes` | CT-0011 |
| Admin | `admin.sys` | ADM-0001 |

> **Tip:** Click any demo account button on the login page to auto-fill credentials.

---

## 🏗️ Project Structure

```
src/
├── App.jsx                          # Root app with routing
├── main.jsx                         # React entry point
├── index.css                        # Global styles + animations
│
├── context/
│   ├── AuthContext.jsx              # Authentication state
│   └── EvidenceContext.jsx          # Evidence/cases global state
│
├── data/
│   └── mockData.js                  # All mock data (cases, evidence, etc.)
│
├── components/
│   └── common/
│       ├── DashboardLayout.jsx      # Sidebar + topbar layout
│       ├── UIComponents.jsx         # Reusable: Card, Button, Badge, Modal, etc.
│       ├── ChainOfCustodyTimeline.jsx  # Vertical custody timeline
│       ├── EvidenceTable.jsx        # Sortable/filterable evidence table
│       ├── QRScanner.jsx            # QR code scanner modal (simulated)
│       ├── QRCodeDisplay.jsx        # QR code generator display
│       └── AlertPanel.jsx           # Tamper & system alerts
│
└── pages/
    ├── LoginPage.jsx                # Role-based login
    ├── MainDashboard.jsx            # Admin overview dashboard
    ├── CasesPage.jsx                # Case management
    ├── EvidenceDetailPage.jsx       # Evidence detail view
    ├── CollectionPortal.jsx         # Crime Scene Officer portal
    ├── TransportPortal.jsx          # Transport Officer portal
    ├── LaboratoryPortal.jsx         # Forensic Scientist portal
    ├── InvestigatorPortal.jsx       # Investigator (read-only) portal
    └── CourtPortal.jsx              # Court verification portal
```

---

## 🌐 Application Portals

### 1. 📦 Evidence Collection Portal
- **Role:** Crime Scene Officer
- Create evidence entries with full metadata
- Upload evidence files (images, videos, documents)
- Generates SHA-256 hash + ECDSA digital signature
- Generates QR Code for the evidence package
- View all collected evidence

### 2. 🚛 Transportation Portal
- **Role:** Transport Officer
- 4-step transport workflow: Scan → Verify → Log → Confirm
- QR code scanning (simulated camera + manual ID input)
- Seal integrity and package condition verification
- GPS vehicle tracker placeholder
- Transport history log

### 3. 🔬 Forensic Laboratory Portal
- **Role:** Forensic Scientist
- Evidence reception with hash verification
- Seal and signature checks
- Analysis form (type, observations, conclusion)
- Generates forensic report with report hash
- Scientist digital signature

### 4. 🔍 Investigator Portal
- **Role:** Investigator (Read-only)
- Search and browse cases
- View evidence details and files
- Read forensic reports
- View chain of custody timelines
- Download reports

### 5. ⚖️ Court Verification Portal
- **Role:** Court Official
- Enter Case ID or Evidence ID
- Verifies: Hash, Digital Signature, Chain of Custody
- Shows verification badges: ✔ Evidence Authentic / ✔ Hash Verified / ✔ Sig Verified
- Full audit trail display

---

## ✨ Features

- **Role-Based Access Control** — Each role sees only relevant portals
- **Blockchain-Style Integrity** — SHA-256 hashes, digital signatures per evidence item
- **Tamper Detection** — Red alert banners and badges when hash mismatches detected
- **Chain of Custody Visualization** — Vertical timeline with role icons and verification status
- **QR Code Generation** — Each evidence item gets a scannable QR code
- **QR Scanner** — Simulated camera scan + manual ID lookup
- **Live Alerts Panel** — Real-time tamper and transport alerts
- **Evidence Table** — Sortable, filterable, with integrity indicators
- **Dark Theme** — Professional cybersecurity-grade dark UI
- **Recharts Dashboards** — Bar, Line, Pie charts for evidence analytics
- **Persistent Login** — Session stored in localStorage

---

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Recharts | Dashboard charts |
| qrcode / qrcode.react | QR code generation |
| lucide-react | Icons |
| date-fns | Date formatting |
| clsx | Conditional classes |

---

## 🔒 Security Notice

This is a **frontend demo application** with mock data. In a production system:
- Replace mock auth with JWT + backend authentication
- Replace mock hashes with real SHA-256 computed from file buffers
- Replace simulated QR scanner with a real camera API
- Connect to a blockchain backend (e.g., Hyperledger Fabric, Ethereum)
- Implement real ECDSA digital signatures

---

## 📸 UI Highlights

- **Dark cybersecurity aesthetic** — `#0a0f1e` background with cyan/blue accents
- **Rajdhani + Exo 2 + JetBrains Mono** — Professional government/forensic font pairing
- **Animated scan lines, pulse effects, glow borders**
- **Grid background pattern** for the tech feel
- **Color-coded status badges** per evidence state
- **Tamper alerts** with flashing red animation

---

*Built with ForensicChain v2.4.1 — CLASSIFIED SYSTEM*

npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
````
