# tunnel-fn

[![npm](https://img.shields.io/npm/v/@felixfern/tunnel-fn)](https://www.npmjs.com/package/@felixfern/tunnel-fn)

Type-safe function tunneling across React components via context.

```bash
npm install @felixfern/tunnel-fn
```

See [packages/tunnel-fn/README.md](./packages/tunnel-fn/README.md) for full documentation.

## Repository Structure

```
tunnel-fn/
├── packages/
│   ├── tunnel-fn/   — The npm package source (published to npm)
│   └── web/         — Landing page / demo website
├── pnpm-workspace.yaml
└── package.json     — Workspace root
```

## Development

```bash
# Install all dependencies
pnpm install

# Run the landing page dev server
pnpm dev

# Build the library
pnpm build:lib

# Run tests
pnpm test

# Build everything
pnpm build
```

## About

Developed by: [Felix Fernando](https://github.com/FelixFern)
