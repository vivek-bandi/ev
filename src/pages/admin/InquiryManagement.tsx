import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { inquiryAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Calendar, Plus } from 'lucide-react';

interface Inquiry {
  _id: string;
  type: string;
  subject: string;
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  priority: string;
  responses: Array<{
    message: string;
    respondedBy: string;
    respondedAt: string;
  }>;
  createdAt: string;
}

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');
  const { toast } = useToast();

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseForm, setResponseForm] = useState({
    message: ''
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryAPI.getAll({ limit: 100 });
      setInquiries(response.data.inquiries || response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch inquiries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedInquiry || !responseForm.message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response message',
        variant: 'destructive'
      });
      return;
    }

    try {
      await inquiryAPI.addResponse(selectedInquiry._id, {
        message: responseForm.message
      });

      toast({ title: 'Success', description: 'Response added successfully' });
      setResponseForm({ message: '' });
      fetchInquiries();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add response',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (inquiryId: string, status: string) => {
    try {
      await inquiryAPI.update(inquiryId, { status });
      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchInquiries();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = !filterStatus || filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesPriority = !filterPriority || filterPriority === 'all' || inquiry.priority === filterPriority;
    const matchesType = !filterType || filterType === 'all' || inquiry.type === filterType;
    return matchesStatus && matchesPriority && matchesType;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'vehicle_specific':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'test_drive':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'pricing':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case 'technical':
        return <MessageSquare className="h-4 w-4 text-red-500" />;
      case 'complaint':
        return <MessageSquare className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const statuses = ['new', 'in_progress', 'resolved', 'closed'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const types = ['general', 'vehicle_specific', 'test_drive', 'pricing', 'technical', 'complaint'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inquiry Management</h2>
          <p className="text-muted-foreground mt-1">View and respond to customer inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Filter by Priority</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterStatus('');
                  setFilterPriority('');
                  setFilterType('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries ({filteredInquiries.length})</CardTitle>
          <CardDescription>Manage customer questions and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading inquiries...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(inquiry.type)}
                        <span className="text-sm">{inquiry.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.contactInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.contactInfo.email}</p>
                        {inquiry.contactInfo.phone && (
                          <p className="text-sm text-muted-foreground">{inquiry.contactInfo.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedInquiry(inquiry)}
                          variant="outline"
                          size="sm"
                        >
                          View
                        </Button>
                        <Select
                          value={inquiry.status}
                          onValueChange={(value) => handleUpdateStatus(inquiry._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedInquiry.subject}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4">
                  <span>{getTypeIcon(selectedInquiry.type)} {selectedInquiry.type.replace('_', ' ')}</span>
                  {getPriorityBadge(selectedInquiry.priority)}
                  {getStatusBadge(selectedInquiry.status)}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p><strong>Name:</strong> {selectedInquiry.contactInfo.name}</p>
                  <p><strong>Email:</strong> {selectedInquiry.contactInfo.email}</p>
                  {selectedInquiry.contactInfo.phone && (
                    <p><strong>Phone:</strong> {selectedInquiry.contactInfo.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Message</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p>{selectedInquiry.message}</p>
                </div>
              </div>

              {selectedInquiry.responses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Responses</h4>
                  <div className="space-y-2">
                    {selectedInquiry.responses.map((response, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(response.respondedAt).toLocaleString()}
                        </p>
                        <p>{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Add Response</h4>
                <Textarea
                  value={responseForm.message}
                  onChange={(e) => setResponseForm({ message: e.target.value })}
                  placeholder="Type your response here..."
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={handleAddResponse}>Send Response</Button>
                  <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default InquiryManagement;
