# sos-emulator-electron

A simple emulator for the SOS plugin for Bakkesmod, intended for use testing Rocket League broadcast overlays.

Currently set up to start on port 49122 so if you have Rocket League running with SOS set to port 49122, bad things will happen.

Use `rush add` from the relevant project folder to add dependencies. If you use npm or any other package manager, it can mess up the monorepo. Reference [here.](https://rushjs.io/pages/developer/new_developer/)

## Install

1. Install Rush globally: `npm i -g @microsoft/rush`
2. Install the dependencies of the monorepo with `rush update`

## Development Process

1. `rush build`
1. `cd emulator-electron`
1. `rushx start`

## Build for Distribution

1. `rush build`
2. `rush dist-electron`

## Next?

- Currently only the core scorebug relevant attributes are dynamic but the intention is to eventually have all event dynamic properties configurable.
- Event simulator (ie, click a button for a goal and the relevant SOS events will be generated and sent at the appropriate time intervals to simulate a goal occurring).
- Game playback (listen to SOS and store all packets for later playback).
