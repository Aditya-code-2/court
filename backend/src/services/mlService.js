import axios from 'axios';
import { env } from '../config/env.js';

const mlApi = axios.create({ baseURL: env.mlServiceUrl, timeout: 7000 });

export const analyzeCase = async (payload) => {
  const { data } = await mlApi.post('/analyze', payload);
  return data;
};

export const recommendCases = async (cases) => {
  const { data } = await mlApi.post('/recommend', { cases });
  return data;
};
