import React from "react";

interface MoneyFormatterProps {
	value: number;
	currency?: string;
}

const MoneyFormatter: React.FC<MoneyFormatterProps> = ({ value, currency = "BRL" }) => {
	const formattedValue = value.toLocaleString("pt-BR", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
	});

	return <span>{formattedValue}</span>;
};

export default MoneyFormatter;
