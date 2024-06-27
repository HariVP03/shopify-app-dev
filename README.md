# Shopify Auth with Vercel KV

This package provides a simple implementation of Shopify authentication using Vercel KV. It handles all scenarios where token exchange authentication is not supported.

## Features

- **Easy Integration**: Quickly add Shopify authentication to your application.
- **Vercel KV**: Utilizes Vercel KV for storing authentication tokens securely.
- **Comprehensive Handling**: Covers all scenarios where token exchange auth is not supported.

## Installation

```bash
npm install shopify-dev-tools
```

## Usage

1. Initialise the Shopify provider with the required parameters.

```javascript

import { shopifyApi } from "@shopify/shopify-api";
import { authProviderServer } from "shopify-dev-tools";

const shopifyProvider = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: [
   ...
  ],
  hostName: ...,
  hostScheme: "https",
  apiVersion: LATEST_API_VERSION,
  billing: { ... }
});

```

2. Pass the `shopifyProvider` as an argument to the `authProviderServer` function to login the user.

```javascript
import { authProviderServer } from "shopify-dev-tools";

export default async function LoginPage({ searchParams }: { searchParams: any }) {
  await authProviderServer.login(shopifyProvider, searchParams, {
    manualOAuthRedirect: `${process.env.SHOPIFY_APP_URL}/api/auth/callback`
  })

  ...
}
```

3. Get the session anytime using the `authProviderServer` function.

```javascript

import { authProviderServer } from "shopify-dev-tools";

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const session = await authProviderServer.getSession(searchParams);

  ...
}

```

## Note

For all of this to work you need to pass the Shopify search params whenever user navigates to a new page in your application. The search params are the query parameters that are passed to the URL by Shopify after the user opens the app.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
