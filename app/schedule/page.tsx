"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Type for a fixture (schedule)
export type Fixture = {
  id: number;
  _id?: string;
  opponent: string;
  competition: string;
  date: Date;
  time: string;
  location: string;
  type: string;
};

// Instead of using local initialFixtures, we'll fetch data from the backend.
export default function SchedulePage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isAddFixtureOpen, setIsAddFixtureOpen] = useState(false);
  const [currentFixture, setCurrentFixture] = useState<Fixture | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // New fixture form state
  const [formData, setFormData] = useState({
    opponent: "",
    competition: "",
    date: new Date(),
    time: "",
    location: "",
    type: "Home",
  });

  // Helper function to return authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch fixtures from backend
  const fetchFixtures = async () => {
    try {
      const response = await fetch("http://localhost:5000/schedules", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        // Convert date strings into Date objects
        const fixturesWithDates = data.map((f: any) => ({
          ...f,
          date: new Date(f.match_date),
        }));
        setFixtures(fixturesWithDates);
      } else {
        console.error("Failed to fetch fixtures");
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setFormData({
        ...formData,
        date: selectedDate,
      });
    }
  };

  const handleAddFixture = async () => {
    try {
      const response = await fetch("http://localhost:5000/schedules", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          opponent: formData.opponent,
          competition: formData.competition,
          match_date: formData.date, // ensure backend accepts a valid date/time string
          time: formData.time,
          location: formData.location,
          type: formData.type,
        }),
      });
      if (response.ok) {
        await fetchFixtures();
        setIsAddFixtureOpen(false);
        resetForm();
      } else {
        console.error("Failed to add fixture");
      }
    } catch (error) {
      console.error("Error adding fixture:", error);
    }
  };

  const handleEditFixture = (fixture: Fixture) => {
    setCurrentFixture(fixture);
    setFormData({
      opponent: fixture.opponent,
      competition: fixture.competition,
      date: fixture.date,
      time: fixture.time,
      location: fixture.location,
      type: fixture.type,
    });
    setIsAddFixtureOpen(true);
  };

  const handleUpdateFixture = async () => {
    if (!currentFixture) return;
    try {
      const response = await fetch(
        `http://localhost:5000/schedules/${currentFixture._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            opponent: formData.opponent,
            competition: formData.competition,
            match_date: formData.date,
            time: formData.time,
            location: formData.location,
            type: formData.type,
          }),
        }
      );
      if (response.ok) {
        await fetchFixtures();
        setIsAddFixtureOpen(false);
        setCurrentFixture(null);
        resetForm();
      } else {
        console.error("Failed to update fixture");
      }
    } catch (error) {
      console.error("Error updating fixture:", error);
    }
  };

  const confirmDeleteFixture = (fixture: Fixture) => {
    setCurrentFixture(fixture);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFixture = async () => {
    if (!currentFixture) return;
    try {
      const response = await fetch(
        `http://localhost:5000/schedules/${currentFixture._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        await fetchFixtures();
        setIsDeleteDialogOpen(false);
        setCurrentFixture(null);
      } else {
        console.error("Failed to delete fixture");
      }
    } catch (error) {
      console.error("Error deleting fixture:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      opponent: "",
      competition: "",
      date: new Date(),
      time: "",
      location: "",
      type: "Home",
    });
  };

  // Sort fixtures by date
  const sortedFixtures = [...fixtures].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Group fixtures by month
  const fixturesByMonth: Record<string, Fixture[]> = {};
  sortedFixtures.forEach((fixture) => {
    const monthYear = format(fixture.date, "MMMM yyyy");
    if (!fixturesByMonth[monthYear]) {
      fixturesByMonth[monthYear] = [];
    }
    fixturesByMonth[monthYear].push(fixture);
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Schedule & Fixtures</h1>
        <Button
          onClick={() => {
            setCurrentFixture(null);
            resetForm();
            setIsAddFixtureOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Fixture
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {Object.entries(fixturesByMonth).map(([monthYear, monthFixtures]) => (
            <div key={monthYear} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{monthYear}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthFixtures.map((fixture) => (
                  <Card
                    key={fixture._id}
                    className={cn(
                      "overflow-hidden",
                      fixture.type === "Home"
                        ? "border-l-4 border-l-green-500"
                        : "border-l-4 border-l-blue-500"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{fixture.opponent}</CardTitle>
                          <CardDescription>
                            {fixture.competition}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditFixture(fixture)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteFixture(fixture)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(fixture.date, "EEEE, MMMM do, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{fixture.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{fixture.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="calendar">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-[350px]">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Select a date to view fixtures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {formData.date
                      ? format(formData.date, "EEEE, MMMM do, yyyy")
                      : "All Upcoming Fixtures"}
                  </CardTitle>
                  <CardDescription>
                    {formData.date
                      ? "Fixtures for selected date"
                      : "Select a date to filter fixtures"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedFixtures
                      .filter(
                        (fixture) =>
                          !formData.date ||
                          (fixture.date.getDate() === formData.date.getDate() &&
                            fixture.date.getMonth() ===
                              formData.date.getMonth() &&
                            fixture.date.getFullYear() ===
                              formData.date.getFullYear())
                      )
                      .map((fixture) => (
                        <div
                          key={fixture._id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {fixture.opponent}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {fixture.competition}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span>
                                {format(fixture.date, "MMM do")} •{" "}
                                {fixture.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                fixture.type === "Home"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              )}
                            >
                              {fixture.type}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditFixture(fixture)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {sortedFixtures.filter(
                      (fixture) =>
                        !formData.date ||
                        (fixture.date.getDate() === formData.date.getDate() &&
                          fixture.date.getMonth() ===
                            formData.date.getMonth() &&
                          fixture.date.getFullYear() ===
                            formData.date.getFullYear())
                    ).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No fixtures found for this date
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Fixture Dialog */}
      <Dialog open={isAddFixtureOpen} onOpenChange={setIsAddFixtureOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentFixture ? "Edit Fixture" : "Add New Fixture"}
            </DialogTitle>
            <DialogDescription>
              {currentFixture
                ? "Update fixture information"
                : "Fill in the details to add a new fixture"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opponent">Opponent</Label>
                <Input
                  id="opponent"
                  name="opponent"
                  value={formData.opponent}
                  onChange={handleInputChange}
                  placeholder="Team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competition">Competition</Label>
                <Input
                  id="competition"
                  name="competition"
                  value={formData.competition}
                  onChange={handleInputChange}
                  placeholder="League/Cup name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="e.g. 15:00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Stadium name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Match Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="home"
                      name="type"
                      value="Home"
                      checked={formData.type === "Home"}
                      onChange={() => handleSelectChange("type", "Home")}
                      className="mr-2"
                    />
                    <Label htmlFor="home">Home</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="away"
                      name="type"
                      value="Away"
                      checked={formData.type === "Away"}
                      onChange={() => handleSelectChange("type", "Away")}
                      className="mr-2"
                    />
                    <Label htmlFor="away">Away</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddFixtureOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={currentFixture ? handleUpdateFixture : handleAddFixture}
            >
              {currentFixture ? "Update Fixture" : "Add Fixture"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the fixture against{" "}
              {currentFixture?.opponent}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFixture}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
