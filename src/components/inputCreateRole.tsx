import { IRolePermission } from "@/interfaces/user.interface";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";

interface IInputCreateRoleProps {
	resource: string;
	resourceLabel: string;
	permissions: IRolePermission[];
	toggleOperation: (resource: string, operation: string) => void;
	addResource: (resource: string, resourceLabel: string) => void;
}

const InputCreateRole: React.FC<IInputCreateRoleProps> = ({ resource, resourceLabel, permissions, toggleOperation, addResource }) => {
	return (
		<div className="w-full flex justify-between">
			<div className="flex items-center gap-1">
				<input type="checkbox" name={resource} id={resource} onClick={() => addResource(resource, resourceLabel)} />
				<span>{resourceLabel}</span>
			</div>
			<div className="flex gap-1">
				<PlusIcon
					className={`hover:cursor-pointer ${
						permissions.find((p) => p.resource === resource)?.operations.includes("create") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => toggleOperation(resource, "create")}
				/>
				<EyeIcon
					className={`hover:cursor-pointer ${
						permissions.find((p) => p.resource === resource)?.operations.includes("read") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => toggleOperation(resource, "read")}
				/>
				<EditIcon
					className={`hover:cursor-pointer ${
						permissions.find((p) => p.resource === resource)?.operations.includes("update") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => toggleOperation(resource, "update")}
				/>
				<TrashIcon
					className={`hover:cursor-pointer ${
						permissions.find((p) => p.resource === resource)?.operations.includes("delete") ? "opacity-100" : "opacity-20"
					}`}
					onClick={() => toggleOperation(resource, "delete")}
				/>
			</div>
		</div>
	);
};

export default InputCreateRole;
