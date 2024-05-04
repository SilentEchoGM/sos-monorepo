# sos-emulator-electron

A simple emulator for the SOS plugin for Bakkesmod, intended for use testing Rocket League broadcast overlays.

Currently set up to start on port 49122 so if you have Rocket League running with SOS set to port 49122, bad things will happen.

To install everything in the repo, run yarn install from the root directory.

To start the dev process run `cd apps/emulator-electron` and then `pnpm start`

Uses Turborepo to build and package:

- run `npx turbo run build` to build
- run `npx turbo run dist` to package
