# LOCAL_SETUP.md - Local Windows Workflow

> Last updated: 2026-03-26
> This guide is for running Blixamo locally on Windows.

---

## Install Dependencies

From `D:\blixamo`:

```cmd
cd D:\blixamo
npm install
```

---

## Local Development

Use the dev server for normal local work:

```cmd
cd D:\blixamo
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Notes:
- `npm run dev` uses Next.js development mode.
- Hot reload and development diagnostics are expected here.
- Do not use the dev server to validate the production build.

---

## Local Production Build Test

Use this flow when you want to verify the real production build locally:

```cmd
cd D:\blixamo
npm install
npm run build
npm run start
```

Open:

```text
http://localhost:3000
```

Notes:
- `npm run build` now forces `NODE_ENV=production`.
- `npm run start` serves the already-built production output on port `3000`.

---

## Windows Build Requirement

`next build` must run with `NODE_ENV=production`.

Manual Windows CMD form:

```cmd
set NODE_ENV=production
npm run build
```

The project script now automates this, so the normal command is:

```cmd
npm run build
```

There is also a helper that builds and starts production in one step:

```cmd
npm run build:local
```

---

## Recommended Workflow

Use one of these two paths:

Development:

```cmd
cd D:\blixamo
npm install
npm run dev
```

Production verification:

```cmd
cd D:\blixamo
npm install
npm run build
npm run start
```

---

## Common Build Errors And Fixes

### Non-standard `NODE_ENV`

Symptom:
- `next build` warns about a non-standard `NODE_ENV`
- prerendering can fail or behave incorrectly

Fix:
- run `npm run build`
- if you are testing manually in CMD, use `set NODE_ENV=production`

### Build works in dev but fails in production

Symptom:
- `npm run dev` works
- `npm run build` fails

Fix:
- always test with `npm run build`
- production build behavior is stricter than dev mode

### Stale local output

Symptom:
- local behavior does not match recent changes

Fix:

```cmd
rmdir /s /q .next
npm run build
```

### Port 3000 already in use

Symptom:
- `npm run start` or `npm run dev` cannot bind to port `3000`

Fix:
- stop the process already using port `3000`
- then rerun the command

---

## Reminder

For this project, production builds should always be validated with:

```cmd
npm run build
```

Do not rely on a shell-level `NODE_ENV=development` when running `next build`.
