import React from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

import multiavatar from '@multiavatar/multiavatar';
import logo from '../assets/logo.png';

import Dashboard from './Dashboard';

export default function Navbar(props) {
  const [showMenu, setMenu] = useState(false);
  return (
    <Router>
      <nav className='bg-gray-800 font-Poppins'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='relative flex items-center justify-between h-16'>
            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
              {/* Mobile menu button */}
              <button
                type='button'
                onClick={() => {
                  setMenu(!showMenu);
                }}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                aria-controls='mobile-menu'
                aria-expanded='false'
              >
                <span className='sr-only'>Open main menu</span>
                {/* Icon when menu is closed.
                    Heroicon name: outline/menu
                    Menu open: "hidden", Menu closed: "block"
                */}
                <svg
                  className={`${showMenu ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
                {/* Icon when menu is open.
                    Heroicon name: outline/x
                    Menu open: "block", Menu closed: "hidden"
                */}
                <svg
                  className={`${showMenu ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex-shrink-0 flex items-center'>
                <img
                  className='hidden lg:block h-8 w-auto'
                  src={logo}
                  alt='logo'
                />
              </div>
              <div className='hidden sm:block sm:ml-6'>
                <div className='flex space-x-4'>
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                  <NavLink
                    to='/'
                    exact
                    activeClassName='bg-gray-900 text-white hover:bg-gray-900'
                    className='transition-colors duration-100 ease-in text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to='/requests'
                    activeClassName='bg-gray-900 text-white hover:bg-gray-900'
                    className='transition-colors duration-100 ease-in text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Requests
                  </NavLink>
                  <NavLink
                    to='/projects'
                    activeClassName='bg-gray-900 text-white hover:bg-gray-900'
                    className='transition-colors duration-100 ease-in text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Projects
                  </NavLink>
                  <NavLink
                    to='/calendar'
                    activeClassName='bg-gray-900 text-white hover:bg-gray-900'
                    className='transition-colors duration-100 ease-in text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Calendar
                  </NavLink>
                </div>
              </div>
            </div>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              <p className='hidden sm:block text-white text-sm font-medium'>
                {props.user}
              </p>
              <div className='ml-3 relative'>
                <button
                  className='bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                  id='user-profile'
                  aria-haspopup='true'
                >
                  <span className='sr-only'>Profile</span>
                  <span
                    className='h-8 w-8 rounded-full'
                    dangerouslySetInnerHTML={{
                      __html: multiavatar(props.user),
                    }}
                  />
                </button>
              </div>

              <div className='ml-3 relative'>
                <button className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                  <span className='sr-only'>Logout</span>
                  {/* Heroicon name: outline/logout */}
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div
          className={`${showMenu ? 'block' : 'hidden'} sm:hidden`}
          id='mobile-menu'
        >
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white"  */}
            <NavLink
              exact
              to='/'
              activeClassName='bg-gray-900 text-white'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Dashboard
            </NavLink>
            <NavLink
              exact
              to='/requests'
              activeClassName='bg-gray-900 text-white'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Requests
            </NavLink>
            <NavLink
              exact
              to='/projects'
              activeClassName='bg-gray-900 text-white'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Projects
            </NavLink>
            <NavLink
              exact
              to='/calendar'
              activeClassName='bg-gray-900 text-white'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              Calendar
            </NavLink>
          </div>
        </div>
      </nav>
      <Switch>
        <Route path='/calendar'></Route>
        <Route path='/projects'></Route>
        <Route path='/requests'></Route>
        <Route path='/'>
          <Dashboard contract={props.contract} user={props.user} />
        </Route>
      </Switch>
    </Router>
  );
}
