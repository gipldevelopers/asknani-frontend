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
import { Star, Search, Filter, ThumbsUp, MessageSquare, Calendar, User, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ManageReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Sample data - in a real app this would come from an API
    const sampleReviews = [
      {
        id: 'R001',
        parentName: 'Rahul Sharma',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul Sharma',
        childName: 'Aarav Sharma',
        rating: 5,
        comment: 'Sunshine Daycare has been wonderful for our son. The staff is caring and the facilities are excellent. Highly recommended!',
        date: '2023-08-10T10:30:00Z',
        status: 'published',
        daycareResponse: 'Thank you for your kind words, Rahul! We love having Aarav in our daycare family.',
        responseDate: '2023-08-10T11:15:00Z',
        helpfulCount: 3,
        reported: false
      },
      {
        id: 'R002',
        parentName: 'Priya Patel',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya Patel',
        childName: 'Ananya Patel',
        rating: 4,
        comment: 'Good daycare with qualified staff. The outdoor play area could use some maintenance, but overall a positive experience.',
        date: '2023-08-05T14:20:00Z',
        status: 'published',
        daycareResponse: 'Thank you for your feedback, Priya. We\'ve noted your comment about the play area and will address it.',
        responseDate: '2023-08-05T15:30:00Z',
        helpfulCount: 1,
        reported: false
      },
      {
        id: 'R003',
        parentName: 'Vikram Singh',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram Singh',
        childName: 'Vihaan Singh',
        rating: 2,
        comment: 'Not satisfied with the hygiene standards. My child fell sick twice after attending this daycare.',
        date: '2023-08-01T09:15:00Z',
        status: 'pending',
        daycareResponse: '',
        responseDate: null,
        helpfulCount: 0,
        reported: true
      },
      {
        id: 'R004',
        parentName: 'Neha Gupta',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Neha Gupta',
        childName: 'Advik Gupta',
        rating: 5,
        comment: 'Excellent daycare! The teachers are amazing and my child has learned so much. The activities are engaging and educational.',
        date: '2023-07-28T11:40:00Z',
        status: 'published',
        daycareResponse: 'We\'re thrilled to hear about Advik\'s progress, Neha! Thank you for sharing your experience.',
        responseDate: '2023-07-28T12:05:00Z',
        helpfulCount: 5,
        reported: false
      },
      {
        id: 'R005',
        parentName: 'Arun Kumar',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Arun Kumar',
        childName: 'Aisha Kumar',
        rating: 3,
        comment: 'Average experience. Some staff members are great but others seem inexperienced. Facilities are good but could be cleaner.',
        date: '2023-07-25T16:25:00Z',
        status: 'published',
        daycareResponse: '',
        responseDate: null,
        helpfulCount: 2,
        reported: false
      },
      {
        id: 'R006',
        parentName: 'Sneha Reddy',
        parentImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Sneha Reddy',
        childName: 'Reyansh Reddy',
        rating: 1,
        comment: 'Very disappointed with the care provided. My child came home with bruises multiple times and no proper explanation was given.',
        date: '2023-07-20T13:10:00Z',
        status: 'rejected',
        daycareResponse: 'We take all concerns seriously. Please contact us directly to discuss this matter further.',
        responseDate: '2023-07-20T14:20:00Z',
        helpfulCount: 0,
        reported: true
      }
    ];

    setReviews(sampleReviews);
    
    // Select the first review by default
    if (sampleReviews.length > 0 && !selectedReview) {
      setSelectedReview(sampleReviews[0]);
      setResponseText(sampleReviews[0].daycareResponse || '');
    }
  },[selectedReview]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && review.status === 'pending') ||
                      (activeTab === 'reported' && review.reported);
    
    return matchesSearch && matchesStatus && matchesRating && matchesTab;
  });

  const stats = {
    total: reviews.length,
    averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    published: reviews.filter(review => review.status === 'published').length,
    pending: reviews.filter(review => review.status === 'pending').length,
    reported: reviews.filter(review => review.reported).length,
    ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
    }))
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
    
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }
  };

  const handleResponseSubmit = () => {
    if (selectedReview && responseText.trim()) {
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? { 
              ...review, 
              daycareResponse: responseText,
              responseDate: new Date().toISOString()
            } 
          : review
      );
      
      setReviews(updatedReviews);
      setSelectedReview(updatedReviews.find(r => r.id === selectedReview.id));
      alert('Response submitted successfully!');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status, reported) => {
    if (reported) {
      return <Badge variant="destructive">Reported</Badge>;
    }
    
    const statusConfig = {
      'published': { variant: 'default', text: 'Published', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'pending': { variant: 'outline', text: 'Pending Review', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      'rejected': { variant: 'destructive', text: 'Rejected', icon: <XCircle className="h-3 w-3 mr-1" /> }
    };
    
    const config = statusConfig[status] || { variant: 'outline', text: status };
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Reviews</h1>
          <p className="text-muted-foreground">Monitor and respond to parent feedback</p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Request Reviews
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All received reviews
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            <div className="flex mt-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting moderation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reported Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reported}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.ratingDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 flex items-center">
                  <span className="text-sm font-medium">{item.rating} star</span>
                </div>
                <div className="flex-1 ml-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-400 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium">{item.count} ({item.percentage.toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reviews..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredReviews.map(review => (
                <div 
                  key={review.id} 
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedReview?.id === review.id ? 'bg-muted' : ''}`}
                  onClick={() => {
                    setSelectedReview(review);
                    setResponseText(review.daycareResponse || '');
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={review.parentImage} />
                        <AvatarFallback>{review.parentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{review.parentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.childName}
                        </div>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(review.status, review.reported)}
                    </div>
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{review.comment}</p>
                </div>
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No reviews found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Detail */}
        <Card className="lg:col-span-2">
          {selectedReview ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Review Details</CardTitle>
                    <CardDescription>
                      Review by {selectedReview.parentName} for {selectedReview.childName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedReview.status, selectedReview.reported)}
                    {selectedReview.reported && (
                      <Badge variant="destructive">Reported</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedReview.parentImage} />
                    <AvatarFallback>{selectedReview.parentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{selectedReview.parentName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Parent of {selectedReview.childName}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedReview.date)}
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <div className="mt-4">
                      <p>{selectedReview.comment}</p>
                    </div>
                    <div className="flex items-center mt-4 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{selectedReview.helpfulCount} people found this helpful</span>
                    </div>
                  </div>
                </div>

                {selectedReview.daycareResponse && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold">Your Response</h4>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedReview.responseDate)}
                      </div>
                    </div>
                    <p className="mt-2">{selectedReview.daycareResponse}</p>
                  </div>
                )}

                <div className="mt-6">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    id="response"
                    placeholder="Type your response to this review..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedReview.status === 'published' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedReview.id, 'published')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                  <Button 
                    variant={selectedReview.status === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedReview.id, 'pending')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Mark Pending
                  </Button>
                  <Button 
                    variant={selectedReview.status === 'rejected' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
                <Button onClick={handleResponseSubmit} disabled={!responseText.trim()}>
                  Submit Response
                </Button>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a review</h3>
              <p className="text-muted-foreground text-center">
                Choose a review from the list to view details and respond
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageReviewsPage;