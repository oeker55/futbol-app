import React, { useState, useEffect } from 'react';
import { getLeaguesList, getGoalKings } from '../services/api';

function GoalKings() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [goalKings, setGoalKings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await getLeaguesList();
        setLeagues(response.data.result);
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
      const fetchGoalKings = async () => {
        try {
          const response = await getGoalKings(selectedLeague);
          setGoalKings(response.data.result);
        } catch (err) {
          setError('Gol kralları yüklenirken bir hata oluştu.');
        }
      };

      fetchGoalKings();
    }
  }, [selectedLeague]);

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
      <h1 className="text-3xl font-bold text-primary mb-6">Gol Kralları</h1>
      <div className="mb-6">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Lig Seçin</option>
          {leagues.map((league) => (
            <option key={league.key} value={league.key}>
              {league.league}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {goalKings.map((player, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-primary w-8">{index + 1}.</div>
                <div>
                  <h3 className="text-xl font-semibold">{player.name}</h3>
                  <p className="text-gray-600">Maç: {player.play}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{player.goals}</div>
                <div className="text-sm text-gray-500">Gol</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalKings; 