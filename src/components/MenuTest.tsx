import Link from "next/link";
import React, { useState } from "react";
import { FiHome, FiShoppingCart, FiPackage, FiLogOut, FiUsers, FiTag, FiUser, FiUsers as FiUsersIcon, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-muted/40 border-r md:w-[220px] lg:w-[280px] xl:w-[280px]">
      <div className="flex items-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <FiPackage className="h-6 w-6 text-[#3b82f6]" />
          <span className="hidden text-[#3b82f6] md:inline">Test</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="flex flex-col justify-center items-center md:items-start text-[16px] mt-4 font-bold lg:px-4">
          <Link
            href="/home"
            className="flex items-center gap-2 md:gap-3 bg-muted rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            prefetch={false}
          >
            <FiHome className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-2 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            prefetch={false}
          >
            <FiShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Ordens de serviço</span>
          </Link>
          <div className="flex flex-col">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-center items-center gap-2 md:gap-3 rounded-lg py-2 text-primary transition-all hover:text-primary w-full"
          >
            <FiUsers className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Equipes</span>
            <span className="hidden md:inline ml-auto">
              {isOpen ? (
                <FiChevronUp className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <FiChevronDown className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </span>
          </button>

            {isOpen && (
              <div className="flex flex-col gap-1">
                <Link
                  href="/teams"
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-primary"
                  prefetch={false}
                >
                  <FiUser className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:flex">Ver Equipes</span>
                </Link>
                <Link
                  href="/teams/leaders"
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-primary"
                  prefetch={false}
                >
                  <FiUsersIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Líderes</span>
                </Link>
                <Link
                  href="/teams/members"
                  className="flex items-center gap-2 p-2 text-muted-foreground hover:text-primary"
                  prefetch={false}
                >
                  <FiTag className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Membros</span>
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/subjects"
            className="flex items-center gap-2 md:gap-3 rounded-lg py-2 text-primary transition-all hover:text-primary"
            prefetch={false}
          >
            <FiTag className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Categorias</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 md:gap-3 rounded-lg py-2 text-muted-foreground transition-all hover:text-primary"
            prefetch={false}
          >
            <FiUser className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Usuários</span>
          </Link>
        </nav>
      </div>
      <div className="p-4 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 rounded-lg py-2 text-primary"
          prefetch={false}
        >
          <FiLogOut className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:inline">Sair</span>
        </Link>
      </div>
    </div>
  );
}
