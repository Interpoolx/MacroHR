import { useState, useMemo, useCallback } from 'react';
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
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Button
} from "@/components/ui/button";
import {
    Input
} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    SlidersHorizontal,
    Trash2,
    Download,
    MoreHorizontal,
    Plus,
    Edit,
    CheckCircle2,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DataTableConfig {
    addLabel?: string;
    searchPlaceholder?: string;
    // Easily extendable later:
    // editLabel?: string;
    // emptyMessage?: string;
    // etc.
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    searchColumn?: string;
    addLabel?: string;
    config?: DataTableConfig;       // NEW: centralized config
    onAdd?: () => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    isLoading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder: deprecatedSearchPlaceholder,
    searchColumn,
    addLabel: deprecatedAddLabel,
    config = {},       // NEW: centralized config
    onAdd,
    onEdit,
    onDelete,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    // Extract config values with fallbacks
    const addLabel = config.addLabel ?? deprecatedAddLabel ?? "Initialize Entry";
    const searchPlaceholder = config.searchPlaceholder ?? deprecatedSearchPlaceholder ?? "Filter records...";

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Confirmation States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TData | null>(null);
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

    // Add selection column and action column
    const tableColumns = useMemo(() => {
        const cols = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            } as ColumnDef<TData, TValue>,
            ...columns,
        ];

        if (onEdit || onDelete) {
            cols.push({
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const item = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass border-border rounded-[var(--radius)] p-2 w-48">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground px-2 py-1.5">Entity Control</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                {onEdit && (
                                    <DropdownMenuItem
                                        onClick={() => onEdit(item)}
                                        className="rounded-xl font-black uppercase italic text-[10px] tracking-widest gap-2 focus:bg-primary/20 focus:text-primary cursor-pointer"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setItemToDelete(item);
                                            setIsConfirmOpen(true);
                                        }}
                                        className="rounded-xl font-black uppercase italic text-[10px] tracking-widest gap-2 focus:bg-red-500/20 focus:text-red-500 cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                }
            } as ColumnDef<TData, TValue>);
        }

        return cols;
    }, [columns, onEdit, onDelete]);

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
    });

    // Bulk Copy Logic
    const handleBulkCopy = useCallback(() => {
        const selected = table.getFilteredSelectedRowModel().rows;
        if (selected.length === 0) return;

        // Get headers (only visible, excluding selection and actions)
        const headers = table.getAllColumns()
            .filter(col => col.id !== 'select' && col.id !== 'actions' && col.getIsVisible())
            .map(col => col.id);

        // Get data for selected rows
        const rows = selected.map(row => {
            return headers.map(header => {
                const value = (row.original as any)[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value);
            }).join('\t');
        });

        const content = [headers.join('\t'), ...rows].join('\n');

        navigator.clipboard.writeText(content).then(() => {
            toast.success("Data Copied", {
                description: `${selected.length} item(s) copied to clipboard.`,
                className: "glass border-primary/20"
            });
        }).catch(() => {
            toast.error("Copy Failed", {
                description: "Terminal was unable to access the clipboard ecosystem."
            });
        });
    }, [table]);

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    return (
        <div className="space-y-6">
            {/* Search, Filter & Actions Bar */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row flex-1 items-center gap-4 w-full">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={(table.getColumn(searchColumn || "")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchColumn || "")?.setFilterValue(event.target.value)
                            }
                            className="pl-11 h-12 bg-muted/50 border-border rounded-2xl glass focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Select
                            defaultValue="all"
                            onValueChange={(value) => {
                                if (value === "all") {
                                    table.getColumn("status")?.setFilterValue(undefined);
                                } else {
                                    table.getColumn("status")?.setFilterValue(value);
                                }
                            }}
                        >
                            <SelectTrigger className="h-12 w-full md:w-40 bg-muted/50 border-border rounded-2xl glass font-black uppercase italic tracking-widest text-[10px] text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Filter size={14} className="text-primary" />
                                    <SelectValue placeholder="Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="glass border-border rounded-2xl">
                                <SelectItem value="all" className="font-black uppercase italic text-[10px] tracking-widest p-3">All Records</SelectItem>
                                <SelectItem value="active" className="font-black uppercase italic text-[10px] tracking-widest p-3">Active Only</SelectItem>
                                <SelectItem value="inactive" className="font-black uppercase italic text-[10px] tracking-widest p-3">Inactive</SelectItem>
                                <SelectItem value="pending" className="font-black uppercase italic text-[10px] tracking-widest p-3">Pending</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            defaultValue="newest"
                            onValueChange={(value) => {
                                if (value === "name-asc") setSorting([{ id: "name", desc: false }]);
                                if (value === "name-desc") setSorting([{ id: "name", desc: true }]);
                                if (value === "newest") setSorting([{ id: "createdAt", desc: true }]);
                                if (value === "oldest") setSorting([{ id: "createdAt", desc: false }]);
                            }}
                        >
                            <SelectTrigger className="h-12 w-full md:w-48 bg-muted/50 border-border rounded-2xl glass font-black uppercase italic tracking-widest text-[10px] text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown size={14} className="text-primary" />
                                    <SelectValue placeholder="Sort By" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="glass border-border rounded-2xl">
                                <SelectItem value="name-asc" className="font-black uppercase italic text-[10px] tracking-widest p-3">Name A-Z</SelectItem>
                                <SelectItem value="name-desc" className="font-black uppercase italic text-[10px] tracking-widest p-3">Name Z-A</SelectItem>
                                <SelectItem value="newest" className="font-black uppercase italic text-[10px] tracking-widest p-3">Newest First</SelectItem>
                                <SelectItem value="oldest" className="font-black uppercase italic text-[10px] tracking-widest p-3">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {onAdd && (
                        <Button
                            onClick={onAdd}
                            className="h-12 px-6 accent-gradient border-0 rounded-[var(--radius)] font-black uppercase italic shadow-lg shadow-primary/20 text-[10px] tracking-widest whitespace-nowrap ml-auto hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-2"
                        >
                            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                            {addLabel}
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-12 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 gap-2 glass font-black uppercase italic tracking-widest text-[10px] text-muted-foreground">
                                <SlidersHorizontal className="h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass border-border rounded-[var(--radius)] p-2 w-56">
                            <p className="px-4 py-2 text-[9px] font-black uppercase italic text-muted-foreground tracking-widest border-b border-border mb-2">Display Controls</p>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="rounded-lg font-bold text-muted-foreground focus:text-foreground focus:bg-primary/20 capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="h-12 w-12 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 glass flex-shrink-0">
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="rounded-[var(--radius)] border border-border bg-card overflow-hidden glass relative shadow-3xl">
                <Table>
                    <TableHeader className="bg-muted/30 border-b border-border">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-0 h-16">
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const isSorted = header.column.getIsSorted();

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`text-muted-foreground font-black uppercase italic text-[10px] tracking-widest px-6 first:rounded-tl-[var(--radius)] ${canSort ? 'cursor-pointer hover:text-foreground transition-colors' : ''}`}
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            <div className="flex items-center gap-2">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {isSorted === "asc" && <ArrowUp size={12} className="text-primary" />}
                                                {isSorted === "desc" && <ArrowDown size={12} className="text-primary" />}
                                                {canSort && !isSorted && <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {isLoading ? (
                                // Skeleton Loading State
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={`skeleton-${i}`} className="border-b border-border h-20">
                                        {tableColumns.map((col, j) => (
                                            <TableCell key={`skeleton-cell-${j}`} className="px-6">
                                                <Skeleton className="h-4 w-full bg-muted" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`group/row border-b border-border transition-colors hover:bg-primary/5 ${row.getIsSelected() ? 'bg-primary/10' : ''}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6 py-5 text-foreground font-bold text-sm first:relative">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                {row.getIsSelected() && cell.column.id === 'select' && (
                                                    <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                                                )}
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={tableColumns.length} className="h-48 text-center text-muted-foreground font-black uppercase italic text-[10px] tracking-[0.2em]">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="h-12 w-12 rounded-[var(--radius)] bg-muted/50 flex items-center justify-center border border-border opacity-50">
                                                <Search size={24} />
                                            </div>
                                            No matching records found in ecosystem
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Pagination & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                                <span className="text-primary-foreground bg-primary/20 px-2.5 py-1 rounded-md border border-primary/20">
                                    {table.getFilteredSelectedRowModel().rows.length}
                                </span>
                                of
                                <span className="text-foreground ml-1">
                                    {table.getFilteredRowModel().rows.length}
                                </span>
                                Items Selected
                            </div>
                            <Separator orientation="vertical" className="h-4 bg-border" />
                        </>
                    )}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Items Per Page</span>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-9 w-24 bg-muted/50 border-border rounded-[var(--radius)] text-[10px] font-black glass">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent className="glass border-border rounded-[var(--radius)] overflow-hidden">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`} className="text-[10px] font-black p-3 focus:bg-primary/20 transition-colors">
                                        {pageSize} Rows
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 glass hidden sm:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 glass"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center px-5 h-10 rounded-[var(--radius)] bg-muted/50 border border-border glass text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground">
                            Page <span className="text-foreground mx-3">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-foreground mx-3">{table.getPageCount()}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 glass"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-[var(--radius)] border-border bg-muted/50 hover:bg-muted/70 glass hidden sm:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bulk Control Center */}
            <AnimatePresence>
                {selectedRows.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6"
                    >
                        <div className="bg-card/95 border border-primary/30 rounded-[var(--radius)] p-4 flex items-center justify-between shadow-4xl glass relative overflow-hidden group backdrop-blur-2xl">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/20 rounded-[var(--radius)] flex items-center justify-center text-primary shadow-lg border border-primary/20">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase italic tracking-tighter text-foreground">Bulk Management</h4>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase italic tracking-widest">{selectedRows.length} units flagged</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    className="h-11 rounded-xl font-black uppercase italic text-[10px] tracking-widest text-muted-foreground hover:text-foreground"
                                    onClick={() => table.resetRowSelection()}
                                >
                                    Clear
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleBulkCopy}
                                        className="h-11 px-6 rounded-xl bg-muted/50 border border-border text-foreground font-black uppercase italic text-[10px] tracking-widest hover:bg-muted/80"
                                    >
                                        Copy
                                    </Button>
                                    <Button className="h-11 px-6 rounded-xl bg-muted/50 border border-border text-foreground font-black uppercase italic text-[10px] tracking-widest hover:bg-muted/80">
                                        Export
                                    </Button>
                                    <Button
                                        onClick={() => setIsBulkConfirmOpen(true)}
                                        className="h-11 px-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-500/20 shadow-lg shadow-red-500/5"
                                    >
                                        Delete
                                        <Trash2 size={14} className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Single Delete Confirmation */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent className="glass border-border rounded-[var(--radius)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-bold uppercase italic text-[10px] tracking-widest leading-relaxed">
                            This action cannot be undone. This will permanently delete the selected entity from the ecosystem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="h-11 rounded-xl font-black uppercase italic text-[10px] tracking-widest">Abort</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (itemToDelete && onDelete) {
                                    onDelete(itemToDelete);
                                    setItemToDelete(null);
                                }
                            }}
                            className="h-11 px-8 rounded-xl bg-red-500 text-white border-0 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20"
                        >
                            Execute Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Delete Confirmation */}
            <AlertDialog open={isBulkConfirmOpen} onOpenChange={setIsBulkConfirmOpen}>
                <AlertDialogContent className="glass border-border rounded-[var(--radius)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter text-red-500">Mass Deletion Warning</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground font-bold uppercase italic text-[10px] tracking-widest leading-relaxed">
                            You are about to purge <span className="text-red-500 font-black">{selectedRows.length} units</span>. This protocol is irreversible. Continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="h-11 rounded-xl font-black uppercase italic text-[10px] tracking-widest">Stand Down</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (onDelete) {
                                    // Handle bulk delete if implemented at page level, 
                                    // otherwise we might need a batch call here.
                                    // For now, we call onDelete for each or assume onDelete handles selection logic if passed no args?
                                    // Actually, onDelete typically takes one item. If the page supports batch, it should handle it.
                                    // Let's assume for now the user wants to trigger deletions for all selected.
                                    selectedRows.forEach(row => onDelete(row.original));
                                    table.resetRowSelection();
                                    setIsBulkConfirmOpen(false);
                                }
                            }}
                            className="h-11 px-8 rounded-xl bg-red-500 text-white border-0 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20"
                        >
                            Purge All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
