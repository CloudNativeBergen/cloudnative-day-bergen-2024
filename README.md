# Cloud Native Bergen

Official website for Cloud Native Bergen and CloudNative Day Bergen 2024.

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Sanity

Install the Sanity CLI:

```bash
npm install --global sanity@latest
```

Deploy Sanity Studio to Sanity.io

```bash
cd studio && sanity deploy
```

## Models

Models are defined in `lib/<type>/types.ts` and in `sanity/schemaTypes/<type>.ts` for the representation in Sanity Studio.

## Authentication

Authentication is handled by [next-auth](https://next-auth.js.org/). To enable authentication, you need to create a `.env.local` file in the root of the project and add the following environment variables:

```bash
NEXTAUTH_SECRET=YOUR_SECRET
```

To generate a secret, you can run the following command:

```bash
openssl rand -base64 32
```

### New providers

To add a new provider, you need to add a new provider in the `lib/auth.ts` file and add the corresponding environment variables to the `.env.local` file.

You also need to update the `app/profile/email/route.ts` file to handle the new provider.

### GitHub provider

```bash
AUTH_GITHUB_ID=YOUR_GITHUB_ID
AUTH_GITHUB_SECRET=YOUR_GITHUB_SECRET
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
