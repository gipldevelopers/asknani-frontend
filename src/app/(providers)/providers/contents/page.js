"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Upload, MapPin, Users, Shield, Award, Wifi, Utensils, Car, Heart, BookOpen } from 'lucide-react';
import Image from 'next/image';

// Reusable Image Upload Component
const ImageUpload = ({ images, onImagesChange, maxImages = 10 }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= maxImages) {
      const newImages = files.map(file => URL.createObjectURL(file));
      onImagesChange([...images, ...newImages]);
    } else {
      alert(`Maximum ${maxImages} images allowed`);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <Image
            fill
              src={image} 
              alt={`Daycare ${index + 1}`} 
              className="h-40 w-full object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-40 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Upload Image</span>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">{images.length} of {maxImages} images</p>
    </div>
  );
};

// Reusable Tag Input Component
const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(index)}>
              <Trash2 className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Reusable Facility Toggle Component
const FacilityToggle = ({ facility, isEnabled, onToggle }) => {
  const facilityIcons = {
    'Air Conditioned': <Wifi className="h-4 w-4" />,
    'CCTV Surveillance': <Shield className="h-4 w-4" />,
    'Meals Provided': <Utensils className="h-4 w-4" />,
    'Transportation': <Car className="h-4 w-4" />,
    'First Aid': <Heart className="h-4 w-4" />,
    'Educational Toys': <BookOpen className="h-4 w-4" />,
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          {facilityIcons[facility] || <Shield className="h-4 w-4 text-primary" />}
        </div>
        <span>{facility}</span>
      </div>
      <Switch checked={isEnabled} onCheckedChange={() => onToggle(facility)} />
    </div>
  );
};

// Reusable Staff Member Form Component
const StaffMemberForm = ({ staff, index, onChange, onRemove }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Staff Member #{index + 1}</CardTitle>
          <Button variant="outline" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`staff-name-${index}`}>Name</Label>
            <Input
              id={`staff-name-${index}`}
              value={staff.name}
              onChange={(e) => onChange(index, 'name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`staff-role-${index}`}>Role</Label>
            <Input
              id={`staff-role-${index}`}
              value={staff.role}
              onChange={(e) => onChange(index, 'role', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-experience-${index}`}>Experience</Label>
          <Input
            id={`staff-experience-${index}`}
            value={staff.experience}
            onChange={(e) => onChange(index, 'experience', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-qualifications-${index}`}>Qualifications</Label>
          <Input
            id={`staff-qualifications-${index}`}
            value={staff.qualifications}
            onChange={(e) => onChange(index, 'qualifications', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`staff-image-${index}`}>Image URL</Label>
          <Input
            id={`staff-image-${index}`}
            value={staff.image}
            onChange={(e) => onChange(index, 'image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Reusable Certification Form Component
const CertificationForm = ({ certification, index, onChange, onRemove }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
          <Button variant="outline" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`cert-name-${index}`}>Name</Label>
          <Input
            id={`cert-name-${index}`}
            value={certification.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`cert-desc-${index}`}>Description</Label>
          <Input
            id={`cert-desc-${index}`}
            value={certification.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main Content Management Page
const ProvidersContentPage = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [daycareData, setDaycareData] = useState({
    name: 'Sunshine Daycare Center',
    tagline: 'Where children grow, learn, and play in a safe environment',
    address: '123 Main Street, Bangalore, Karnataka 560001',
    phone: '+91 9876543210',
    email: 'info@sunshinedaycare.com',
    website: 'www.sunshinedaycare.com',
    hours: 'Monday - Friday: 7:30 AM - 6:30 PM, Saturday: 8:00 AM - 1:00 PM',
    images: [
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
    enabledFacilities: [
      'Air Conditioned',
      'CCTV Surveillance',
      'Meals Provided',
      'First Aid',
      'Trained Staff'
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
      }
    ],
    certifications: [
      {
        name: 'ISO 9001 Certified',
        description: 'Quality management certification'
      },
      {
        name: 'Child Safety Certified',
        description: 'Certified child-safe environment'
      }
    ],
    about: `Sunshine Daycare Center has been providing quality childcare services since 2010. We believe in creating a nurturing environment where children can learn, grow, and explore their potential. Our curriculum is designed to foster cognitive, social, emotional, and physical development through play-based learning activities.

Our center features state-of-the-art facilities with secure premises, CCTV monitoring, and trained staff who are passionate about early childhood education. We maintain a low child-to-teacher ratio to ensure individual attention for each child.`,
    ageGroups: ['Infants (6-12 months)', 'Toddlers (1-2 years)', 'Preschool (2-4 years)', 'Kindergarten (4-6 years)']
  });

  const handleInputChange = (field, value) => {
    setDaycareData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilityToggle = (facility) => {
    setDaycareData(prev => {
      const isEnabled = prev.enabledFacilities.includes(facility);
      return {
        ...prev,
        enabledFacilities: isEnabled
          ? prev.enabledFacilities.filter(f => f !== facility)
          : [...prev.enabledFacilities, facility]
      };
    });
  };

  const handleStaffChange = (index, field, value) => {
    setDaycareData(prev => {
      const newStaff = [...prev.staff];
      newStaff[index] = { ...newStaff[index], [field]: value };
      return { ...prev, staff: newStaff };
    });
  };

  const addStaffMember = () => {
    setDaycareData(prev => ({
      ...prev,
      staff: [
        ...prev.staff,
        {
          name: '',
          role: '',
          experience: '',
          qualifications: '',
          image: ''
        }
      ]
    }));
  };

  const removeStaffMember = (index) => {
    setDaycareData(prev => {
      const newStaff = [...prev.staff];
      newStaff.splice(index, 1);
      return { ...prev, staff: newStaff };
    });
  };

  const handleCertificationChange = (index, field, value) => {
    setDaycareData(prev => {
      const newCerts = [...prev.certifications];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
  };

  const addCertification = () => {
    setDaycareData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: '',
          description: ''
        }
      ]
    }));
  };

  const removeCertification = (index) => {
    setDaycareData(prev => {
      const newCerts = [...prev.certifications];
      newCerts.splice(index, 1);
      return { ...prev, certifications: newCerts };
    });
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    console.log('Saving daycare data:', daycareData);
    alert('Daycare information saved successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Daycare Content Management</h1>
          <p className="text-muted-foreground">Manage your daycare listing information</p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your daycare&apos;s basic information that appears in search results and listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Daycare Name</Label>
                <Input
                  id="name"
                  value={daycareData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={daycareData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About Your Daycare</Label>
                <Textarea
                  id="about"
                  rows={5}
                  value={daycareData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={daycareData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={daycareData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={daycareData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={daycareData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={daycareData.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Age Groups</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {daycareData.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={group}
                        onChange={(e) => {
                          const newAgeGroups = [...daycareData.ageGroups];
                          newAgeGroups[index] = e.target.value;
                          handleInputChange('ageGroups', newAgeGroups);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newAgeGroups = [...daycareData.ageGroups];
                          newAgeGroups.splice(index, 1);
                          handleInputChange('ageGroups', newAgeGroups);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleInputChange('ageGroups', [...daycareData.ageGroups, ''])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Age Group
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Tags & Keywords</Label>
                <TagInput 
                  tags={daycareData.tags} 
                  onTagsChange={(tags) => handleInputChange('tags', tags)} 
                />
                <p className="text-sm text-muted-foreground">
                  These tags help parents find your daycare when searching our platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Daycare Images</CardTitle>
              <CardDescription>
                Upload images of your daycare facility. The first image will be used as the main photo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload 
                images={daycareData.images} 
                onImagesChange={(images) => handleInputChange('images', images)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Facilities & Amenities</CardTitle>
              <CardDescription>
                Select the facilities and amenities available at your daycare.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {daycareData.facilities.map((facility, index) => (
                  <FacilityToggle
                    key={index}
                    facility={facility}
                    isEnabled={daycareData.enabledFacilities.includes(facility)}
                    onToggle={handleFacilityToggle}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Information</CardTitle>
              <CardDescription>
                Add information about your staff members to build trust with parents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {daycareData.staff.map((staff, index) => (
                <StaffMemberForm
                  key={index}
                  staff={staff}
                  index={index}
                  onChange={handleStaffChange}
                  onRemove={() => removeStaffMember(index)}
                />
              ))}
              <Button variant="outline" onClick={addStaffMember}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Accreditations</CardTitle>
              <CardDescription>
                Showcase your daycare&apos;s certifications and accreditations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {daycareData.certifications.map((cert, index) => (
                <CertificationForm
                  key={index}
                  certification={cert}
                  index={index}
                  onChange={handleCertificationChange}
                  onRemove={() => removeCertification(index)}
                />
              ))}
              <Button variant="outline" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProvidersContentPage;