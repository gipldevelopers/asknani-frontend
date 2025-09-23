// app/(providers)/components/common/ParentSearchAndSelect.jsx
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

export default function ParentSearchAndSelect({
  onParentSelect,
  selectedParent,
  isChildLoading,
}) {
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newParentForm, setNewParentForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [logData, setLogData] = useState([]);

  const logMessage = (msg) => {
    setLogData((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError(null);
    onParentSelect(null);
    setIsSearching(true);
    logMessage(`Searching for parent with email: "${searchEmail}"...`);

    try {
      const response = await API.get(
        `/provider/parent/search?email=${searchEmail}`
      );
      onParentSelect(response.data);
      logMessage(`Success! Found parent: "${response.data.full_name}".`);
    } catch (err) {
      console.error("Parent search error:", err);
      setSearchError("Parent not found. You can add them now.");
      logMessage(`Error! Parent not found.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateParent = async () => {
    setIsSearching(true);
    setSearchError(null);
    logMessage(
      `Attempting to create new parent: "${newParentForm.full_name}"...`
    );

    try {
      const response = await API.post("/provider/parents", newParentForm);
      onParentSelect(response.data.parent);
      setIsCreateDialogOpen(false);
      setNewParentForm({ full_name: "", email: "", password: "" });
      logMessage(
        `Success! Created parent with ID: "${response.data.parent.id}".`
      );
    } catch (err) {
      console.error("Parent creation error:", err);
      setSearchError(err.response?.data?.message || "Failed to create parent.");
      logMessage(`Error! Failed to create parent.`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewParentFormChange = (e) => {
    const { name, value } = e.target;
    setNewParentForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">Parent Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for an existing parent by email or create a new one.
        </p>

        {!selectedParent ? (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Search parent by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || isChildLoading}
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
              {selectedParent.full_name}
            </span>
            <Button variant="ghost" onClick={() => onParentSelect(null)}>
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
                  Create New Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                {" "}
                {/* Added max-h and overflow here */}
                <DialogHeader>
                  <DialogTitle>Create New Parent Account</DialogTitle>
                  <DialogDescription>
                    The parent does not exist. Please fill in their details to
                    create a new account.
                  </DialogDescription>
                </DialogHeader>
                {/* This div now handles the scrolling for the form content */}
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Full Name"
                    name="full_name"
                    value={newParentForm.full_name}
                    onChange={handleNewParentFormChange}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newParentForm.email}
                    onChange={handleNewParentFormChange}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password (Min. 6 characters)"
                    name="password"
                    value={newParentForm.password}
                    onChange={handleNewParentFormChange}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleCreateParent}
                    disabled={
                      isSearching ||
                      !newParentForm.full_name ||
                      !newParentForm.email ||
                      newParentForm.password.length < 6
                    }
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Parent"
                    )}
                  </Button>
                </DialogFooter>
                {/* Scrollable log data */}
                <div className="h-32 overflow-y-auto border rounded-md p-2 text-sm text-gray-600 mt-4">
                  <h4 className="font-semibold mb-2">Logs:</h4>
                  {logData.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No recent activity.
                    </p>
                  ) : (
                    logData.map((log, index) => <p key={index}>{log}</p>)
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
