import React, { useState, useEffect } from 'react';
import { getLeaguesList, getResults } from '../services/api';

function Matches() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await getLeaguesList();
        // Benzersiz ligleri filtrele
        const uniqueLeagues = response.data.result.reduce((acc, current) => {
          const x = acc.find(item => item.key === current.key);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setLeagues(uniqueLeagues);
        setLoading(false);
      } catch (err) {
        setError('Ligler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      const fetchMatches = async () => {
        try {
          const response = await getResults(selectedLeague);
          setMatches(response.data.result);
        } catch (err) {
          setError('Maç sonuçları yüklenirken bir hata oluştu.');
        }
      };

      fetchMatches();
    }
  }, [selectedLeague]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    };
    
    return date.toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Maç Sonuçları</h1>
      <div className="mb-6">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Lig Seçin</option>
          {leagues.map((league) => (
            <option key={`${league.key}-${league.league}`} value={league.key}>
              {league.league}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <h3 className="font-semibold">{match.home}</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{match.score}</div>
                <div className="text-sm text-gray-500">{formatDate(match.date)}</div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{match.away}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches; 