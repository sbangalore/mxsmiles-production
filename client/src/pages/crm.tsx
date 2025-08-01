import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import CrmLogin from "./crm-login";
import { Phone, Mail, MessageSquare, Calendar, DollarSign, Users, TrendingUp, Activity, LogOut } from "lucide-react";
import type { Lead, LeadActivity } from "@shared/schema";

const statusColors = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  qualified: "bg-green-500",
  proposal_sent: "bg-purple-500",
  won: "bg-emerald-500",
  lost: "bg-red-500",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
  urgent: "bg-red-700",
};

export default function CrmPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    source: "",
    search: "",
  });

  const queryClient = useQueryClient();

  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to sign in to access the CRM system.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch dashboard stats
  const { data: dashboardData, error: dashboardError } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/crm/dashboard"],
    enabled: isAuthenticated,
  });

  // Fetch leads
  const { data: leadsData, error: leadsError } = useQuery<{ success: boolean; data: Lead[] }>({
    queryKey: ["/api/crm/leads", filters],
    enabled: isAuthenticated,
  });

  // Handle authentication errors
  useEffect(() => {
    if (dashboardError && isUnauthorizedError(dashboardError as Error)) {
      toast({
        title: "Session Expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [dashboardError, toast]);

  // Show login page if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CrmLogin />;
  }

  const leads = leadsData?.data || [];
  const dashboard = dashboardData?.data || null;

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getStatusColor = (status: string) => statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  const getPriorityColor = (priority: string) => priorityColors[priority as keyof typeof priorityColors] || "bg-gray-500";

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
            <p className="text-gray-600">Manage your sales leads and track performance</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>
            <Link href="/email-test">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Test
              </Button>
            </Link>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {dashboard ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboard.totalLeads}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboard.newLeads}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboard.wonLeads}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboard.proposalsSent}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Leads by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dashboard.leadsBySource.map((item: { source: string; count: number }) => (
                          <div key={item.source} className="flex justify-between items-center">
                            <span className="capitalize">{item.source.replace('_', ' ')}</span>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leads by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dashboard.leadsByStatus.map((item: { status: string; count: number }) => (
                          <div key={item.status} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                              <span className="capitalize">{item.status.replace('_', ' ')}</span>
                            </div>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboard.recentActivities.slice(0, 5).map((activity: LeadActivity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {activity.type === 'call' && <Phone className="h-4 w-4 text-blue-500" />}
                            {activity.type === 'email' && <Mail className="h-4 w-4 text-green-500" />}
                            {activity.type === 'note' && <MessageSquare className="h-4 w-4 text-gray-500" />}
                            {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-500" />}
                            {activity.type === 'status_change' && <Activity className="h-4 w-4 text-orange-500" />}
                            {activity.type === 'treatment_quote' && <DollarSign className="h-4 w-4 text-green-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.subject}</p>
                            <p className="text-xs text-gray-500">
                              by {activity.performedBy} • {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading dashboard data...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search leads..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sources</SelectItem>
                      <SelectItem value="consultation_form">Consultation Form</SelectItem>
                      <SelectItem value="contact_form">Contact Form</SelectItem>
                      <SelectItem value="provider_application">Provider Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Leads List */}
            <div className="grid gap-4">
              {leads.map((lead: Lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{lead.fullName}</h3>
                          <Badge className={`text-white ${getStatusColor(lead.status)}`}>
                            {lead.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={`text-white ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                              {formatPhoneNumber(lead.phone)}
                            </a>
                          </div>
                          {lead.treatmentInterest && (
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              <span>Interested in: {lead.treatmentInterest}</span>
                            </div>
                          )}
                        </div>
                        {lead.notes && (
                          <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {lead.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {lead.source.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <Link href={`/crm/lead/${lead.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>All recent lead activities and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(dashboard?.recentActivities || []).map((activity: LeadActivity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'call' && <Phone className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'email' && <Mail className="h-5 w-5 text-green-500" />}
                        {activity.type === 'note' && <MessageSquare className="h-5 w-5 text-gray-500" />}
                        {activity.type === 'meeting' && <Calendar className="h-5 w-5 text-purple-500" />}
                        {activity.type === 'status_change' && <Activity className="h-5 w-5 text-orange-500" />}
                        {activity.type === 'treatment_quote' && <DollarSign className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{activity.subject}</h4>
                          <span className="text-sm text-gray-500">
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="capitalize">Type: {activity.type.replace('_', ' ')}</span>
                          <span>By: {activity.performedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}