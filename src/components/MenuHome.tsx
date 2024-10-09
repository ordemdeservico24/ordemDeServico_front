"use client";
import React, { useState } from "react";
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
	FaUsers,
	FaFileInvoice,
	FaChartBar,
	FaClipboardList,
} from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Logo from "../assets/logo.png";
import Image from "next/image";
import { useStore } from "../zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { ChartColumnIncreasingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompanyData } from "@/hooks/useCompanyData";

const MenuHome = () => {
	const { data } = useCompanyData();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const { role = [], logout, teamId, roleLevel } = useStore();
	const router = useRouter();
	const toggleDropdown = (dropdown: string) => {
		setOpenDropdown((prevDropdown) => (prevDropdown === dropdown ? null : dropdown));
	};

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<Card className="hidden md:block w-[300px] h-full p-4 transition-transform duration-300 ease-in-out z-20">
			<div className="flex flex-col justify-between ">
				<div>
					<div className="w-full flex justify-center items-center h-[170px] bg-[#cccccc] overflow-hidden">
						<Image src={data ? data?.companyPhoto : Logo} alt="Logo" layout="responsive" width={60} height={60} />
					</div>
					<h1 className="text-center text-[#000] text-[1.2rem] mb-1 mt-2">{data?.companyName || "Empresa"}</h1>

					<div className="flex flex-col p-4">
						<Link href="/home">
							<Button variant="link" className="flex items-center pl-1 gap-2 py-2">
								<FaHome className="h-5 w-5" />
								<span>Início</span>
							</Button>
						</Link>

						{hasPermission(role, "admin_management", "read", "primary", roleLevel) && (
							<div>
								<Button
									onClick={() => toggleDropdown("empresa")}
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
									variant="link"
								>
									<div className="flex items-center gap-2">
										<FaBuilding className="h-5 w-5" />
										<span>Minha Empresa</span>
									</div>
									{openDropdown === "empresa" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>

								{openDropdown === "empresa" && (
									<div className="flex flex-col ml-1">
										<Link href="/company/firm">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaGlobe className="h-5 w-5" />
												<span>Minha Empresa</span>
											</Button>
										</Link>
										<Link href="/company/primary">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaGlobe className="h-5 w-5" />
												<span>Estado</span>
											</Button>
										</Link>
										<Link href="/company/secondary">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaMap className="h-5 w-5" />
												<span>Cidade</span>
											</Button>
										</Link>
										<Link href="/company/tertiary">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaMapPin className="h-5 w-5" />
												<span>Distrito</span>
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}

						{hasPermission(role, "admin_management", "read") && (
							<Link href="/stock">
								<Button variant="link" className="flex items-center pl-1 gap-2 py-2">
									<FaDatabase className="h-5 w-5" />
									<span>Estoque</span>
								</Button>
							</Link>
						)}

						{hasPermission(role, "admin_management", "read", "primary", roleLevel) && (
							<div>
								<Button
									onClick={() => toggleDropdown("financeiro")}
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
									variant="link"
								>
									<div className="flex items-center gap-2">
										<FaMoneyCheck className="h-5 w-5" />
										<span>Financeiro</span>
									</div>
									{openDropdown === "financeiro" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>

								{openDropdown === "financeiro" && (
									<div className="flex flex-col ml-2">
										<Link href="/financial/categories">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaTag className="h-5 w-5" />
												<span>Categorias</span>
											</Button>
										</Link>
										<Link href="/financial/expenses">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaFileInvoice className="h-5 w-5" />
												<span>Despesas</span>
											</Button>
										</Link>
										<Link href="/financial/revenues">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaChartBar className="h-5 w-5" />
												<span>Receitas</span>
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}

						{hasPermission(role, "orders_management", "read") && (
							<div>
								<Button
									onClick={() => toggleDropdown("ordem")}
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
									variant="link"
								>
									<div className="flex items-center gap-2">
										<FaShoppingCart className="h-5 w-5" />
										<span>Ordens de Serviço</span>
									</div>
									{openDropdown === "ordem" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>

								{openDropdown === "ordem" && (
									<div className="flex flex-col ml-2">
										<Link href="/orders">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaUsers className="h-5 w-5" />
												<span>Ver todas</span>
											</Button>
										</Link>
										<Link href="/subjects">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaTag className="h-5 w-5" />
												<span>Categoria</span>
											</Button>
										</Link>
										<Link href="/orders/order-status">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaArchive className="h-5 w-5" />
												<span>Status das Ordens</span>
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}

						{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
							<div>
								<Button
									onClick={() => toggleDropdown("equipe")}
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
									variant="link"
								>
									<div className="flex items-center gap-2">
										<FaBriefcase className="h-5 w-5" />
										<span>Equipes</span>
									</div>
									{openDropdown === "equipe" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>

								{openDropdown === "equipe" && (
									<div className="flex flex-col ml-2">
										{teamId ? (
											<Link href={`/teams/${teamId}`}>
												<Button variant="link" className="flex items-center gap-2 py-2">
													<FaUsers className="h-5 w-5" />
													<span>Minha Equipe</span>
												</Button>
											</Link>
										) : (
											""
										)}
										{hasPermission(role, ["teams_management", "teamleader"], "read") && (
											<Link href="/teams">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<FaThLarge className="h-5 w-5" />
													<span>Ver Equipes</span>
												</Button>
											</Link>
										)}
										{hasPermission(role, ["teams_management", "teamleader"], "read") && (
											<Link href="/teams/leaders">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<FaArchive className="h-5 w-5" />
													<span>Líderes</span>
												</Button>
											</Link>
										)}
										{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
											<Link href="/teams/members">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<FaCalendar className="h-5 w-5" />
													<span>Membros</span>
												</Button>
											</Link>
										)}
									</div>
								)}
							</div>
						)}

						{hasPermission(role, "admin_management", "read", ["primary", "tertiary"], roleLevel) && (
							<div>
								<Button
									onClick={() => toggleDropdown("usuarios")}
									variant="link"
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
								>
									<div className="flex items-center gap-2">
										<FaUser className="h-5 w-5" />
										<span>Funcionários/Usuários</span>
									</div>
									{openDropdown === "usuarios" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>
								{openDropdown === "usuarios" && (
									<div className="flex flex-col ml-1">
										<Link href="/users">
											<Button variant="link" className="flex items-center gap-2 py-2">
												<FaUsers className="h-4 w-4 md:h-5 md:w-5" />
												<span>Ver todos</span>
											</Button>
										</Link>
										{hasPermission(role, "roles_management", "read", "primary", roleLevel) && (
											<Link href="/roles">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<FaClipboardList className="h-4 w-4 md:h-5 md:w-5" />
													<span>Cargos</span>
												</Button>
											</Link>
										)}
									</div>
								)}
							</div>
						)}

						{hasPermission(role, ["orders_management", "admin_management"], "read", "primary", roleLevel) && (
							<div>
								<Button
									onClick={() => toggleDropdown("relatorios")}
									className="flex w-full justify-between items-center pl-1 gap-2 py-2 text-[#000] transition-all"
									variant="link"
								>
									<div className="flex items-center gap-2">
										<FaClipboardList className="h-5 w-5" />
										<span>Relatórios</span>
									</div>
									{openDropdown === "relatorios" ? <FaChevronUp className="h-5 w-5" /> : <FaChevronDown className="h-5 w-5" />}
								</Button>

								{openDropdown === "relatorios" && (
									<div className="flex flex-col ml-1">
										{hasPermission(role, "orders_management", "read", "primary") && (
											<Link href="/orders/report">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<MdHomeRepairService className="h-5 w-5" />
													<span>Ordens de Serviço</span>
												</Button>
											</Link>
										)}
										{hasPermission(role, "admin_management", "read", "primary") && (
											<Link href="/financial/report">
												<Button variant="link" className="flex items-center gap-2 py-2">
													<ChartColumnIncreasingIcon className="h-5 w-5" />
													<span>Financeiro</span>
												</Button>
											</Link>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="p-4 mt-auto">
					<Link href="/">
						<Button onClick={handleLogout} variant="link" className="flex items-center pl-1 gap-2 py-2">
							<FaSignOutAlt className="h-5 w-5" />
							<span>Sair</span>
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	);
};

export default MenuHome;
