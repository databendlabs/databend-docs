import axios from 'axios';

export default async function handler() {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
  const deployUrl = 'https://api.vercel.com/v12/now/deployments';
  await axios.post(deployUrl, {
    name: 'databend-docs',
    project: VERCEL_PROJECT_ID,
    ...(VERCEL_TEAM_ID ? { teamId: VERCEL_TEAM_ID } : {})
  }, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}