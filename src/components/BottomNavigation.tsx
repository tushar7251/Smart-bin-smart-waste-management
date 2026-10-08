import React from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { Home, Trash2, MapPin, Users, BarChart3, Sparkles } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, counts } = useSmartBin();

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'bins' as const,
      label: 'All Bins',
      icon: Trash2,
      badge: counts.collection > 0 ? `${counts.collection}` : null,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'map' as const,
      label: 'Map',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'staff' as const,
      label: 'Staff',
      icon: Users,
      badge: null,
    },
    {
      id: 'reports' as const,
      label: 'Reports & AI',
      icon: BarChart3,
      badge: 'AI',
      badgeColor: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 sm:px-6 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-600' : ''
                  }`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-1 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
