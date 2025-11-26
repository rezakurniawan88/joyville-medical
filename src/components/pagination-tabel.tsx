import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type PaginationTabelType = {
    page: number;
    totalItems: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    setPage: (p: number) => void;
}

export default function PaginationTabel({ page, totalItems, totalPages, startIndex, endIndex, setPage }: PaginationTabelType) {
    return (
        <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} entries
                </p>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className={`${page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            aria-disabled={page <= 1}
                            tabIndex={page <= 1 ? -1 : undefined}
                        />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                            <PaginationLink
                                className={`cursor-pointer ${page === i + 1 ? "bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700" : ""}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            className={`${page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            aria-disabled={page === totalPages}
                            tabIndex={page === totalPages ? 1 : undefined}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
