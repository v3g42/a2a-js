# A2A-JS Vite Compatibility Fix

## Problem

The original a2a-js library had compatibility issues when used with Vite (and other browser bundlers) because:

1. **Mixed Server/Client Code**: The main entry point exported both server-side and client-side components
2. **Node.js Dependencies**: Server components used Node.js-specific modules like:
   - `events` (EventEmitter)
   - `express`
   - `http`, `fs`, `path`, etc.
3. **Build Failures**: Vite would try to bundle server code for the browser, causing build failures

## Error Example

When building with Vite, you would see errors like:
```
[plugin vite:resolve] Module "events" has been externalized for browser compatibility
error during build:
../dist/index.js (18:9): "EventEmitter" is not exported by "__vite-browser-external"
```

## Solution

### 1. Created Browser-Compatible Entry Point

Created `src/client.ts` that exports only browser-compatible components:
- `A2AClient` class (uses only `fetch` API)
- All necessary TypeScript types
- No server-side dependencies

### 2. Updated Package Exports

Modified `package.json` to provide conditional exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./client": {
      "types": "./dist/client.d.ts",
      "import": "./dist/client.js",
      "require": "./dist/client.cjs"
    }
  }
}
```

### 3. Updated Build Process

Modified the build script to compile both entry points:
```json
{
  "scripts": {
    "build": "tsup src/index.ts src/client.ts --format esm,cjs --dts"
  }
}
```

## Usage

### For Browser/Vite Projects

Use the client-only import:

```typescript
import { A2AClient } from '@a2a-js/sdk/client'
import { v4 as uuidv4 } from 'uuid'

// All the same functionality, but browser-compatible
const client = new A2AClient('http://localhost:3000')

const messageId = uuidv4()
const message = {
  messageId,
  role: 'user' as const,
  parts: [{ kind: 'text' as const, text: 'Hello!' }],
  kind: 'message' as const
}

// Use client methods normally
const response = await client.sendMessage({ message })
```

### For Node.js Projects

Continue using the main export for full functionality:

```typescript
import { A2AClient, A2AExpressApp, DefaultRequestHandler } from '@a2a-js/sdk'
// Full server and client functionality available
```

## Test Results

The fix was verified with a Vite test project:

1. ✅ **TypeScript compilation**: No type errors
2. ✅ **Vite build**: Successful production build
3. ✅ **Vite dev server**: Starts without errors
4. ✅ **Runtime functionality**: A2AClient works correctly in browser environment

## Benefits

- **No Breaking Changes**: Existing Node.js usage continues to work
- **Browser Compatible**: New `/client` export works in all browser bundlers
- **Type Safety**: Full TypeScript support for both entry points
- **Small Bundle Size**: Client-only import excludes unnecessary server code

## Files Modified

1. `src/client.ts` - New browser-compatible entry point
2. `package.json` - Updated exports and build script
3. `vite-test/` - Test project demonstrating the fix