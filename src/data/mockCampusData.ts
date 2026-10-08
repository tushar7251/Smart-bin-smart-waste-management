import { SmartBin, StaffMember, CollectionRecord, CampusBlock } from '../types/smartbin';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'HK001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@campus.edu',
    phone: '+91 98765 43210',
    employeeId: 'HK001',
    assignedArea: 'Block A',
    shift: '8 AM – 4 PM',
    status: 'Active',
    collectionsCompletedToday: 4,
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'HK002',
    name: 'Amit Kumar',
    email: 'amit.kumar@campus.edu',
    phone: '+91 98765 43211',
    employeeId: 'HK002',
    assignedArea: 'Block B',
    shift: '8 AM – 4 PM',
    status: 'Active',
    collectionsCompletedToday: 3,
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'HK003',
    name: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    phone: '+91 98765 43212',
    employeeId: 'HK003',
    assignedArea: 'Block C',
    shift: '7 AM – 3 PM',
    status: 'Active',
    collectionsCompletedToday: 2,
    avatarColor: 'bg-purple-600',
  },
  {
    id: 'HK004',
    name: 'Sunita Devi',
    email: 'sunita.devi@campus.edu',
    phone: '+91 98765 43213',
    employeeId: 'HK004',
    assignedArea: 'Block D',
    shift: '12 PM – 8 PM',
    status: 'On Duty',
    collectionsCompletedToday: 2,
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'HK005',
    name: 'Vikram Malhotra',
    email: 'vikram.m@campus.edu',
    phone: '+91 98765 43214',
    employeeId: 'HK005',
    assignedArea: 'Block A',
    shift: '9 AM – 5 PM',
    status: 'Active',
    collectionsCompletedToday: 1,
    avatarColor: 'bg-teal-600',
  },
];

// Helper to determine coordinates and details
interface RawBinConfig {
  id: string;
  block: CampusBlock;
  location: string;
  floor: string;
  fillLevel: number;
  mapX: number;
  mapY: number;
  binType: 'General Waste' | 'Recyclable (Dry/Plastic)' | 'Organic / Food' | 'Paper' | 'E-Waste';
  staffId: string;
  staffName: string;
}

// Exactly 50 campus bins
// Exactly 8 in Collection (>= 90%)
// Exactly 11 in Warning (70% - 89%)
// Exactly 31 in Normal (< 70%)
// Total: 8 + 11 + 31 = 50
const RAW_BINS: RawBinConfig[] = [
  // --- COLLECTION REQUIRED (8 BINS: >= 90%) ---
  { id: 'BIN-024', block: 'Block A', location: 'Canteen Area', floor: 'Ground Floor', fillLevel: 94, mapX: 24, mapY: 34, binType: 'Organic / Food', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-031', block: 'Block A', location: 'Ground Floor Lobby', floor: 'Ground Floor', fillLevel: 91, mapX: 28, mapY: 26, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-006', block: 'Block B', location: 'Robotics Lab Courtyard', floor: 'Ground Floor', fillLevel: 95, mapX: 68, mapY: 26, binType: 'E-Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-012', block: 'Block B', location: 'Cafeteria Snack Corner', floor: '1st Floor', fillLevel: 92, mapX: 74, mapY: 32, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-022', block: 'Block C', location: 'Central Library Entrance', floor: 'Ground Floor', fillLevel: 93, mapX: 26, mapY: 72, binType: 'Paper', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-029', block: 'Block C', location: 'Student Union Lounge', floor: '1st Floor', fillLevel: 90, mapX: 34, mapY: 78, binType: 'General Waste', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-038', block: 'Block D', location: 'Sports Stadium Bleachers', floor: 'Ground Floor', fillLevel: 96, mapX: 72, mapY: 74, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-045', block: 'Block D', location: 'Hostel Mess Entry', floor: 'Ground Floor', fillLevel: 92, mapX: 82, mapY: 68, binType: 'Organic / Food', staffId: 'HK004', staffName: 'Sunita Devi' },

  // --- WARNING BINS (11 BINS: 70% - 89%) ---
  { id: 'BIN-018', block: 'Block B', location: '1st Floor Corridor East', floor: '1st Floor', fillLevel: 76, mapX: 78, mapY: 22, binType: 'General Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-004', block: 'Block A', location: 'Auditorium North Wing', floor: 'Ground Floor', fillLevel: 85, mapX: 18, mapY: 22, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-009', block: 'Block A', location: 'Physics Dept Stairs', floor: '1st Floor', fillLevel: 78, mapX: 32, mapY: 36, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-014', block: 'Block A', location: 'Faculty Lounge Exit', floor: '2nd Floor', fillLevel: 72, mapX: 20, mapY: 38, binType: 'Paper', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-016', block: 'Block B', location: 'Computer Lab 3 Hall', floor: '2nd Floor', fillLevel: 81, mapX: 62, mapY: 24, binType: 'E-Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-020', block: 'Block B', location: 'Workshop Bay 2', floor: 'Ground Floor', fillLevel: 88, mapX: 84, mapY: 36, binType: 'General Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-026', block: 'Block C', location: 'Admin Affairs Corridor', floor: '1st Floor', fillLevel: 74, mapX: 22, mapY: 82, binType: 'Paper', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-033', block: 'Block C', location: 'Digital Media Studio', floor: '2nd Floor', fillLevel: 79, mapX: 38, mapY: 70, binType: 'General Waste', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-035', block: 'Block D', location: 'Gymnasium Locker Hall', floor: 'Ground Floor', fillLevel: 84, mapX: 64, mapY: 80, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-041', block: 'Block D', location: 'Basketball Court Walkway', floor: 'Ground Floor', fillLevel: 77, mapX: 88, mapY: 76, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-048', block: 'Block D', location: 'Swimming Pool Pavilion', floor: 'Ground Floor', fillLevel: 86, mapX: 78, mapY: 84, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK004', staffName: 'Sunita Devi' },

  // --- NORMAL BINS (31 BINS: 0% - 69%) ---
  { id: 'BIN-001', block: 'Block A', location: 'Main Entrance Portico', floor: 'Ground Floor', fillLevel: 34, mapX: 22, mapY: 18, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-002', block: 'Block A', location: 'Library Hall Concourse', floor: 'Ground Floor', fillLevel: 61, mapX: 36, mapY: 20, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-003', block: 'Block A', location: 'Dean Office Lobby', floor: '1st Floor', fillLevel: 45, mapX: 16, mapY: 30, binType: 'Paper', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-005', block: 'Block A', location: 'Classroom 101 Entrance', floor: '1st Floor', fillLevel: 28, mapX: 30, mapY: 32, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-007', block: 'Block A', location: 'Seminar Hall B Foyer', floor: '2nd Floor', fillLevel: 34, mapX: 26, mapY: 14, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-008', block: 'Block A', location: 'Staff Restroom Corridor', floor: 'Ground Floor', fillLevel: 52, mapX: 14, mapY: 26, binType: 'General Waste', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-010', block: 'Block A', location: 'Chemistry Lab Porch', floor: '1st Floor', fillLevel: 42, mapX: 38, mapY: 28, binType: 'Organic / Food', staffId: 'HK001', staffName: 'Rahul Sharma' },
  { id: 'BIN-011', block: 'Block A', location: 'Academic Terrace Garden', floor: '3rd Floor', fillLevel: 27, mapX: 28, mapY: 40, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK001', staffName: 'Rahul Sharma' },
  
  { id: 'BIN-013', block: 'Block B', location: 'Engineering Atrium', floor: 'Ground Floor', fillLevel: 55, mapX: 66, mapY: 18, binType: 'General Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-015', block: 'Block B', location: 'Electronics Lab Hall', floor: 'Ground Floor', fillLevel: 38, mapX: 72, mapY: 16, binType: 'E-Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-017', block: 'Block B', location: 'Server Room Corridor', floor: '1st Floor', fillLevel: 19, mapX: 80, mapY: 18, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-019', block: 'Block B', location: 'Mechanical CAD Lab', floor: '2nd Floor', fillLevel: 48, mapX: 64, mapY: 30, binType: 'Paper', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-021', block: 'Block B', location: 'Civil Engg Survey Yard', floor: 'Ground Floor', fillLevel: 63, mapX: 86, mapY: 28, binType: 'General Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-023', block: 'Block B', location: 'Biotech Lab Washroom', floor: '1st Floor', fillLevel: 50, mapX: 70, mapY: 36, binType: 'General Waste', staffId: 'HK002', staffName: 'Amit Kumar' },
  { id: 'BIN-025', block: 'Block B', location: 'Conference Room 2', floor: '2nd Floor', fillLevel: 22, mapX: 76, mapY: 38, binType: 'Paper', staffId: 'HK002', staffName: 'Amit Kumar' },

  { id: 'BIN-027', block: 'Block C', location: 'Reference Section East', floor: 'Ground Floor', fillLevel: 58, mapX: 20, mapY: 66, binType: 'Paper', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-028', block: 'Block C', location: 'Periodicals Reading Room', floor: 'Ground Floor', fillLevel: 31, mapX: 30, mapY: 68, binType: 'Paper', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-030', block: 'Block C', location: 'Registrar Office Hall', floor: '1st Floor', fillLevel: 44, mapX: 18, mapY: 74, binType: 'General Waste', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-032', block: 'Block C', location: 'Accounts Branch Porch', floor: '1st Floor', fillLevel: 37, mapX: 32, mapY: 74, binType: 'Paper', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-034', block: 'Block C', location: 'Student Council Room', floor: '2nd Floor', fillLevel: 62, mapX: 24, mapY: 88, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-036', block: 'Block C', location: 'Career Placement Cell', floor: '2nd Floor', fillLevel: 29, mapX: 36, mapY: 84, binType: 'General Waste', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-037', block: 'Block C', location: 'Central Courtyard Fountain', floor: 'Ground Floor', fillLevel: 53, mapX: 45, mapY: 55, binType: 'Organic / Food', staffId: 'HK003', staffName: 'Priya Patel' },
  { id: 'BIN-039', block: 'Block C', location: 'Campus Bookstore Front', floor: 'Ground Floor', fillLevel: 40, mapX: 42, mapY: 64, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK003', staffName: 'Priya Patel' },

  { id: 'BIN-040', block: 'Block D', location: 'Hostel A Common Room', floor: 'Ground Floor', fillLevel: 66, mapX: 68, mapY: 66, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-042', block: 'Block D', location: 'Hostel B Water Cooler', floor: '1st Floor', fillLevel: 33, mapX: 76, mapY: 64, binType: 'Recyclable (Dry/Plastic)', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-043', block: 'Block D', location: 'Indoor Badminton Arena', floor: 'Ground Floor', fillLevel: 49, mapX: 84, mapY: 70, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-044', block: 'Block D', location: 'Track & Field Shed', floor: 'Ground Floor', fillLevel: 18, mapX: 90, mapY: 82, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-046', block: 'Block D', location: 'Mess Dining Hall West', floor: 'Ground Floor', fillLevel: 64, mapX: 70, mapY: 88, binType: 'Organic / Food', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-047', block: 'Block D', location: 'Auditorium Green Room', floor: '1st Floor', fillLevel: 25, mapX: 60, mapY: 72, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-049', block: 'Block D', location: 'Health Care Clinic Exit', floor: 'Ground Floor', fillLevel: 39, mapX: 58, mapY: 82, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
  { id: 'BIN-050', block: 'Block D', location: 'Campus Security Gate 4', floor: 'Ground Floor', fillLevel: 15, mapX: 88, mapY: 90, binType: 'General Waste', staffId: 'HK004', staffName: 'Sunita Devi' },
];

export const INITIAL_BINS: SmartBin[] = RAW_BINS.map((b) => {
  // Ultrasonic sensor logic:
  // If usable bin height = 100cm, distance from top sensor = 100 - fillLevel
  const sensorDist = Math.max(2, Math.round(100 - b.fillLevel));

  // Realistic historical trend curve
  const h1 = Math.max(10, Math.round(b.fillLevel * 0.25));
  const h2 = Math.max(15, Math.round(b.fillLevel * 0.45));
  const h3 = Math.max(22, Math.round(b.fillLevel * 0.68));
  const h4 = Math.max(30, Math.round(b.fillLevel * 0.86));
  const h5 = b.fillLevel;

  return {
    id: b.id,
    code: b.id,
    block: b.block,
    location: b.location,
    floor: b.floor,
    mapX: b.mapX,
    mapY: b.mapY,
    fillLevel: b.fillLevel,
    binType: b.binType,
    assignedStaffId: b.staffId,
    assignedStaffName: b.staffName,
    lastUpdated: '10:42 AM',
    sensorDistanceCm: sensorDist,
    maxDistanceCm: 100,
    minDistanceCm: 0,
    batteryLevel: Math.floor(84 + Math.random() * 15),
    isOnline: true,
    history: [
      { time: '08:00 AM', fill: h1 },
      { time: '10:00 AM', fill: h2 },
      { time: '12:00 PM', fill: h3 },
      { time: '02:00 PM', fill: h4 },
      { time: '04:00 PM', fill: h5 },
    ],
    installDate: '15 Aug 2026',
  };
});

export const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: 'COL-101',
    binId: 'BIN-024',
    binLocation: 'Block A – Canteen Area',
    block: 'Block A',
    staffId: 'HK001',
    staffName: 'Rahul Sharma',
    previousFillLevel: 94,
    collectionTime: '11:12 AM',
    date: '06 Oct 2026',
    remarks: 'Emptied before lunch rush; replaced liner bag',
    durationMinutes: 8,
  },
  {
    id: 'COL-102',
    binId: 'BIN-031',
    binLocation: 'Block A – Ground Floor',
    block: 'Block A',
    staffId: 'HK002',
    staffName: 'Amit Kumar',
    previousFillLevel: 91,
    collectionTime: '11:30 AM',
    date: '06 Oct 2026',
    remarks: 'High paper towel & plastic bottle volume',
    durationMinutes: 6,
  },
  {
    id: 'COL-103',
    binId: 'BIN-018',
    binLocation: 'Block B – 1st Floor East',
    block: 'Block B',
    staffId: 'HK001',
    staffName: 'Rahul Sharma',
    previousFillLevel: 89,
    collectionTime: '12:05 PM',
    date: '06 Oct 2026',
    remarks: 'Routine pre-afternoon collection completed',
    durationMinutes: 5,
  },
  {
    id: 'COL-104',
    binId: 'BIN-006',
    binLocation: 'Block B – Robotics Lab',
    block: 'Block B',
    staffId: 'HK002',
    staffName: 'Amit Kumar',
    previousFillLevel: 96,
    collectionTime: '09:40 AM',
    date: '06 Oct 2026',
    remarks: 'Electronic wire scrap separated to recycling bin',
    durationMinutes: 12,
  },
  {
    id: 'COL-105',
    binId: 'BIN-038',
    binLocation: 'Block D – Sports Stadium',
    block: 'Block D',
    staffId: 'HK004',
    staffName: 'Sunita Devi',
    previousFillLevel: 98,
    collectionTime: '08:20 AM',
    date: '06 Oct 2026',
    remarks: 'Collected after early morning athletic practice',
    durationMinutes: 10,
  },
  {
    id: 'COL-106',
    binId: 'BIN-022',
    binLocation: 'Block C – Library Entrance',
    block: 'Block C',
    staffId: 'HK003',
    staffName: 'Priya Patel',
    previousFillLevel: 92,
    collectionTime: '07:50 AM',
    date: '06 Oct 2026',
    remarks: 'Book return paper shred cleared',
    durationMinutes: 7,
  },
  {
    id: 'COL-107',
    binId: 'BIN-045',
    binLocation: 'Block D – Hostel Mess Entry',
    block: 'Block D',
    staffId: 'HK004',
    staffName: 'Sunita Devi',
    previousFillLevel: 95,
    collectionTime: '09:15 AM',
    date: '06 Oct 2026',
    remarks: 'Breakfast waste collected for compost digester',
    durationMinutes: 15,
  },
  {
    id: 'COL-108',
    binId: 'BIN-004',
    binLocation: 'Block A – Auditorium North',
    block: 'Block A',
    staffId: 'HK001',
    staffName: 'Rahul Sharma',
    previousFillLevel: 88,
    collectionTime: '10:00 AM',
    date: '06 Oct 2026',
    remarks: 'Routine inspection and clearance',
    durationMinutes: 6,
  },
];
