import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiShoppingCart, FiUsers, FiUser, FiTag, FiLogOut, FiGrid, FiArchive, FiCalendar,FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {Card} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '../assets/logo.png'
import Image from 'next/image';

const MenuHome = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="hidden md:block w-[300px] h-[80vh] p-4 transition-transform duration-300 ease-in-out z-20">
      <div className='flex flex-col justify-between h-full'>
        <div>
        <div className="w-full flex justify-center items-center h-[170px] bg-[#cccccc]">
        <Image src={Logo} alt="Logo" width={60} height={60} />
      </div>
      <h1 className="text-center text-[#000] text-[1.2rem] mb-4 mt-2">EMPRESA</h1>
      <div className="flex flex-col p-4">
        <Link href="/home">
          <Button variant="link" className="flex items-center pl-1 gap-2 py-2">
            <FiHome className="h-4 w-4 md:h-5 md:w-5" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <Link href="/orders">
          <Button variant="link" className="flex items-center pl-1 gap-2 py-2">
            <FiShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            <span>Ordens de serviço</span>
          </Button>
        </Link>
        <Link href="#" onClick={toggleMenu}>
          <Button variant="link" className="flex w-full justify-between items-center pl-1 gap-2 py-2">
            <div className='flex items-center gap-2'>
              <FiUsers className="h-4 w-4 md:h-5 md:w-5" />
              <span>Equipes</span>
            </div>
            
            {isOpen ? (
              <FiChevronUp className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <FiChevronDown className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </Link>
        {isOpen && (
          <div className="flex flex-col">
            <Link href="/teams">
              <Button variant="link" className="flex items-center gap-2 py-2">
                <FiGrid className="h-4 w-4 md:h-5 md:w-5" />
                <span>Ver Equipes</span>
              </Button>
            </Link>
            <Link href="/teams/leaders">
              <Button variant="link" className="flex items-center gap-2 py-2">
                <FiArchive className="h-4 w-4 md:h-5 md:w-5" />
                <span>Líderes</span>
              </Button>
            </Link>
            <Link href="/teams/members">
              <Button variant="link" className="flex items-center gap-2 py-2">
                <FiCalendar className="h-4 w-4 md:h-5 md:w-5" />
                <span>Membros</span>
              </Button>
            </Link>
          </div>
        )}
        <Link href="/subjects">
          <Button variant="link" className="flex items-center pl-1 gap-2 py-2">
            <FiTag className="h-4 w-4 md:h-5 md:w-5" />
            <span>Categorias</span>
          </Button>
        </Link>
        <Link href="/users">
          <Button variant="link" className="flex items-center pl-1 gap-2 py-2">
            <FiUser className="h-4 w-4 md:h-5 md:w-5" />
            <span>Usuários</span>
          </Button>
        </Link>
      </div>
        </div>
      
        
      <Link href="/" className='p-4'>
          <Button variant="link" className="flex items-center pl-1 gap-2 py-2">
            <FiLogOut className="h-4 w-4 md:h-5 md:w-5" />
            <span>Sair</span>
          </Button>
        </Link>

      </div>

    </Card>
  );
};

export default MenuHome;
