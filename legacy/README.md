# Legacy code

`joydeep-fullstack/` is the earlier full-stack version of NEXO from the `joydeep` branch
(commit `3373eab`, 28 Dec 2025): login and register, API routes, MongoDB models, JWT auth
and a Socket.IO server.

It was moved here unchanged when the redesigned frontend was merged into `joydeep`, because
the two use different stacks (Next 14, React 18, Tailwind 3 here vs. Next 16, React 19,
Tailwind 4 at the root) and define the same routes, so they can't build side by side.

It is excluded from TypeScript and ESLint and is not part of the app build. Its auth, API,
database and socket code is the starting point for wiring a real backend into the new frontend.
