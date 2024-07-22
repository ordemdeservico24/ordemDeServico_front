import Link from "next/link";
import React, { useState } from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";

interface OrderID {
	orderId: string;
}

export const EditDeleteOrder: React.FC<OrderID> = ({ orderId }) => {
	const [deleteConfirmation, setDeleteConfirmation] = useState(false);

	const handleConfirmation = () => {
		setDeleteConfirmation(true);
	};

	const handleDelete = async (orderId: string) => {
		await fetch(
			`https://ordemdeservicosdev.onrender.com/api/order/delete-order/${orderId}`,
			{
				method: "DELETE",
			}
		)
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				toast.success("Ordem deletada com sucesso!", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					transition: Bounce,
					onClose: () => window.location.reload(),
				});
			});
		setDeleteConfirmation(false);
	};

	return (
		<div className="flex gap-2">
			<Link href={`/orders/order/edit/${orderId}`}>
				<FaEdit className="text-[#44D2FF] cursor-pointer" size={20} />
			</Link>
			{!deleteConfirmation ? (
				<FaTrash
					className="text-[#FE5E64] cursor-pointer transition-all duration-200"
					size={20}
					onClick={handleConfirmation}
				/>
			) : (
				<FaCheck
					size={20}
					className="text-[#FE5E64] cursor-pointer transition-all duration-200"
					onClick={() => handleDelete(orderId)}
				/>
			)}
		</div>
	);
};
