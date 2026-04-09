"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Students } from "@/interfaces/students.interface";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Checkbox } from "../ui/checkbox";
import CreateStudent from "./create-student";
import ChangeStatusDialog from "./change-status";
import DeleteStudentDialog from "./delete-student";
import UpdateStudent from "./update-student";


interface StudentsTableProps {
    session: any;
}

const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <span key={index} className="bg-yellow-300 text-black rounded px-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

const StudentsTable = ({ session }: StudentsTableProps) => {
    const accessToken = session?.user?.id;
    // console.log('🚀 ~ student-table.tsx:71 ~ accessToken:', accessToken);
    const [data, setData] = useState<Students[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useState<number>();
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const pathname = usePathname();
    const lng = pathname.split("/")[1];
    const { t } = useTranslation(lng, "Language");

    // 🔹 Load saved visibility from localStorage (if exists)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        () => {
            if (typeof window !== "undefined") {
                const saved = localStorage.getItem("storeTableColumnVisibility");
                return saved ? JSON.parse(saved) : {};
            }
            return {};
        }
    );

    const classMap = Object.fromEntries(
        classes.map((cls: any) => [cls.id, cls.class_name])
    );

    const columns: ColumnDef<Students>[] = [
        // {
        //     accessorKey: "id",
        //     header: ({ column }) => {
        //         const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
        //         return (
        //             <div className="flex items-center justify-center gap-2">
        //                 {t("student_id")}
        //                 <Button
        //                     variant="ghost"
        //                     size="icon"
        //                     className="h-4 w-4 p-0"
        //                     onClick={() => column.toggleSorting(isSorted === "asc")}
        //                 >
        //                     <ArrowUpDown className="h-4 w-4" />
        //                 </Button>
        //             </div>
        //         )
        //     },
        //     enableSorting: true,
        //     sortingFn: (rowA, rowB, columnId) => {
        //         return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId));
        //     },
        //     cell: ({ row }) => (
        //         <div className="whitespace-nowrap ">
        //             {row.getValue("id")}
        //         </div>
        //     ),
        // },

        {
            accessorKey: "full_name",
            header: t("full_name"),
            cell: ({ row }) => {
                const fullName = row.getValue("full_name") as string;
                return <div className="whitespace-nowrap text-start">{highlightText(fullName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "class",
            header: t("class"),
            cell: ({ row }) => {
                const classString = row.getValue("class");

                let classArray: number[] = [];

                // 🔥 Handle both string and array (future-proof)
                if (typeof classString === "string") {
                    try {
                        classArray = JSON.parse(classString);
                    } catch {
                        classArray = [];
                    }
                } else if (Array.isArray(classString)) {
                    classArray = classString;
                }

                const formattedClass = classArray
                    .map((id: number) => classMap[id])
                    .filter(Boolean)
                    .join(", ");

                return (
                    <div className="whitespace-nowrap">
                        {formattedClass || "N/A"}
                    </div>
                );
            },
        },

        {
            accessorKey: "guardian_phone",
            header: t("guardian_phone"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{highlightText(row.getValue("guardian_phone") as string, globalFilter)}</div>
            ),
        },

        {
            accessorKey: "monthly_fee",
            header: t("monthly_fee"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("monthly_fee")}</div>
            ),
        },

        {
            accessorKey: "address",
            header: t("address"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("address")}</div>
            ),
        },

        {
            accessorKey: "is_active",
            header: t("status"),
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") === 1;
                return (
                    <Badge
                        variant={isActive ? "default" : "destructive"}
                        className="capitalize"
                    >
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },

        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.created_at
                    ? format(new Date(row.original.created_at), 'yyyy-MM-dd HH:mm:ss')
                    : ''}</div>
            ),
        },

        {
            accessorKey: "updated_at",
            header: t("updated_at"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.updated_at
                    ? format(new Date(row.original.updated_at), 'yyyy-MM-dd HH:mm:ss')
                    : 'N/A'}</div>
            ),
        },

        {
            id: 'actions',
            header: t("actions"),
            enableHiding: false,
            cell: ({ row }) => {
                const isActive = row.original.is_active === 1;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontalIcon className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Update Student Data */}
                            <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <UpdateStudent
                                    accessToken={accessToken}
                                    classes={classes}
                                    studentData={row.original}
                                    onUpdateTable={() => {
                                        studentsTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "asc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div>

                            {/* Change Student Status */}
                            <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <ChangeStatusDialog
                                    id={row.original.id}
                                    accessToken={accessToken}
                                    statusCode={row.getValue("is_active") == 1 ? 0 : 1}
                                    onUpdateTable={() => {
                                        studentsTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "desc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div>

                            {/* Delete Student Data */}
                            <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <DeleteStudentDialog
                                    id={row.original.id}
                                    accessToken={accessToken}
                                    onUpdateTable={() => {
                                        studentsTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "desc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div>

                            {/* <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <UpdateZoneDialog
                                    rowData={row.original}
                                    depotData={depotData}
                                    accessToken={accessToken}
                                    onUpdateSuccess={() => {
                                        getCountInformation();
                                        zoneTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "asc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }
    ]

    const handlePaginationState = useCallback(async (btnType: "prev" | "next" | "last" | "first" = "next") => {
        const factor = btnType === "next" ? 1 : -1;

        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + factor
        }))
    }, [])

    const studentsTableData = async (paginationData: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/students/table-data`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    paginationData
                }),
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            // console.log('🚀 ~ student-table.tsx:319 ~ responseData:', responseData);
            const studentData = responseData?.data?.tableData as Students[];
            const pageCount = Math.ceil(responseData?.data?.metadata?.totalRows / pagination.pageSize);
            if (pageCount === 0) {
                setTotalPage(() => 1);
            } else {
                setTotalPage(() => pageCount);
            }
            if (studentData.length === 0) {
                setData(() => []);
                setIsLoading(false)
                return;
            }
            setData(() => studentData);
            setIsLoading(false)
        }
        else {
            console.error("fetch req failed: ", response)
        }

    }

    const classList = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/common/class-list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    lg: lng
                })
            },
        );
        if (response.ok) {
            const responseData = await response.json();
            setClasses(responseData?.data);
        }
        else {
            console.error("fetch req failed: ", response)
        }
    }

    useEffect(() => {
        classList();
        localStorage.setItem(
            "storeTableColumnVisibility",
            JSON.stringify(columnVisibility)
        );
    }, [columnVisibility]);

    useEffect(() => {
        studentsTableData({
            itemsPerPage: pagination.pageSize,
            currentPageNumber: pagination.pageIndex,
            sortOrder: "desc",
            filterBy: ""
        })
    }, [pagination]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter, // use the state variable here
        },
        onGlobalFilterChange: setGlobalFilter, // <-- important
    })
    return (
        <div className="w-full">
            <div className="flex justify-start flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mb-2">
                <div className="w-full">
                    <Input
                        className="w-full"
                        placeholder="Search by Full name or Username or Email..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                </div>
                <div className="w-full flex justify-between md:justify-end  gap-2">
                    {/* Column Toggle Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="default" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                Columns
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3">
                            <p className="text-sm font-medium mb-2">Toggle Columns</p>
                            <Separator className="mb-2" />
                            <ScrollArea className="h-48 pr-2">
                                <div className="flex flex-col gap-2">
                                    {table
                                        .getAllLeafColumns()
                                        .filter((col) => col.getCanHide())
                                        .map((column) => (
                                            <div key={column.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                />
                                                <label className="capitalize text-sm cursor-pointer">
                                                    {column.id.replaceAll("_", " ")}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                    <CreateStudent
                        session={accessToken}
                        classes={classes}
                        onCreateSuccess={() => {
                            studentsTableData({
                                itemsPerPage: pagination.pageSize,
                                currentPageNumber: pagination.pageIndex,
                                sortOrder: "desc",
                                filterBy: "",
                            });
                        }}
                    />
                </div>
            </div>

            <div className="max-h-[calc(100vh-250px)] overflow-y-auto rounded-t-md border border-solid">
                <Table className="relative h-[80%]">
                    <TableHeader className="sticky top-0 whitespace-nowrap z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="text-center font-bold border bg-accent"
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2Icon className="animate-spin" />
                                        &nbsp; Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 && table.getState().globalFilter ? (
                            // If no rows match the filter, show the "No data matched" message inside a table row
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No data matched
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="text-center" key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-3 border-r rounded ">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-2 border rounded-b-md px-2">
                <div className="flex-1 hidden sm:block text-sm text-muted-foreground">
                    Total&nbsp;{table.getFilteredRowModel().rows.length} row(s)
                </div>
                <div className="flex md:items-center sm:space-x-6 lg:space-x-8">
                    <div className="sm:flex hidden whitespace-nowrap items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                setPagination({
                                    pageIndex: 0,
                                    pageSize: Number(value)
                                });
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 ">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex w-full gap-4 md:flex-row md:items-center justify-between md:w-auto">
                        {/* Current Page Info and Navigation */}
                        <div className="flex flex-row justify-between text-sm items-center gap-4 md:flex-row md:gap-8">
                            Page {pagination.pageIndex + 1} of{' '}
                            {totalPage}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-24 p-2"
                                onClick={() => {
                                    handlePaginationState("prev");
                                }}
                                disabled={pagination.pageIndex === 0}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-16 p-2"
                                onClick={() => {
                                    handlePaginationState("next");
                                }}
                                disabled={pagination.pageIndex + 1 === totalPage}
                            >
                                <span className="sr-only">Go to next page</span>
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default StudentsTable;