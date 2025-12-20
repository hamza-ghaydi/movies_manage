import { Home, CheckCircle, Clock, Film } from 'lucide-react';
import { images } from '../constants/images';

function Sidebar({ activeView, onViewChange }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'watched', label: 'Watched', icon: CheckCircle },
    { id: 'toWatch', label: 'To Watch', icon: Clock },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 glass border-r border-[#db0000] border-opacity-20 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/30 border-opacity-15">
        <div className="flex items-center justify-center">
          <img src={images.logo} alt="logo" className="w-25" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gray-500/20 text-white '
                  : 'text-gray-400 hover:text-white hover:glass-light'
              }`}
            >
              <Icon size={20} color={isActive ? 'white' : 'gray'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;

