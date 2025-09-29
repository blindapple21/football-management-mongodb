"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipProvider,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";

export type Player = {
  id: number;
  _id: string;
  name: string;
  position: string;
  photo: string;
};

export type Performance = {
  id: number;
  _id: string;
  playerId: number;
  matchId: number;
  rating: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  passAccuracy: number;
  shotsOnTarget: number;
  tackles: number;
  comments: string;
  created_at?: string;
};

// If you have a matches table, you can fetch it similarly. For now, we'll use static match data.
const staticMatches = [
  {
    id: 1,
    opponent: "Manchester City",
    date: new Date(2025, 2, 5),
    result: "2-1",
    type: "Away",
    competition: "Premier League",
  },
  {
    id: 2,
    opponent: "Liverpool",
    date: new Date(2025, 2, 12),
    result: "0-0",
    type: "Home",
    competition: "Premier League",
  },
  {
    id: 3,
    opponent: "Bayern Munich",
    date: new Date(2025, 2, 15),
    result: "1-3",
    type: "Away",
    competition: "Champions League",
  },
  {
    id: 4,
    opponent: "Arsenal",
    date: new Date(2025, 2, 20),
    result: "2-0",
    type: "Home",
    competition: "Premier League",
  },
  {
    id: 5,
    opponent: "Chelsea",
    date: new Date(2025, 2, 27),
    result: "1-1",
    type: "Away",
    competition: "FA Cup",
  },
];

export default function PerformancePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPerformanceOpen, setIsAddPerformanceOpen] = useState(false);

  // New performance form state
  const [formData, setFormData] = useState({
    playerId: "",
    matchId: "",
    rating: "7.0",
    goals: "0",
    assists: "0",
    minutesPlayed: "90",
    passAccuracy: "80",
    shotsOnTarget: "0",
    tackles: "0",
    comments: "",
  });

  // Fetch players and performance data from backend with token auth
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      // Fetch players
      const playersResponse = await fetch("http://localhost:5000/players", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch performance records
      const performanceResponse = await fetch(
        "http://localhost:5000/performance",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (playersResponse.ok && performanceResponse.ok) {
        const playersData = await playersResponse.json();
        const performanceData = await performanceResponse.json();
        setPlayers(playersData);
        setPerformances(performanceData);
      } else {
        console.error("Failed to fetch players or performance records");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes for the add performance form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleAddPerformance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playerId: parseInt(formData.playerId),
          matchId: parseInt(formData.matchId),
          rating: parseFloat(formData.rating),
          goals: parseInt(formData.goals),
          assists: parseInt(formData.assists),
          minutesPlayed: parseInt(formData.minutesPlayed),
          passAccuracy: parseInt(formData.passAccuracy),
          shotsOnTarget: parseInt(formData.shotsOnTarget),
          tackles: parseInt(formData.tackles),
          comments: formData.comments,
        }),
      });
      if (response.ok) {
        alert("Performance data added successfully!");
        setIsAddPerformanceOpen(false);
        resetForm();
        // Refresh performance data after adding
        fetchData();
      } else {
        console.error("Failed to add performance record");
      }
    } catch (error) {
      console.error("Error adding performance:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      playerId: "",
      matchId: "",
      rating: "7.0",
      goals: "0",
      assists: "0",
      minutesPlayed: "90",
      passAccuracy: "80",
      shotsOnTarget: "0",
      tackles: "0",
      comments: "",
    });
  };

  // Filter players by search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get performance data for a given player
  const getPlayerPerformance = (playerId: string) => {
    return performances.filter((perf) => perf._id === playerId);
  };

  // Get match details from staticMatches
  const getMatch = (matchId: number) => {
    return staticMatches.find((match) => match.id === matchId);
  };

  // Get player details
  const getPlayer = (playerId: string) => {
    return players.find((player) => player._id === playerId);
  };

  // Prepare chart data for a given player
  const preparePlayerChartData = (playerId: string) => {
    const playerPerf = getPlayerPerformance(playerId);
    return playerPerf.map((perf) => {
      const match = getMatch(perf.matchId);
      return {
        match: match?.opponent,
        rating: perf.rating,
        goals: perf.goals,
        assists: perf.assists,
        passAccuracy: perf.passAccuracy,
      };
    });
  };

  // Prepare summary stats for a given player
  const preparePlayerStats = (playerId: string) => {
    const playerPerf = getPlayerPerformance(playerId);
    if (playerPerf.length === 0) return null;
    const totalGoals = playerPerf.reduce((sum, perf) => sum + perf.goals, 0);
    const totalAssists = playerPerf.reduce(
      (sum, perf) => sum + perf.assists,
      0
    );
    const avgRating =
      playerPerf.reduce((sum, perf) => sum + perf.rating, 0) /
      playerPerf.length;
    const avgPassAccuracy =
      playerPerf.reduce((sum, perf) => sum + perf.passAccuracy, 0) /
      playerPerf.length;
    const totalTackles = playerPerf.reduce(
      (sum, perf) => sum + perf.tackles,
      0
    );
    return {
      matches: playerPerf.length,
      goals: totalGoals,
      assists: totalAssists,
      avgRating: avgRating.toFixed(1),
      avgPassAccuracy: avgPassAccuracy.toFixed(1),
      totalTackles,
    };
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Player Performance</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsAddPerformanceOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Performance Record
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>
                Select a player to view performance history
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search players..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {filteredPlayers.map((player) => (
                  <div
                    key={player._id}
                    className={`flex items-center p-2 rounded-lg border hover:bg-accent cursor-pointer ${
                      selectedPlayer === player._id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedPlayer(player._id)}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={player.photo || "/placeholder.svg"}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {player.position}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedPlayer ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="matches">Match History</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                      {getPlayer(selectedPlayer)?.name}'s performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Rating Trend
                        </h3>
                        <div className="h-[300px] w-full">
                          <ChartContainer>
                            <ChartTooltipProvider>
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={preparePlayerChartData(selectedPlayer)}
                                  margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="match" />
                                  <YAxis domain={[0, 10]} />
                                  <Tooltip
                                    content={
                                      <ChartTooltip>
                                        <></>
                                      </ChartTooltip>
                                    }
                                  />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                              <ChartTooltipContent
                                content={({ payload }) => {
                                  if (!payload?.length) return null;
                                  return (
                                    <div>
                                      <div className="font-medium">
                                        {payload[0].payload.match}
                                      </div>
                                      <div>Rating: {payload[0].value}</div>
                                    </div>
                                  );
                                }}
                              />
                            </ChartTooltipProvider>
                          </ChartContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Performance Metrics
                        </h3>
                        <div className="h-[300px] w-full">
                          <ChartContainer>
                            <ChartTooltipProvider>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={preparePlayerChartData(selectedPlayer)}
                                  margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="match" />
                                  <YAxis />
                                  <Tooltip
                                    content={
                                      <ChartTooltip>
                                        <></>
                                      </ChartTooltip>
                                    }
                                  />
                                  <Legend />
                                  <Bar dataKey="goals" fill="#8884d8" />
                                  <Bar dataKey="assists" fill="#82ca9d" />
                                </BarChart>
                              </ResponsiveContainer>
                              <ChartTooltipContent
                                content={({ payload }) => {
                                  if (!payload?.length) return null;
                                  return (
                                    <div>
                                      <div className="font-medium">
                                        {payload[0].payload.match}
                                      </div>
                                      <div>Goals: {payload[0].value}</div>
                                      <div>Assists: {payload[1].value}</div>
                                    </div>
                                  );
                                }}
                              />
                            </ChartTooltipProvider>
                          </ChartContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matches">
                <Card>
                  <CardHeader>
                    <CardTitle>Match History</CardTitle>
                    <CardDescription>
                      {getPlayer(selectedPlayer)?.name}'s performance in recent
                      matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getPlayerPerformance(selectedPlayer).map((perf) => {
                        const match = getMatch(perf.matchId);
                        return (
                          <Card key={perf.matchId} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>vs {match?.opponent}</CardTitle>
                                  <CardDescription>
                                    {match
                                      ? format(match.date, "MMMM d, yyyy")
                                      : ""}{" "}
                                    • {match?.competition}
                                  </CardDescription>
                                </div>
                                <div className="text-lg font-bold">
                                  {match?.result}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {perf.rating}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Rating
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {perf.goals}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Goals
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {perf.assists}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Assists
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {perf.minutesPlayed}'
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Minutes
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-xl font-bold">
                                    {perf.passAccuracy}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Pass Accuracy
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-xl font-bold">
                                    {perf.shotsOnTarget}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Shots on Target
                                  </div>
                                </div>
                                <div className="text-center p-2 bg-muted rounded-lg">
                                  <div className="text-xl font-bold">
                                    {perf.tackles}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Tackles
                                  </div>
                                </div>
                              </div>
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="text-sm font-medium mb-1">
                                  Coach's Comments:
                                </div>
                                <div className="text-sm">{perf.comments}</div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {getPlayerPerformance(selectedPlayer).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No performance data available for this player
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Statistics</CardTitle>
                    <CardDescription>
                      {getPlayer(selectedPlayer)?.name}'s overall statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {preparePlayerStats(selectedPlayer) ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {preparePlayerStats(selectedPlayer)?.matches}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Matches Played
                          </div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {preparePlayerStats(selectedPlayer)?.goals}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Goals
                          </div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {preparePlayerStats(selectedPlayer)?.assists}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Assists
                          </div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {preparePlayerStats(selectedPlayer)?.avgRating}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Average Rating
                          </div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {
                              preparePlayerStats(selectedPlayer)
                                ?.avgPassAccuracy
                            }
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg Pass Accuracy
                          </div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">
                            {preparePlayerStats(selectedPlayer)?.totalTackles}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Tackles
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No statistics available for this player
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  Select a player to view performance data
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Performance Dialog */}
      <Dialog
        open={isAddPerformanceOpen}
        onOpenChange={setIsAddPerformanceOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Performance Record</DialogTitle>
            <DialogDescription>
              Record a player's performance for a specific match
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playerId">Player</Label>
                <Select
                  value={formData.playerId}
                  onValueChange={(value) =>
                    handleSelectChange("playerId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem
                        key={player._id}
                        value={player._id.toString()}
                      >
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchId">Match</Label>
                <Select
                  value={formData.matchId}
                  onValueChange={(value) =>
                    handleSelectChange("matchId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select match" />
                  </SelectTrigger>
                  <SelectContent>
                    {staticMatches.map((match) => (
                      <SelectItem key={match.id} value={match.id.toString()}>
                        {match.opponent} ({format(match.date, "MMM d, yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutesPlayed">Minutes Played</Label>
                <Input
                  id="minutesPlayed"
                  name="minutesPlayed"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.minutesPlayed}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Input
                  id="goals"
                  name="goals"
                  type="number"
                  min="0"
                  value={formData.goals}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Assists</Label>
                <Input
                  id="assists"
                  name="assists"
                  type="number"
                  min="0"
                  value={formData.assists}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passAccuracy">Pass Accuracy (%)</Label>
                <Input
                  id="passAccuracy"
                  name="passAccuracy"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passAccuracy}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shotsOnTarget">Shots on Target</Label>
                <Input
                  id="shotsOnTarget"
                  name="shotsOnTarget"
                  type="number"
                  min="0"
                  value={formData.shotsOnTarget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tackles">Tackles</Label>
                <Input
                  id="tackles"
                  name="tackles"
                  type="number"
                  min="0"
                  value={formData.tackles}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                placeholder="Add performance notes here..."
                value={formData.comments}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddPerformanceOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddPerformance}>Add Performance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
