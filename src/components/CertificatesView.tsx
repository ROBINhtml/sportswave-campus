import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Award, Download, Calendar, ExternalLink } from "lucide-react";
import { CertificateGenerator } from "./CertificateGenerator";
import { supabase } from "../utils/supabase/client";

interface Certificate {
  id: string;
  courseName: string;
  studentName: string;
  completionDate: string;
  certificateNumber: string;
  generatedAt: string;
  courseId: string;
}

export function CertificatesView() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/server/make-server-35a8e92d/certificates`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShowCertificate(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Award className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Complete courses to earn certificates of completion and showcase your achievements.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Certificates</h2>
          <p className="text-muted-foreground">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b">
              <div className="flex items-start justify-between">
                <Award className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 line-clamp-2">{cert.courseName}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Completed: {new Date(cert.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  Certificate ID: {cert.certificateNumber}
                </div>
              </div>

              <Button
                onClick={() => handleDownloadCertificate(cert)}
                className="w-full"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate Generator Modal */}
      {selectedCertificate && (
        <CertificateGenerator
          isOpen={showCertificate}
          onClose={() => {
            setShowCertificate(false);
            setSelectedCertificate(null);
          }}
          studentName={selectedCertificate.studentName}
          courseName={selectedCertificate.courseName}
          completionDate={selectedCertificate.completionDate}
          courseId={selectedCertificate.courseId}
        />
      )}
    </div>
  );
}