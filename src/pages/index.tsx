import { Redirect } from '@docusaurus/router';

// Production: Vercel rewrites / to /guides/ (URL stays /)
// Development: Client-side redirect to /guides/
export default function Home(): JSX.Element {
  return <Redirect to="/guides/" />;
}
