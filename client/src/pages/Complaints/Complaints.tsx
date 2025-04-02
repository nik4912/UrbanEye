import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  SquarePen,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MessageCircle
} from "lucide-react"
import useStore from "../../store/store"

function Complaints() {
  const { user } = useUser()
  const userData = useStore((state) => state.userData)
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data - replace with actual data from your backend
  const sampleComplaints = [
    {
      id: 1,
      title: "Water leakage in building A",
      description: "There's a significant water leak in the corridor of Building A, first floor",
      status: "open",
      date: "2025-03-28T10:30:00Z",
      category: "maintenance"
    },
    {
      id: 2,
      title: "Streetlight malfunction near Block C",
      description: "The streetlights near Block C have been non-functional for the past week",
      status: "in-progress",
      date: "2025-03-25T15:45:00Z",
      category: "infrastructure"
    },
    {
      id: 3,
      title: "Garbage collection missed",
      description: "Garbage hasn't been collected from our area for two consecutive days",
      status: "resolved",
      date: "2025-03-20T09:15:00Z",
      category: "sanitation"
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>
      case "in-progress":
        return <Badge className="bg-amber-500">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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
                  <BreadcrumbLink href="/dashboard">
                    UrbanEYE
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Complaints</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-2 mt-2">
            <h1 className="text-2xl font-semibold tracking-tight">Complaints Portal</h1>
            <p className="text-sm text-muted-foreground">
              Submit and track urban complaints and issues.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 w-full max-w-md">
              <TabsTrigger value="all" className="flex-1">
                <ClipboardList className="mr-2 h-4 w-4" />
                All Complaints
              </TabsTrigger>
              <TabsTrigger value="new" className="flex-1">
                <SquarePen className="mr-2 h-4 w-4" />
                Submit New
              </TabsTrigger>
              <TabsTrigger value="my" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                My Complaints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Complaints</CardTitle>
                  <CardDescription>
                    Browse and search through all reported complaints.
                  </CardDescription>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search complaints..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleComplaints.length > 0 ? (
                      sampleComplaints.map((complaint) => (
                        <Card key={complaint.id} className="overflow-hidden">
                          <div className="flex justify-between items-start p-4 border-b">
                            <div>
                              <h3 className="font-medium">{complaint.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(complaint.date)}
                              </p>
                            </div>
                            <div>
                              {getStatusBadge(complaint.status)}
                            </div>
                          </div>
                          <CardContent className="p-4 pt-3">
                            <p className="text-sm">{complaint.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between bg-secondary/50 p-3">
                            <Badge variant="outline" className="capitalize">{complaint.category}</Badge>
                            <Button variant="outline" size="sm">View Details</Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-6 bg-secondary/30 rounded-lg">
                        <p className="text-muted-foreground">No complaints found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {sampleComplaints.length} complaints
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    Load More
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submit New Complaint</CardTitle>
                  <CardDescription>
                    Report an issue or submit a complaint about urban infrastructure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Complaint Title
                      </label>
                      <Input
                        id="title"
                        placeholder="Brief title describing the issue"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="safety">Safety & Security</SelectItem>
                          <SelectItem value="noise">Noise Complaint</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        placeholder="Specific location of the issue"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about the issue"
                        required
                        rows={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="photo" className="text-sm font-medium">
                        Attach Photo (Optional)
                      </label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload images to help illustrate the issue (Max size: 5MB)
                      </p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Complaint</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Complaints</CardTitle>
                  <CardDescription>
                    Track the status of complaints you've submitted.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground">You haven't submitted any complaints yet</span>
                      </div>
                      <Button size="sm" variant="default">
                        Submit New
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Statistics</CardTitle>
                  <CardDescription>
                    Overview of complaints in your area.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <div className="flex justify-center">
                        <Clock className="h-5 w-5 text-blue-500 mb-2" />
                      </div>
                      <h3 className="text-2xl font-bold">12</h3>
                      <p className="text-sm text-muted-foreground">Open</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <div className="flex justify-center">
                        <MessageCircle className="h-5 w-5 text-amber-500 mb-2" />
                      </div>
                      <h3 className="text-2xl font-bold">8</h3>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <div className="flex justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                      </div>
                      <h3 className="text-2xl font-bold">24</h3>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <div className="flex justify-center">
                        <XCircle className="h-5 w-5 text-muted-foreground mb-2" />
                      </div>
                      <h3 className="text-2xl font-bold">3</h3>
                      <p className="text-sm text-muted-foreground">Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Complaints