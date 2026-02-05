// Placeholder component - Course Material Manager
// This component will be implemented with backend integration

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  user: any;
  courseId: string;
};

type Material = {
  id: string;
  course_id: string;
  title: string;
  type: "pdf" | "video";
  file_path: string;
  created_at: string;
};

export function CourseMaterialManager({ user, courseId }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  const [pdfTitle, setPdfTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  const canUpload = useMemo(() => {
    return !!user?.id && !!courseId;
  }, [user?.id, courseId]);

  const loadMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_materials")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (!error && data) setMaterials(data as Material[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!courseId) return;
    loadMaterials();
  }, [courseId]);

  const uploadToBucket = async (bucket: string, file: File) => {
    if (!user?.id) throw new Error("Not logged in");

    const ext = file.name.split(".").pop();
    const path = `${courseId}/${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    if (uploadError) throw uploadError;

    return path;
  };

  const saveMaterialRow = async (payload: {
    title: string;
    type: "pdf" | "video";
    file_path: string;
  }) => {
    const { error } = await supabase.from("course_materials").insert({
      course_id: courseId,
      title: payload.title,
      type: payload.type,
      file_path: payload.file_path,
      uploaded_by: user?.id,
    });

    if (error) throw error;
  };

  const handleUploadPdf = async (file?: File | null) => {
    if (!file) return;
    if (!pdfTitle.trim()) return alert("Please enter a PDF title first.");

    try {
      setLoading(true);
      const file_path = await uploadToBucket("course-pdfs", file);
      await saveMaterialRow({ title: pdfTitle.trim(), type: "pdf", file_path });
      setPdfTitle("");
      await loadMaterials();
      alert("PDF uploaded successfully ✅");
    } catch (e: any) {
      alert(e.message ?? "PDF upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVideo = async (file?: File | null) => {
    if (!file) return;
    if (!videoTitle.trim()) return alert("Please enter a video title first.");

    try {
      setLoading(true);
      const file_path = await uploadToBucket("course-videos", file);
      await saveMaterialRow({ title: videoTitle.trim(), type: "video", file_path });
      setVideoTitle("");
      await loadMaterials();
      alert("Video uploaded successfully ✅");
    } catch (e: any) {
      alert(e.message ?? "Video upload failed");
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (mat: Material) => {
    const bucket = mat.type === "pdf" ? "course-pdfs" : "course-videos";
    return supabase.storage.from(bucket).getPublicUrl(mat.file_path).data.publicUrl;
  };

  return (
    <div className="space-y-6">
      {/* Upload PDF */}
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>PDF Title</Label>
            <Input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} placeholder="e.g. Week 1 Notes" />
          </div>

          <div className="space-y-2">
            <Label>Select PDF</Label>
            <input
              type="file"
              accept="application/pdf"
              disabled={!canUpload || loading}
              onChange={(e) => handleUploadPdf(e.target.files?.[0])}
            />
          </div>

          {!canUpload && (
            <p className="text-sm text-red-600">
              You must be logged in and have a course selected to upload.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upload Video */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Video Title</Label>
            <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="e.g. Lesson 1 Demo" />
          </div>

          <div className="space-y-2">
            <Label>Select Video</Label>
            <input
              type="file"
              accept="video/*"
              disabled={!canUpload || loading}
              onChange={(e) => handleUploadVideo(e.target.files?.[0])}
            />
          </div>
        </CardContent>
      </Card>

      {/* List materials */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p>Loading...</p>
          ) : materials.length === 0 ? (
            <p className="text-muted-foreground">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {materials.map((m) => (
                <div key={m.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.type.toUpperCase()}</p>
                  </div>
                  <a
                    className="text-sm underline"
                    href={getPublicUrl(m)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
