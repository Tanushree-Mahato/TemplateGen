import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Category, DocumentCode2, Setting2, Logout } from 'iconsax-react';
import '../styles/drawer.css'
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';
const drawerItems = [
  { text: 'Dashboard', icon: <Category size="20" variant="Bulk" />, link: '/dashboard' },
  { text: 'Template', icon: <DocumentCode2 size='20' variant='Bulk' />, link: '/template' },
  { text: 'Generate Template', icon: <Setting2 size='20' variant='Bulk' />, link: '/gentemp' }
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
        <div className='bottom-0 mt-5 ml-2'>
          <Tooltip title='Logout'>
              <Logout size='20' color='white' variant='Bulk' onClick={() => dispatch(logout())} />
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
