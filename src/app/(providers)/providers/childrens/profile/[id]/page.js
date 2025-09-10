import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  Heart, 
  Shield, 
  AlertCircle,
  FileText,
  Stethoscope,
  Utensils,
  Bell,
  Edit,
  Download,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const ChildrenDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample child data - in a real app this would come from API or props
  const child = {
    id: 'C001',
    name: 'Aarav Sharma',
    age: 3,
    dateOfBirth: '2020-05-15',
    gender: 'Male',
    image: 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav Sharma',
    status: 'active',
    enrollmentDate: '2023-08-01',
    room: 'Toddler Room',
    teacher: 'Priya Patel',
    
    // Parent/Guardian information
    parents: [
      {
        id: 'P001',
        name: 'Rahul Sharma',
        relationship: 'Father',
        email: 'rahul.sharma@email.com',
        phone: '+91 9876543210',
        primary: true
      },
      {
        id: 'P002',
        name: 'Neha Sharma',
        relationship: 'Mother',
        email: 'neha.sharma@email.com',
        phone: '+91 9876543211',
        primary: false
      }
    ],
    
    // Medical information
    medical: {
      bloodType: 'O+',
      allergies: ['Peanuts', 'Dairy'],
      medications: [
        {
          name: 'Asthma Inhaler',
          dosage: 'As needed',
          instructions: 'Use during breathing difficulties'
        }
      ],
      doctor: {
        name: 'Dr. Rajesh Kumar',
        phone: '+91 9876543212',
        clinic: 'City Children Clinic'
      },
      emergencyContact: {
        name: 'Grandma Sharma',
        phone: '+91 9876543213',
        relationship: 'Grandmother'
      }
    },
    
    // Special requirements
    specialRequirements: {
      dietary: 'Lactose intolerant, vegetarian',
      nap: 'Afternoon nap from 1:30 PM to 3:00 PM',
      activities: 'Enjoys outdoor play, avoid loud noises',
      other: 'Comfort toy: Teddy bear'
    },
    
    // Attendance summary
    attendance: {
      present: 45,
      absent: 5,
      late: 2,
      percentage: 90
    },
    
    // Recent activities
    recentActivities: [
      {
        date: '2023-09-15',
        type: 'check-in',
        time: '08:45 AM',
        notes: 'Happy and energetic'
      },
      {
        date: '2023-09-15',
        type: 'meal',
        time: '12:30 PM',
        notes: 'Ate all fruits, skipped vegetables'
      },
      {
        date: '2023-09-15',
        type: 'nap',
        time: '01:30 PM',
        notes: 'Slept well for 1.5 hours'
      },
      {
        date: '2023-09-15',
        type: 'check-out',
        time: '05:30 PM',
        notes: 'Picked up by father'
      }
    ],
    
    // Upcoming events
    upcomingEvents: [
      {
        date: '2023-09-20',
        title: 'Parent-Teacher Meeting',
        time: '4:00 PM'
      },
      {
        date: '2023-09-25',
        title: 'Field Trip to Zoo',
        time: 'All day'
      }
    ]
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'default', text: 'Active' },
      'inactive': { variant: 'outline', text: 'Inactive' },
      'pending': { variant: 'secondary', text: 'Pending' }
    };
    
    const config = statusConfig[status] || { variant: 'outline', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const handleMessageParent = (parent) => {
    // In a real app, this would open a chat with the parent
    console.log('Messaging parent:', parent.name);
  };

  const handleCheckIn = () => {
    // In a real app, this would check the child in
    console.log('Checking in child:', child.name);
  };

  const handleCheckOut = () => {
    // In a real app, this would check the child out
    console.log('Checking out child:', child.name);
  };

  const handleAddNote = () => {
    // In a real app, this would open a form to add a note
    console.log('Adding note for child:', child.name);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/providers/childrens">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Child Profile</h1>
            <p className="text-muted-foreground">Detailed information and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button onClick={child.status === 'active' ? handleCheckOut : handleCheckIn}>
            <Clock className="h-4 w-4 mr-2" />
            {child.status === 'active' ? 'Check Out' : 'Check In'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child Summary Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={child.image} />
                  <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{child.name}</h2>
                      <p className="text-muted-foreground">{child.age} years old • {child.gender}</p>
                    </div>
                    {getStatusBadge(child.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{formatDate(child.dateOfBirth)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Enrollment Date</p>
                      <p className="font-medium">{formatDate(child.enrollmentDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium">{child.room}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Primary Teacher</p>
                      <p className="font-medium">{child.teacher}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Parents Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Parents/Guardians</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {child.parents.map((parent, index) => (
                        <div key={parent.id} className="flex items-start justify-between p-3 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${parent.name}`} />
                              <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">
                                {parent.name} 
                                {parent.primary && <Badge variant="outline" className="ml-2">Primary</Badge>}
                              </h3>
                              <p className="text-sm text-muted-foreground">{parent.relationship}</p>
                              <div className="flex items-center mt-1 text-sm">
                                <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                {parent.phone}
                              </div>
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                {parent.email}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleMessageParent(parent)}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Utensils className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Dietary</h4>
                          <p className="text-sm text-muted-foreground">{child.specialRequirements.dietary}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Nap Time</h4>
                          <p className="text-sm text-muted-foreground">{child.specialRequirements.nap}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Activities</h4>
                          <p className="text-sm text-muted-foreground">{child.specialRequirements.activities}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Bell className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Other</h4>
                          <p className="text-sm text-muted-foreground">{child.specialRequirements.other}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Medical Tab */}
            <TabsContent value="medical">
              <div className="space-y-6">
                {/* Medical Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Blood Type</p>
                        <p className="font-medium">{child.medical.bloodType}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {child.medical.allergies.map((allergy, index) => (
                            <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Medications */}
                    <div>
                      <h4 className="font-semibold mb-2">Medications</h4>
                      {child.medical.medications.length > 0 ? (
                        <div className="space-y-2">
                          {child.medical.medications.map((med, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="font-medium">{med.name}</div>
                              <div className="text-sm text-muted-foreground">Dosage: {med.dosage}</div>
                              <div className="text-sm text-muted-foreground">Instructions: {med.instructions}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No medications listed</p>
                      )}
                    </div>

                    {/* Doctor Information */}
                    <div>
                      <h4 className="font-semibold mb-2">Doctor Information</h4>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">{child.medical.doctor.name}</div>
                        <div className="text-sm text-muted-foreground">{child.medical.doctor.clinic}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {child.medical.doctor.phone}
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <h4 className="font-semibold mb-2">Emergency Contact</h4>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">{child.medical.emergencyContact.name}</div>
                        <div className="text-sm text-muted-foreground">{child.medical.emergencyContact.relationship}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {child.medical.emergencyContact.phone}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{child.attendance.present}</div>
                        <p className="text-sm text-muted-foreground">Present</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-600">{child.attendance.absent}</div>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-amber-600">{child.attendance.late}</div>
                        <p className="text-sm text-muted-foreground">Late</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{child.attendance.percentage}%</div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Attendance chart would be displayed here</p>
                    <p className="text-sm">Monthly and yearly attendance trends</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Attendance Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities">
              <div className="space-y-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Activities</CardTitle>
                    <CardDescription>{formatDate(new Date().toISOString())}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {child.recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {child.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex flex-col items-center">
                              <div className={`p-2 rounded-full ${
                                activity.type === 'check-in' ? 'bg-green-100 text-green-600' :
                                activity.type === 'check-out' ? 'bg-blue-100 text-blue-600' :
                                activity.type === 'meal' ? 'bg-amber-100 text-amber-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                {activity.type === 'check-in' ? <User className="h-4 w-4" /> :
                                 activity.type === 'check-out' ? <User className="h-4 w-4" /> :
                                 activity.type === 'meal' ? <Utensils className="h-4 w-4" /> :
                                 <Clock className="h-4 w-4" />}
                              </div>
                              {index < child.recentActivities.length - 1 && (
                                <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-semibold capitalize">{activity.type}</h4>
                                <span className="text-sm text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.notes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No activities recorded today</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddNote} className="w-full">
                      Add Daily Note
                    </Button>
                  </CardFooter>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {child.upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {child.upcomingEvents.map((event, index) => (
                          <div key={index} className="flex items-center p-3 border rounded-lg">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(event.date)} • {event.time}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No upcoming events</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Documents
              </Button>
              <Button variant="outline" className="w-full">
                <Stethoscope className="h-4 w-4 mr-2" />
                Add Medical Note
              </Button>
              <Button variant="outline" className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Profile
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Information */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Emergency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">{child.medical.emergencyContact.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">{child.medical.emergencyContact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-red-700" />
                  <span>{child.medical.emergencyContact.relationship}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-700" />
                  <span className="font-medium">Allergies</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {child.medical.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Present</span>
                  <span className="font-medium">{child.attendance.present} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Absent</span>
                  <span className="font-medium">{child.attendance.absent} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Late Arrivals</span>
                  <span className="font-medium">{child.attendance.late} days</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Attendance Rate</span>
                  <span className="font-bold text-green-600">{child.attendance.percentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildrenDetailsPage;