import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  nextPage: number;
  prevPage: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  nextPage,
  prevPage,
  totalPage,
  onPageChange,
}) => {
  const pageNumbers = [];

  const startPage = Math.max(2, currentPage - 2);
  const endPage = Math.min(totalPage - 1, currentPage + 2);

  pageNumbers.push(1);

  if (startPage > 2) pageNumbers.push("ellipsis-left");

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPage - 1) pageNumbers.push("ellipsis-right");

  if (totalPage > 1) pageNumbers.push(totalPage);
  return (
    <Pagination >
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => onPageChange(prevPage)}
            />
          </PaginationItem>
        )}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis-left" || page === "ellipsis-right" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        {currentPage < totalPage && (
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => onPageChange(nextPage)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
