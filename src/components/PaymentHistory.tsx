import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download, Receipt, CreditCard, Smartphone } from "lucide-react";

interface PaymentHistoryProps {
  userId: string;
}

const mockPayments = [
  {
    id: "PAY-001",
    courseTitle: "Foundation Football Coaching",
    amount: "$89",
    date: "2024-01-15",
    method: "Bank Card",
    status: "completed",
    transactionId: "TXN-123456789"
  },
  {
    id: "PAY-002",
    courseTitle: "Youth Athletics Development",
    amount: "$75",
    date: "2024-01-10",
    method: "M-Pesa",
    status: "completed",
    transactionId: "MPS-987654321"
  },
  {
    id: "PAY-003",
    courseTitle: "Sports Psychology Fundamentals",
    amount: "$120",
    date: "2024-01-05",
    method: "Bank Card",
    status: "completed",
    transactionId: "TXN-456789123"
  }
];

export function PaymentHistory({ userId }: PaymentHistoryProps) {
  const handleDownloadReceipt = (paymentId: string) => {
    // Mock receipt download
    alert(`Downloading receipt for payment ${paymentId}`);
  };

  const getPaymentIcon = (method: string) => {
    if (method.toLowerCase().includes('mpesa')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <CreditCard className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Payment History
        </CardTitle>
        <CardDescription>
          View and manage your course payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mockPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{payment.courseTitle}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Payment ID: {payment.id}</span>
                      <span>•</span>
                      <span>{payment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getPaymentIcon(payment.method)}
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{payment.amount}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(payment.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  Transaction ID: {payment.transactionId}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-2">Payment Methods</h5>
          <p className="text-sm text-muted-foreground mb-3">
            We accept various payment methods for your convenience:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Visa/Mastercard
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              M-Pesa
            </Badge>
            <Badge variant="outline">
              Bank Transfer
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}