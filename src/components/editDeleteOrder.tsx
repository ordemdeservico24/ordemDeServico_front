import Link from "next/link";
import React, { useState } from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { getCookie } from 'cookies-next';

interface OrderID {
  orderId: string;
}

export const EditDeleteOrder: React.FC<OrderID> = ({ orderId }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const token = getCookie('access_token');
  const handleConfirmation = () => {
    setDeleteConfirmation(true);
  };
  const handleDelete = async (orderId: string) => {
    await fetch(
      `https://ordemdeservicosdev.onrender.com/api/order/delete-order/${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          theme: "light",
          transition: Bounce,
          onClose: () => window.location.reload(),
        });
      });
    setDeleteConfirmation(false);
  };

  return (
    <div className="flex gap-2 items-center">
      <Link href={`/orders/order/edit/${orderId}`}>
        <FaEdit
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          size={20}
          title="Editar ordem"
        />
      </Link>
      {deleteConfirmation ? (
        <FaCheck
          size={20}
          className="text-green-500 cursor-pointer hover:text-green-700 transition-colors duration-200"
          onClick={() => handleDelete(orderId)}
          title="Confirmar exclusão"
        />
      ) : (
        <FaTrash
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          size={20}
          onClick={handleConfirmation}
          title="Excluir ordem"
        />
      )}
    </div>
  );
};
