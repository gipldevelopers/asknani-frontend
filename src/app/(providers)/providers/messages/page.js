"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  User,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { contactsAPI } from "@/lib/contacts-api";

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    unreadMessages: 0,
    toursScheduled: 0,
    newEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactsAndStats();
  }, []);

  const fetchContactsAndStats = async () => {
    try {
      setLoading(true);
      const [contactsResponse, statsResponse] = await Promise.all([
        contactsAPI.getContacts(),
        contactsAPI.getStats(),
      ]);

      if (contactsResponse.status === "success") {
        setContacts(contactsResponse.contacts);
        if (contactsResponse.contacts.length > 0 && !selectedContact) {
          setSelectedContact(contactsResponse.contacts[0]);
        }
      }

      if (statsResponse.status === "success") {
        setStats(statsResponse.stats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || contact.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "No contact yet";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      interested: { variant: "default", text: "Interested" },
      "tour scheduled": { variant: "secondary", text: "Tour Scheduled" },
      enrolled: { variant: "success", text: "Enrolled" },
      "follow up": { variant: "outline", text: "Follow Up Needed" },
      "not interested": { variant: "destructive", text: "Not Interested" },
    };

    const config = statusConfig[status] || { variant: "outline", text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading contacts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages & Contacts</h1>
          <p className="text-muted-foreground">
            Manage communications with parents
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Requiring your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Contacts List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
        
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedContact?.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <Link href={`/providers/messages/${contact.parent_id}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`}
                          />
                          <AvatarFallback>
                            {contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{contact.name}</div>

                          {/* Proper child names display */}
                          <div className="text-sm text-muted-foreground">
                            Childs
                            {contact.children && contact.children.length > 0
                              ? contact.children
                                  .map((child) => child.full_name)
                                  .join(", ")
                              : "No children"}{" "}
                            (
                            {contact.children && contact.children.length > 0
                              ? contact.children[0].age
                              : "-"}{" "}
                            yrs)
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
                  {contacts.length === 0
                    ? "No contacts yet"
                    : "No contacts found"}
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
