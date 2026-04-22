# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio built with Eleventy (11ty) static site generator, Sass for styling, and Nunjucks for templating. Assets are uploaded to Cloudflare R2 for CDN distribution.

## Development Commands

### Development Server
```bash
pnpm start  # Runs on localhost:8088
```
This command:
- Cleans the `_site` directory
- Generates changelog from git history (requires Ruby)
- Starts Eleventy dev server with live reload
- Watches Sass files and recompiles automatically

### Building for Production
```bash
pnpm build
```
This command:
- Runs the full kickstart process
- Compiles Sass with compression (no source maps)
- Builds static site
- Uploads assets to Cloudflare R2
- Removes local assets directory after upload

### Deployment
```bash
pnpm deploy  # Builds and deploys to Cloudflare Pages via Wrangler
```

### Individual Commands
- `pnpm changelog` - Generate changelog from git commits (requires Ruby)
- `pnpm clean` - Remove `_site` directory
- `pnpm sass-dev` - Watch and compile Sass in development mode
- `pnpm sass-prod` - Compile Sass for production (compressed, no source maps)

## Architecture

### Directory Structure

```
src/
├── content/
│   ├── collections/      # Content organized by type (projects, til, quizzes, experience, webutils)
│   │   ├── experience/   # Job experience markdown files
│   │   ├── projects/     # Project pages with metadata
│   │   ├── quizzes/      # Quiz content
│   │   ├── til/          # Today I Learned articles
│   │   └── webutils/     # Web utility projects
│   └── data/            # JSON data files (changelog.json generated from git)
├── static/
│   ├── css/             # Sass stylesheets (compiled to _site/static/css)
│   │   ├── global/      # Global styles and models
│   │   ├── app/         # Page-specific styles (changelog, etc.)
│   │   ├── index/       # Index page styles
│   │   └── _colors.sass, _base.sass  # Design tokens
│   └── js/
│       ├── app/         # Client-side JavaScript for pages
│       └── building/    # Build-time shortcodes (server-side)
├── templates/           # Nunjucks layout templates
│   └── snippets/       # Reusable template components
└── partials/           # Page sections (e.g., index/about.njk)

_site/                  # Generated output (gitignored)
assets/                # Static assets (uploaded to R2 during build)
```

### Build System

**Eleventy Configuration** (`.eleventy.js`):
- Input: `src/`, templates: `src/templates`, data: `src/content/data`
- Server runs on port 8088
- Watches CSS directory for Sass changes
- Custom shortcodes defined in `src/static/js/building/`

**Shortcodes** (available in Nunjucks templates):
- `{% addScript "filename" %}` / `{% addStyle "filename" %}` - Add page-specific JS/CSS
- `{% breadcrumbs %}` - Generate breadcrumb navigation
- `{% treemap %}` - Generate project treemap visualization
- `{% changelog changelog, pkg %}` - Render changelog from JSON data
- `{% tilTags %}`, `{% tilRecents %}`, `{% tilRelated %}` - TIL article navigation
- `{% projectImages %}` - Render project image gallery
- `{% version %}`, `{% keywords %}` - Package.json metadata
- Quiz-related: `{% qka %}`, `{% quizButtons %}`, `{% quizQuestions %}`

**Changelog Generation** (`build-changelog.rb`):
- Ruby script that parses git history
- Filters commits by author (`miermontoto`, `Juan Mier`)
- Extracts version numbers from commit messages (format: `XX.y`)
- Supports channels: alpha, beta, RC, RTW (default)
- Processes markdown code blocks and sanitizes HTML
- Outputs to `src/content/data/changelog.json`

**Asset Management**:
- Sass compiles to `_site/static/css`
- Assets in `/assets` are uploaded to Cloudflare R2 during build
- R2 upload script (`scripts/upload-to-r2.js`) syncs only new files
- Requires environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- Large files (>5MB) use multipart upload

### Styling System

**Color Palette** (`src/static/css/_colors.sass`):
```sass
$primary: hsl(0, 0%, 1%)        # Near black
$secondary: hsl(0, 0%, 5%)      # Dark gray background
$halflight: hsl(0, 0%, 12.5%)   # Borders and dividers
$dark: hsl(0, 0%, 25%)
$light: hsl(0, 0%, 50%)
$half: hsl(0, 0%, 75%)          # Text descriptions
$white: hsl(0, 0%, 99%)         # Primary text
```

**Typography** (`src/static/css/_base.sass`):
- Primary: `'Berkeley Mono'` (variable), fallback `'Courier Prime'`
- Classic (dates/metadata): `'Courier Prime'` only
- Border radius: `0px` (sharp corners throughout)

**Component Patterns**:
- `.model` - Base card style with borders
- `.carded` - Grid layout for cards
- `.hoverborder` - Interactive border color change
- Experience cards use CSS Grid: `grid-template-rows: auto 1fr auto`
- Changelog uses two-column layout with fixed sidebar and scrollable content

### Content Organization

**Collections** are directories in `src/content/collections/`:
- Each collection type has its own directory
- Markdown frontmatter defines metadata
- Eleventy automatically creates collections from directory structure
- Experience items include role, period, logo, icons
- Projects include featured/main/other categorization

**Project Filtering** (`src/static/js/building/projects.js`):
- `featuredProjects` - Pinned projects (featured: true)
- `mainProjects` - Non-hidden, non-draft, non-featured
- `otherProjects` - Hidden but not draft

## Important Notes

- **Changelog versioning**: Commits must follow `XX.y` format to appear in changelog
- **Sass changes**: Automatically watched in dev mode, but require restart if Sass compilation fails
- **Ruby dependency**: Changelog generation requires Ruby to be installed
- **Asset uploads**: Only occur during `pnpm build`, not in dev mode
- **Port 8088**: Default port, auto-selects next available if in use (via `detect-port`)

## Other Rules

- Avoid hardcoding absolute positions in CSS (use a relative unit, such as "em" or "vm"=
