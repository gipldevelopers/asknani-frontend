"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, BarChart3, Users, TrendingUp, Package, IndianRupee } from 'lucide-react';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    hours: '',
    description: '',
    price: '',
    ageGroup: '',
    maxChildren: ''
  });

  // Sample data - in a real app this would come from an API
  useEffect(() => {
    const samplePackages = [
      {
        id: 'PKG1',
        title: 'Full Day Care',
        hours: '9am-6pm',
        description: 'Complete daycare service with meals, activities, and nap time',
        price: 12000,
        ageGroup: '2-5 years',
        maxChildren: 15,
        isActive: true,
        bookingsCount: 45,
        popularity: 4.8
      },
      {
        id: 'PKG2',
        title: 'Half Day Care',
        hours: '9am-1pm',
        description: 'Morning care with breakfast and lunch included',
        price: 8000,
        ageGroup: '2-5 years',
        maxChildren: 10,
        isActive: true,
        bookingsCount: 32,
        popularity: 4.5
      },
      {
        id: 'PKG3',
        title: 'Weekly Package',
        hours: '8am-5pm',
        description: 'Full week care at discounted rate',
        price: 15000,
        ageGroup: '3-6 years',
        maxChildren: 12,
        isActive: true,
        bookingsCount: 28,
        popularity: 4.7
      },
      {
        id: 'PKG4',
        title: 'Weekend Care',
        hours: '8am-4pm',
        description: 'Special weekend care program for working parents',
        price: 5000,
        ageGroup: '2-6 years',
        maxChildren: 8,
        isActive: false,
        bookingsCount: 15,
        popularity: 4.2
      },
      {
        id: 'PKG5',
        title: 'After School Care',
        hours: '2pm-6pm',
        description: 'Care for school-going children after school hours',
        price: 6000,
        ageGroup: '5-10 years',
        maxChildren: 15,
        isActive: true,
        bookingsCount: 22,
        popularity: 4.6
      }
    ];
    
    setPackages(samplePackages);
    
    // Sample analytics data
    setAnalytics({
      totalPackages: 5,
      activePackages: 4,
      totalBookings: 142,
      mostPopularPackage: samplePackages[0],
      totalRevenue: 1564000,
      averagePrice: 9200
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      hours: '',
      description: '',
      price: '',
      ageGroup: '',
      maxChildren: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      hours: pkg.hours,
      description: pkg.description,
      price: pkg.price,
      ageGroup: pkg.ageGroup,
      maxChildren: pkg.maxChildren
    });
    setIsDialogOpen(true);
  };

  const handleSavePackage = () => {
    if (editingPackage) {
      // Update existing package
      setPackages(prev => prev.map(p => 
        p.id === editingPackage.id 
          ? { ...p, ...formData, price: Number(formData.price), maxChildren: Number(formData.maxChildren) }
          : p
      ));
    } else {
      // Add new package
      const newPackage = {
        id: `PKG${packages.length + 1}`,
        ...formData,
        price: Number(formData.price),
        maxChildren: Number(formData.maxChildren),
        isActive: true,
        bookingsCount: 0,
        popularity: 0
      };
      setPackages(prev => [...prev, newPackage]);
    }
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (id) => {
    setPackages(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleDeletePackage = (id) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Packages Management</h1>
          <p className="text-muted-foreground">Create and manage your daycare packages</p>
        </div>
        <Button onClick={handleAddPackage} className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Package
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activePackages} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Across all packages
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {analytics.mostPopularPackage?.title}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.mostPopularPackage?.bookingsCount} bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Package Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.averagePrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Packages List */}
      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`overflow-hidden ${!pkg.isActive ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    {pkg.title}
                    {!pkg.isActive && (
                      <Badge variant="outline" className="ml-2">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {pkg.hours} • {pkg.ageGroup} • Max {pkg.maxChildren} children
                  </CardDescription>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(pkg.price)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{pkg.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{pkg.bookingsCount}</div>
                    <div className="text-xs text-muted-foreground">Bookings</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{pkg.popularity}/5</div>
                    <div className="text-xs text-muted-foreground">Popularity</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{formatCurrency(pkg.price * pkg.bookingsCount)}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {analytics.totalBookings ? Math.round((pkg.bookingsCount / analytics.totalBookings) * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Of total bookings</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 py-3 flex justify-between">
              <Button 
                variant={pkg.isActive ? "outline" : "default"} 
                size="sm"
                onClick={() => handleToggleStatus(pkg.id)}
              >
                {pkg.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add/Edit Package Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </DialogTitle>
            <DialogDescription>
              {editingPackage 
                ? 'Update your package details below.' 
                : 'Fill in the details for your new package.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">
                Hours
              </Label>
              <Input
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="9am-6pm"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₹)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ageGroup" className="text-right">
                Age Group
              </Label>
              <Input
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="2-5 years"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxChildren" className="text-right">
                Max Children
              </Label>
              <Input
                id="maxChildren"
                name="maxChildren"
                type="number"
                value={formData.maxChildren}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>
              {editingPackage ? 'Update Package' : 'Add Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {packages.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No packages yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first package to start receiving bookings
          </p>
          <Button onClick={handleAddPackage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Package
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackagesPage;