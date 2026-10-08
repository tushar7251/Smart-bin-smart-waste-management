import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  SmartBin,
  StaffMember,
  CollectionRecord,
  BinAlert,
  ThresholdConfig,
  CurrentUser,
  CampusBlock,
} from '../types/smartbin';
import { INITIAL_BINS, INITIAL_STAFF, INITIAL_COLLECTIONS } from '../data/mockCampusData';
import confetti from 'canvas-confetti';

interface SmartBinContextType {
  bins: SmartBin[];
  staff: StaffMember[];
  collections: CollectionRecord[];
  alerts: BinAlert[];
  thresholds: ThresholdConfig;
  currentUser: CurrentUser;
  availableUsers: CurrentUser[];
  selectedBin: SmartBin | null;
  collectingBin: SmartBin | null;
  isIotLabOpen: boolean;
  isSettingsOpen: boolean;
  activeTab: 'home' | 'bins' | 'map' | 'staff' | 'reports';

  // State setters
  setActiveTab: (tab: 'home' | 'bins' | 'map' | 'staff' | 'reports') => void;
  setCurrentUser: (user: CurrentUser) => void;
  setSelectedBin: (bin: SmartBin | null) => void;
  setCollectingBin: (bin: SmartBin | null) => void;
  setIsIotLabOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;

  // Domain Actions
  updateBinFill: (binId: string, fillLevel: number) => void;
  toggleBinOnline: (binId: string) => void;
  collectBin: (binId: string, remarks?: string) => void;
  addStaff: (member: Omit<StaffMember, 'id' | 'collectionsCompletedToday'>) => void;
  updateStaff: (staffId: string, updates: Partial<StaffMember>) => void;
  updateThresholds: (updates: Partial<ThresholdConfig>) => void;
  simulateSensorBurst: () => void;
  simulateLunchRush: () => void;
  resetDemoData: () => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;

  // Computed
  counts: {
    total: number;
    normal: number;
    warning: number;
    collection: number;
    offline: number;
  };
  visibleBins: SmartBin[];
  unreadAlertCount: number;
}

const AVAILABLE_USERS: CurrentUser[] = [
  {
    id: 'ADMIN-01',
    name: 'Head of Housekeeping',
    role: 'ADMIN',
    title: 'Chief Campus Sanitation Officer',
  },
  {
    id: 'HK001',
    name: 'Rahul Sharma',
    role: 'STAFF',
    title: 'Housekeeping Lead – Block A',
    assignedBlock: 'Block A',
    employeeId: 'HK001',
  },
  {
    id: 'HK002',
    name: 'Amit Kumar',
    role: 'STAFF',
    title: 'Housekeeping Lead – Block B',
    assignedBlock: 'Block B',
    employeeId: 'HK002',
  },
  {
    id: 'HK003',
    name: 'Priya Patel',
    role: 'STAFF',
    title: 'Housekeeping Lead – Block C',
    assignedBlock: 'Block C',
    employeeId: 'HK003',
  },
  {
    id: 'HK004',
    name: 'Sunita Devi',
    role: 'STAFF',
    title: 'Housekeeping Lead – Block D',
    assignedBlock: 'Block D',
    employeeId: 'HK004',
  },
];

const DEFAULT_THRESHOLDS: ThresholdConfig = {
  warningThreshold: 70,
  collectionThreshold: 90,
  offlineTimeoutMinutes: 15,
};

const SmartBinContext = createContext<SmartBinContextType | undefined>(undefined);

export const SmartBinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<SmartBin[]>(INITIAL_BINS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(AVAILABLE_USERS[0]);
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [collectingBin, setCollectingBin] = useState<SmartBin | null>(null);
  const [isIotLabOpen, setIsIotLabOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'bins' | 'map' | 'staff' | 'reports'>('home');
  const [alerts, setAlerts] = useState<BinAlert[]>([]);

  // Generate dynamic alerts whenever bins or thresholds change
  useEffect(() => {
    const newAlerts: BinAlert[] = [];
    bins.forEach((b) => {
      if (!b.isOnline) {
        newAlerts.push({
          id: `alert-off-${b.id}`,
          binId: b.id,
          block: b.block,
          location: b.location,
          fillLevel: b.fillLevel,
          type: 'OFFLINE',
          message: `${b.id} sensor telemetry heartbeat missing (>15 min)`,
          timestamp: 'Just now',
          read: false,
          resolved: false,
          assignedStaffName: b.assignedStaffName,
        });
      } else if (b.fillLevel >= thresholds.collectionThreshold) {
        newAlerts.push({
          id: `alert-col-${b.id}`,
          binId: b.id,
          block: b.block,
          location: b.location,
          fillLevel: b.fillLevel,
          type: 'COLLECTION',
          message: `${b.id} is ${b.fillLevel}% full (${b.location}). Collection required immediately!`,
          timestamp: b.lastUpdated,
          read: false,
          resolved: false,
          assignedStaffName: b.assignedStaffName,
        });
      } else if (b.fillLevel >= thresholds.warningThreshold) {
        newAlerts.push({
          id: `alert-war-${b.id}`,
          binId: b.id,
          block: b.block,
          location: b.location,
          fillLevel: b.fillLevel,
          type: 'WARNING',
          message: `${b.id} has reached ${b.fillLevel}% fill level. Prepare for scheduled clearance.`,
          timestamp: b.lastUpdated,
          read: false,
          resolved: false,
          assignedStaffName: b.assignedStaffName,
        });
      }
    });

    // Sort: COLLECTION first, then OFFLINE, then WARNING
    const priority = { COLLECTION: 1, OFFLINE: 2, WARNING: 3 };
    newAlerts.sort((a, b) => priority[a.type] - priority[b.type] || b.fillLevel - a.fillLevel);
    setAlerts(newAlerts);
  }, [bins, thresholds]);

  // Dynamic counts derived from the state and configurable thresholds
  const counts = useMemo(() => {
    let normal = 0;
    let warning = 0;
    let collection = 0;
    let offline = 0;

    bins.forEach((b) => {
      if (!b.isOnline) {
        offline++;
      } else if (b.fillLevel >= thresholds.collectionThreshold) {
        collection++;
      } else if (b.fillLevel >= thresholds.warningThreshold) {
        warning++;
      } else {
        normal++;
      }
    });

    return {
      total: bins.length,
      normal,
      warning,
      collection,
      offline,
    };
  }, [bins, thresholds]);

  // Visible bins according to current user's role (Admin sees all; Staff sees assigned area)
  const visibleBins = useMemo(() => {
    if (currentUser.role === 'ADMIN' || !currentUser.assignedBlock) {
      return bins;
    }
    return bins.filter((b) => b.block === currentUser.assignedBlock);
  }, [bins, currentUser]);

  const unreadAlertCount = useMemo(() => {
    const relevant = currentUser.role === 'ADMIN' 
      ? alerts 
      : alerts.filter((a) => a.block === currentUser.assignedBlock);
    return relevant.filter((a) => !a.read).length;
  }, [alerts, currentUser]);

  // Update bin fill level directly (e.g. from IoT sensor or slider)
  const updateBinFill = (binId: string, fillLevel: number) => {
    const safeFill = Math.max(0, Math.min(100, Math.round(fillLevel)));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sensorDist = Math.max(0, Math.round(100 - safeFill));

    setBins((prev) =>
      prev.map((b) => {
        if (b.id !== binId) return b;
        const newHistory = [...b.history];
        if (newHistory.length >= 6) newHistory.shift();
        newHistory.push({ time: nowTime, fill: safeFill });

        return {
          ...b,
          fillLevel: safeFill,
          sensorDistanceCm: sensorDist,
          lastUpdated: nowTime,
          history: newHistory,
        };
      })
    );

    // Also update selectedBin if open
    setSelectedBin((curr) => {
      if (curr && curr.id === binId) {
        return {
          ...curr,
          fillLevel: safeFill,
          sensorDistanceCm: sensorDist,
          lastUpdated: nowTime,
        };
      }
      return curr;
    });
  };

  // Toggle bin online / offline (sensor health check)
  const toggleBinOnline = (binId: string) => {
    setBins((prev) =>
      prev.map((b) => (b.id === binId ? { ...b, isOnline: !b.isOnline } : b))
    );
    setSelectedBin((curr) => (curr && curr.id === binId ? { ...curr, isOnline: !curr.isOnline } : curr));
  };

  // Complete collection workflow:
  // Empties bin (fill = 0%), records previous fill level, logs into collection history audit trail
  const collectBin = (binId: string, remarks?: string) => {
    const targetBin = bins.find((b) => b.id === binId);
    if (!targetBin) return;

    const previousFill = targetBin.fillLevel;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = '06 Oct 2026';

    const collectorName = currentUser.role === 'STAFF' ? currentUser.name : targetBin.assignedStaffName;
    const collectorId = currentUser.role === 'STAFF' && currentUser.employeeId ? currentUser.employeeId : targetBin.assignedStaffId;

    // Create new collection record
    const newRecord: CollectionRecord = {
      id: `COL-${Date.now().toString().slice(-4)}`,
      binId: targetBin.id,
      binLocation: `${targetBin.block} – ${targetBin.location}`,
      block: targetBin.block,
      staffId: collectorId,
      staffName: collectorName,
      previousFillLevel: previousFill,
      collectionTime: nowTime,
      date: todayStr,
      remarks: remarks || `Routine empty performed by ${collectorName}. Liner bag refreshed.`,
      durationMinutes: Math.floor(4 + Math.random() * 8),
    };

    setCollections((prev) => [newRecord, ...prev]);

    // Update staff completed collections count
    setStaff((prev) =>
      prev.map((s) =>
        s.id === collectorId || s.name === collectorName
          ? { ...s, collectionsCompletedToday: s.collectionsCompletedToday + 1 }
          : s
      )
    );

    // Reset bin fill level to 0% and update history
    setBins((prev) =>
      prev.map((b) => {
        if (b.id !== binId) return b;
        return {
          ...b,
          fillLevel: 0,
          sensorDistanceCm: 100, // Empty bin means full distance to bottom
          lastUpdated: nowTime,
          history: [...b.history, { time: nowTime, fill: 0 }],
        };
      })
    );

    setSelectedBin((curr) => {
      if (curr && curr.id === binId) {
        return {
          ...curr,
          fillLevel: 0,
          sensorDistanceCm: 100,
          lastUpdated: nowTime,
        };
      }
      return curr;
    });

    setCollectingBin(null);

    // Celebration confetti for successful sanitation action
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
  };

  const addStaff = (member: Omit<StaffMember, 'id' | 'collectionsCompletedToday'>) => {
    const newId = `HK00${staff.length + 1}`;
    const newStaff: StaffMember = {
      ...member,
      id: newId,
      collectionsCompletedToday: 0,
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaff = (staffId: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
  };

  const updateThresholds = (updates: Partial<ThresholdConfig>) => {
    setThresholds((prev) => ({ ...prev, ...updates }));
  };

  // Simulate real-time IoT burst from campus wireless sensors
  const simulateSensorBurst = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBins((prev) => {
      // Pick 4 random bins to update
      const indices = new Set<number>();
      while (indices.size < Math.min(5, prev.length)) {
        indices.add(Math.floor(Math.random() * prev.length));
      }

      return prev.map((b, idx) => {
        if (!indices.has(idx)) return b;
        // Increase fill by 3-12%
        const delta = Math.floor(3 + Math.random() * 10);
        const newFill = Math.min(100, b.fillLevel + delta);
        const newDist = Math.max(0, 100 - newFill);

        return {
          ...b,
          fillLevel: newFill,
          sensorDistanceCm: newDist,
          lastUpdated: nowTime,
          history: [...b.history, { time: nowTime, fill: newFill }],
        };
      });
    });
  };

  // Simulate high campus foot-traffic lunch rush
  const simulateLunchRush = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBins((prev) =>
      prev.map((b) => {
        const isFoodOrLobby =
          b.location.toLowerCase().includes('canteen') ||
          b.location.toLowerCase().includes('mess') ||
          b.location.toLowerCase().includes('lobby') ||
          b.location.toLowerCase().includes('courtyard');

        if (isFoodOrLobby) {
          const newFill = Math.min(100, Math.max(91, b.fillLevel + 22));
          return {
            ...b,
            fillLevel: newFill,
            sensorDistanceCm: Math.max(2, 100 - newFill),
            lastUpdated: nowTime,
            history: [...b.history, { time: nowTime, fill: newFill }],
          };
        }
        return b;
      })
    );
  };

  const resetDemoData = () => {
    setBins(INITIAL_BINS);
    setStaff(INITIAL_STAFF);
    setCollections(INITIAL_COLLECTIONS);
    setThresholds(DEFAULT_THRESHOLDS);
    setCurrentUser(AVAILABLE_USERS[0]);
    setSelectedBin(null);
    setCollectingBin(null);
  };

  const markAlertRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <SmartBinContext.Provider
      value={{
        bins,
        staff,
        collections,
        alerts,
        thresholds,
        currentUser,
        availableUsers: AVAILABLE_USERS,
        selectedBin,
        collectingBin,
        isIotLabOpen,
        isSettingsOpen,
        activeTab,
        setActiveTab,
        setCurrentUser,
        setSelectedBin,
        setCollectingBin,
        setIsIotLabOpen,
        setIsSettingsOpen,
        updateBinFill,
        toggleBinOnline,
        collectBin,
        addStaff,
        updateStaff,
        updateThresholds,
        simulateSensorBurst,
        simulateLunchRush,
        resetDemoData,
        markAlertRead,
        markAllAlertsRead,
        counts,
        visibleBins,
        unreadAlertCount,
      }}
    >
      {children}
    </SmartBinContext.Provider>
  );
};

export const useSmartBin = (): SmartBinContextType => {
  const context = useContext(SmartBinContext);
  if (!context) {
    throw new Error('useSmartBin must be used within a SmartBinProvider');
  }
  return context;
};
