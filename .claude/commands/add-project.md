Add new project(s) to the portfolio: $ARGUMENTS

The arguments are one or more paths to local repos (e.g. `../bidi-mcp`), optionally with a category hint ("minor", "featured", "hidden"). Default to minor if no category is given. For each project:

1. **Inspect the repo** — read its README, manifest (`package.json`, `CMakeLists.txt`, `Cargo.toml`, `go.mod`, etc.) and, if needed, a couple of source files to understand what it does and what it's built with. Get the public repo URL from `git remote -v`.
2. **Pick icons** — only use names that exist as SVGs in `assets/icons/tech/` (list the directory to check). 2-3 icons max, most representative tech first. There is no `cpp` icon: use `c` for C-family projects.
3. **Write the file** at `src/content/collections/projects/<name>.md`, following the existing frontmatter pattern (see `bprun.md` for a minor project, `url.md` for a regular one):

   ```
   ---
   title: <repo name>
   desc: <one line, lowercase, ends with a period>
   source: <github url>
   icons: [<icon>, <icon>]
   emoji: <single fitting emoji>
   minor: true          # omit for regular; hidden: true for hidden; featured: true + img for featured
   ---
   ```

   Category flags are read by `src/static/js/building/projects.js`: `minor` → minor list, `hidden` → excluded, `featured` + `img` → featured grid, none → main list.

4. **Style of `desc`** — short and factual, names the core tech or protocol, no marketing language. Check existing project files for tone before writing.
5. **Verify** — confirm every icon name resolves to a file in `assets/icons/tech/` and that the emoji isn't already used by another project (prefer a unique one, not a hard rule).

Do not commit. Report the created files and the frontmatter chosen for each.
