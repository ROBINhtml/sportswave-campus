import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CreditCard, 
  Smartphone, 
  Lock, 
  CheckCircle, 
  X, 
  Shield,
  AlertCircle,
  Loader2
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    instructor: string;
    price: string;
    image: string;
  };
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, course, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: "",
    mpesaPin: "",
  });

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
    
    // Auto close and trigger success after showing completion
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
      setPaymentComplete(false);
    }, 2000);
  };

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate M-Pesa STK push
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
    
    // Auto close and trigger success after showing completion
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
      setPaymentComplete(false);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Complete your enrollment for this course
          </CardDescription>
        </CardHeader>

        <CardContent>
          {paymentComplete ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Welcome to {course.title}! You can now access all course materials.
              </p>
              <Badge variant="default" className="bg-green-500">
                Enrollment Confirmed
              </Badge>
            </div>
          ) : (
            <>
              {/* Course Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{course.price}</p>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Bank Card
                  </TabsTrigger>
                  <TabsTrigger value="mpesa" className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    M-Pesa
                  </TabsTrigger>
                </TabsList>

                {/* Bank Card Payment */}
                <TabsContent value="card" className="space-y-4">
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({
                            ...cardData,
                            cardNumber: formatCardNumber(e.target.value)
                          })}
                          maxLength={19}
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="flex space-x-1">
                            <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                            <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({
                            ...cardData,
                            expiryDate: e.target.value
                          })}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({
                            ...cardData,
                            cvv: e.target.value
                          })}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        type="text"
                        placeholder="John Doe"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({
                          ...cardData,
                          cardName: e.target.value
                        })}
                        required
                      />
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                      </AlertDescription>
                    </Alert>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total: {course.price}</span>
                      <Button 
                        type="submit" 
                        disabled={isProcessing}
                        className="min-w-32"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Pay Now
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* M-Pesa Payment */}
                <TabsContent value="mpesa" className="space-y-4">
                  <form onSubmit={handleMpesaPayment} className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-800">M-Pesa Payment</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Pay securely using your M-Pesa mobile wallet
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                      <div className="relative">
                        <Select defaultValue="+254">
                          <SelectTrigger className="w-20 absolute left-0 top-0 h-full border-r-0 rounded-r-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+254">🇰🇪 +254</SelectItem>
                            <SelectItem value="+255">🇹🇿 +255</SelectItem>
                            <SelectItem value="+256">🇺🇬 +256</SelectItem>
                            <SelectItem value="+250">🇷🇼 +250</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="mpesaPhone"
                          type="tel"
                          placeholder="712 345 678"
                          className="pl-24"
                          value={mpesaData.phoneNumber}
                          onChange={(e) => setMpesaData({
                            ...mpesaData,
                            phoneNumber: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You will receive an STK push notification on your phone to complete the payment.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Payment Instructions:</h5>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        <li>1. Click "Pay with M-Pesa" button below</li>
                        <li>2. Check your phone for STK push notification</li>
                        <li>3. Enter your M-Pesa PIN to complete payment</li>
                        <li>4. You'll receive confirmation via SMS</li>
                      </ol>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total: {course.price}</span>
                      <Button 
                        type="submit" 
                        disabled={isProcessing}
                        className="min-w-32"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Waiting for PIN...
                          </>
                        ) : (
                          <>
                            <Smartphone className="h-4 w-4 mr-2" />
                            Pay with M-Pesa
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Security Notice */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                <Shield className="h-3 w-3 inline mr-1" />
                Secured by SSL encryption • Your data is protected
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}