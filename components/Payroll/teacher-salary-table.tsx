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
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Checkbox } from "../ui/checkbox";
import { StudentPayments } from "@/interfaces/student-payment.interface";
import CreateStudentPayment from "./create-student-payment";
import { StudentList } from "@/interfaces/students.interface";
import UpdateStudentPayment from "./update-student-payment";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TeacherSalary } from "@/interfaces/teacher-salary.interface";
import UpdateTeacherSalary from "./teachers-salary-payment";

// import CreateStudent from "./create-student";
// import ChangeStatusDialog from "./change-status";
// import DeleteStudentDialog from "./delete-student";
// import UpdateStudent from "./update-student";


interface TeachersSalaryTableProps {
    session: any;
}

const numberToWord: Record<number, string> = {
    0: "Zero",
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
};

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


const classOptions = [
    { label: "All Classes", value: "all" },
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
    { label: "Three", value: "3" },
    { label: "Four", value: "4" },
    { label: "Five", value: "5" },
    { label: "Six", value: "6" },
    { label: "Seven", value: "7" },
    { label: "Eight", value: "8" },
    { label: "Nine", value: "9" },
    { label: "Ten", value: "10" },
    { label: "Eleven", value: "11" },
    { label: "Twelve", value: "12" },
];


const TeachersSalaryTable = ({ session }: TeachersSalaryTableProps) => {
    const accessToken = session?.user?.id;
    const [data, setData] = useState<TeacherSalary[]>([]);
    // const [studentList, setStudentList] = useState<StudentList[]>([]);
    const [classFilter, setClassFilter] = useState<string>("all");
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
    const [monthFilter, setMonthFilter] = useState<string>("");
    const currentYear = new Date().getFullYear();

    const [yearFilter, setYearFilter] = useState<string>(currentYear.toString());


    const yearOptions = Array.from({ length: 5 }, (_, i) =>
        (currentYear - i).toString()
    );

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


    const filteredData = useMemo(() => {
        return data.filter((row) => {
            if (!classFilter || classFilter === "all") return true;

            const raw = row.class;

            let classes: number[] = [];

            if (Array.isArray(raw)) {
                classes = raw.map(Number);
            }
            else if (typeof raw === "string") {
                try {
                    const parsed = JSON.parse(raw);
                    classes = Array.isArray(parsed)
                        ? parsed.map(Number)
                        : [];
                } catch {
                    classes = raw.split(",").map(Number);
                }
            }

            const filterValue = Number(classFilter);

            return classes.includes(filterValue);
        });
    }, [data, classFilter]);

    const columns: ColumnDef<TeacherSalary>[] = [

        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="mr-3"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: true,
            enableHiding: false,
        },

        {
            accessorKey: "fullName",
            header: t("full_name"),
            cell: ({ row }) => {
                const fullName = row.getValue("fullName") as string;
                return <div className="whitespace-nowrap text-start">{highlightText(fullName, globalFilter)}</div>;
            },
        },

        {
            accessorKey: "class",
            header: t("class"),
            cell: ({ row }) => {
                let classes: string | number[] = row.getValue("class");
                // console.log(classes)

                // 👉 Step 1: Convert string "[6]" → [6]
                if (typeof classes === "string") {
                    try {
                        classes = JSON.parse(classes);
                    } catch {
                        classes = [] as number[];
                    }
                }

                // 👉 Step 2: Ensure it's an array
                const classArray = Array.isArray(classes) ? classes : [classes];

                // 👉 Step 3: Convert numbers → words
                const formatted = classArray
                    .filter((num): num is number => typeof num === "number")
                    .map((num) => numberToWord[num] || num)
                    .join(", ");

                return (
                    <div className="whitespace-nowrap">
                        {formatted
                            ? highlightText(formatted, globalFilter)
                            : "N/A"}
                    </div>
                );
            },
        },

        {
            accessorKey: "month",
            header: t("month"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("month")}</div>
            ),
        },

        {
            accessorKey: "year",
            header: t("year"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("year")}</div>
            ),
        },

        {
            accessorKey: "bonus",
            header: t("bonus"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("bonus")}</div>
            ),
        },

        {
            accessorKey: "totalPayableAmount",
            header: t("total_payable_amount"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("totalPayableAmount")}</div>
            ),
        },

        {
            accessorKey: "paidAmount",
            header: t("paid_amount"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("paidAmount")}</div>
            ),
        },

        {
            accessorKey: "duesAmount",
            header: t("dues_amount"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("duesAmount")}</div>
            ),
        },

        {
            accessorKey: "note",
            header: t("note"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap ">{row.getValue("note")}</div>
            ),
        },

        {
            accessorKey: "salaryStatus",
            header: t("salary_status"),
            cell: ({ row }) => {
                const status = row.getValue("salaryStatus") as string

                return (
                    <div className="whitespace-nowrap">
                        <Badge
                            variant={status === "PAID" ? "default" : "destructive"}
                        >
                            {status}
                        </Badge>
                    </div>
                )
            },
        },

        {
            accessorKey: "salaryUpdatedDate",
            header: t("salary_date"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.salaryUpdatedDate
                    ? format(new Date(row.original.salaryUpdatedDate), 'yyyy-MM-dd HH:mm:ss')
                    : 'N/A'}</div>
            ),
        },

        {
            accessorKey: "salaryDate",
            header: t("salary_generated_date"),
            cell: ({ row }) => (
                <div className="whitespace-nowrap">{row.original.salaryDate
                    ? format(new Date(row.original.salaryDate), 'yyyy-MM-dd HH:mm:ss')
                    : ''}</div>
            ),
        },

        {
            id: 'actions',
            header: t("actions"),
            enableHiding: false,
            cell: ({ row }) => {
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
                                <UpdateTeacherSalary
                                    accessToken={accessToken}
                                    salaryData={row.original}
                                    onUpdateTable={() => {
                                        teachersSalaryTableData({
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: pagination.pageIndex,
                                            sortOrder: "asc",
                                            filterBy: "",
                                        });
                                    }}
                                />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }
    ]
    const hasData = filteredData.length > 0;
    const handlePaginationState = useCallback(async (btnType: "prev" | "next" | "last" | "first" = "next") => {
        const factor = btnType === "next" ? 1 : -1;

        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + factor
        }))
    }, [])

    const teachersSalaryTableData = async (paginationData: any, filters?: any) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payroll/teacher-salary`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    paginationData,
                    filterData: filters
                }),
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            // console.log('🚀 ~ student-table.tsx:319 ~ responseData:', responseData);
            const salaryData = responseData?.data?.tableData as TeacherSalary[];
            const pageCount = Math.ceil(responseData?.data?.metadata?.totalRows / pagination.pageSize);
            if (pageCount === 0) {
                setTotalPage(() => 1);
            } else {
                setTotalPage(() => pageCount);
            }
            if (salaryData.length === 0) {
                setData(() => []);
                setIsLoading(false)
                return;
            }
            setData(() => salaryData);
            setIsLoading(false)
        }
        else {
            console.error("fetch req failed: ", response)
        }
    };

    // const getStudentList = async () => {
    //     const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_API_URL}/students/student-list`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `bearer ${accessToken}`
    //             },
    //             body: JSON.stringify({
    //                 lg: lng,
    //             }),
    //         },
    //     );

    //     if (response.ok) {
    //         const responseData = await response.json();
    //         const studentList = responseData?.data as StudentList[];
    //         // console.log('🚀 ~ student-payment-table.tsx:410 ~ studentList:', studentList);
    //         setStudentList(() => studentList);
    //     }
    // };

    useEffect(() => {
        localStorage.setItem(
            "storeTableColumnVisibility",
            JSON.stringify(columnVisibility)
        );
    }, [columnVisibility]);

    useEffect(() => {
        teachersSalaryTableData(
            {
                itemsPerPage: pagination.pageSize,
                currentPageNumber: pagination.pageIndex,
                sortOrder: "desc",
                filterBy: ""
            },
            {
                month: monthFilter,
                year: yearFilter
            }
        );
        // getStudentList();
    }, [pagination]);

    const table = useReactTable({
        data: filteredData,
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
                <div className="w-full flex flex-col sm:flex-row gap-2">
                    <Input
                        className="w-full"
                        placeholder={t("search_hint.search_by_full_name")}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />

                    {/* </div>
                <div> */}
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-30">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {classOptions.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full flex   gap-2">
                    <div className="flex flex-col col-auto sm:flex-row gap-2 w-full">
                        {/* Month Filter */}
                        <div className="flex gap-2">
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-full md:w-30">
                                    <SelectValue placeholder={t("month")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                    ].map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Year Filter */}
                            <Select value={yearFilter} onValueChange={setYearFilter}>
                                <SelectTrigger className="w-full md:w-20">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            {/* Filter Button */}
                            <Button
                                onClick={() => {
                                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

                                    teachersSalaryTableData(
                                        {
                                            itemsPerPage: pagination.pageSize,
                                            currentPageNumber: 0,
                                            sortOrder: "desc",
                                            filterBy: "",
                                        },
                                        {
                                            month: monthFilter,
                                            year: yearFilter,
                                        }
                                    );
                                }}
                            >
                                {t("submit")}
                            </Button>

                            {/* Reset Button (optional but useful) */}
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setMonthFilter("");
                                    setYearFilter(currentYear.toString());
                                    setClassFilter("all");

                                    teachersSalaryTableData({
                                        itemsPerPage: pagination.pageSize,
                                        currentPageNumber: 0,
                                        sortOrder: "desc",
                                        filterBy: "",
                                    });
                                }}
                            >
                                {t("reset")}
                            </Button>
                        </div>
                    </div>
                    {/* Column Toggle Popover */}
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="default" className="flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" />
                                    {t("columns")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-3">
                                <p className="text-sm font-medium mb-2">{t("toggle_columns")}</p>
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
                                                        {typeof column.columnDef.header === "string"
                                                            ? column.columnDef.header
                                                            : column.id}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* <CreateStudentPayment
                        session={accessToken}
                        studentList={studentList}
                        onCreateSuccess={() => {
                            teachersSalaryTableData({
                                itemsPerPage: pagination.pageSize,
                                currentPageNumber: pagination.pageIndex,
                                sortOrder: "desc",
                                filterBy: "",
                            });
                        }}
                    /> */}
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
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {globalFilter || classFilter
                                        ? "No data matched"
                                        : "No results"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="text-center"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="p-3 border-r rounded"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
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

export default TeachersSalaryTable;