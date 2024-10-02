import React, { ReactNode, useState, useEffect } from "react";
import Header from "./header";
import Menu from "./MenuLateral";
import MenuHome from './MenuHome';
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const token = getCookie("access_token");
  const router = useRouter();
  
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
		return null;
  }
  
  return (
    <div className="relative">
      <Menu isOpen={isMenuOpen} />

      <div className={`flex flex-col min-h-[100dvh] transition-transform duration-300 ${isMenuOpen ? 'translate-x-[260px]' : ''}`}>
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <div className={`flex-1 flex mt-3 bg-white p-4 rounded-lg ${className}`}>
          <MenuHome />
          {children}
        </div>
      </div>
    </div>
  );
};
