'use client';


import { useEffect, useState } from "react";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import DynamicTable from "./DynamicTable";
import useAxios from "axios-hooks";

export type Data = {
  uuid: string;
  tenant: string;
  title: string;
  short_description: string;
  long_description: string;
  status: string;
  locale: string;
  status_updated_by: string;
  status_updated_on: string;
  created_on: string;
  created_by: string;
  attachment: string;
  
};

export default function Home() {
  const [pagination , setPagination] = useState<PaginationState>({pageIndex: 0,pageSize : 10})
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setcolumnFilters] = useState<ColumnFiltersState>([]);

  const [{ data, loading, error }, refetch] = useAxios<Data[], any, any>({
    url: 'https://api-test.agwise.com/portal/v1/scheme/',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNTdlYTEwOGMtYzAxMy00NjhkLWFiYjYtMDBjNmYxYzRjZWM1IiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTcwOTgyNjk5OSwibmJmIjoxNzA5ODE5Nzk5LCJpc3MiOiJjb20uYWd3aXNlLmlkZW50aXR5IiwiaWF0IjoxNzA5ODE5Nzk5fQ.bbGDG7UCzRkgzHnUZpmevFnQtJgt7-K5FDClt6mZUGM'
    },
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize
    }
  })

  useEffect(() => {
    refetch({
      params: {
        page: pagination.pageIndex,
        limit: pagination.pageSize
      }
    })
  },[pagination.pageIndex, pagination.pageSize]);

  const columns = [
    {id: 'tenant', header: <b>tenant</b>},
    {id: 'title', header: <i>title</i>},
    {id: 'short_description', header: <u>short_description</u>},
    {id: 'long_description', header: <b>long_description</b>},
  ] 
  

  return (
    <DynamicTable
      columns={columns}
      data={data || []}
      loading={loading}
      sorting={sorting}
      pagination={pagination}
      columnFilters={columnFilters}
      setSorting={setSorting}
      onPaginationChange={setPagination}
      setcolumnFilters={setcolumnFilters}
    />
  );
}
