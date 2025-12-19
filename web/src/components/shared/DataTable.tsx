import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Search, Trash2, Edit } from "lucide-react"

import { Button } from "@shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu"
import { Input } from "@shared/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@shared/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[]
    data: TData[]
    searchKey: string
    onAdd?: () => void
    onEdit?: (row: TData) => void
    onDelete?: (row: TData) => void
}

export function DataTable<TData>({
    columns,
    data,
    searchKey,
    onAdd,
    onEdit,
    onDelete,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Enhance columns with actions if handlers are provided
    const tableColumns = React.useMemo(() => {
        if (!onEdit && !onDelete) return columns

        const actionsColumn: ColumnDef<TData> = {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const item = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] glass border-white/10 shadow-xl rounded-2xl p-2">
                            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {onEdit && (
                                <DropdownMenuItem
                                    onSelect={() => onEdit(item)}
                                    className="rounded-xl focus:bg-primary/10 focus:text-primary font-black uppercase italic text-[10px] tracking-widest cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Edit size={14} className="group-hover:scale-110 transition-transform" />
                                        <span>Edit Profile</span>
                                    </div>
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onSelect={() => onDelete(item)}
                                    className="flex items-center gap-2 p-2 rounded-xl focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer font-medium text-sm"
                                >
                                    <Trash2 className="h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        }

        return [...columns, actionsColumn]
    }, [columns, onEdit, onDelete])

    const table = useReactTable({
        data,
        columns: tableColumns,
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
        },
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 max-w-sm relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder={`Search by ${searchKey}...`}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }
                        className="pl-10 h-11 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/30 focus-visible:border-primary transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {onAdd && (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAdd();
                            }}
                            className="h-11 px-5 accent-gradient border-0 rounded-2xl font-black uppercase italic shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add New
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-11 rounded-2xl border-white/10 bg-white/5 font-bold text-sm hover:bg-white/10 transition-all">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] glass border-white/10 shadow-xl rounded-2xl p-2">
                            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize p-2 rounded-xl focus:bg-white/10 transition-colors cursor-pointer font-medium text-sm"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-0 h-14">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-xs font-black uppercase tracking-widest text-slate-400 px-6">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="group border-b border-white/5 last:border-0 hover:bg-white/5 transition-all h-16"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6 py-4">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={tableColumns.length}
                                        className="h-32 text-center text-slate-500 font-bold italic uppercase tracking-tighter"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-2">
                <div className="text-sm font-bold text-slate-500 italic uppercase tracking-wider">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-10 px-4 rounded-xl border-white/10 bg-white/5 font-black uppercase italic text-xs hover:bg-white/10 disabled:opacity-30 transition-all"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1 font-black text-xs text-slate-400">
                        <span className="text-white">{table.getState().pagination.pageIndex + 1}</span>
                        <span>/</span>
                        <span>{table.getPageCount()}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-10 px-4 rounded-xl border-white/10 bg-white/5 font-black uppercase italic text-xs hover:bg-white/10 disabled:opacity-30 transition-all"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
