import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Award, Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import certificateTemplate from "figma:asset/0e21bec48a19afc6374d3493cf72a24036bb036d.png";
import { supabase } from "../utils/supabase/client";

interface CertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate: string;
  courseId: string;
}

export function CertificateGenerator({
  isOpen,
  onClose,
  studentName,
  courseName,
  completionDate,
  courseId,
}: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    setIsGenerating(true);
    try {
      // First, save certificate to backend
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/server/make-server-35a8e92d/generate-certificate`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                courseId,
                courseName,
                completionDate,
              }),
            }
          );

          if (!response.ok) {
            console.warn('Failed to save certificate to backend');
          }
        } catch (backendError) {
          console.warn('Backend certificate save error:', backendError);
          // Continue with PDF generation even if backend save fails
        }
      }

      // Generate PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Load the certificate template image
      const img = new Image();
      img.src = certificateTemplate;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Add the template as background
      pdf.addImage(img, "PNG", 0, 0, 297, 210);

      // Add student name - positioned on the line in the certificate
      pdf.setFont("times", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(0, 0, 0);
      
      // Center the student name (positioned where the line is on the template)
      const nameWidth = pdf.getTextWidth(studentName);
      const nameX = (297 - nameWidth) / 2;
      pdf.text(studentName, nameX, 92);

      // Add course name in the description area
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(40, 40, 40);
      
      const courseText = `${courseName}`;
      const courseWidth = pdf.getTextWidth(courseText);
      const courseX = (297 - courseWidth) / 2;
      pdf.text(courseText, courseX, 120);

      // Add completion date
      const dateText = `Completed on ${new Date(completionDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;
      const dateWidth = pdf.getTextWidth(dateText);
      const dateX = (297 - dateWidth) / 2;
      pdf.text(dateText, dateX, 127);

      // Add certificate ID for verification (bottom left)
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 120);
      const certId = `Certificate ID: SW-${courseId}-${Date.now()}`;
      pdf.text(certId, 10, 205);

      // Save the PDF
      const fileName = `Sportswave_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      // Show success message
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating certificate:", error);
      setIsGenerating(false);
      alert("Failed to generate certificate. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription>
            You have successfully completed the course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-primary/20">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
                <Award className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-primary">Certificate of Completion</h3>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">This certifies that</p>
                <p className="text-3xl font-bold text-gray-900">{studentName}</p>
                <p className="text-sm text-muted-foreground">has successfully completed</p>
                <p className="text-xl font-semibold text-gray-800">{courseName}</p>
                <p className="text-sm text-muted-foreground">
                  on {new Date(completionDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-xs text-muted-foreground">
                  Sportswave Foundation - Empowering Sports Coaches Across Africa
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={generateCertificate}
              disabled={isGenerating}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Download Certificate"}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your certificate will be saved as a PDF file with the Sportswave Foundation branding.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}