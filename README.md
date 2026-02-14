# CarComp (TCO comparator)

This project is a small interactive web app.
You can move sliders and compare car scenarios.

---

## Quick answer to your question

- **Do I have a downloadable "artifact" like Claude Code?**
  - **Not in this environment.** I cannot hand you a one-click hosted preview artifact from here.
- **Good news:** you can still run it easily with copy/paste commands below.

---

## Option A — Run it **here** (inside this environment)

If your environment allows access to npm:

1. Open a terminal in `/workspace/carcomp`.
2. Run:

```bash
npm install
npm run dev
```

3. Open this URL in your browser:

- `http://localhost:4173`

4. Keep the terminal open while using the app.

### If it does not start
You may see a `403` npm error (network/proxy restriction in this environment).
If that happens, use **Option B (run locally on your computer)**.

---

## Option B — Run on your own computer (non-technical tutorial)

### 1) Install Node.js (one time)

- Go to: https://nodejs.org
- Download **LTS** version.
- Install with default options.

### 2) Get the project folder

You need the folder containing these files:
- `package.json`
- `index.html`
- `tco-v7.jsx`
- `src/main.jsx`

(If using Git, clone the repo. If not, download/copy the folder.)

### 3) Open a terminal in that folder

- **Windows:** open File Explorer in the project folder, type `cmd` in the address bar, press Enter.
- **Mac:** open Terminal, type `cd ` then drag the folder into the terminal, press Enter.

### 4) Install app dependencies (one time)

```bash
npm install
```

Wait until it finishes.

### 5) Start the app

```bash
npm run dev
```

### 6) Open the app in browser

- Visit: `http://localhost:4173`

You should now see the TCO comparator and can play with all controls.

---

## Everyday use after first setup

Next time, you only need:

```bash
npm run dev
```

Then open `http://localhost:4173`.

---

## Optional: build a production bundle

```bash
npm run build
```

This creates a `dist/` folder.

To preview that build:

```bash
npm run preview
```

Then open `http://localhost:4173`.
