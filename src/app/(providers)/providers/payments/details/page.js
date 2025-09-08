"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Lock, Shield } from 'lucide-react';



const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Sample booking data - in a real app this would come from props or state management
  const bookingDetails = {
    daycareName: "Sunshine Daycare Center",
    address: "123 Main St, San Francisco, CA",
    bookingDates: "Mon, Aug 15 - Fri, Aug 19, 2023",
    childName: "Emma Johnson",
    ageGroup: "Toddler (2-3 years)",
    basePrice: 325,
    serviceFee: 32.50,
    totalAmount: 357.50
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment processing here
    console.log('Processing payment with:', { paymentMethod, cardDetails });
    // In a real app, you would integrate with your payment gateway here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{bookingDetails.daycareName}</h3>
                <p className="text-sm text-muted-foreground">{bookingDetails.address}</p>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {bookingDetails.bookingDates}
              </div>
              
              <div>
                <p className="font-medium">{bookingDetails.childName}</p>
                <Badge variant="outline">{bookingDetails.ageGroup}</Badge>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Base Price (5 days)</span>
                  <span>${bookingDetails.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${bookingDetails.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${bookingDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure. We do not store your card details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment method to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                  <Label
                    htmlFor="paypal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <svg className="mb-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M7.2 18c-.3 0-.6 0-.7-.2l-1.9-5.6h-.6v-.3l.3-1.1.3-.5h3.2c.3 0 .5.2.6.4l1.4 4.2c.1.3 0 .6-.2.8-.2.2-.5.2-.8.2h-1.6zm-.3-.7h1.3c.2 0 .3-.1.3-.3l-1.1-3.4c0-.2-.1-.3-.3-.3h-1.9l1.7 4c0 .2.1.3.3.3h-.1zm5.8.7c-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.2-.8l1.9-6.7h-1.6c-.3 0-.6-.1-.7-.3-.2-.2-.3-.5-.2-.8l.4-1.4c.1-.3.4-.5.7-.5h4.8c.3 0 .6.2.6.5l-.4 1.4c-.1.3-.4.5-.7.5h-3.2l-1.3 4.5 1.1-.4c.3-.1.6 0 .8.2.2.2.3.5.2.8l-.4 1.4c-.1.3-.4.5-.7.5h-1.4zm5.5-6.8h-2.1c-.3 0-.6-.2-.7-.4l-.4-1.4c-.1-.3.1-.6.4-.7.3-.1.6.1.7.4l.2.7h1.9c.3 0 .6.2.6.5l-.4 1.4c0 .3-.3.5-.6.5zm-1.2 6.8c-.3 0-.6-.2-.6-.5l.4-1.4c.1-.3.4-.5.7-.5h1.6l.2-.7c.1-.3.4-.4.7-.4.3.1.5.4.4.7l-.4 1.4c-.1.3-.4.4-.7.4h-2.3z" fill="#0070BA"/>
                    </svg>
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="name"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">Security Code (CVV)</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6" size="lg">
                    <Lock className="mr-2 h-4 w-4" /> Pay ${bookingDetails.totalAmount.toFixed(2)}
                  </Button>
                </form>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
                    Continue to PayPal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 24 hours before the booking start time. 
                Cancellations within 24 hours will be charged 50% of the booking fee. 
                No-shows will be charged the full amount.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;