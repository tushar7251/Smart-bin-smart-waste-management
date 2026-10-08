export type BinStatus = 'NORMAL' | 'WARNING' | 'COLLECTION' | 'OFFLINE';

export type BinType = 'General Waste' | 'Recyclable (Dry/Plastic)' | 'Organic / Food' | 'Paper' | 'E-Waste';

export type CampusBlock = 'Block A' | 'Block B' | 'Block C' | 'Block D';

export interface ReadingHistoryPoint {
  time: string;
  fill: number;
}

export interface SmartBin {
  id: string; // e.g. "BIN-024"
  code: string;
  block: CampusBlock;
  location: string; // e.g. "Canteen Area", "Ground Floor Lobby"
  floor: string; // e.g. "Ground Floor", "1st Floor", "2nd Floor", "Courtyard"
  latitude?: number;
  longitude?: number;
  // Percentage coordinates on campus map (0 - 100)
  mapX: number;
  mapY: number;
  fillLevel: number; // 0 - 100%
  binType: BinType;
  assignedStaffId: string;
  assignedStaffName: string;
  lastUpdated: string;
  sensorDistanceCm: number; // HC-SR04 distance (e.g. 6 cm)
  maxDistanceCm: number; // Total usable height (e.g. 100 cm)
  minDistanceCm: number; // Offset from sensor (e.g. 0 cm)
  batteryLevel: number; // %
  isOnline: boolean;
  history: ReadingHistoryPoint[];
  installDate: string;
}

export interface StaffMember {
  id: string; // e.g. "HK001"
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  assignedArea: CampusBlock;
  shift: string; // e.g. "8 AM – 4 PM"
  status: 'Active' | 'On Duty' | 'On Break' | 'Off Duty';
  collectionsCompletedToday: number;
  avatarColor: string;
}

export interface CollectionRecord {
  id: string;
  binId: string;
  binLocation: string;
  block: CampusBlock;
  staffId: string;
  staffName: string;
  previousFillLevel: number;
  collectionTime: string;
  date: string;
  remarks?: string;
  durationMinutes?: number;
}

export interface BinAlert {
  id: string;
  binId: string;
  block: CampusBlock;
  location: string;
  fillLevel: number;
  type: 'WARNING' | 'COLLECTION' | 'OFFLINE';
  message: string;
  timestamp: string;
  read: boolean;
  resolved: boolean;
  assignedStaffName?: string;
}

export interface ThresholdConfig {
  warningThreshold: number; // default 70
  collectionThreshold: number; // default 90
  offlineTimeoutMinutes: number; // default 15
}

export type UserRole = 'ADMIN' | 'STAFF';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  assignedBlock?: CampusBlock;
  employeeId?: string;
}

export interface RouteStop {
  stopNumber: number;
  binId: string;
  block: CampusBlock;
  location: string;
  fillLevel: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estimatedTimeMins: number;
  distanceFromPreviousMeters: number;
}
