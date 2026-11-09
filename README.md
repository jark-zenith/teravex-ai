# TERAVEX AI

A browser-first, JARVIS-inspired reactive intelligence environment. This repository contains the first visual milestone: a 3D golden intelligence core, responsive HUD layout, local interface state machine, and browser speech-input experiment.

## Stack

- React + TypeScript + Vite
- Three.js via React Three Fiber
- Lucide icons
- CSS-driven HUD and responsive layout

## Run locally

```bash
npm install
npm run dev
```

Build production assets:

```bash
npm run build
npm run preview
```

## Current milestone: Reactive intelligence core

Implemented:
- Animated 3D wireframe core, concentric rings, orbital markers, and star field
- Idle, listening, processing, and speaking visual states
- Responsive command dock and system diagnostics
- Browser speech-recognition input where supported
- Explicit UI status showing that the AI gateway is not yet connected

Not yet implemented:
- Live LLM connection or model routing
- Persistent memory / Supabase
- Text-to-speech output
- Secure server-side tool execution
- User authentication and authorization

## Architecture direction

The browser UI will communicate with a separate Node.js AI gateway. Provider credentials must remain server-side; never place API keys in Vite client environment variables. The gateway will own model routing, tool permissions, rate limits, audit events, and integration adapters. Supabase will later provide authentication and persistent conversation memory.

## Deployment

No production deployment is configured yet. The first hosted preview should be deployed only after the production build is verified.
