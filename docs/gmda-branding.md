# GMDA branding

## Identity

- Product: **GMDA**
- Meaning: **Grok, Muse & Dots Alternative**
- Tagline: **Your AI team. Your control.**
- Mark palette: dark teal with mint highlights; existing theme palettes stay unchanged
- Mark: an original geometric G with four agent nodes on a dark teal tile
- Source: <https://github.com/arthurwang110505-debug/GMDA-bot>

GMDA is an independent fork. The name's expansion describes its positioning,
not an affiliation with Grok, Muse, Dots, or their respective providers.
Trademark and domain availability have not been checked.

## This first pass

The renderer and server share built-in product defaults, so a successful
`/api/brand` response does not restore the upstream product name. Existing
licensed deployment-specific overrides still work and their entitlement checks
are unchanged.

App titles, installable-web-app metadata, localized product copy, welcome mark,
About dialog, desktop startup screen, tray labels, installer display names, and
web/desktop app icons use GMDA. Source, help, feedback, and release links point
to the GMDA repository. The desktop update feed points to GMDA's repository,
not upstream binaries; no GMDA release has been created by this change. Linux
packages install under `/opt/GMDA`; Sentinel detection also retains the legacy
OpenMausBot locations. Desktop user-data paths are pinned before the app display
name changes.

## Compatibility and service boundaries

This is a branding pass, not a migration or infrastructure deployment. The
following deliberately remain unchanged:

- Existing data paths, internal npm package name, desktop app ID, Windows tray identity, `openmausbot://`
  protocol, environment-variable prefixes, command names, and API identifiers.
- Wire-message matchers and protocol strings expected from upstream engines.
- Third-party service URLs, provider names, upstream help links for integrations,
  and upstream mobile app download URLs. The phone-app dialog identifies these
  apps as upstream offerings, not GMDA releases.
- `LICENSE`, `NOTICE`, third-party notices, and the enterprise license.
- Agent avatar artwork and the optional enterprise layer. Replacing the app icon
  does not clear rights to redistribute upstream trademarked mascot artwork.

## Before a public release

1. Build the Apache-licensed OSS edition without `enterprise/`, or obtain the
   necessary separate agreement. Do not bypass license or entitlement checks.
2. Audit and replace remaining upstream trademarked mascot artwork and marketing
   previews, or obtain permission. The GMDA app mark is separate original artwork.
3. Decide on a new bundle/app ID, URL scheme, storage namespace, OAuth client
   registrations, and a tested migration strategy before changing identifiers.
4. Configure GMDA-owned signing, notarization, update publishing, and installer
   smoke tests. The existing release workflows still contain upstream assumptions;
   artifact display-name changes alone do not make them GMDA release automation.
5. Provision any GMDA-owned cloud, support, analytics, OAuth, and mobile services.
   Do not advertise upstream plans or apps as GMDA-owned offerings.
6. Run isolated onboarding and packaged desktop tests on each target OS. Static
   branding checks cannot prove installation, permissions, deep links, or updates.

## Verification for this pass

- TypeScript renderer and server checks passed with a 3 GiB Node heap.
- Lint and all 12 locale-catalog checks passed.
- The focused Node 24 renderer/locale/brand/updater run passed 726 tests across
  55 files (3 existing TODOs). Packaging-hook and Sentinel tests also passed;
  5 macOS-only packaging cases were skipped on Linux.
- Startup/tray, lending-guard, and environment-title Node tests passed.
- An isolated fake-engine fixture passed `control:omb doctor`; its `/api/brand`
  returned GMDA and the tagline. The preview proxies only to that disposable
  fixture, not a user's workspace.
- The production Vite build was killed by the sandbox during chunk rendering
  after transforming 5,437 modules. A complete production build, browser-driven
  onboarding, and native packaged installs have not been verified here.

Use Node 24 or newer for the suite, as required by the project. Node 22 cannot
resolve `node:sqlite` correctly in some DOM-test dependency graphs.
