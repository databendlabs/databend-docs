import axios from 'axios';
import docusaurusConfig from '@generated/docusaurus.config';
import { isChinaArea } from '../utils/tools';
const { customFields: { askBendUrl } = {} } = docusaurusConfig;
export const CLOUD_LINK = isChinaArea() ? 'https://app.databend.cn' :'https://app.databend.com';
export function getAnswers(question: string) {
  return axios.post(`${askBendUrl}/query`, {
    query: question
  });
}
export function evaluateDocs(data: {domain: string, path: string, action: 'Yes' | 'No', comment?: string}) {
  return axios.post(`${CLOUD_LINK}/api/v1/doc-feedbacks`, data);
}