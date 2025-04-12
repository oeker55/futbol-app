import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResults, getLeaguesList } from '../services/api';

function Home() {
  const [todayMatches, setTodayMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await getLeaguesList();
        console.log('Leagues Response:', response.data);
        if (response.data && response.data.success) {
          // Sadece futbol liglerini filtrele ve özet/gol olmayanları al
          const footballLeagues = response.data.result.filter(league => 
            !league.key.includes('/mac-ozetleri-goller/') && 
            !league.key.includes('/gundem/') &&
            !league.key.includes('basketbol') &&
            !league.key.includes('nba') &&
            !league.key.includes('euroleague')
          );
          console.log('Filtered Leagues:', footballLeagues);
          setLeagues(footballLeagues);
        }
      } catch (err) {
        console.error('Ligler yüklenirken hata:', err);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchTodayMatches = async () => {
      try {
        const matchesByLeague = {};

        for (const league of leagues) {
          const response = await getResults(league.key);
          console.log(`Matches for ${league.league}:`, response.data);
          if (response.data && Array.isArray(response.data.result)) {
            // Türkiye saati için bugünün tarihini al
            const today = new Date();
            const todayStr = today.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' });
            console.log('Today:', todayStr);

            // Sadece bugünün maçlarını filtrele
            const todayMatches = response.data.result.filter(match => {
              const matchDate = new Date(match.date);
              const matchDateStr = matchDate.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' });
              console.log('Match Date:', matchDateStr, 'Match:', match);
              return matchDateStr === todayStr;
            });

            console.log(`Today's matches for ${league.league}:`, todayMatches);

            matchesByLeague[league.key] = {
              name: league.league,
              matches: todayMatches
            };
          } else {
            matchesByLeague[league.key] = {
              name: league.league,
              matches: []
            };
          }
        }

        console.log('All matches by league:', matchesByLeague);
        setTodayMatches(matchesByLeague);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Maçlar yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    if (leagues.length > 0) {
      fetchTodayMatches();
    }
  }, [leagues]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    };
    return date.toLocaleTimeString('tr-TR', options);
  };

  const formatScore = (score) => {
    if (score === 'undefined-undefined') {
      return '-';
    }
    return score;
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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Futbol Dünyasına Hoş Geldiniz</h1>
        <p className="text-xl text-gray-600">En güncel futbol haberleri, maç sonuçları ve istatistikler</p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-primary">Bugünün Maçları</h2>
        {Object.entries(todayMatches).map(([leagueKey, leagueData]) => (
          <div key={leagueKey} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-4">{leagueData.name}</h3>
            <div className="space-y-4">
              {Array.isArray(leagueData.matches) && leagueData.matches.length > 0 ? (
                leagueData.matches.map((match, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-center flex-1">
                      <h4 className="font-semibold">{match.home}</h4>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-xl font-bold">{formatScore(match.score)}</div>
                      <div className="text-sm text-gray-500">{formatDate(match.date)}</div>
                    </div>
                    <div className="text-center flex-1">
                      <h4 className="font-semibold">{match.away}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Bu ligde bugün maç bulunmamaktadır.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/leagues" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-primary mb-2">Ligler</h2>
          <p className="text-gray-600">Tüm ligleri keşfedin ve güncel puan durumlarını görüntüleyin</p>
        </Link>

        <Link to="/teams" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-primary mb-2">Takımlar</h2>
          <p className="text-gray-600">Takımların detaylı bilgilerini ve kadrolarını inceleyin</p>
        </Link>

        <Link to="/matches" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-primary mb-2">Maçlar</h2>
          <p className="text-gray-600">Güncel maç programları ve sonuçları takip edin</p>
        </Link>
      </div>
    </div>
  );
}

export default Home; 