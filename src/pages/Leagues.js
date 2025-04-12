import React, { useState, useEffect } from 'react';
import { getLeaguesList, getLeagueTable } from '../services/api';

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leagueTable, setLeagueTable] = useState([]);
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
      const fetchLeagueTable = async () => {
        try {
          const response = await getLeagueTable(selectedLeague);
          setLeagueTable(response.data.result);
        } catch (err) {
          setError('Puan durumu yüklenirken bir hata oluştu.');
        }
      };

      fetchLeagueTable();
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
      <h1 className="text-3xl font-bold text-primary mb-6">Ligler</h1>
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

      {selectedLeague && leagueTable.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-left">Sıra</th>
                <th className="py-3 px-4 text-left">Takım</th>
                <th className="py-3 px-4 text-center">O</th>
                <th className="py-3 px-4 text-center">G</th>
                <th className="py-3 px-4 text-center">B</th>
                <th className="py-3 px-4 text-center">M</th>
                <th className="py-3 px-4 text-center">P</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((team) => (
                <tr key={team.rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{team.rank}</td>
                  <td className="py-3 px-4 font-medium">{team.team}</td>
                  <td className="py-3 px-4 text-center">{team.play}</td>
                  <td className="py-3 px-4 text-center">{team.win}</td>
                  <td className="py-3 px-4 text-center">{team.draw || 0}</td>
                  <td className="py-3 px-4 text-center">{team.lose}</td>
                  <td className="py-3 px-4 text-center font-bold">{team.point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leagues; 