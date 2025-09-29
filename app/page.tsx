import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, TrendingUp, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">Team Manager</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link
              href="/players"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Players
            </Link>
            <Link
              href="/schedule"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Schedule
            </Link>
            <Link
              href="/lineup"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Lineup
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Analytics
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Football Team Management System</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Manage your team, track player performance, schedule games, and optimize your lineup with our
                  comprehensive platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Player Management</CardTitle>
                  <CardDescription>Add, edit, and manage player profiles with detailed information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track player details, injury status, form assessment, and performance ratings.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/players">
                    <Button variant="outline" size="sm">
                      View Players
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Performance History</CardTitle>
                  <CardDescription>Record and analyze player performance over time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track match statistics, ratings, and comments for each player across all games.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/performance">
                    <Button variant="outline" size="sm">
                      View Performance
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Schedule & Fixtures</CardTitle>
                  <CardDescription>Manage upcoming matches and team events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Keep track of opponent details, match dates, times, and locations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/schedule">
                    <Button variant="outline" size="sm">
                      View Schedule
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Trophy className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Lineup Optimization</CardTitle>
                  <CardDescription>Generate recommended starting lineups based on player data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm considers player ratings, form, and fitness to suggest optimal team selections.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/lineup">
                    <Button variant="outline" size="sm">
                      View Lineup
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Team Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

