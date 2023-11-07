import axios from 'axios';

export default async function handler() {
  await axios.post(process.env.VERCEL_AUTO_DEPLOY);
}