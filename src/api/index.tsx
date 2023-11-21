import axios from 'axios';
import docusaurusConfig from '@generated/docusaurus.config';
const { customFields: { askBendUrl } = {} } = docusaurusConfig;
export function getAnswers(question: string) {
  return axios.post(`${askBendUrl}/query`, {
    query: question
  });
}
export function evaluateDocs(data: {domain: string, path: string, action: 'Yes' | 'No', comment?: string}) {
  return axios.post('/api/v1/doc-feedbacks', data);
}