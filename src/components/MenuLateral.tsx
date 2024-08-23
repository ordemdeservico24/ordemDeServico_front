import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiShoppingCart, FiUsers, FiUser, FiTag, FiLogOut, FiGrid, FiArchive, FiCalendar, FiChevronDown } from 'react-icons/fi';
import Logo from '../assets/logo.png'
import Image from 'next/image';
interface MenuProps {
  isOpen: boolean;
}

const Menu: React.FC<MenuProps> = ({ isOpen }) => {
  const [isEquipeOpen, setIsEquipeOpen] = useState(false);

  const toggleEquipeDropdown = () => {
    setIsEquipeOpen(!isEquipeOpen);
  };

  return (
    <div
      className={`sm:hidden fixed left-0 w-[260px] h-full p-4 bg-[#f1f1f1] transition-transform duration-300 ease-in-out z-20 [box-shadow:rgba(60,_64,_67,_0.3)_0px_1px_2px_0px,_rgba(60,_64,_67,_0.15)_0px_1px_3px_1px] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="w-full flex justify-center items-center h-[120px] bg-[#cccccc]">
        <Image src={Logo} alt="Logo" width={100} height={100} />
      </div>
      <h1 className="text-center text-[#000] text-[1.2rem] mb-4 mt-2">EMPRESA</h1>

      <div className="flex flex-col mt-6">
        <Link href="/home" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
          <FiHome className="h-4 w-4 md:h-5 md:w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/orders" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
          <FiShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
          <span>Ordens de serviço</span>
        </Link>

        <button
          onClick={toggleEquipeDropdown}
          className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
        >
          <div className="flex items-center gap-2">
            <FiUsers className="h-4 w-4 md:h-5 md:w-5" />
            <span>Equipes</span>
          </div>
          <FiChevronDown
            className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${
              isEquipeOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
        {isEquipeOpen && (
          <div className="flex flex-col">
            <Link href="/teams" className="flex items-center pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
              <FiGrid className="h-4 w-4 md:h-5 md:w-5" />
              <span>Ver Equipes</span>
            </Link>
            <Link href="/teams/leaders" className="flex items-center pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
              <FiArchive className="h-4 w-4 md:h-5 md:w-5" />
              <span>Líderes</span>
            </Link>
            <Link href="/teams/members" className="flex items-center pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
              <FiCalendar className="h-4 w-4 md:h-5 md:w-5" />
              <span>Membros</span>
            </Link>
          </div>
        )}

        <Link href="/subjects" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
          <FiTag className="h-4 w-4 md:h-5 md:w-5" />
          <span>Categorias</span>
        </Link>
        <Link href="/users" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
          <FiUser className="h-4 w-4 md:h-5 md:w-5" />
          <span>Usuários</span>
        </Link>
        <Link href="/" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
          <FiLogOut className="h-4 w-4 md:h-5 md:w-5" />
          <span>Sair</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;