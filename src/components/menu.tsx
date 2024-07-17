import Link from "next/link";
import React, { ReactNode } from "react";

export default function Menu() {
	return (
		<div className="border-x border-[#d7d7d7] shadow-inner hidden md:inline">
			<ul className="flex flex-col mt-8 gap-4">
				<Link href="/">
					<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
						Dashboard
					</li>
				</Link>
				<Link href="/orders">
					<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
						Ordens de serviço
					</li>
				</Link>
				<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
					Equipes
				</li>
				<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
					Usuários
				</li>
				<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
					Sair
				</li>
			</ul>
		</div>
	);
}
