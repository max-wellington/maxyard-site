## Bayside Yard Parking

Minimalist marketing site for a residential parking lot near Raymond James Stadium. Inspired by the flow of mikes-lot.com but pared back to the essentials: event highlights, reservation instructions, and fast contact options.

### Stack

- Next.js App Router (16.x)
- TypeScript + Tailwind CSS

### Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

### Project structure

- `src/app/page.tsx` – landing page with hero, steps, and featured events
- `src/app/events/page.tsx` – full event listing
- `src/app/contact/page.tsx` – simple contact options and FAQs
- `src/data/events.ts` – curated event data displayed across pages
- `src/components/*` – shared header and footer

### Deploying

Any static hosting provider that supports Next.js can serve the site. Common flows:

- **Vercel**: `vercel deploy`
- **Netlify**: build command `npm run build`, publish directory `.next`

### Customizing

- Update copy and pricing in `src/data/events.ts`
- Adjust colors and spacing via Tailwind tokens in `src/app/globals.css`
- Replace contact details in `src/components/site-footer.tsx` and contact page

> Note: The site is informational only—no payment processing or authentication layers are included.
