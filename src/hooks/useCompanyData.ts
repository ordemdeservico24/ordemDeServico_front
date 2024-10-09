'use client'

import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import axios, { AxiosPromise } from 'axios'
import { ICompany } from '@/interfaces/company.interface'

const token = getCookie('access_token')

const fetchCompanyData = (): AxiosPromise<ICompany> => {
  const response = axios.get<ICompany>('https://ordemdeservicosdev.onrender.com/api/company/get-company', {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}

export function useCompanyData() {
  const query = useQuery({
    queryFn: fetchCompanyData,
    queryKey: ['company'],
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    ...query,
    data: query.data?.data,
  }
}
