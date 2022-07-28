import * as React from "react";
import TablePagination from "@mui/material/TablePagination";

type PaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;
  setPage: (data: number) => void;
  setRowsPerPage: (data: number) => void;
};

export default function Pagination({
  total,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
}: PaginationProps) {
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
