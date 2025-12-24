import { Home, CheckCircle, Clock, Film, X } from 'lucide-react';
import { images } from '../constants/images';

function Sidebar({ activeView, onViewChange, isOpen = false, onClose }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'watched', label: 'Watched', icon: CheckCircle },
    { id: 'toWatch', label: 'To Watch', icon: Clock },
  ];

  const handleNavClick = (id) => {
    onViewChange(id);
    onClose?.(); // Close sidebar on mobile after navigation
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-72 glass border-r border-[#db0000] border-opacity-20 z-40 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Close menu"
      >
        <X size={24} />
      </button>
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-white/30 border-opacity-15">
        <div className="flex items-center justify-center">
          <img src={images.logo} alt="logo" className="w-20 sm:w-24 max-w-full h-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
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

