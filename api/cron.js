import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.post(process.env.VERCEL_AUTO_DEPLOY);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
