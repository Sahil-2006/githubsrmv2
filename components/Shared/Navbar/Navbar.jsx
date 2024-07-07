import React, { useState , useEffect } from 'react' ;
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar =() => {
  const [nav, setNav] = useState(false);
  const [currentPath, setCurrentPath ] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname) ;
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setCurrentPath(path);
  };

  const navItems = [
    {id: 1, text: 'Home', path: '/'  },
    {id: 2, text: 'Our Team', path: '/team' },
    {id: 3, text: 'Our Story', path: '/about' },
    {id: 4, text: 'Events', path: '/events' },
    {id: 5, text: 'Contact Us', path: '/contact' },
  ];

  return(
    <div className='bg-black flex justify-between items-center h-32 max-w-[1240px] mx-auto px-4 text-white'>
      <img src = "logo.png"/>
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key ={item.id}
            className={`p-4 hover:text-bright_green m-2 cursor-pointer duration-300 hover:text-black ${currentPath ===item.path ? 'text-green-500' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.text}
          </li>
        ))}
      </ul>
      <div onClick = {handleNav} className ='block md:hidden z-10'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className= {`fixed md:hidden top-0 left-0 w-full h-full bg-black transition-transform duration-500 ${
          nav ? 'transform translate-y-20':'transform -translate-y-full'
        }`}
      >
        {navItems.map(item => (
          <li
            key={item.id}
            className={`p-4 rounded-xl duration-300 hover:text-bright_green cursor-pointer border-gray-600 ${currentPath === item.path ? 'text-green-500' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
