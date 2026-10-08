# SmartBin – Smart Waste Management System

> **Cleaner Campus | Smarter Monitoring | Greener Tomorrow**  
> *Small Steps, Big Impact*

SmartBin is an AI & IoT-based university campus waste management platform. It monitors garbage bins in real-time, displays live fill-level telemetry on an architectural campus map, manages housekeeping staff and area allocations, provides automated threshold alerts, logs collection audits, and employs machine learning for predictive fill-forecasting and route optimization.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** or **yarn**

### 2. Installation
```bash
# Clone or extract this repository
cd smartbin-app

# Install dependencies
npm install
```

### 3. Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` or the port shown in your terminal.

### 4. Building for Production
```bash
npm run build
npm run preview
```

---

## 🌟 Key Features

1. **Live Campus Overview Dashboard**
   - Head of Housekeeping executive command center
   - Dynamic counts for **50 Bins**: Normal (0–69%), Warning (70–89%), Collection Required (90–100%), and Sensor Offline
   - Real-time recent alerts with immediate dispatch links

2. **Architectural Campus Map**
   - High-fidelity interactive layout of university grounds:
     - **Block A**: Academic Complex, Central Lobby & Canteen
     - **Block B**: Science & Engineering Labs
     - **Block C**: Central Library & Administrative Complex
     - **Block D**: Sports Stadium, Hostels & Dining Mess
   - Interactive colored pin markers (🟢 Normal, 🟡 Warning, 🔴 Collection, ⚫ Offline)
   - Route path overlay for optimal collection sequence

3. **Two Access Levels (RBAC)**
   - **Admin / Head of Housekeeping**: Full campus-wide management of all 50 bins, custodial staff, thresholds, and analytics.
   - **Housekeeping Staff (e.g. Rahul Sharma, Amit Kumar)**: Restricted to their assigned campus zone (e.g. Block A), receiving localized alerts and logging collections.

4. **Detailed Bin Inspection & Fill History**
   - Ultrasonic distance meter (HC-SR04 usable height: 100 cm, sensor distance to surface)
   - Formula: `Fill % = ((Max_Distance - Current_Distance) / Max_Distance) * 100`
   - Intraday fill-level trend curve (8 AM, 10 AM, 12 PM, 2 PM, 4 PM)
   - Real-time virtual distance slider for hardware testing

5. **Collection Workflow & Audit Trail**
   - Step-by-step dispatch execution: `Alert` → `[Start Collection]` → `[Mark as Collected]`
   - Resets fill level to 0% and logs historical audit records exportable to CSV

6. **AI Fill-Level Prediction & Route Optimizer**
   - Accumulation velocity calculation (`+%/hr`) and estimated hours to full
   - TSP collection route ordering prioritizing urgent bins first
   - Gemini AI campus sanitation advisory generator

7. **ESP32 IoT Hardware Lab**
   - Ultrasonic sensor pinout guide (TRIG: GPIO 5, ECHO: GPIO 18, 5V, GND)
   - Ready-to-flash Arduino C++ firmware sketch (`.ino`)
   - Virtual telemetry packet dispatcher
