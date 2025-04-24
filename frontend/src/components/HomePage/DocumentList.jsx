import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, ArrowUpDown } from "lucide-react"
import { fetchDocuments } from "@/services/api"
import { toast } from "sonner"

export function DocumentList() {
  const [documents, setDocuments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ field: "id", order: "ASC" })
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const result = await fetchDocuments({
        page: currentPage,
        search: searchQuery,
        sortField: sortConfig.field,
        sortOrder: sortConfig.order
      })
      setDocuments(result.documents)
      setPagination(result.pagination)
    } catch (error) {
      toast.error("Failed to fetch documents. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [currentPage, sortConfig, searchQuery])

  const handleSort = (field) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === "ASC" ? "DESC" : "ASC"
    })
    setCurrentPage(1)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 3
    const totalPages = pagination.totalPages

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3)
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1)
      }
    }

    return pageNumbers
  }

  return (
    <Card>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 p-0 font-medium"
                  >
                    ID
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 p-0 font-medium"
                  >
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("total")}
                    className="flex items-center gap-1 p-0 font-medium"
                  >
                    Total
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>${doc.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/details/${doc.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pagination.totalPages > 3 && currentPage < pagination.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}
