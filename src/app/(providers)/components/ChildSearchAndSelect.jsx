// app/(providers)/components/common/ChildSearchAndSelect.jsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Search, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import API from "@/lib/api";

export default function ChildSearchAndSelect({
  onChildSelect,
  selectedChild,
  isFormLoading,
  guardianId,
}) {
  const [searchName, setSearchName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChildForm, setNewChildForm] = useState({
    full_name: "",
    dob: "",
    gender: "male", // Default value
    allergies: "",
    special_needs: "",
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    onChildSelect(null);
    setIsSearching(true);

    try {
      const response = await API.get(
        `/child/search?full_name=${searchName}&guardian_id=${guardianId}`
      );
      onChildSelect(response.data);
    } catch (err) {
      console.error("Child search error:", err);
      setSearchError("Child not found. You can add them now.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateChild = async () => {
    setIsSearching(true);
    setSearchError(null);

    if (!guardianId) {
      alert("Please select a guardian first.");
      setIsSearching(false);
      return;
    }

    try {
      const response = await API.post(`/provider/parents/${guardianId}/children`, {
        ...newChildForm,
        parent_id: guardianId,
      });
      onChildSelect(response.data.child);
      setIsCreateDialogOpen(false);
      setNewChildForm({
        full_name: "",
        dob: "",
        gender: "male",
        allergies: "",
        special_needs: "",
      });
    } catch (err) {
      console.error("Child creation error:", err);
      setSearchError(err.response?.data?.message || "Failed to create child.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewChildFormChange = (e) => {
    const { name, value } = e.target;
    setNewChildForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">Child Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for an existing child or create a new one.
        </p>

        {!selectedChild ? (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search child by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || isFormLoading}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-lg">
              {selectedChild.full_name}
            </span>
            <Button variant="ghost" onClick={() => onChildSelect(null)}>
              Change
            </Button>
          </div>
        )}

        {searchError && (
          <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{searchError}</span>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 text-sm h-auto"
                  disabled={isSearching}
                >
                  Create New Child
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Child Record</DialogTitle>
                  <DialogDescription>
                    Fill in the child's details to create a new record.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Full Name"
                    name="full_name"
                    value={newChildForm.full_name}
                    onChange={handleNewChildFormChange}
                    required
                  />
                  <Input
                    type="date"
                    name="dob"
                    value={newChildForm.dob}
                    onChange={handleNewChildFormChange}
                    required
                  />
                  <Input
                    placeholder="Allergies (e.g., Peanuts, Dairy)"
                    name="allergies"
                    value={newChildForm.allergies}
                    onChange={handleNewChildFormChange}
                  />
                  <Input
                    placeholder="Special Needs"
                    name="special_needs"
                    value={newChildForm.special_needs}
                    onChange={handleNewChildFormChange}
                  />
                  {/* Add a select for gender */}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleCreateChild}
                    disabled={
                      isSearching ||
                      !newChildForm.full_name ||
                      !newChildForm.dob
                    }
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Child"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
