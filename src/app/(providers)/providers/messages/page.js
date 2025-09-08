"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Mail, Phone, Calendar, MessageSquare, User, Star, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const MessagesPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

    // Sample data - in a real app this would come from an API
    const [contacts, setContacts] = useState([]);


    useEffect(() => {
        // Sample contacts data
        const sampleContacts = [
            {
                id: 'C001',
                name: 'Rahul Sharma',
                email: 'rahul.sharma@email.com',
                phone: '+91 9876543210',
                childName: 'Aarav Sharma',
                childAge: 3,
                lastContact: '2023-08-15T10:30:00Z',
                unreadCount: 2,
                status: 'interested',
                priority: 'high'
            },
            {
                id: 'C002',
                name: 'Priya Patel',
                email: 'priya.patel@email.com',
                phone: '+91 9876543211',
                childName: 'Ananya Patel',
                childAge: 4,
                lastContact: '2023-08-14T14:20:00Z',
                unreadCount: 0,
                status: 'tour scheduled',
                priority: 'medium'
            },
            {
                id: 'C003',
                name: 'Vikram Singh',
                email: 'vikram.singh@email.com',
                phone: '+91 9876543212',
                childName: 'Vihaan Singh',
                childAge: 2,
                lastContact: '2023-08-13T09:15:00Z',
                unreadCount: 0,
                status: 'enrolled',
                priority: 'low'
            },
            {
                id: 'C004',
                name: 'Neha Gupta',
                email: 'neha.gupta@email.com',
                phone: '+91 9876543213',
                childName: 'Advik Gupta',
                childAge: 5,
                lastContact: '2023-08-12T11:40:00Z',
                unreadCount: 1,
                status: 'follow up',
                priority: 'high'
            },
            {
                id: 'C005',
                name: 'Arun Kumar',
                email: 'arun.kumar@email.com',
                phone: '+91 9876543214',
                childName: 'Aisha Kumar',
                childAge: 3,
                lastContact: '2023-08-10T16:25:00Z',
                unreadCount: 0,
                status: 'not interested',
                priority: 'low'
            }
        ];

        // Sample messages data

        setContacts(sampleContacts);


        // Select the first contact by default
        if (sampleContacts.length > 0 && !selectedContact) {
            setSelectedContact(sampleContacts[0]);
        }
    }, []);

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = searchTerm === '' ||
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === 'all' || contact.status === activeTab;

        return matchesSearch && matchesTab;
    });



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'interested': { variant: 'default', text: 'Interested' },
            'tour scheduled': { variant: 'secondary', text: 'Tour Scheduled' },
            'enrolled': { variant: 'success', text: 'Enrolled' },
            'follow up': { variant: 'outline', text: 'Follow Up Needed' },
            'not interested': { variant: 'destructive', text: 'Not Interested' }
        };

        const config = statusConfig[status] || { variant: 'outline', text: status };
        return <Badge variant={config.variant}>{config.text}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            'high': { variant: 'destructive', text: 'High Priority' },
            'medium': { variant: 'default', text: 'Medium Priority' },
            'low': { variant: 'secondary', text: 'Low Priority' }
        };

        const config = priorityConfig[priority] || { variant: 'outline', text: priority };
        return <Badge variant={config.variant}>{config.text}</Badge>;
    };

    const stats = {
        totalContacts: contacts.length,
        unreadMessages: contacts.reduce((sum, contact) => sum + contact.unreadCount, 0),
        toursScheduled: contacts.filter(contact => contact.status === 'tour scheduled').length,
        newEnrollments: contacts.filter(contact => contact.status === 'enrolled').length
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Messages & Contacts</h1>
                    <p className="text-muted-foreground">Manage communications with parents</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Broadcast
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalContacts}</div>
                        <p className="text-xs text-muted-foreground">
                            All potential and current clients
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                        <p className="text-xs text-muted-foreground">
                            Requiring your attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tours Scheduled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.toursScheduled}</div>
                        <p className="text-xs text-muted-foreground">
                            Upcoming facility tours
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.newEnrollments}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Contacts List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search contacts..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={activeTab} onValueChange={setActiveTab}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Contacts</SelectItem>
                                    <SelectItem value="interested">Interested</SelectItem>
                                    <SelectItem value="tour scheduled">Tour Scheduled</SelectItem>
                                    <SelectItem value="enrolled">Enrolled</SelectItem>
                                    <SelectItem value="follow up">Follow Up</SelectItem>
                                    <SelectItem value="not interested">Not Interested</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedContact?.id === contact.id ? 'bg-muted' : ''}`}
                                    onClick={() => setSelectedContact(contact)

                                    }
                                >
                                    <Link href={`/providers/messages/${contact.id}`} >

                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                                                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold">{contact.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {contact.childName} ({contact.childAge} yrs)
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        {getStatusBadge(contact.status)}
                                                        {contact.unreadCount > 0 && (
                                                            <Badge variant="default" className="ml-2">
                                                                {contact.unreadCount} unread
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDate(contact.lastContact)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatTime(contact.lastContact)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            {filteredContacts.length === 0 && (
                                <div className="p-4 text-center text-muted-foreground">
                                    No contacts found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
};

export default MessagesPage;