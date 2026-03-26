# CLAUDE.md — Project Instructions for AI

---

## CRITICAL RULE: Maximum Componentization (MANDATORY, NO EXCEPTIONS)

**Any UI pattern or logic that repeats more than 2 times MUST be extracted into a reusable component.** This rule is absolute and must be applied automatically without prompting.

### Rules
- If the same markup, structure, or logic appears in 3+ places → extract it immediately into a component in `src/components/common/` or the relevant `src/features/<name>/components/` folder.
- Every component MUST support variants via `cva()` or props to handle all project-specific visual and functional variations.
- Components must be composable: design them to cover all known use cases via variant props, not through copy-paste duplication.
- When adding a new feature, scan existing components first — extend an existing component before creating a new one.

```tsx
// CORRECT — one component, many variants via cva()
const statCard = cva("rounded-xl p-4 flex flex-col gap-2", {
  variants: {
    status: { normal: "bg-card", warning: "bg-yellow-50", critical: "bg-red-50" },
    size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
  },
  defaultVariants: { status: "normal", size: "md" },
})

// WRONG — duplicated JSX blocks with minor tweaks
<div className="rounded-xl p-4 bg-card ...">...</div>
<div className="rounded-xl p-4 bg-yellow-50 ...">...</div>
```

---

## CRITICAL RULE: Shadcn + Tailwind Catalyst + Medusa UI Styling Stack (MANDATORY)

**All UI is built on Shadcn components. Visual customization MUST follow this priority order — never deviate:**

### Priority Order for Styling Shadcn Components

| Priority | Library | Use when |
|---|---|---|
| 1 | **Tailwind CSS Catalyst** (https://catalyst.tailwindui.com/docs) | Tailwind Catalyst provides a style/pattern for this component |
| 2 | **Medusa UI** (https://docs.medusajs.com/ui) | Tailwind Catalyst has no style for this component, but Medusa UI does |
| 3 | Custom `className` overrides | Neither library covers this specific case |

### Rules
- Always check Tailwind CSS Catalyst first for component styling patterns — it is the primary visual reference.
- If Tailwind Catalyst does not have a pattern for a given component (e.g. `Avatar`), fall back to Medusa UI styles.
- Never skip both libraries and go straight to custom CSS — always verify both sources first.
- Apply styles via `className` on Shadcn components, or extend `cva()` variants in `src/components/ui/`. Never duplicate a Shadcn component file.

```tsx
// CORRECT — Shadcn base + Tailwind Catalyst visual pattern
<Button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90">
  Save changes
</Button>

// CORRECT — Shadcn Avatar + Medusa UI style (Catalyst has no Avatar)
<Avatar className="size-8 rounded-full ring-2 ring-white">
  <AvatarImage src={user.avatar} />
  <AvatarFallback className="bg-ui-bg-subtle text-ui-fg-subtle text-xs font-medium">
    {initials}
  </AvatarFallback>
</Avatar>

// WRONG — custom component ignoring both libraries
<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
  <img src={user.avatar} />
</div>
```

---

## CRITICAL RULE: Always Use Shadcn UI Components

**Every UI element in this project MUST use the native Shadcn UI component from `src/components/ui/`.** This rule is non-negotiable and applies to the entire codebase without exception.

---

## Component Library

This project uses **Shadcn UI** (https://ui.shadcn.com/) with **Radix UI** primitives, **Tailwind CSS v4**, and `class-variance-authority`. Components live in `src/components/ui/`.

### Mandatory Component Mapping

| UI Element | Use This Component | Import Path |
|---|---|---|
| Button | `<Button>` | `@/components/ui/button` |
| Text field / Input | `<Input>` | `@/components/ui/input` |
| Textarea | `<Textarea>` | `@/components/ui/textarea` |
| Checkbox | `<Checkbox>` | `@/components/ui/checkbox` |
| Radio button | `<RadioGroup>` + `<RadioGroupItem>` | `@/components/ui/radio-group` |
| Toggle / Switch | `<Switch>` | `@/components/ui/switch` |
| Select / Dropdown | `<Select>` + sub-components | `@/components/ui/select` |
| Form wrapper | `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` | `@/components/ui/form` |
| Label | `<Label>` | `@/components/ui/label` |
| Card | `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>` | `@/components/ui/card` |
| Dialog / Modal | `<Dialog>` + sub-components | `@/components/ui/dialog` |
| Sheet / Drawer | `<Sheet>` + sub-components | `@/components/ui/sheet` |
| Tabs | `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` | `@/components/ui/tabs` |
| Badge | `<Badge>` | `@/components/ui/badge` |
| Avatar | `<Avatar>`, `<AvatarImage>`, `<AvatarFallback>` | `@/components/ui/avatar` |
| Progress bar | `<Progress>` | `@/components/ui/progress` |
| Separator | `<Separator>` | `@/components/ui/separator` |
| Tooltip | `<Tooltip>` + sub-components | `@/components/ui/tooltip` |
| Dropdown menu | `<DropdownMenu>` + sub-components | `@/components/ui/dropdown-menu` |
| Popover | `<Popover>` + sub-components | `@/components/ui/popover` |
| Accordion | `<Accordion>` + sub-components | `@/components/ui/accordion` |
| Command palette | `<Command>` + sub-components | `@/components/ui/command` |
| Skeleton loader | `<Skeleton>` | `@/components/ui/skeleton` |
| Alert | `<Alert>`, `<AlertDescription>` | `@/components/ui/alert` |
| Scroll area | `<ScrollArea>` | `@/components/ui/scroll-area` |
| OTP Input | `<InputOTP>` + sub-components | `@/components/ui/input-otp` |
| Navigation menu | `<NavigationMenu>` + sub-components | `@/components/ui/navigation-menu` |
| Breadcrumb | `<Breadcrumb>` + sub-components | `@/components/ui/breadcrumb` |
| Sidebar | `<Sidebar>` + sub-components | `@/components/ui/sidebar` |
| Toast / Notification | `<Sonner>` / `toast()` | `@/components/ui/sonner` |

### NEVER use these in place of Shadcn components
- Raw `<input>`, `<button>`, `<select>`, `<textarea>`, `<input type="checkbox">`, `<input type="radio">` HTML elements
- Custom hand-rolled UI elements when a Shadcn equivalent exists
- Any third-party component library (Material UI, Ant Design, Chakra, etc.)

---

## Design Tokens

All styling is driven by CSS custom properties defined in `src/styles/globals.css`. **Always use these tokens — never hardcode colors.**

### Color Palette (Light Mode)

| Token | Purpose | Value |
|---|---|---|
| `--primary` | Primary actions, focus rings, active states | `oklch(0.52 0.18 240)` — calm blue |
| `--primary-foreground` | Text on primary backgrounds | `oklch(0.985 0 0)` — near white |
| `--secondary` | Secondary/muted actions | `oklch(0.96 0 0)` |
| `--secondary-foreground` | Text on secondary backgrounds | `oklch(0.205 0 0)` |
| `--background` | Page background | `oklch(0.99 0 0)` |
| `--foreground` | Default text | `oklch(0.145 0 0)` |
| `--muted` | Subtle backgrounds | `oklch(0.96 0 0)` |
| `--muted-foreground` | Placeholder / secondary text | `oklch(0.556 0 0)` |
| `--accent` | Hover states | `oklch(0.96 0 0)` |
| `--border` | Borders | `oklch(0.922 0 0)` |
| `--input` | Input borders | `oklch(0.922 0 0)` |
| `--ring` | Focus ring | `oklch(0.52 0.18 240)` — same as primary |
| `--destructive` | Errors, delete actions | `oklch(0.577 0.245 27.325)` — red |
| `--card` | Card backgrounds | `oklch(1 0 0)` |

### Tailwind Usage
Use semantic Tailwind classes that map to these tokens:
- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-background`, `text-foreground`
- `border-input`, `ring-ring`
- `bg-destructive`, `text-destructive`

### Border Radius
- `--radius: 0.5rem` (base) → Tailwind: `rounded-md`
- `rounded-sm` = `calc(var(--radius) - 4px)`
- `rounded-lg` = `var(--radius)`
- `rounded-xl` = `calc(var(--radius) + 4px)`

---

## Customizing Shadcn Components

When a component needs project-specific styling, **extend via `className` prop** — never duplicate or rewrite the component itself.

```tsx
// CORRECT — extend with className
<Button className="w-full rounded-xl text-base h-12" variant="default">
  Continue
</Button>

// CORRECT — use a variant
<Button variant="outline" size="lg">
  Cancel
</Button>

// WRONG — custom raw button
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Continue
</button>
```

If a new visual variant is needed repeatedly, add it to the component's `cva()` definition in `src/components/ui/`. Keep variants consistent with the design token system.

---

## Shadcn Tooling Priority — MANDATORY WORKFLOW

When working on any Shadcn component (adding, installing, customizing, theming, or inspecting), always follow this exact priority order **before writing or editing any code manually**.

### Priority 1 — Shadcn Skill (`shadcn/ui`)

**Always activate the Shadcn Skill first.** This is the official AI skill from https://ui.shadcn.com/docs/skills. It is project-aware: it reads `components.json` (present at the project root) and runs `shadcn info --json` to detect the exact framework, Tailwind version, aliases, installed components, icon library, and file paths — then generates accurate component code on the first attempt.

Install once if not yet present:
```bash
pnpm dlx skills add shadcn/ui
```

The skill auto-activates when `components.json` exists. This project already has `components.json` configured with:
- Style: `new-york`
- Tailwind CSS variables: `src/styles/globals.css`
- Base color: `zinc`
- Icon library: `lucide`
- Aliases: `@/components/ui`, `@/lib`, `@/hooks`

Use the Shadcn Skill for:
- Generating any new component or UI section
- Applying or switching themes (`shadcn/ui` preset support)
- Enforcing correct patterns (`FieldGroup`, `ToggleGroup`, semantic colors)
- Discovering components via `shadcn docs`, `shadcn search`
- Adding components from external registries (e.g. `@tailark`)

### Priority 2 — Shadcn MCP (via `mcp__Shadcn_UI__*` tools)

If additional registry context is needed beyond what the Skill provides, use Shadcn MCP tools:

| Task | MCP Tool |
|---|---|
| Browse available components | `mcp__Shadcn_UI__list_components` |
| Get component source code | `mcp__Shadcn_UI__get_component` |
| Get a live usage demo | `mcp__Shadcn_UI__get_component_demo` |
| Get component props/metadata | `mcp__Shadcn_UI__get_component_metadata` |
| Browse pre-built page blocks | `mcp__Shadcn_UI__list_blocks` / `mcp__Shadcn_UI__get_block` |
| Apply or inspect a theme | `mcp__Shadcn_UI__apply_theme` / `mcp__Shadcn_UI__get_theme` |
| List available themes | `mcp__Shadcn_UI__list_themes` |
| Check the Shadcn registry structure | `mcp__Shadcn_UI__get_directory_structure` |

### Priority 3 — Shadcn CLI

To install a component that is not yet in `src/components/ui/`:

```bash
pnpm dlx shadcn@latest add <component-name>
```

To add a pre-built block:

```bash
pnpm dlx shadcn@latest add <block-name>
```

Always prefer installing via CLI over writing a custom UI primitive from scratch.

### Priority 4 — Manual editing

Only edit files in `src/components/ui/` manually as a last resort — for example, adding a new `cva()` variant specific to this project's design system that cannot be achieved via `className` overrides alone.

---

## Form Pattern

Always use `react-hook-form` + `zod` + Shadcn `<Form>` components together:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const form = useForm({ resolver: zodResolver(schema) })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

---

## Consistency Rules

1. **All buttons** across the entire project use `<Button>` with the same variant system. Never mix custom styled raw buttons with Shadcn buttons.
2. **All inputs** (text, email, password, number, search) use `<Input>`. Stylistic variations go through `className`.
3. **All checkboxes** use `<Checkbox>` — never `<input type="checkbox">`.
4. **All radio buttons** use `<RadioGroup>` + `<RadioGroupItem>` — never `<input type="radio">`.
5. **All toggles/switches** use `<Switch>`.
6. **All dropdowns/selects** use Shadcn `<Select>` or `<DropdownMenu>` depending on context.
7. **All modals** use `<Dialog>` or `<Sheet>`. Never use custom overlay/modal implementations.
8. **All loading states** use `<Skeleton>`.
9. **All notifications/toasts** use Sonner's `toast()` function.
10. **All form labels** use `<Label>` or `<FormLabel>`.

---

## Tech Stack Summary

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.8 | Type safety |
| Vite | 6 | Build tool |
| Tailwind CSS | 4 | Utility styling |
| Shadcn UI | latest | Component library |
| Radix UI | via `radix-ui` pkg | Headless primitives |
| class-variance-authority | 0.7 | Component variants |
| react-hook-form | 7 | Form state |
| zod | 3 | Schema validation |
| framer-motion | 12 | Animations |
| react-router | 7 | Routing |
| zustand | 5 | Global state |
| sonner | 2 | Toast notifications |

---

## Project Structure

```
src/
  components/
    ui/           ← Shadcn components (DO NOT delete or bypass)
    common/       ← Shared app-level components built on top of Shadcn
    navigation/   ← Navigation components
    feedback/     ← Toast, dialog wrappers
  features/       ← Feature-scoped code (auth, dashboard, profile, etc.)
  styles/
    globals.css   ← Design tokens & global styles
  lib/
    utils.ts      ← cn() helper (clsx + tailwind-merge)
```

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
