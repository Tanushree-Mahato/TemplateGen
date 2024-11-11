import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TemplateIcon from '@mui/icons-material/Description';
import GenerateTemplateIcon from '@mui/icons-material/Build';
import '../styles/drawer.css'
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';
const drawerItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
  { text: 'Template', icon: <TemplateIcon />, link: '/template' },
  { text: 'Generate Template', icon: <GenerateTemplateIcon />, link: '/gentemp' }
];

function Layout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  return (
    <div className="flex h-screen">
      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-[4rem] bg-green-600 flex flex-col items-center py-4">
        <ul className="flex flex-col items-center space-y-4">
          {drawerItems.map((item) => (
            <li key={item.text}>
              <Link
                to={item.link}
                className={`group flex items-center justify-center p-0.5 rounded-full ${location.pathname === item.link ? 'active-icon' : 'text-white'
                  }`}
              >
                <Tooltip title={item.text} placement="right">
                  <div className={`icon-container ${location.pathname === item.link ? 'active-icon-container' : ''}`}>
                    {item.icon}
                  </div>
                </Tooltip>
              </Link>
            </li>
          ))}
        </ul>
        <div className='bottom-0'>
          <Tooltip title='Logout' placement="right">
            <button onClick={() => dispatch(logout())}>
              Logout
            </button>
          </Tooltip>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 p-4 ml-[4rem] transition-all">
        {children}
      </div>
    </div>
  );
}

export default Layout;
