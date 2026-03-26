import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Logo } from "@/components/common/Logo";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import type { UserRole } from "@/types";

// All routes for the inventory table
const ALL_ROUTES = [
  { path: "/welcome", layout: "Public", auth: false, status: "Built" },
  { path: "/register/email", layout: "Public", auth: false, status: "Redirect → /welcome" },
  { path: "/register/verify", layout: "Public", auth: false, status: "Built" },
  { path: "/register/2fa-setup", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/register/profile", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/consent", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/login", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/login/email", layout: "Public", auth: false, status: "Built" },
  { path: "/login/verify", layout: "Public", auth: false, status: "Built" },
  { path: "/login/2fa", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/privacy", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/terms", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/ai-explanation", layout: "Public", auth: false, status: "Placeholder" },
  { path: "/app/dashboard", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/questionnaire", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/tests", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/test/:testType/:id", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/marketplace", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/marketplace/:id", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/consultations", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/consultations/:id", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/tokens", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/profile", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/app/profile/edit", layout: "AppLayout", auth: true, status: "Placeholder" },
  { path: "/doctor/patients", layout: "DoctorLayout", auth: true, status: "Placeholder" },
  { path: "/doctor/patients/:id", layout: "DoctorLayout", auth: true, status: "Placeholder" },
  { path: "/admin/users", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/questionnaires", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/marketplace", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/consultations", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/tokens", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/orders", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/audit-logs", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/admin/profile", layout: "AdminLayout", auth: true, status: "Placeholder" },
  { path: "/404", layout: "None", auth: false, status: "Placeholder" },
  { path: "/error", layout: "None", auth: false, status: "Placeholder" },
  { path: "/maintenance", layout: "None", auth: false, status: "Placeholder" },
  { path: "/dev", layout: "None", auth: false, status: "Built" },
] as const;

const HEALTH_COLORS = [
  { name: "Normal", variable: "--health-normal", tailwind: "bg-[var(--health-normal)]", description: "Within reference range" },
  { name: "Borderline", variable: "--health-borderline", tailwind: "bg-[var(--health-borderline)]", description: "Slightly outside range" },
  { name: "Elevated", variable: "--health-elevated", tailwind: "bg-[var(--health-elevated)]", description: "Significantly elevated" },
  { name: "Critical", variable: "--health-critical", tailwind: "bg-[var(--health-critical)]", description: "Requires immediate attention" },
];

const QUICK_LINKS = [
  { label: "Welcome", href: "/welcome", role: "none" },
  { label: "Dashboard (Patient)", href: "/app/dashboard", role: "patient" },
  { label: "Admin Users", href: "/admin/users", role: "admin" },
  { label: "Doctor Patients", href: "/doctor/patients", role: "doctor" },
];

/** /dev — Smoke test page: route inventory, component showcase, theme test */
export function DevPage() {
  const [progress, setProgress] = useState(15);
  const { user, quickLogin } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.title = "Dev — Component Inventory — DT Health";
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6 md:p-10 space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
            <Badge variant="destructive" className="text-xs">DEV ONLY</Badge>
          </div>
          <h1 className="text-3xl font-bold">Component & Route Smoke Test</h1>
          <p className="text-muted-foreground">
            Verifies the project foundation: routing, design system, theming, stores, and shared components.
          </p>
        </div>

        {/* ── SECTION 1: Current Session ─────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Mock Session State</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <Badge className="mt-1 capitalize">{user.role}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No active session.</p>
              )}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground self-center">Quick Login:</span>
                {(["patient", "doctor", "admin"] as UserRole[]).map((role) => (
                  <Button key={role} size="sm" variant="outline" onClick={() => quickLogin(role)} className="capitalize">
                    {role}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── SECTION 2: Quick Navigation ───────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">2. Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Button key={link.href} variant="outline" size="sm" asChild>
                <Link to={link.href}>
                  {link.label}
                  {link.role !== "none" && (
                    <Badge variant="secondary" className="ml-1.5 text-[10px] capitalize">
                      {link.role}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Route Inventory ────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">3. Route Inventory ({ALL_ROUTES.length} routes)</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium">Path</th>
                    <th className="text-left px-4 py-2 font-medium">Layout</th>
                    <th className="text-left px-4 py-2 font-medium">Auth</th>
                    <th className="text-left px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_ROUTES.map((route, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-2 font-mono text-xs">
                        {route.path.includes(":") ? (
                          <span className="text-muted-foreground">{route.path}</span>
                        ) : (
                          <Link to={route.path} className="text-primary hover:underline">
                            {route.path}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{route.layout}</td>
                      <td className="px-4 py-2">
                        {route.auth ? (
                          <Badge variant="outline" className="text-xs">Protected</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Public</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={route.status === "Built" ? "default" : "secondary"} className="text-xs">
                          {route.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* ── SECTION 4: Theme & Health Colors ─────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">4. Theming</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm">Current theme: <strong>{resolvedTheme}</strong></span>
            <Button size="sm" variant="outline" onClick={toggleTheme}>
              Toggle to {resolvedTheme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {HEALTH_COLORS.map((c) => (
              <div key={c.name} className="rounded-lg overflow-hidden border">
                <div className={`h-12 ${c.tailwind}`} />
                <div className="p-2">
                  <div className="text-xs font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: Component Showcase ────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold mb-4">5. Component Showcase</h2>
          <Tabs defaultValue="buttons">
            <TabsList className="mb-4 flex-wrap h-auto">
              <TabsTrigger value="buttons">Buttons & Badges</TabsTrigger>
              <TabsTrigger value="inputs">Inputs & Forms</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="overlay">Overlays</TabsTrigger>
            </TabsList>

            {/* Buttons & Badges */}
            <TabsContent value="buttons" className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Buttons</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                  <Button disabled>Disabled</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Badges</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="red">Red</Badge>
                  <Badge variant="orange">Orange</Badge>
                  <Badge variant="amber">Amber</Badge>
                  <Badge variant="yellow">Yellow</Badge>
                  <Badge variant="lime">Lime</Badge>
                  <Badge variant="green">Green</Badge>
                  <Badge variant="emerald">Emerald</Badge>
                  <Badge variant="teal">Teal</Badge>
                  <Badge variant="cyan">Cyan</Badge>
                  <Badge variant="sky">Sky</Badge>
                  <Badge variant="blue">Blue</Badge>
                  <Badge variant="indigo">Indigo</Badge>
                  <Badge variant="violet">Violet</Badge>
                  <Badge variant="purple">Purple</Badge>
                  <Badge variant="fuchsia">Fuchsia</Badge>
                  <Badge variant="pink">Pink</Badge>
                  <Badge variant="rose">Rose</Badge>
                  <Badge variant="zinc">Zinc</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Logos</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-6 items-center">
                  <Logo size="sm" />
                  <Logo size="md" />
                  <Logo size="lg" />
                  <Logo size="md" variant="admin" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inputs & Forms */}
            <TabsContent value="inputs" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Form Controls</CardTitle></CardHeader>
                <CardContent className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input placeholder="Enter your email" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Message</Label>
                    <Textarea placeholder="Enter a message…" rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="check1" />
                    <Label htmlFor="check1">I agree to the terms</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="switch1" />
                    <Label htmlFor="switch1">Enable notifications</Label>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Preferred contact</Label>
                    <RadioGroup defaultValue="email" className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="email" id="r-email" />
                        <Label htmlFor="r-email">Email</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="sms" id="r-sms" />
                        <Label htmlFor="r-sms">SMS</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="none" id="r-none" />
                        <Label htmlFor="r-none">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feedback */}
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Toasts (Sonner)</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => toast.success("Operation successful!")}>Success toast</Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.error("Something went wrong.")}>Error toast</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Here's some information.")}>Info toast</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.warning("Please review this.")}>Warning toast</Button>
                  <Button size="sm" variant="secondary" onClick={() => toast("Default notification")}>Default toast</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Alerts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>This is a default alert with some information.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Progress & Skeleton</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Questionnaire Progress</span><span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
                      <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.max(0, p - 10))}>−10%</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display */}
            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Component</CardTitle>
                  <CardDescription>Cards are used throughout the app for content grouping.</CardDescription>
                </CardHeader>
                <CardContent>Content area of the card.</CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Accordion</CardTitle></CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="a1">
                      <AccordionTrigger>What is a Digital Twin?</AccordionTrigger>
                      <AccordionContent>
                        A digital twin is a personalized health model built from your genetic, laboratory, and questionnaire data.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="a2">
                      <AccordionTrigger>How is my data used?</AccordionTrigger>
                      <AccordionContent>
                        Your data is processed locally and used only to power your personal health insights.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Breadcrumb</CardTitle></CardHeader>
                <CardContent>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItemUI>
                        <BreadcrumbLink href="/app/dashboard">Dashboard</BreadcrumbLink>
                      </BreadcrumbItemUI>
                      <BreadcrumbSeparator />
                      <BreadcrumbItemUI>
                        <BreadcrumbLink href="/app/marketplace">Marketplace</BreadcrumbLink>
                      </BreadcrumbItemUI>
                      <BreadcrumbSeparator />
                      <BreadcrumbItemUI>
                        <BreadcrumbPage>Product Detail</BreadcrumbPage>
                      </BreadcrumbItemUI>
                    </BreadcrumbList>
                  </Breadcrumb>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Avatar & Separator</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Alex Miller</div>
                    <div className="text-xs text-muted-foreground">Patient</div>
                  </div>
                  <Separator orientation="vertical" className="h-8 mx-2" />
                  <Avatar>
                    <AvatarFallback className="bg-violet-500 text-white">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Dr. Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">Doctor</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overlays */}
            <TabsContent value="overlay" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Dialog</CardTitle></CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                          This is a reusable confirmation dialog. In prototype mode, all actions succeed immediately.
                        </DialogDescription>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground">Dialog content goes here.</p>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Dropdown Menu</CardTitle></CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Tooltip</CardTitle></CardHeader>
                <CardContent>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      This is a tooltip with helpful information.
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <Separator />
        <p className="text-xs text-muted-foreground text-center pb-6">
          🛠 DT Health Prototype Foundation — Remove <code className="font-mono">/dev</code> route before production deployment.
        </p>
      </div>
    </TooltipProvider>
  );
}
