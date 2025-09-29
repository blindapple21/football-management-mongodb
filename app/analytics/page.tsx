"use client";

import { useState } from "react";
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Sample team performance data
const teamPerformance = [
  { month: "Jan", wins: 3, draws: 1, losses: 1, goalsFor: 10, goalsAgainst: 5 },
  { month: "Feb", wins: 2, draws: 2, losses: 0, goalsFor: 7, goalsAgainst: 3 },
  { month: "Mar", wins: 1, draws: 1, losses: 3, goalsFor: 5, goalsAgainst: 8 },
  { month: "Apr", wins: 4, draws: 0, losses: 1, goalsFor: 12, goalsAgainst: 4 },
  { month: "May", wins: 3, draws: 2, losses: 0, goalsFor: 9, goalsAgainst: 2 },
];

// Sample player stats data
const playerStats = [
  { name: "John Smith", goals: 12, assists: 5, rating: 8.2 },
  { name: "Carlos Rodriguez", goals: 2, assists: 8, rating: 7.5 },
  { name: "Thomas Müller", goals: 5, assists: 10, rating: 8.0 },
  { name: "David Chen", goals: 1, assists: 2, rating: 7.2 },
  { name: "Ahmed Hassan", goals: 0, assists: 0, rating: 7.8 },
  { name: "Pierre Dubois", goals: 3, assists: 1, rating: 7.4 },
  { name: "James Wilson", goals: 2, assists: 3, rating: 7.6 },
  { name: "Marco Rossi", goals: 4, assists: 6, rating: 7.9 },
];

// Sample position distribution data
const positionDistribution = [
  { name: "Forwards", value: 5 },
  { name: "Midfielders", value: 8 },
  { name: "Defenders", value: 6 },
  { name: "Goalkeepers", value: 2 },
];

// Sample team strengths data
const teamStrengths = [
  { subject: "Attack", A: 8.5, fullMark: 10 },
  { subject: "Defense", A: 7.2, fullMark: 10 },
  { subject: "Possession", A: 8.0, fullMark: 10 },
  { subject: "Set Pieces", A: 6.8, fullMark: 10 },
  { subject: "Pressing", A: 7.5, fullMark: 10 },
  { subject: "Counter Attack", A: 8.2, fullMark: 10 },
];

// Sample injury data
const injuryData = [
  { month: "Jan", count: 2 },
  { month: "Feb", count: 3 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 1 },
  { month: "May", count: 2 },
];

// Colors for charts
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("season");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Team Analytics</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="season">Full Season</SelectItem>
            <SelectItem value="last3">Last 3 Months</SelectItem>
            <SelectItem value="last5">Last 5 Matches</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Win Rate</CardTitle>
            <CardDescription>Team performance overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">68%</div>
            <div className="text-xs text-muted-foreground">
              +12% from previous period
            </div>
            <div className="h-[150px] mt-4">
              <ChartContainer>
                <ChartTooltipProvider>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Wins", value: 13 },
                          { name: "Draws", value: 6 },
                          { name: "Losses", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#facc15" />
                        <Cell fill="#f87171" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartTooltipProvider>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Goals</CardTitle>
            <CardDescription>Goals scored vs conceded</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">43</div>
                <div className="text-xs text-muted-foreground">
                  Goals scored
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">22</div>
                <div className="text-xs text-muted-foreground">
                  Goals conceded
                </div>
              </div>
            </div>
            <div className="h-[150px] mt-4">
              <ChartContainer>
                <ChartTooltipProvider>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        content={
                          <ChartTooltip>
                            <></>
                          </ChartTooltip>
                        }
                      />
                      <Bar dataKey="goalsFor" fill="#4ade80" name="Goals For" />
                      <Bar
                        dataKey="goalsAgainst"
                        fill="#f87171"
                        name="Goals Against"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <ChartTooltipContent
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      return (
                        <div>
                          <div className="font-medium">
                            {payload[0].payload.month}
                          </div>
                          <div>Goals For: {payload[0].value}</div>
                          <div>Goals Against: {payload[1].value}</div>
                        </div>
                      );
                    }}
                  />
                </ChartTooltipProvider>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Injuries</CardTitle>
            <CardDescription>Injury count over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">3</div>
            <div className="text-xs text-muted-foreground">
              Current injured players
            </div>
            <div className="h-[150px] mt-4">
              <ChartContainer>
                <ChartTooltipProvider>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={injuryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        content={
                          <ChartTooltip>
                            <></>
                          </ChartTooltip>
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#ef4444"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <ChartTooltipContent
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      return (
                        <div>
                          <div className="font-medium">
                            {payload[0].payload.month}
                          </div>
                          <div>Injuries: {payload[0].value}</div>
                        </div>
                      );
                    }}
                  />
                </ChartTooltipProvider>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="players">Player Analysis</TabsTrigger>
          <TabsTrigger value="tactics">Tactical Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Results Over Time</CardTitle>
                <CardDescription>Monthly performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="wins"
                            stackId="a"
                            fill="#4ade80"
                            name="Wins"
                          />
                          <Bar
                            dataKey="draws"
                            stackId="a"
                            fill="#facc15"
                            name="Draws"
                          />
                          <Bar
                            dataKey="losses"
                            stackId="a"
                            fill="#f87171"
                            name="Losses"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.month}
                              </div>
                              <div>Wins: {payload[0].value}</div>
                              <div>Draws: {payload[1].value}</div>
                              <div>Losses: {payload[2].value}</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Strengths</CardTitle>
                <CardDescription>Performance across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={teamStrengths}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} />
                          <Radar
                            name="Team"
                            dataKey="A"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.subject}
                              </div>
                              <div>Rating: {payload[0].value}/10</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Goal Difference Trend</CardTitle>
                <CardDescription>
                  Cumulative goal difference over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={teamPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
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
                            dataKey="goalsFor"
                            stroke="#4ade80"
                            name="Goals For"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="goalsAgainst"
                            stroke="#f87171"
                            name="Goals Against"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.month}
                              </div>
                              <div>Goals For: {payload[0].value}</div>
                              <div>Goals Against: {payload[1].value}</div>
                              <div>
                                Difference:{" "}
                                {Number(payload[0].value) -
                                  Number(payload[1].value)}
                              </div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="players">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Goal Scorers</CardTitle>
                <CardDescription>
                  Players with most goals this season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={playerStats
                            .sort((a, b) => b.goals - a.goals)
                            .slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Bar dataKey="goals" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.name}
                              </div>
                              <div>Goals: {payload[0].value}</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Assisters</CardTitle>
                <CardDescription>
                  Players with most assists this season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={playerStats
                            .sort((a, b) => b.assists - a.assists)
                            .slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Bar dataKey="assists" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.name}
                              </div>
                              <div>Assists: {payload[0].value}</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Ratings</CardTitle>
                <CardDescription>
                  Average player ratings this season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={playerStats.sort((a, b) => b.rating - a.rating)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Bar dataKey="rating" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.name}
                              </div>
                              <div>Rating: {payload[0].value}/10</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Squad Composition</CardTitle>
                <CardDescription>Players by position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={positionDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {positionDistribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.name}
                              </div>
                              <div>Count: {payload[0].value} players</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tactics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Formation Success Rate</CardTitle>
                <CardDescription>Win percentage by formation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { formation: "4-3-3", winRate: 75 },
                            { formation: "4-4-2", winRate: 60 },
                            { formation: "3-5-2", winRate: 80 },
                            { formation: "4-2-3-1", winRate: 65 },
                            { formation: "5-3-2", winRate: 50 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="formation" />
                          <YAxis />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Bar dataKey="winRate" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.formation}
                              </div>
                              <div>Win Rate: {payload[0].value}%</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Timing</CardTitle>
                <CardDescription>
                  When goals are scored and conceded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { period: "0-15", scored: 5, conceded: 2 },
                            { period: "16-30", scored: 8, conceded: 3 },
                            { period: "31-45", scored: 6, conceded: 4 },
                            { period: "46-60", scored: 10, conceded: 5 },
                            { period: "61-75", scored: 7, conceded: 6 },
                            { period: "76-90", scored: 7, conceded: 2 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="scored"
                            fill="#4ade80"
                            name="Goals Scored"
                          />
                          <Bar
                            dataKey="conceded"
                            fill="#f87171"
                            name="Goals Conceded"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.period} min
                              </div>
                              <div>Scored: {payload[0].value}</div>
                              <div>Conceded: {payload[1].value}</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Team Performance by Competition</CardTitle>
                <CardDescription>
                  Results across different competitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer>
                    <ChartTooltipProvider>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              competition: "Premier League",
                              wins: 10,
                              draws: 4,
                              losses: 3,
                            },
                            {
                              competition: "FA Cup",
                              wins: 3,
                              draws: 1,
                              losses: 0,
                            },
                            {
                              competition: "League Cup",
                              wins: 2,
                              draws: 0,
                              losses: 1,
                            },
                            {
                              competition: "Champions League",
                              wins: 4,
                              draws: 2,
                              losses: 2,
                            },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="competition" />
                          <YAxis />
                          <Tooltip
                            content={
                              <ChartTooltip>
                                <></>
                              </ChartTooltip>
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="wins"
                            stackId="a"
                            fill="#4ade80"
                            name="Wins"
                          />
                          <Bar
                            dataKey="draws"
                            stackId="a"
                            fill="#facc15"
                            name="Draws"
                          />
                          <Bar
                            dataKey="losses"
                            stackId="a"
                            fill="#f87171"
                            name="Losses"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartTooltipContent
                        content={({ payload }) => {
                          if (!payload?.length) return null;
                          return (
                            <div>
                              <div className="font-medium">
                                {payload[0].payload.competition}
                              </div>
                              <div>Wins: {payload[0].value}</div>
                              <div>Draws: {payload[1].value}</div>
                              <div>Losses: {payload[2].value}</div>
                            </div>
                          );
                        }}
                      />
                    </ChartTooltipProvider>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
