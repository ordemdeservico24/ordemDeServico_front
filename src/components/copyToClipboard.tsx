import React, { useState } from "react";
import { FaClipboard, FaCheck } from "react-icons/fa"; // Ícones de feedback
import { Button } from "./ui/button";

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
		<Button onClick={handleCopy} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
			{copied ? <FaCheck /> : <FaClipboard />}
			{copied ? "Copiado!" : "Copiar link de cadastro"}
		</Button>
	);
};

export default CopyToClipboardButton;
