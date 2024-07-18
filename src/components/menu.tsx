"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

export default function Menu() {
	return (
		<>
			<div className="border-x border-[#d7d7d7] relative shadow-inner hidden lg:inline">
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
					<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium group">
						<p className="flex items-center justify-between">
							Equipes
							<IoIosArrowDown className="transition-all duration-200 group-hover:rotate-180" />
						</p>
						<div className="flex-col pl-4 hidden group-hover:flex gap-4 w-full">
							<Link
								href="/teams"
								className="mt-4 hover:text-[#5100ff]"
							>
								Ver equipes
							</Link>
							<Link
								href="/teams/leaders"
								className="hover:text-[#5100ff]"
							>
								Líderes
							</Link>
							<Link
								href="/teams/members"
								className="hover:text-[#5100ff]"
							>
								Membros
							</Link>
						</div>
					</li>
					<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
						Usuários
					</li>
					<li className="hover:bg-[rgba(127,86,216,0.1)] px-8 py-4 hover:text-[#7F56D8] cursor-pointer font-medium">
						Sair
					</li>
				</ul>
			</div>
		</>
	);
}
