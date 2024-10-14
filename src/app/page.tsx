"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Bg from "../assets/bg.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useStore } from "../zustandStore";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export default function Page() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const setToken = useStore((state) => state.setToken);
	const setName = useStore((state) => state.setName);
	const setUserId = useStore((state) => state.setUserId);
	const setTeamId = useStore((state) => state.setTeamId);
	const setRole = useStore((state) => state.setRole);
	const setRoleLevel = useStore((state) => state.setRoleLevel);
	const onSubmit = async (data: any) => {
		try {
			const response = await axios.post(`${BASE_URL}/user/login`, data);
			// console.log("Login successful:", response.data);

			const { token, userName, role, userId, teamId, roleLevel } = response.data;

			if (token) {
				setToken(token);
			}
			if (userName) {
				setName(userName);
			}
			if (userId) {
				setUserId(userId);
			}
			if (teamId) {
				setTeamId(teamId);
			}
			if (role) {
				setRole(role);
			}
			if (roleLevel) {
				setRoleLevel(roleLevel);
			}
			// console.log("Login token:", token);
			// console.log("User role:", role);
			// console.log("User roleLevel:", roleLevel);

			router.push("/home");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const [isPasswordVisible, setIsPasswordVisibile] = useState(false);

	return (
		<div className="flex min-h-screen">
			<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
				<div className="flex items-center justify-center py-12">
					<form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid w-[450px] gap-6">
						<div className="grid gap-2 text-center">
							<h1 className="text-3xl font-bold">Login</h1>
							<p className="text-balance text-muted-foreground">Coloque suas informações e entre.</p>
						</div>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email">E-mail</Label>
								<Input id="email" type="email" placeholder="m@example.com" {...register("email")} required />
								{errors.email && <span className="text-red-500">{errors.email.message?.toString()}</span>}
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Senha</Label>
									<Link href="#" className="ml-auto text-sm text-black hover:underline">
										Esqueceu a senha?
									</Link>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={isPasswordVisible ? "text" : "password"}
										placeholder="********"
										{...register("password")}
										required
									/>
									<span className="absolute right-3 top-1/2 -translate-y-1/2 ">
										<button type="button" onClick={() => setIsPasswordVisibile(!isPasswordVisible)}>
											{isPasswordVisible ? (
												<EyeIcon size={20} className="text-slate-600 cursor-pointer" />
											) : (
												<EyeOffIcon size={20} className="text-slate-600 cursor-pointer" />
											)}
										</button>
									</span>
								</div>

								{errors.password && <span className="text-red-500">{errors.password.message?.toString()}</span>}
							</div>
							<Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center">
								{isSubmitting ? <Loader className="animate-spin" /> : "Entrar"}
							</Button>
						</div>
					</form>
				</div>
				<div className="hidden bg-muted lg:block">
					<Image src={Bg} alt="Image" width="1920" height="1080" className="h-full w-full object-cover dark:brightness-[0.2]" />
				</div>
			</div>
		</div>
	);
}
