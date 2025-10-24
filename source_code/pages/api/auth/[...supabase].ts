import type { NextApiHandler } from 'next'

// Import the module as a namespace so we work across different package versions.
// Some releases export `handleAuth` as a named export, some as a default, and
// some provide it as a property on the module object. The code below picks the
// function whichever shape your installed package uses.
import * as AuthHelpers from '@supabase/auth-helpers-nextjs'

const handlerFactory =
  // named export
  (AuthHelpers as any).handleAuth ??
  // default export that is a function
  (AuthHelpers as any).default ??
  // default that contains handleAuth
  (AuthHelpers as any).default?.handleAuth ??
  null

if (!handlerFactory || typeof handlerFactory !== 'function') {
  // Fail fast with a helpful message in dev if the package API is unexpected.
  // If you see this error, check your installed @supabase/auth-helpers-nextjs version.
  throw new Error(
    'Could not find handleAuth() in @supabase/auth-helpers-nextjs. ' +
      'Run `npm ls @supabase/auth-helpers-nextjs` and ensure a compatible version is installed.'
  )
}

const handler: NextApiHandler = handlerFactory()
export default handler
