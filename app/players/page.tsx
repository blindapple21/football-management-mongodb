"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";

// Define a type for a Player
export type Player = {
  id: number;
  _id?: string;
  name: string;
  age: number;
  nationality: string;
  position: string;
  photo: string;
  injured: boolean;
  form: string;
  rating: number;
  Matches: number;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // New player form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    nationality: "",
    position: "Forward",
    injured: "no",
    form: "Average",
    rating: "75",
  });

  // Fetch players from backend when component mounts
  useEffect(() => {
    fetchPlayers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5000/players", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        console.error("Failed to fetch players");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = async () => {
    const newPlayerData = {
      name: formData.name,
      age: Number.parseInt(formData.age),
      nationality: formData.nationality,
      position: formData.position,
      photo: "/placeholder.svg?height=100&width=100",
      injured: formData.injured === "yes",
      form: formData.form,
      rating: Number.parseInt(formData.rating),
    };

    try {
      const response = await fetch("http://localhost:5000/players", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newPlayerData),
      });
      if (response.ok) {
        await fetchPlayers();
        setIsAddPlayerOpen(false);
        resetForm();
      } else {
        console.error("Failed to add player");
      }
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setCurrentPlayer(player);
    setFormData({
      name: player.name,
      age: player.age.toString(),
      nationality: player.nationality,
      position: player.position,
      injured: player.injured ? "yes" : "no",
      form: player.form,
      rating: player.rating.toString(),
    });
    setIsAddPlayerOpen(true);
  };

  const handleUpdatePlayer = async () => {
    if (!currentPlayer) return;

    const updatedData = {
      name: formData.name,
      age: Number.parseInt(formData.age),
      nationality: formData.nationality,
      position: formData.position,
      injured: formData.injured === "yes",
      form: formData.form,
      rating: Number.parseInt(formData.rating),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/players/${currentPlayer._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedData),
        }
      );
      if (response.ok) {
        await fetchPlayers();
        setIsAddPlayerOpen(false);
        setCurrentPlayer(null);
        resetForm();
      } else {
        console.error("Failed to update player");
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const confirmDeletePlayer = (player: Player) => {
    setCurrentPlayer(player);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePlayer = async () => {
    if (!currentPlayer) return;

    try {
      const response = await fetch(
        `http://localhost:5000/players/${currentPlayer._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        await fetchPlayers();
        setIsDeleteDialogOpen(false);
        setCurrentPlayer(null);
      } else {
        console.error("Failed to delete player");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      nationality: "",
      position: "Forward",
      injured: "no",
      form: "Average",
      rating: "75",
    });
  };

  const getFormColor = (form: string) => {
    switch (form) {
      case "Excellent":
        return "bg-green-500";
      case "Good":
        return "bg-emerald-400";
      case "Average":
        return "bg-yellow-400";
      case "Poor":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };
  const getAvailablePlayersCount = () => {
    return players.filter((player) => !player.injured).length;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Players</h1>
        <div className="text-lg font-medium">
          Available Players: {getAvailablePlayersCount()}
        </div>
        <Button
          onClick={() => {
            setCurrentPlayer(null);
            resetForm();
            setIsAddPlayerOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Players</h1>
          <Button
            onClick={() => {
              setCurrentPlayer(null);
              resetForm();
              setIsAddPlayerOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Player
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search players..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Card key={player._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                          <Image
                            src={player.photo || "/placeholder.svg"}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle>{player.name}</CardTitle>
                          <CardDescription>{player.position}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlayer(player)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDeletePlayer(player)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Age:</span>{" "}
                        {player.age}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Nationality:
                        </span>{" "}
                        {player.nationality}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        {player.injured ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" /> Injured
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Available
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-muted-foreground">Form:</span>
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${getFormColor(
                            player.form
                          )}`}
                        ></span>
                        {player.form}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <div className="w-full1">
                      <span className="text-sm font-medium">
                        Played matches:
                      </span>
                      <span className="text-sm font-bold">
                        {Math.floor(player.age / 10)}
                      </span>
                    </div>
                    <div className="w-full11">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Rating</span>
                        <span className="text-sm font-bold">
                          {player.rating}/100
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${player.rating}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Age
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Nationality
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Position
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Form
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Rating
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr
                        key={player._id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                              <Image
                                src={player.photo || "/placeholder.svg"}
                                alt={player.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {player.name}
                          </div>
                        </td>
                        <td className="p-4 align-middle">{player.age}</td>
                        <td className="p-4 align-middle">
                          {player.nationality}
                        </td>
                        <td className="p-4 align-middle">{player.position}</td>
                        <td className="p-4 align-middle">
                          {player.injured ? (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" /> Injured
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Available
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-3 h-3 rounded-full ${getFormColor(
                                player.form
                              )}`}
                            ></span>
                            {player.form}
                          </div>
                        </td>
                        <td className="p-4 align-middle">{player.rating}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPlayer(player)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDeletePlayer(player)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Player Dialog */}
        <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentPlayer ? "Edit Player" : "Add New Player"}
              </DialogTitle>
              <DialogDescription>
                {currentPlayer
                  ? "Update player information"
                  : "Fill in the details to add a new player"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Player name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) =>
                      handleSelectChange("position", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Forward">Forward</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="injured">Injury Status</Label>
                  <Select
                    value={formData.injured}
                    onValueChange={(value) =>
                      handleSelectChange("injured", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Injury status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Available</SelectItem>
                      <SelectItem value="yes">Injured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form">Form</Label>
                  <Select
                    value={formData.form}
                    onValueChange={(value) => handleSelectChange("form", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-100)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="Player rating"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddPlayerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={currentPlayer ? handleUpdatePlayer : handleAddPlayer}
              >
                {currentPlayer ? "Update Player" : "Add Player"}
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
                Are you sure you want to delete {currentPlayer?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePlayer}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
