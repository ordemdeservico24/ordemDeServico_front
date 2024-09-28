import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, Bounce } from "react-toastify";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OrderSubjectSelect } from "@/components/orderSubjectSelect";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { IOrderGet, IOrderStatus } from "@/interfaces/order.interface";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ISubject } from "@/interfaces/subject.interface";
import { Input } from "./ui/input";

interface OrderID {
	orderId: string;
	subjects: ISubject[];
	orderStatus: IOrderStatus[];
}

export const EditDeleteOrder: React.FC<OrderID> = ({ orderId, subjects, orderStatus }) => {
	const [isClient, setIsClient] = useState(false);
	const [order, setOrder] = useState<IOrderGet | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [selectedSubject, setSelectedSubject] = useState<string>("");
	const [isEditing, setIsEditing] = useState(false);
	const token = getCookie("access_token");

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (orderId) {
			fetch(`https://ordemdeservicosdev.onrender.com/api/order/get-order/${orderId}`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => setOrder(data))
				.catch((err) => console.error("Failed to fetch order:", err));
		}
	}, [orderId, token]);

	const handleDelete = async () => {
		await fetch(`https://ordemdeservicosdev.onrender.com/api/order/delete-order/${orderId}`, {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then(() => {
				toast.success("Ordem deletada com sucesso!", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
					onClose: () => window.location.reload(),
				});
			})
			.catch(() => {
				toast.error("Erro ao deletar ordem.", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				});
			});
	};

	const handleSelectOrderStatusChange = (value: string) => {
		setSelectedStatus(value);
	};
	const handleSelectSubjectChange = (value: string) => {
		setSelectedSubject(value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: IRequest = {
			subjectId: selectedSubject || order?.subjectId || "",
			orderStatusId: selectedStatus || order?.orderStatusId || "",
			requesterName: getInput("requesterName").value || "",
			requesterPhone: getInput("requesterPhone").value || "",
			requesterStreet: getInput("requesterStreet").value || "",
			requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
			requesterComplement: getInput("requesterComplement").value || "",
			requesterZipcode: getInput("requesterZipcode").value || "",
			notes: getInput("notes").value || "",
		};

		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/order/edit-order/${orderId}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(request),
			})
				.then((res) => res.json())
				.then(() => {
					toast.success("Ordem editada com sucesso", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
						transition: Bounce,
					});
					setIsEditing(false);
				}),
			{
				pending: "Editando ordem",
				success: "Ordem editada com sucesso",
				error: "Ocorreu um erro",
			}
		);
	};

	return (
		<div className="flex gap-2 items-center">
			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogTrigger asChild>
					<FaEdit
						className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
						size={20}
						title="Editar ordem"
						onClick={() => setIsEditing(true)}
					/>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Editar Ordem</DialogTitle>
						<DialogDescription>Edite os dados da ordem de serviço abaixo</DialogDescription>
					</DialogHeader>
					{order && (
						<form action="#" onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-2">
							<Select onValueChange={handleSelectSubjectChange} value={selectedSubject}>
								<SelectTrigger className="outline-none border rounded px-2 py-1">
									<SelectValue placeholder={order.subject.name} />
								</SelectTrigger>
								<SelectContent>
									{subjects?.map((subject) => (
										<SelectItem key={subject.id} value={subject.id || ""}>
											{subject.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select onValueChange={handleSelectOrderStatusChange} value={selectedStatus}>
								<SelectTrigger className="outline-none border rounded px-2 py-1">
									<SelectValue placeholder={order.orderStatus.orderStatusName} />
								</SelectTrigger>
								<SelectContent>
									{orderStatus?.map((status) => (
										<SelectItem key={status.id} value={status.id}>
											{status.orderStatusName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input type="text" name="requesterName" placeholder={"Nome do solicitante"} required defaultValue={order.requesterName} />
							<Input
								type="tel"
								name="requesterPhone"
								placeholder="Telefone do solicitante"
								required
								defaultValue={order.requesterPhone}
							/>
							<Input
								type="text"
								name="requesterStreet"
								placeholder="Endereço do solicitante"
								required
								defaultValue={order.requesterStreet}
							/>
							<Input
								type="number"
								name="requesterHouseNumber"
								placeholder="N° da casa do solicitante"
								required
								defaultValue={order.requesterHouseNumber}
							/>
							<Input
								type="text"
								name="requesterComplement"
								placeholder="Complemento do solicitante"
								required
								defaultValue={order.requesterComplement}
							/>
							<Input
								type="text"
								name="requesterZipcode"
								placeholder="CEP do solicitante"
								required
								defaultValue={order.requesterZipcode}
							/>
							<Textarea name="notes" placeholder="Observações" className="border rounded px-2 py-1 mb-4" defaultValue={order.notes} />
							<DialogFooter>
								<Button type="submit" className="bg-blue-500 hover:bg-blue-600">
									Salvar
								</Button>
								<Button type="button" className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsEditing(false)}>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>
			{isClient && (
				<Dialog>
					<DialogTrigger asChild>
						<FaTrash
							className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
							size={20}
							title="Excluir ordem"
						/>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogDescription>Tem certeza que deseja deletar esta ordem?</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button type="submit" onClick={handleDelete}>
								Deletar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};
