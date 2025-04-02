import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Filter,
  Image,
  Loader2,
  MapPin,
  MoreVertical,
  RefreshCcw,
  Search,
  User,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { GET_COMPLAINTS } from "@/utils/constants";

interface Complaint {
  _id: string;
  type: string;
  location: string;
  description: string;
  urgencyLevel: "low" | "medium" | "high";
  isAnonymous: boolean;
  name?: string;
  email?: string;
  phone?: string;
  expectedResolution: string;
  images: string[];
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const urgencyColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints based on search and filters
  useEffect(() => {
    filterComplaints();
  }, [complaints, searchQuery, statusFilter, urgencyFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(GET_COMPLAINTS);
      setComplaints(response.data.data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      setError("Failed to fetch complaints. Please try again.");
      toast.error("Failed to fetch complaints", {
        description: "Could not load complaint data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (complaint) =>
          complaint.description.toLowerCase().includes(query) ||
          complaint.location.toLowerCase().includes(query) ||
          complaint.type.toLowerCase().includes(query) ||
          (complaint.name && complaint.name.toLowerCase().includes(query)) ||
          (complaint.email && complaint.email.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter);
    }

    // Apply urgency filter
    if (urgencyFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.urgencyLevel === urgencyFilter);
    }

    setFilteredComplaints(filtered);
  };

  const viewComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsOpen(true);
  };

  const openStatusDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setIsStatusDialogOpen(true);
  };

  const updateComplaintStatus = async () => {
    if (!selectedComplaint) return;

    setStatusLoading(true);
    try {
      const response = await apiClient.patch(`/api/complaint/${selectedComplaint._id}/status`, {
        status: newStatus,
      });

      // Update the complaints list with the updated status
      const updatedComplaints = complaints.map((complaint) =>
        complaint._id === selectedComplaint._id
          ? { ...complaint, status: newStatus as any, updatedAt: new Date().toISOString() }
          : complaint
      );

      setComplaints(updatedComplaints);
      setIsStatusDialogOpen(false);
      toast.success("Status Updated", {
        description: `Complaint status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update complaint status:", error);
      toast.error("Status Update Failed", {
        description: "Could not update complaint status. Please try again.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">UrbanEYE</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Manage Complaints</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-2 mt-2">
            <h1 className="text-2xl font-semibold tracking-tight">Complaint Management</h1>
            <p className="text-sm text-muted-foreground">
              View, filter and manage citizen complaints
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Urgency</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchComplaints}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading complaints...</p>
            </div>
          ) : error ? (
            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredComplaints.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No complaints found</h3>
                <p className="text-muted-foreground text-center max-w-sm mt-1">
                  {searchQuery || statusFilter !== "all" || urgencyFilter !== "all"
                    ? "Try changing your filters or search query"
                    : "No complaints have been submitted yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Urgency</TableHead>
                    <TableHead className="w-[180px]">Submitted</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium">{complaint.type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {complaint.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[complaint.status] || ""}
                        >
                          {complaint.status.charAt(0).toUpperCase() +
                            complaint.status.slice(1).replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={urgencyColors[complaint.urgencyLevel] || ""}
                        >
                          {complaint.urgencyLevel.charAt(0).toUpperCase() +
                            complaint.urgencyLevel.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => viewComplaintDetails(complaint)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openStatusDialog(complaint)}
                            >
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </SidebarInset>

      {/* Complaint Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Complaint Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedComplaint && formatDate(selectedComplaint.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className={statusColors[selectedComplaint.status] || ""}
                >
                  {selectedComplaint.status.charAt(0).toUpperCase() +
                    selectedComplaint.status.slice(1).replace("-", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className={urgencyColors[selectedComplaint.urgencyLevel] || ""}
                >
                  {selectedComplaint.urgencyLevel.charAt(0).toUpperCase() +
                    selectedComplaint.urgencyLevel.slice(1)} Urgency
                </Badge>
                <Badge variant="outline">
                  {selectedComplaint.isAnonymous ? "Anonymous" : "Public"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Complaint Type
                  </h3>
                  <p>{selectedComplaint.type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Expected Resolution
                  </h3>
                  <p>{selectedComplaint.expectedResolution}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Location
                </h3>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedComplaint.location}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <div className="p-3 rounded-md bg-muted/30 mt-1">
                  <p>{selectedComplaint.description}</p>
                </div>
              </div>

              {!selectedComplaint.isAnonymous && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Name
                        </h4>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {selectedComplaint.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Email
                        </h4>
                        <p>{selectedComplaint.email || "Not provided"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Phone
                        </h4>
                        <p>{selectedComplaint.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Attached Images ({selectedComplaint.images.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedComplaint.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer"
                        onClick={() => viewImage(image)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <img
                          src={`http://localhost:5000${image}`}
                          alt={`Complaint image ${index + 1}`}
                          className="absolute inset-0 h-full w-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false);
                if (selectedComplaint) {
                  openStatusDialog(selectedComplaint);
                }
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>
              Change the status of this complaint to reflect its current state.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={statusLoading}
            >
              Cancel
            </Button>
            <Button onClick={updateComplaintStatus} disabled={statusLoading}>
              {statusLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complaint Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={`http://localhost:5000${selectedImage}`}
              alt="Complaint"
              className="max-h-[70vh] max-w-full object-contain rounded-md"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default ViewComplaints;