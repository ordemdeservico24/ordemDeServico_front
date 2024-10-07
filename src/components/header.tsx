import React, { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import ImageProfile from "../assets/profile.png";
// import Image from "next/image";
import { FaHome, FaGlobe, FaQuestionCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useStore } from "../zustandStore";
import ProfileSettingsDialog from "./dialogProfile";
import { useRouter } from "next/navigation";

interface HeaderProps {
	onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
	const { name, logout, userId } = useStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const router = useRouter();

	const handleLogout = () => {
		logout();
	};

	const openDialog = () => setIsDialogOpen(true);
	const closeDialog = () => setIsDialogOpen(false);

	return (
		<>
			<header className="w-full flex items-center px-3 sm:px-10 justify-between p-3 bg-[#3b86fb] text-[#fff]">
				<div className="flex gap-5 items-center space-x-4">
					<div className="md:hidden">
						<p onClick={onMenuToggle} className="cursor-pointer">
							<FiMenu size={24} />
						</p>
					</div>
					{/* <h1 className="mr-10">LOGO</h1>
					<div className="items-center cursor-pointer hidden sm:flex">
						<FaHome size={24} />
						<span className="hidden md:inline ml-2">Home</span>
					</div> */}
				</div>

				<div>
					<div className="flex flex-row items-center gap-3">
						<h1 className="hover:cursor-pointer" onClick={() => router.push(`/users/${userId}`)}>
							{name}
						</h1>
						{/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Image
                    src={ImageProfile}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openDialog}>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
					</div>
				</div>
			</header>

			<ProfileSettingsDialog isOpen={isDialogOpen} onClose={closeDialog} />
		</>
	);
}
