import { useState } from "react";
import { IRolePermission } from "@/interfaces/user.interface";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";

interface IInputCreateRoleProps {
	resource: string;
	resourceLabel: string;
	permissions: IRolePermission[];
	toggleOperation: (resource: string, operation: string) => void;
	addResource: (resource: string, resourceLabel: string) => void;
}

const InputCreateRole: React.FC<IInputCreateRoleProps> = ({ resource, resourceLabel, permissions, toggleOperation, addResource }) => {
	const [isChecked, setIsChecked] = useState(false);
	const [showWarning, setShowWarning] = useState(false);

	// Função que lida com a marcação do checkbox
	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
		setShowWarning(false);
		addResource(resource, resourceLabel);
	};

	const handleIconClick = (operation: string) => {
		if (!isChecked) {
			toast.warn("Por favor, selecione o checkbox antes de escolher as permissões.");
		} else {
			toggleOperation(resource, operation);
		}
	};

	return (
		<div className="w-full flex justify-between">
			<div className="flex items-center gap-1 cursor-pointer" onClick={handleCheckboxChange}>
				<input type="checkbox" name={resource} id={resource} checked={isChecked} />
				<span>{resourceLabel}</span>
			</div>
			<div className="flex gap-1">
				<PlusIcon
					className={`hover:cursor-pointer ${isChecked ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
						permissions.find((p) => p.resource === resource)?.operations.includes("create") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => handleIconClick("create")}
				/>
				<EyeIcon
					className={`hover:cursor-pointer ${isChecked ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
						permissions.find((p) => p.resource === resource)?.operations.includes("read") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => handleIconClick("read")}
				/>
				<EditIcon
					className={`hover:cursor-pointer ${isChecked ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
						permissions.find((p) => p.resource === resource)?.operations.includes("update") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => handleIconClick("update")}
				/>
				<TrashIcon
					className={`hover:cursor-pointer ${isChecked ? "opacity-100" : "opacity-50 cursor-not-allowed"} ${
						permissions.find((p) => p.resource === resource)?.operations.includes("delete") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => handleIconClick("delete")}
				/>
			</div>
		</div>
	);
};

export default InputCreateRole;
