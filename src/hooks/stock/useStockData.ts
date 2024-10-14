"use client";

import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import axios, { AxiosPromise } from "axios";
import { IStockItem, ISupplier } from "@/interfaces/stock.interface";

const token = getCookie("access_token");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchStockData = (): AxiosPromise<IStockItem> => {
	const response = axios.get<IStockItem>(`${BASE_URL}/storage/get-all-items`, {
		headers: {
			"Content-type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response;
};

export function useStockData() {
	const query = useQuery({
		queryFn: fetchStockData,
		queryKey: ["stock"],
		enabled: !!token,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	return {
		...query,
		data: query.data?.data,
	};
}

const fetchSuppliersData = (): AxiosPromise<ISupplier> => {
	const response = axios.get<ISupplier>(`${BASE_URL}/storage/get-all-suppliers`, {
		headers: {
			"Content-type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response;
};

export function useSupplierData() {
	const query = useQuery({
		queryFn: fetchSuppliersData,
		queryKey: ["suppliers"],
		enabled: !!token,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	});

	return {
		...query,
		data: query.data?.data,
	};
}
