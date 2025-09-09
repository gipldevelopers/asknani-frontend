"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Clock, Phone, Mail, Globe, Users, Shield, Award, Heart } from 'lucide-react';
import Image from 'next/image';

const DaycareDetailPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isFavorite, setIsFavorite] = useState(false);

    // Sample daycare data
    const daycare = {
        id: 'DC001',
        name: 'Sunshine Daycare Center',
        tagline: 'Where children grow, learn, and play in a safe environment',
        rating: 4.8,
        reviewCount: 124,
        address: '123 Main Street, Bangalore, Karnataka 560001',
        phone: '+91 9876543210',
        email: 'info@sunshinedaycare.com',
        website: 'www.sunshinedaycare.com',
        hours: 'Monday - Friday: 7:30 AM - 6:30 PM, Saturday: 8:00 AM - 1:00 PM',
        images: [
            'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1540479859555-17af45c78602?auto=format&fit=crop&w=1200&q=80'
        ],
        tags: ['Preschool', 'Daycare', 'After School', 'Play Group', 'Safe Environment', 'Educational'],
        facilities: [
            'Air Conditioned',
            'CCTV Surveillance',
            'Indoor Play Area',
            'Outdoor Play Area',
            'Meals Provided',
            'Educational Toys',
            'Transportation',
            'First Aid',
            'Trained Staff',
            'Activity Classes'
        ],
        staff: [
            {
                name: 'Priya Sharma',
                role: 'Director & Founder',
                experience: '15 years in early childhood education',
                qualifications: 'M.A. in Child Development, Certified Montessori Teacher',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
            },
            {
                name: 'Rajesh Kumar',
                role: 'Head Teacher',
                experience: '10 years teaching experience',
                qualifications: 'B.Ed. in Early Childhood Education, CPR Certified',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
            },
            {
                name: 'Anjali Mehta',
                role: 'Child Care Specialist',
                experience: '8 years in daycare management',
                qualifications: 'Diploma in Child Care, Special Needs Training',
                image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
            }
        ],
        certifications: [
            {
                name: 'ISO 9001 Certified',
                description: 'Quality management certification',
                icon: <Shield className="h-6 w-6" />
            },
            {
                name: 'Child Safety Certified',
                description: 'Certified child-safe environment',
                icon: <Award className="h-6 w-6" />
            },
            {
                name: 'Montessori Trained',
                description: 'Montessori method trained staff',
                icon: <Award className="h-6 w-6" />
            }
        ],
        about: `Sunshine Daycare Center has been providing quality childcare services since 2010. We believe in creating a nurturing environment where children can learn, grow, and explore their potential. Our curriculum is designed to foster cognitive, social, emotional, and physical development through play-based learning activities.

Our center features state-of-the-art facilities with secure premises, CCTV monitoring, and trained staff who are passionate about early childhood education. We maintain a low child-to-teacher ratio to ensure individual attention for each child.`,
        ageGroups: ['Infants (6-12 months)', 'Toddlers (1-2 years)', 'Preschool (2-4 years)', 'Kindergarten (4-6 years)'],
        pricing: [
            {
                package: 'Full Day Care',
                hours: '9:00 AM - 6:00 PM',
                price: '₹12,000/month'
            },
            {
                package: 'Half Day Care',
                hours: '9:00 AM - 1:00 PM',
                price: '₹8,000/month'
            },
            {
                package: 'After School Care',
                hours: '2:00 PM - 6:00 PM',
                price: '₹6,000/month'
            }
        ]
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{daycare.name}</h1>
                    <p className="text-muted-foreground mt-1">{daycare.tagline}</p>
                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-semibold">{daycare.rating}</span>
                        </div>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{daycare.reviewCount} reviews</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="ml-1 text-muted-foreground">Bangalore</span>
                        </div>
                    </div>
                </div>
                <Button
                    variant={isFavorite ? "default" : "outline"}
                    className="mt-4 md:mt-0"
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
                    {isFavorite ? 'Saved' : 'Save to Favorites'}
                </Button>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2 md:row-span-2">
                    <Image
                        src={daycare.images[0]}
                        alt={daycare.name}
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                </div>
                {daycare.images.slice(1, 4).map((image, index) => (
                    <div key={index}>
                        <Image
                            src={image}
                            alt={daycare.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                ))}
                <div className="md:col-span-1 flex items-center justify-center bg-muted rounded-lg">
                    <Button variant="outline">+{daycare.images.length - 4} more</Button>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    <TabsTrigger value="staff">Our Staff</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About Us</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">{daycare.about}</p>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Age Groups We Serve</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {daycare.ageGroups.map((group, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                                                    <span>{group}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                                        <span>{daycare.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                                        <span>{daycare.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                                        <span>{daycare.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Globe className="h-5 w-5 text-muted-foreground mr-3" />
                                        <span>{daycare.website}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                                        <span>{daycare.hours}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Tags & Keywords</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {daycare.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Facilities Tab */}
                <TabsContent value="facilities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Facilities & Amenities</CardTitle>
                            <CardDescription>
                                We provide a safe and stimulating environment for your child&apos;s development
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {daycare.facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center p-3 border rounded-lg">
                                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <span>{facility}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Staff Tab */}
                <TabsContent value="staff">
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Qualified Staff</CardTitle>
                            <CardDescription>
                                Meet our team of experienced and caring professionals
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {daycare.staff.map((person, index) => (
                                    <Card key={index} className="text-center">
                                        <CardContent className="pt-6">
                                            <Image
                                            fill
                                                src={person.image}
                                                alt={person.name}
                                                className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                                            />
                                            <h3 className="font-semibold text-lg">{person.name}</h3>
                                            <p className="text-primary font-medium">{person.role}</p>
                                            <p className="text-sm text-muted-foreground mt-2">{person.experience}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{person.qualifications}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Certifications Tab */}
                <TabsContent value="certifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Certifications & Accreditations</CardTitle>
                            <CardDescription>
                                Our commitment to quality and safety is recognized through these certifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {daycare.certifications.map((cert, index) => (
                                    <Card key={index} className="text-center">
                                        <CardHeader>
                                            <div className="flex justify-center">
                                                <div className="bg-primary/10 p-3 rounded-full">
                                                    {cert.icon}
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg mt-4">{cert.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{cert.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Packages</CardTitle>
                            <CardDescription>
                                Flexible options to suit your childcare needs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {daycare.pricing.map((plan, index) => (
                                    <Card key={index} className={`text-center ${index === 0 ? 'border-primary' : ''}`}>
                                        <CardHeader className={`${index === 0 ? 'bg-primary/10' : ''}`}>
                                            <CardTitle>{plan.package}</CardTitle>
                                            <CardDescription>{plan.hours}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="text-2xl font-bold">{plan.price}</div>
                                            <Button className="mt-4">
                                                Select Plan
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location">
                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                            <CardDescription>
                                Find us at our convenient location
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold">Interactive Map</h3>
                                    <p className="text-muted-foreground mt-2">Map integration would appear here</p>
                                    <p className="text-sm mt-4">{daycare.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DaycareDetailPage;