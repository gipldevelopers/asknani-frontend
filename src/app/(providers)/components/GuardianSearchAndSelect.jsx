// app/(providers)/components/common/GuardianSearchAndSelect.jsx
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

export default function GuardianSearchAndSelect({
  onGuardianSelect,
  selectedGuardian,
  isFormLoading,
}) {
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGuardianForm, setNewGuardianForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    onGuardianSelect(null);
    setIsSearching(true);

    try {
      const response = await API.get(
        `/provider/parent/search?email=${searchEmail}`
      );
      onGuardianSelect(response.data);
    } catch (err) {
      console.error("Guardian search error:", err);
      setSearchError("Guardian not found. You can add them now.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateGuardian = async () => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await API.post("/guardians", newGuardianForm);
      onGuardianSelect(response.data.guardian);
      setIsCreateDialogOpen(false);
      setNewGuardianForm({ full_name: "", email: "", password: "" });
    } catch (err) {
      console.error("Guardian creation error:", err);
      setSearchError(
        err.response?.data?.message || "Failed to create guardian."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewGuardianFormChange = (e) => {
    const { name, value } = e.target;
    setNewGuardianForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">Guardian Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for an existing guardian by email or create a new one.
        </p>

        {!selectedGuardian ? (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Search guardian by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
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
              {selectedGuardian.full_name}
            </span>
            <Button variant="ghost" onClick={() => onGuardianSelect(null)}>
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
                  Create New Guardian
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Guardian Account</DialogTitle>
                  <DialogDescription>
                    The guardian does not exist. Please fill in their details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Full Name"
                    name="full_name"
                    value={newGuardianForm.full_name}
                    onChange={handleNewGuardianFormChange}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newGuardianForm.email}
                    onChange={handleNewGuardianFormChange}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password (Min. 6 characters)"
                    name="password"
                    value={newGuardianForm.password}
                    onChange={handleNewGuardianFormChange}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleCreateGuardian}
                    disabled={
                      isSearching ||
                      !newGuardianForm.full_name ||
                      !newGuardianForm.email ||
                      newGuardianForm.password.length < 6
                    }
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Guardian"
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
