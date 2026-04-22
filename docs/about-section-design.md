# About Section Design Concept

*Last Updated: January 2026 (v24.1)*

## Overview

The about section features an enhanced experience timeline with modernized card styling, inspired by the changelog page redesign. The design prioritizes visual consistency, alignment, and interactive micro-animations while maintaining a professional, minimalist aesthetic.

## Design Principles

### Visual Hierarchy
- **Primary text**: `colors.$white` (99% white) for titles and emphasis
- **Secondary text**: `colors.$half` (75% gray) for descriptions
- **Metadata**: `colors.$light` (50% gray) with `Courier Prime` font
- **Backgrounds**: `colors.$secondary` (5% gray) for cards
- **Borders**: `colors.$halflight` (12.5% gray) for consistent separators

### Typography System
```sass
// Primary content
font-family: 'Berkeley Mono', 'Courier Prime', monospace

// Dates and metadata
font-family: 'Courier Prime', monospace

// Sizing
.card-title: 1.5rem (titles)
.card-description: 0.9rem (body text)
i (dates): 0.875rem
```

### Spacing & Layout
- Card padding: `1.5em` (consistent with site standards)
- Card gap: `1rem` between cards
- Section spacing: `1rem` internal padding
- Border width: `1px` (consistent across all dividers)

## Component Architecture

### Experience Cards

Cards use CSS Grid with three distinct zones for perfect alignment:

```sass
.card
  display: grid
  grid-template-rows: auto 1fr auto
  // ↑ Title (fixed), Description (flexible), Icons (fixed)
```

**Structure:**
1. **Title Section** (`card-title-col`)
   - Fixed minimum height: `5rem`
   - Contains: logo, title, role, period
   - Bottom border: `1px solid colors.$halflight`
   - Ensures all descriptions start at same vertical position

2. **Description Section** (`card-description`)
   - Flexible height (`1fr` in grid)
   - Top padding: `1rem`
   - Handles variable content length gracefully

3. **Icon Section** (`card-bottom`)
   - Auto-sized, pushed to bottom with `margin-top: auto`
   - Top border: `1px solid colors.$halflight`
   - Technology stack icons with grayscale filter

### Timeline Design (Work Experience)

Enhanced vertical timeline with gradient connectors:

```sass
// Timeline connector
background: linear-gradient(to bottom, colors.$white 0%, colors.$light 100%)
width: 3px
border-radius: 2px

// Timeline dots
width: 14px (default), 16px (hover)
SVG circle with white fill
```

**Interactive States:**
- Hover shifts items right: `padding-left: 24px → 28px`
- Dots scale up on hover: `14px → 16px`
- Smooth transitions: `0.2s ease`

## Interactive Elements

### Card Hover Effects

```sass
.card:hover
  border-color: colors.$light          // Lighten border
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1)  // Subtle glow
  transform: translateY(-2px)          // Lift effect
```

### Logo Scaling
```sass
.experience-logo:hover
  transform: scale(1.1)
  transition: transform 0.2s ease
```

### Icon Grayscale Filter
```sass
.card-icons
  filter: grayscale(0.3)               // Subtle desaturation

  &:hover
    filter: grayscale(0)               // Full color on hover
```

### Timeline Item Interaction
```sass
.work .card-description > ul > li:hover
  padding-left: 28px                   // Shift right

  &:after
    width: 16px                        // Enlarge dot
    height: 16px
    left: -2px                         // Adjust position
```

## Alignment System

### Horizontal Alignment
- All card titles align at the same height across the grid
- Grid's `align-items: stretch` forces equal card heights
- `min-height: 5rem` on title sections normalizes starting positions

### Vertical Alignment
- Description sections start at consistent vertical position
- Icons always align at bottom regardless of content length
- Grid's `1fr` middle section handles flexible content

### Visual Consistency
- All spacers use `colors.$halflight` (no variation)
- Consistent `1px` border width throughout
- Uniform `1rem` padding for descriptions

## Color Usage

### Semantic Color Mapping
```sass
// Card structure
background: colors.$secondary        // #0d0d0d (5% gray)
border: colors.$halflight            // #202020 (12.5% gray)

// Text hierarchy
titles: colors.$white                // #fcfcfc (99% white)
descriptions: colors.$half           // #bfbfbf (75% gray)
metadata: colors.$light              // #808080 (50% gray)

// Code blocks
background: colors.$halflight
border: 1px solid colors.$dark       // #404040 (25% gray)

// Hover states
border: colors.$light                // Brightens to 50% gray
```

## Responsive Behavior

### Mobile Layout (≤768px)
```sass
.card
  width: 100%                         // Full width on mobile
  margin: 0.75rem 0                   // Reduced margins

.card-title
  font-size: 1.25rem                  // Smaller titles

.timeline li:hover
  padding-left: 22px                  // Reduced shift (vs 28px)
```

## Implementation Notes

### Grid Layout Benefits
- **Automatic alignment**: No manual height calculations
- **Flexible content**: Handles any description length
- **Clean markup**: No wrapper divs needed
- **Maintainable**: Easy to adjust zones independently

### Transition Timing
All animations use `0.2s ease` for consistency:
- Fast enough to feel responsive
- Slow enough to be noticeable
- Creates cohesive interaction language

### Performance Considerations
- Transforms use GPU acceleration (translateY, scale)
- Grayscale filter is hardware-accelerated
- No JavaScript required for interactions
- CSS Grid provides efficient layout calculations

## Design Inspiration

This design draws from the changelog page's two-column layout but adapts it for:
- Multi-item grid (vs single scrollable column)
- Variable content lengths (vs uniform entries)
- Interactive timeline visualization
- Professional portfolio presentation

## Future Considerations

### Potential Enhancements
- Sticky section headers on scroll
- Filter/sort functionality for experience items
- Animated entrance effects on page load
- Expandable/collapsible descriptions for mobile

### Consistency Opportunities
- Apply similar card styling to project listings
- Extend timeline pattern to other chronological content
- Standardize hover effects across all card components
- Create reusable Sass mixins for card patterns

## CSS File Structure

```
src/static/css/index/_about.sass
├── #experience-container          // Main container
├── .carded .card                   // Card grid layout and base styles
├── .card-title-col                 // Title section with fixed height
├── .card-description               // Flexible content area
├── .card-bottom                    // Icon section (bottom-aligned)
├── .work timeline                  // Enhanced timeline for work experience
└── @media (max-width: 768px)      // Mobile responsive adjustments
```

## Related Files

- **Template**: `src/partials/index/about.njk`
- **Styles**: `src/static/css/index/_about.sass`
- **Colors**: `src/static/css/_colors.sass`
- **Typography**: `src/static/css/_base.sass`
- **Global Models**: `src/static/css/global/_models.sass`

---

*This design concept was developed as part of the 24.1 release, following the changelog redesign pattern for visual consistency across the portfolio site.*
