import React, { useState } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa"; // Ícones de feedback
import { Button } from "./ui/button";
import { ClipboardIcon } from "lucide-react";

interface CopyToClipboardButtonProps {
	textToCopy: string; // O texto que será copiado
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
		});
	};

	return (
		<Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
			{copied ? <FaCheck /> : <ClipboardIcon size={20} />}
			{copied ? "Copiado!" : "Copiar link de cadastro"}
		</Button>
	);
};

export default CopyToClipboardButton;
