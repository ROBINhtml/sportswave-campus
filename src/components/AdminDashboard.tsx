import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type ApplicationRow = {
    id: string;
    user_id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    status: "pending" | "approved" | "rejected";
    created_at?: string | null;
  };

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPending = async () => {
    setLoading(true);
    setError(null);
  
    const { data, error } = await supabase
      .from("instructor_applications")
      .select("id,user_id,full_name,email,phone,status,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
  
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data as ApplicationRow[]) || []);
    }
  
    setLoading(false);
  };
  useEffect(() => {
    loadPending();
  }, []);

  const approve = async (userId: string) => {
    // mark application approved
    const { error: appErr } = await supabase
      .from("instructor_applications")
      .update({ status: "approved" })
      .eq("user_id", userId);
  
    if (appErr) return alert("Approve failed: " + appErr.message);
  
    // update profile to instructor
    const { error: profErr } = await supabase
      .from("profiles")
      .update({
        role: "instructor",
        instructor_application_status: "approved",
        is_instructor_approved: true,
        instructor_approved_at: new Date().toISOString(),
      })
      .eq("id", userId);
  
    if (profErr) return alert("Profile update failed: " + profErr.message);
  
    await loadPending();
  };
  
  const reject = async (userId: string) => {
    const { error: appErr } = await supabase
      .from("instructor_applications")
      .update({ status: "rejected" })
      .eq("user_id", userId);
  
    if (appErr) return alert("Reject failed: " + appErr.message);
  
    const { error: profErr } = await supabase
      .from("profiles")
      .update({
        instructor_application_status: "rejected",
        is_instructor_approved: false,
      })
      .eq("id", userId);
  
    if (profErr) return alert("Profile update failed: " + profErr.message);
  
    await loadPending();
  };
  

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Instructor Applications</CardTitle>
            <Button variant="outline" onClick={loadPending} disabled={loading}>
              Refresh
            </Button>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="p-3 mb-4 rounded border text-red-600 bg-red-50">
                {error}
              </div>
            )}

            {loading ? (
              <p>Loading applications...</p>
            ) : rows.length === 0 ? (
              <p className="text-muted-foreground">No pending applications.</p>
            ) : (
              <div className="space-y-3">
                {rows.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {p.full_name || "(No name)"}
                        </p>
                        <Badge variant="secondary">
                          {p.status || "pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {p.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        current role: {p.role || "student"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                    <Button onClick={() => approve(p.user_id)}>Approve</Button>
<Button variant="destructive" onClick={() => reject(p.user_id)}>Reject</Button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
