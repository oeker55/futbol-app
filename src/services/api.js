import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://api.collectapi.com/football';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `apikey ${API_KEY}`
  }
});

// Ligler listesi
export const getLeaguesList = () => api.get('/leaguesList');

// Maç sonuçları
export const getResults = (leagueKey) => api.get(`/results?data.league=${leagueKey}`);

// Puan durumu
export const getLeagueTable = (leagueKey) => api.get(`/league?data.league=${leagueKey}`);

// Gol kralları
export const getGoalKings = (leagueKey) => api.get(`/goalKings?data.league=${leagueKey}`);

export default api; 