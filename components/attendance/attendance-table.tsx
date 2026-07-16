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
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, MoreHorizontalIcon, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { AttendanceData } from "@/interfaces/attendance.interface";
import { toast } from "sonner";


interface MarkAttendanceComponentProps {
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



const MarkAttendanceComponent = ({ session }: MarkAttendanceComponentProps) => {
    const accessToken = session?.user?.id;
    const [data, setData] = useState<AttendanceData[]>([]);
    const [studentClass, setStudentClass] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [date, setDate] = useState<Date>()
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const pathname = usePathname();
    const lng = pathname.split("/")[1];
    const { t } = useTranslation(lng, "Language");

    const [classList, setClassList] = useState<any[]>([]); // State to hold the class list
    const [attendanceSelections, setAttendanceSelections] = useState<
        { studentId: string; status: "present" | "absent" | "late" }[]
    >([]);

    const getRowStudentId = (row: AttendanceData) => {
        const anyRow = row as any;
        return `${anyRow.id ?? anyRow.studentId ?? anyRow.student_id ?? ""}`;
    };

    const handleAttendanceSelection = (
        studentId: string,
        status: "present" | "absent" | "late"
    ) => {
        setAttendanceSelections((prev) => {
            const existing = prev.find((item) => item.studentId === studentId);
            if (existing) {
                return prev.map((item) =>
                    item.studentId === studentId ? { ...item, status } : item
                );
            }
            return [...prev, { studentId, status }];
        });
    };
    // console.log('🚀 attendanceSelections:', attendanceSelections);
    const columns: ColumnDef<AttendanceData>[] = [

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
            id: "present",
            header: t("present"),
            cell: ({ row }) => {
                const studentId = getRowStudentId(row.original);
                const selected = attendanceSelections.find((item) => item.studentId === studentId)?.status === "present";
                return (
                    <div className="flex justify-center">
                        <input
                            type="radio"
                            name={`attendance-${studentId}`}
                            value="1"
                            checked={selected}
                            onChange={() => handleAttendanceSelection(studentId, "present")}
                            className="accent-emerald-500"
                        />
                    </div>
                );
            },
        },
        {
            id: "absent",
            header: t("absent"),
            cell: ({ row }) => {
                const studentId = getRowStudentId(row.original);
                const selected = attendanceSelections.find((item) => item.studentId === studentId)?.status === "absent";
                return (
                    <div className="flex justify-center">
                        <input
                            type="radio"
                            name={`attendance-${studentId}`}
                            value="1"
                            checked={selected}
                            onChange={() => handleAttendanceSelection(studentId, "absent")}
                            className="accent-red-500"
                        />
                    </div>
                );
            },
        },
        {
            id: "late",
            header: t("late"),
            cell: ({ row }) => {
                const studentId = getRowStudentId(row.original);
                const selected = attendanceSelections.find((item) => item.studentId === studentId)?.status === "late";
                return (
                    <div className="flex justify-center">
                        <input
                            type="radio"
                            name={`attendance-${studentId}`}
                            value="1"
                            checked={selected}
                            onChange={() => handleAttendanceSelection(studentId, "late")}
                            className="accent-yellow-500"
                        />
                    </div>
                );
            },
        },
        {
            id: "actions",
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
                            {/* <div className='flex w-full flex-row justify-start items-center hover:rounded-md'>
                                <UpdateStudentPayment
                                    accessToken={accessToken}
                                    studentList={row.original}
                                    onUpdateTable={() => {
                                        studentListData({
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

    const studentListData = async (filters?: any) => {
        console.log('🚀 ~ attendance-table.tsx:253 ~ filters:', filters);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/attendance/student-list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    studentClass: filters
                }),
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            const studentList = responseData?.data;

            setData(() => studentList);
            setIsLoading(false)

        }
        else {
            console.error("fetch req failed: ", response)
        }
    };

    const getClassList = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/class/list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${accessToken}`
                },
                body: JSON.stringify({
                    lg: lng,
                }),
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            const classList = responseData?.data;
            // console.log('🚀 ~ student-payment-table.tsx:410 ~ classList:', classList);
            setClassList(classList);
        }
    };

    const markAttendance = async () => {
        console.log('🚀 ~ attendance-table.tsx:458 ~ attendanceSelections:', attendanceSelections);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/mark-attendance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ attendanceSelections }),
                }
            );

            const data = await response.json()

            if (data.status === 'success') {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error("Error marking attendance:", error);
        };
    }
    useEffect(() => {
        studentListData(studentClass);
        getClassList();
    }, []);

    const table = useReactTable({
        data: data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            globalFilter, // use the state variable here
        },
    })
    return (
        <div className="w-full">
            <div className="flex justify-start flex-col gap-2 md:flex-row md:justify-between items-start md:items-center mb-2">
                <div className="w-full flex flex-col sm:flex-row gap-2">
                    <Select value={studentClass} onValueChange={(value) => {
                        setStudentClass(value)
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                        studentListData(value)
                    }}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder={t("select_class")} />
                        </SelectTrigger>
                        <SelectContent>
                            {classList.map((item) => (
                                <SelectItem key={item.id} value={item.class_name}>
                                    {item.class_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                    {studentClass
                                        ? t("no_data_matched")
                                        : t("no_results_found")}
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
                    <Button
                        variant="secondary"
                        onClick={markAttendance}
                        disabled={attendanceSelections.length === 0}
                    >
                        {t("submit")}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => setAttendanceSelections([])}
                        disabled={attendanceSelections.length === 0}
                    >
                        {t("reset")}

                    </Button>
                </div>
            </div>
        </div >
    )
}

export default MarkAttendanceComponent;