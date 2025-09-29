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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, Save } from "lucide-react";

// Sample formations list
const formations = [
  { value: "4-4-2", label: "4-4-2" },
  { value: "4-3-3", label: "4-3-3" },
  { value: "4-2-3-1", label: "4-2-3-1" },
  { value: "3-5-2", label: "3-5-2" },
  { value: "5-3-2", label: "5-3-2" },
];

// Define formation coordinates.
// Each formation object has keys representing position identifiers and values giving x/y percentages.
// Only four roles are used: goalkeeper, defender, midfielder, and forward.
const positionCoordinates: Record<
  string,
  Record<string, { x: number; y: number }>
> = {
  "4-4-2": {
    goalkeeper: { x: 50, y: 90 },
    defender1: { x: 20, y: 70 },
    defender2: { x: 40, y: 70 },
    defender3: { x: 60, y: 70 },
    defender4: { x: 80, y: 70 },
    midfielder1: { x: 20, y: 50 },
    midfielder2: { x: 40, y: 50 },
    midfielder3: { x: 60, y: 50 },
    midfielder4: { x: 80, y: 50 },
    forward1: { x: 40, y: 30 },
    forward2: { x: 60, y: 30 },
  },
  "4-3-3": {
    goalkeeper: { x: 50, y: 90 },
    defender1: { x: 20, y: 70 },
    defender2: { x: 40, y: 70 },
    defender3: { x: 60, y: 70 },
    defender4: { x: 80, y: 70 },
    midfielder1: { x: 30, y: 50 },
    midfielder2: { x: 50, y: 50 },
    midfielder3: { x: 70, y: 50 },
    forward1: { x: 30, y: 30 },
    forward2: { x: 50, y: 30 },
    forward3: { x: 70, y: 30 },
  },
  "4-2-3-1": {
    goalkeeper: { x: 50, y: 90 },
    defender1: { x: 20, y: 70 },
    defender2: { x: 40, y: 70 },
    defender3: { x: 60, y: 70 },
    defender4: { x: 80, y: 70 },
    midfielder1: { x: 30, y: 60 },
    midfielder2: { x: 70, y: 60 },
    midfielder3: { x: 50, y: 45 }, // Formerly attackingMidfielder, now midfielder
    forward1: { x: 30, y: 30 }, // Formerly winger1, now forward
    forward2: { x: 70, y: 30 }, // Formerly winger2, now forward
    forward3: { x: 50, y: 15 }, // Regular forward
  },
  "3-5-2": {
    goalkeeper: { x: 50, y: 90 },
    defender1: { x: 35, y: 70 },
    defender2: { x: 50, y: 70 },
    defender3: { x: 65, y: 70 },
    midfielder1: { x: 20, y: 50 },
    midfielder2: { x: 35, y: 50 },
    midfielder3: { x: 50, y: 50 },
    midfielder4: { x: 65, y: 50 },
    midfielder5: { x: 80, y: 50 },
    forward1: { x: 40, y: 30 },
    forward2: { x: 60, y: 30 },
  },
  "5-3-2": {
    goalkeeper: { x: 50, y: 90 },
    defender1: { x: 15, y: 70 },
    defender2: { x: 30, y: 70 },
    defender3: { x: 50, y: 70 },
    defender4: { x: 70, y: 70 },
    defender5: { x: 85, y: 70 },
    midfielder1: { x: 30, y: 50 },
    midfielder2: { x: 50, y: 50 },
    midfielder3: { x: 70, y: 50 },
    forward1: { x: 40, y: 30 },
    forward2: { x: 60, y: 30 },
  },
};

export type Player = {
  id: number;
  _id: string;
  name: string;
  age: number;
  nationality: string;
  position: string;
  injured: boolean;
  form: "Excellent" | "Good" | "Average" | "Poor";
  rating: number;
};

// We allow Position to be a string since keys can vary by formation.
type Position = string;

// Initialize an empty lineup for a given formation.
const initializeLineup = (formation: string) => {
  const formationCoords = positionCoordinates[formation];
  if (!formationCoords) {
    console.error(`Formation ${formation} not found in positionCoordinates`);
    return {} as Record<Position, Player | null>;
  }
  const positions = Object.keys(formationCoords) as Position[];
  const emptyLineup: Record<Position, Player | null> = {};
  positions.forEach((pos) => {
    emptyLineup[pos] = null;
  });
  return emptyLineup;
};

// Map a formation position key to a player role.
// Now only four roles are supported: Goalkeeper, Defender, Midfielder, and Forward.
const getRoleFromPositionKey = (pos: string): string => {
  const lower = pos.toLowerCase();
  if (lower.includes("goalkeeper")) return "Goalkeeper";
  if (lower.includes("defender")) return "Defender";
  if (lower.includes("forward")) return "Forward";
  if (lower.includes("midfielder")) return "Midfielder";
  return "";
};

export default function LineupPage() {
  const [formation, setFormation] = useState("4-4-2");
  const [lineup, setLineup] = useState<Record<Position, Player | null>>(() =>
    initializeLineup("4-4-2")
  );
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch players from backend with authentication header.
  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/players", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        console.error("Failed to fetch players");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter out injured players.
  const availablePlayers = players.filter((p) => !p.injured);

  // Reset lineup when formation changes.
  useEffect(() => {
    setLineup(initializeLineup(formation));
    setSelectedPosition(null);
  }, [formation]);

  // A simple form factor map.
  const formFactorMap: Record<string, number> = {
    Excellent: 1.0,
    Good: 0.9,
    Average: 0.8,
    Poor: 0.7,
  };

  const computeScore = (player: Player) => {
    const factor = formFactorMap[player.form] || 0.8;
    return player.rating * factor;
  };

  // Generate optimal lineup based on rating and form.
  // The helper function maps each formation position key to a role, then selects the best available player.
  const generateOptimalLineup = () => {
    const formationCoords = positionCoordinates[formation];
    if (!formationCoords) {
      console.error(`Formation ${formation} not found in positionCoordinates`);
      return;
    }
    const positions = Object.keys(formationCoords) as Position[];
    const newLineup: Record<Position, Player | null> = {};
    const availablePlayersCopy = [...availablePlayers];

    positions.forEach((pos) => {
      const role = getRoleFromPositionKey(pos);
      let bestIdx = -1;
      availablePlayersCopy.forEach((player, idx) => {
        if (player.position === role) {
          if (
            bestIdx === -1 ||
            computeScore(player) > computeScore(availablePlayersCopy[bestIdx])
          ) {
            bestIdx = idx;
          }
        }
      });
      if (bestIdx !== -1) {
        newLineup[pos] = availablePlayersCopy[bestIdx];
        availablePlayersCopy.splice(bestIdx, 1);
      } else {
        newLineup[pos] = null;
      }
    });
    setLineup(newLineup);
  };

  const handleFormationChange = (value: string) => {
    setFormation(value);
  };

  const handlePositionClick = (position: Position) => {
    setSelectedPosition(position);
  };

  const handlePlayerSelect = (playerId: string) => {
    if (!selectedPosition) return;
    const player =
      availablePlayers.find((p) => p._id.toString() === playerId) || null;
    const updatedLineup = { ...lineup };
    // Remove player from any position they might currently occupy.
    Object.keys(updatedLineup).forEach((pos) => {
      if (updatedLineup[pos]?._id.toString() === playerId) {
        updatedLineup[pos] = null;
      }
    });
    updatedLineup[selectedPosition] = player;
    setLineup(updatedLineup);
  };

  const resetLineup = () => {
    setLineup(initializeLineup(formation));
  };

  const saveLineup = () => {
    alert("Lineup saved successfully!");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Team Lineup</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetLineup}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={saveLineup}>
            <Save className="mr-2 h-4 w-4" /> Save Lineup
          </Button>
          <Button variant="secondary" onClick={generateOptimalLineup}>
            Generate Optimal Lineup
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Formation</CardTitle>
                <Select value={formation} onValueChange={handleFormationChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formations.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Click on a position to select a player
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="relative w-full h-[500px] bg-green-700 rounded-lg overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "10% 10%",
                }}
              >
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                {/* Center line */}
                <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white/30 -translate-x-1/2"></div>
                {/* Penalty areas */}
                <div className="absolute top-[15%] left-1/2 w-[200px] h-[80px] border-2 border-white/30 -translate-x-1/2"></div>
                <div className="absolute bottom-[15%] left-1/2 w-[200px] h-[80px] border-2 border-white/30 -translate-x-1/2"></div>
                {/* Goal areas */}
                <div className="absolute top-0 left-1/2 w-[100px] h-[20px] border-b-2 border-l-2 border-r-2 border-white/30 -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-[100px] h-[20px] border-t-2 border-l-2 border-r-2 border-white/30 -translate-x-1/2"></div>
                {/* Render player positions */}
                {positionCoordinates[formation] ? (
                  Object.entries(positionCoordinates[formation]).map(
                    ([pos, coords]) => (
                      <div
                        key={pos}
                        className={`absolute cursor-pointer transition-all duration-300 ${
                          selectedPosition === pos ? "scale-110" : ""
                        }`}
                        style={{
                          left: `${coords.x}%`,
                          top: `${coords.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => handlePositionClick(pos)}
                      >
                        <div
                          className={`flex flex-col items-center justify-center ${
                            selectedPosition === pos
                              ? "ring-2 ring-yellow-300"
                              : ""
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                            {lineup[pos] ? (
                              <div className="relative w-full h-full">
                                <span className="text-white font-bold">
                                  {lineup[pos]?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            ) : (
                              <span className="text-white font-bold">
                                {pos}
                              </span>
                            )}
                          </div>
                          <div className="text-white text-xs font-medium bg-black/50 px-1 rounded">
                            {lineup[pos]?.name?.split(" ")[0] || pos}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-white p-4">
                    Formation data not available.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="secondary"
                onClick={generateOptimalLineup}
              >
                Generate Optimal Lineup
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {selectedPosition
                  ? `Select Player for ${selectedPosition}`
                  : "Available Players"}
              </CardTitle>
              <CardDescription>
                {selectedPosition
                  ? `Choose a player for the ${selectedPosition} position`
                  : "Players not in the current lineup"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {loading ? (
                <p>Loading players...</p>
              ) : (
                availablePlayers.map((player) => {
                  // Check if the player is already in the lineup.
                  const isInLineup = Object.values(lineup).some(
                    (p) => p?._id === player._id
                  );
                  return (
                    <div
                      key={player._id}
                      className={`flex items-center p-2 rounded-lg border ${
                        isInLineup
                          ? "bg-muted"
                          : "hover:bg-accent cursor-pointer"
                      } ${player.injured ? "opacity-50" : ""}`}
                      onClick={() =>
                        !player.injured &&
                        handlePlayerSelect(player._id.toString())
                      }
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-300 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm font-bold">
                            {player.rating}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{player.nationality}</span>
                          {player.injured && (
                            <>
                              <span className="mx-1">•</span>
                              <Badge
                                variant="destructive"
                                className="text-[10px] py-0 h-4"
                              >
                                <AlertCircle className="h-2 w-2 mr-1" /> Injured
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
