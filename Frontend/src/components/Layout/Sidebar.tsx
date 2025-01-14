import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, Utensils, Truck, BarChart3, 
  ClipboardList, LogOut, X 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AdminSliceActions } from '../../store/adminstore';
import toast from 'react-hot-toast';

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  const adminLinks = [
    { to: '/admin-dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/patients', icon: Users, label: 'Patients' },
    { to: '/diet-charts', icon: ClipboardList, label: 'DietCharts' },
    { to: '/pantry', icon: Utensils, label: 'Pantry Management' },
    { to: '/delivery', icon: Truck, label: 'Delivery Tracking' },
  ];

  const pantryLinks = [
    { to: '/pantry-dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/panatry-tasks', icon: ClipboardList, label: 'Tasks' },
  ];

  const deliveryLinks = [
    { to: '/delivery-dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/delivery-tasks', icon: ClipboardList, label: 'Tasks' },
  ];

  const links = {
    admin: adminLinks,
    pantry: pantryLinks,
    delivery: deliveryLinks,
  }[`${role}`];

  const handleLogout = () => {
    toast.success('Logout');
    dispatch(AdminSliceActions.logout());
    localStorage.clear();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-teal-600 to-teal-700">
      {/* Close button - visible only on mobile */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-200"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center p-6 bg-teal-800 bg-opacity-20">
        <Utensils className="h-8 w-8 text-white" />
        <span className="text-2xl font-semibold ml-2 text-white">HospitalFood</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded-lg transition duration-200 
              ${isActive
                ? 'bg-teal-800 bg-opacity-50 text-white'
                : 'text-teal-100 hover:bg-teal-800 hover:bg-opacity-30'
              }`
            }
          >
            <link.icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-teal-500">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full space-x-2 py-2.5 px-4 rounded-lg transition duration-200 
                   bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar