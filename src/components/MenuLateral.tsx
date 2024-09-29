"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	FaHome,
	FaShoppingCart,
	FaUser,
	FaTag,
	FaSignOutAlt,
	FaChevronDown,
	FaChevronUp,
	FaBuilding,
	FaGlobe,
	FaMap,
	FaMapPin,
	FaDatabase,
	FaBriefcase,
	FaThLarge,
	FaArchive,
	FaCalendar,
	FaMoneyCheck,
	FaSlash,
	FaUsers,
	FaFileInvoice,
	FaChartBar,
	FaClipboardList,
} from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import Logo from "../assets/logo.png";
import Image from "next/image";
import { Role, useStore } from "../zustandStore";
import IconWrapper from "./IconWrapper";
import { hasPermission } from "@/utils/hasPermissions";
import { getCookie } from "cookies-next";
import { ICompany } from "@/interfaces/company.interface";
import { MdHomeRepairService } from "react-icons/md";

interface MenuProps {
	isOpen: boolean;
}

const Menu: React.FC<MenuProps> = ({ isOpen }) => {
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const [company, setCompany] = useState<ICompany>();
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");
	const { role, logout } = useStore();

	useEffect(() => {
		fetch("https://ordemdeservicosdev.onrender.com/api/company/get-company", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setCompany(data);
				if (!data) {
					setError("Erro ao carregar dados da equipe.");
				}
			})
			.catch((err) => {
				console.error("Erro ao buscar os dados:", err);
				setError("Erro ao carregar dados da equipe.");
			});
	}, [token]);

	const handleLogout = () => {
		logout();
	};

	const toggleDropdown = (dropdown: string) => {
		setOpenDropdown((prevDropdown) => (prevDropdown === dropdown ? null : dropdown));
	};

	const hasRole = (requiredResource: string) => {
		return role.some((r: Role) => r.resource === requiredResource);
	};

	return (
		<div
			className={`sm:hidden fixed left-0 w-[261px] h-full p-4 bg-[#f1f1f1] transition-transform duration-300 ease-in-out z-20 [box-shadow:rgba(60,_64,_67,_0.3)_0px_1px_2px_0px,_rgba(60,_64,_67,_0.15)_0px_1px_3px_1px] ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<div className="w-full flex justify-center items-center h-[170px] bg-[#cccccc]">
				<Image src={company ? company?.companyPhoto : Logo} alt="Logo" layout="responsive" width={60} height={60} />
			</div>
			<h1 className="text-center text-[#000] text-[1.2rem] mb-1 mt-2">{company?.companyName || "Empresa"}</h1>

			<div className="flex flex-col mt-6">
				<Link href="/home" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
					<FaHome className="h-4 w-4 md:h-5 md:w-5" />
					<span>Dashboard</span>
				</Link>

				{hasPermission(role, "admin_management") && (
					<div>
						<button
							onClick={() => toggleDropdown("empresa")}
							className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
						>
							<div className="flex items-center gap-2">
								<FaBuilding className="h-4 w-4 md:h-5 md:w-5" />
								<span>Minha Empresa</span>
							</div>
							<FaChevronDown
								className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "empresa" ? "rotate-180" : "rotate-0"}`}
							/>
						</button>

						{openDropdown === "empresa" && (
							<div className="flex flex-col ml-4">
								<Link href="#" className="flex items-center pl-4 rounded-lg gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
									<FaGlobe className="h-4 w-4 md:h-5 md:w-5" />
									<span>Estado</span>
								</Link>
								<Link href="#" className="flex items-center pl-4 rounded-lg gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
									<FaMap className="h-4 w-4 md:h-5 md:w-5" />
									<span>Cidade</span>
								</Link>
								<Link href="#" className="flex items-center pl-4 rounded-lg gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
									<FaMapPin className="h-4 w-4 md:h-5 md:w-5" />
									<span>Distrito</span>
								</Link>
							</div>
						)}
					</div>
				)}

				<Link href="/stock" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
					<FaDatabase className="h-4 w-4 md:h-5 md:w-5" />
					<span>Estoque</span>
				</Link>

				<button
					onClick={() => toggleDropdown("financeiro")}
					className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
				>
					<div className="flex items-center gap-2">
						<FaMoneyCheck className="h-4 w-4 md:h-5 md:w-5" />
						<span>Financeiro</span>
					</div>
					<FaChevronDown
						className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "financeiro" ? "rotate-180" : "rotate-0"}`}
					/>
				</button>

				{openDropdown === "financeiro" && (
					<div className="flex flex-col ml-4">
						<Link
							href="/financial/categories"
							className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
						>
							<FaTag className="h-4 w-4 md:h-5 md:w-5" />
							<span>Categorias</span>
						</Link>
						<Link
							href="/financial/expenses"
							className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
						>
							<FaFileInvoice className="h-4 w-4 md:h-5 md:w-5" />
							<span>Despesas</span>
						</Link>
						<Link
							href="/financial/revenues"
							className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
						>
							<FaChartBar className="h-4 w-4 md:h-5 md:w-5" />
							<span>Receitas</span>
						</Link>
					</div>
				)}

				{hasPermission(role, "orders_management") && (
					<div>
						<button
							onClick={() => toggleDropdown("ordem")}
							className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
						>
							<div className="flex items-center gap-2">
								<FaShoppingCart className="h-5 w-5" />
								<span>Ordens de Serviço</span>
							</div>
							<FaChevronDown
								className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "ordem" ? "rotate-180" : "rotate-0"}`}
							/>
						</button>

						{openDropdown === "ordem" && (
							<div className="flex flex-col ml-4">
								<Link
									href="/orders"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaUsers className="h-4 w-4 md:h-5 md:w-5" />
									<span>Ver todas</span>
								</Link>
								<Link
									href="/subjects"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaTag className="h-4 w-4 md:h-5 md:w-5" />
									<span>Categoria</span>
								</Link>
								<Link
									href="/orders/order-status"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaArchive className="h-4 w-4 md:h-5 md:w-5" />
									<span>Status das Ordens</span>
								</Link>
							</div>
						)}
					</div>
				)}

				{hasPermission(role, "teams_management") && (
					<div>
						<button
							onClick={() => toggleDropdown("equipe")}
							className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
						>
							<div className="flex items-center gap-2">
								<FaBriefcase className="h-4 w-4 md:h-5 md:w-5" />
								<span>Equipes</span>
							</div>
							<FaChevronDown
								className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "equipe" ? "rotate-180" : "rotate-0"}`}
							/>
						</button>

						{openDropdown === "equipe" && (
							<div className="flex flex-col ml-4">
								<Link href="#" className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]">
									<FaUsers className="h-4 w-4 md:h-5 md:w-5" />
									<span>Minha Equipe</span>
								</Link>
								<Link
									href="/teams"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaThLarge className="h-4 w-4 md:h-5 md:w-5" />
									<span>Ver Equipes</span>
								</Link>
								<Link
									href="/teams/leaders"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaArchive className="h-4 w-4 md:h-5 md:w-5" />
									<span>Líderes</span>
								</Link>
								<Link
									href="/teams/members"
									className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
								>
									<FaCalendar className="h-4 w-4 md:h-5 md:w-5" />
									<span>Membros</span>
								</Link>
							</div>
						)}
					</div>
				)}

				<button
					onClick={() => toggleDropdown("usuarios")}
					className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
				>
					<div className="flex items-center gap-2">
						<FaUser className="h-4 w-4 md:h-5 md:w-5" />
						<span>Usuários</span>
					</div>
					<FaChevronDown
						className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "usuarios" ? "rotate-180" : "rotate-0"}`}
					/>
				</button>

				{openDropdown === "usuarios" && (
					<div className="flex flex-col ml-4">
						<Link href="/users" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
							<FaUsers className="h-4 w-4 md:h-5 md:w-5" />
							<span>Ver todos</span>
						</Link>
						<Link href="/users" className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]">
							<FaClipboardList className="h-4 w-4 md:h-5 md:w-5" />
							<span>Cargos</span>
						</Link>
					</div>
				)}

				<div>
					<button
						onClick={() => toggleDropdown("relatorios")}
						className="flex items-center justify-between px-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9] w-full"
					>
						<div className="flex items-center gap-2">
							<FaClipboardList className="h-5 w-5" />
							<span>Relatórios</span>
						</div>
						<FaChevronDown
							className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${openDropdown === "relatorios" ? "rotate-180" : "rotate-0"}`}
						/>
					</button>

					{openDropdown === "relatorios" && (
						<div className="flex flex-col ml-4">
							<Link
								href="/orders/report"
								className="flex items-center rounded-lg pl-4 gap-2 p-2 text-[#000] transition-all hover:bg-[#dad9d9]"
							>
								<MdHomeRepairService className="h-4 w-4 md:h-5 md:w-5" />
								<span>Ordens de Serviço</span>
							</Link>
						</div>
					)}
				</div>

				<Link
					href="/"
					onClick={handleLogout}
					className="flex items-center pl-4 gap-2 rounded-lg py-2 text-[#000] transition-all hover:bg-[#dad9d9]"
				>
					<FaSignOutAlt className="h-4 w-4 md:h-5 md:w-5" />
					<span>Sair</span>
				</Link>
			</div>
		</div>
	);
};

export default Menu;
