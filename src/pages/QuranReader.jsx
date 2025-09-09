import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaArrowLeft } from 'react-icons/fa';

const QuranReader = () => {
  const navigate = useNavigate();

useEffect(() => {
    window.scrollTo(0, 0);
  }, []);




  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('');
  const [ayah, setAyah] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Juz functionality - added new state
  const [readingMode, setReadingMode] = useState('surah'); // 'surah' or 'juz'
  const [juzNumber, setJuzNumber] = useState('');
  const [juzVerses, setJuzVerses] = useState([]);
  // Page functionality - added new state
  const [pageNumber, setPageNumber] = useState('');
  const [pageVerses, setPageVerses] = useState([]);
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState(false);
  const [isJuzDropdownOpen, setIsJuzDropdownOpen] = useState(false);
 
  // Load all surahs on mount
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => setSurahs(data.data))
      .catch(() => setError('Failed to load Surah list'));
  }, []);

  // Juz fetch function - using your working code
    const handleFetchJuz = async () => {
    if (!juzNumber) return;
    
    setLoading(true);
    setError('');
    setJuzVerses([]);
    setResult(null); // Clear any previous Surah/Ayah results
    
    try {
      // Fetch Arabic text
      const arabicResponse = await fetch(`http://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`);
      if (!arabicResponse.ok) {
        throw new Error(`HTTP error! status: ${arabicResponse.status}`);
      }
      const arabicData = await arabicResponse.json();
      
      // Fetch Urdu translation
      const urduResponse = await fetch(`http://api.alquran.cloud/v1/juz/${juzNumber}/ur.junagarhi`);
      if (!urduResponse.ok) {
        throw new Error(`HTTP error! status: ${urduResponse.status}`);
      }
      const urduData = await urduResponse.json();
      
      if (arabicData.code === 200 && urduData.code === 200 && 
          arabicData.data && urduData.data && 
          arabicData.data.ayahs && urduData.data.ayahs) {
        
        // Combine Arabic and Urdu data
        const arabicAyahs = arabicData.data.ayahs;
        const urduAyahs = urduData.data.ayahs;
        
        const combinedData = arabicAyahs.map((ayah, index) => ({
          number: ayah.number,
          text: ayah.text,
          urduText: urduAyahs[index]?.text || '',
          surah: ayah.surah,
          numberInSurah: ayah.numberInSurah
        }));
        
        setJuzVerses(combinedData);
      } else {
        setError('No data found for this Juz');
      }
    } catch (err) {
      console.error('Error fetching Juz:', err);
      setError('Failed to fetch Juz data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPage = async () => {
    if (!pageNumber) return;

    setLoading(true);
    setError('');
    setPageVerses([]);
    setResult(null); // Clear any previous Surah/Ayah results
    setJuzVerses([]); // Clear any previous Juz results

    try {
      // Fetch Arabic text
      const arabicResponse = await fetch(`http://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
      if (!arabicResponse.ok) {
        throw new Error(`HTTP error! status: ${arabicResponse.status}`);
      }
      const arabicData = await arabicResponse.json();

      // Fetch English translation
      const englishResponse = await fetch(`http://api.alquran.cloud/v1/page/${pageNumber}/en.asad`);
      if (!englishResponse.ok) {
        throw new Error(`HTTP error! status: ${englishResponse.status}`);
      }
      const englishData = await englishResponse.json();

      if (arabicData.code === 200 && englishData.code === 200 &&
          arabicData.data && englishData.data &&
          arabicData.data.ayahs && englishData.data.ayahs) {

        // Combine Arabic and English data
        const arabicAyahs = arabicData.data.ayahs;
        const englishAyahs = englishData.data.ayahs;

        const combinedData = arabicAyahs.map((ayah, index) => ({
          number: ayah.number,
          text: ayah.text,
          englishText: englishAyahs[index]?.text || '',
          surah: ayah.surah,
          numberInSurah: ayah.numberInSurah
        }));

        setPageVerses(combinedData);
      } else {
        setError('No data found for this Page');
      }
    } catch (err) {
      console.error('Error fetching Page:', err);
      setError('Failed to fetch Page data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!selectedSurah) {
      setError('Please select a Surah.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const isFullSurah = ayah.trim() === '';
    const endpoint = isFullSurah
      ? `surah/${selectedSurah}`
      : `ayah/${selectedSurah}:${ayah}`;
    
    const url = `https://api.alquran.cloud/v1/${endpoint}/editions/quran-uthmani,ur.junagarhi`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.code !== 200) {
        const errorMessage = typeof data.data === 'string' ? data.data : 'Failed to fetch data. Please check the Ayah number.';
        throw new Error(errorMessage);
      }

      if (isFullSurah) {
        const arabicAyahs = data.data[0].ayahs;
        const urduAyahs = data.data[1].ayahs;
        const combinedAyahs = arabicAyahs.map((ayah, index) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          urdu: urduAyahs[index].text,
        }));
        setResult({ type: 'surah', data: { name: data.data[0].englishName, ayahs: combinedAyahs } });
      } else {
        setResult({
          type: 'ayah',
          data: {
            arabic: data.data[0].text,
            urdu: data.data[1].text,
            number: data.data[0].numberInSurah,
            surahName: data.data[0].surah.englishName
          }
        });
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#ffffff]/10 pt-24 font-sans">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-8 gap-8 flex-1 mb-20">
        {/* Back Button */}
        <div className="md:w-auto flex items-start pt-6">
          <button
            onClick={() => navigate('/learning-path')}
            className="bg-white/90 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-[#e0c33e]/10 group"
            title="Back to Learning Path"
          >
            <FaArrowLeft className="text-[#055160] text-xl group-hover:text-[#033642] transition-colors" />
          </button>
        </div>

        <div className="w-full bg-gradient-to-br from-[#033642]/10 to-[#e0c33e]/10 rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#055160]">📖 Quran Reader</h2>
            <p className="text-gray-500 mt-2">Select a Surah/Ayah or Juz to read with Urdu translation.</p>
          </div>

          {/* Mode Selection */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-2 shadow-md">
              <button
                onClick={() => {
                  setReadingMode('surah');
                  setJuzVerses([]); // Clear Juz results when switching to Surah mode
                  setPageVerses([]); // Clear Page results
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  readingMode === 'surah'
                    ? 'bg-[#e0c33e] text-[#055160]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📕 Surah Mode
              </button>
              <button
                onClick={() => {
                  setReadingMode('juz');
                  setResult(null); // Clear Surah/Ayah results when switching to Juz mode
                  setPageVerses([]); // Clear Page results
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ml-2 ${
                  readingMode === 'juz'
                    ? 'bg-[#e0c33e] text-[#055160]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📜 Juz Mode
              </button>
              <button
                onClick={() => {
                  setReadingMode('page');
                  setResult(null); 
                  setJuzVerses([]);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition ml-2 ${
                  readingMode === 'page'
                    ? 'bg-[#e0c33e] text-[#055160]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📄 Page Mode
              </button>
            </div>
          </div>

          {readingMode === 'surah' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="md:col-span-2">
              <label htmlFor="surah-select" className="block text-sm font-medium text-[#055160] mb-1">Surah</label>
              <select
                id="surah-select"
                value={selectedSurah}
                onChange={e => {
                  setSelectedSurah(e.target.value)
                  setIsSurahDropdownOpen(false)
                }}
                onFocus={() => setIsSurahDropdownOpen(true)}
                onBlur={() => setIsSurahDropdownOpen(false)}
                onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
                className="w-full p-3 border border-[#055160]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e0c33e] focus:border-[#e0c33e] transition bg-white"
                size={isSurahDropdownOpen ? 5 : 1}
              >
                <option value="">Select Surah</option>
                {surahs.map(s => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.englishName} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="ayah-input" className="block text-sm font-medium text-[#055160] mb-1">Ayah (Optional)</label>
              <input
                id="ayah-input"
                type="number"
                placeholder="Leave blank for full Surah"
                value={ayah}
                onChange={e => setAyah(e.target.value)}
                className="w-full p-3 border border-[#055160]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e0c33e] focus:border-[#e0c33e] transition bg-white"
              />
            </div>

            <div className="md:col-span-1">
              <button 
                onClick={handleFetch}
                className="w-full bg-gradient-to-br from-[#e0c33e] to-[#055160] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#055160] hover:to-[#e0c33e] focus:outline-none focus:ring-4 focus:ring-[#e0c33e]/50 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Load Surah
              </button>
            </div>
            </div>
          )}

          {readingMode === 'juz' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <label htmlFor="juz-select" className="block text-sm font-medium text-[#055160] mb-1">Juz (1–30)</label>
                <select
                  id="juz-select"
                  value={juzNumber}
                  onChange={(e) => {
                    setJuzNumber(e.target.value)
                    setIsJuzDropdownOpen(false)
                  }}
                  onFocus={() => setIsJuzDropdownOpen(true)}
                  onBlur={() => setIsJuzDropdownOpen(false)}
                  onClick={() => setIsJuzDropdownOpen(!isJuzDropdownOpen)}
                  className="w-full p-3 border border-[#055160]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e0c33e] focus:border-[#e0c33e] transition bg-white"
                  size={isJuzDropdownOpen ? 5 : 1}
                >
                  <option value="">-- Select Juz --</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Juz {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <button 
                  onClick={handleFetchJuz}
                  className="w-full bg-gradient-to-br from-[#e0c33e] to-[#055160] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#055160] hover:to-[#e0c33e] focus:outline-none focus:ring-4 focus:ring-[#e0c33e]/50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Load Juz
                </button>
              </div>
            </div>
          )}

          {readingMode === 'page' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <label htmlFor="page-input" className="block text-sm font-medium text-[#055160] mb-1">Page (1–604)</label>
                <input
                  id="page-input"
                  type="number"
                  placeholder="Enter page number (1-604)"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="w-full p-3 border border-[#055160]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e0c33e] focus:border-[#e0c33e] transition bg-white"
                />
              </div>
              <div className="md:col-span-1">
                <button 
                  onClick={handleFetchPage}
                  className="w-full bg-gradient-to-br from-[#e0c33e] to-[#055160] text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-[#055160] hover:to-[#e0c33e] focus:outline-none focus:ring-4 focus:ring-[#e0c33e]/50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Load Page
                </button>
              </div>
            </div>
          )}

          {error && 
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          }

          {loading && (
            <div className="flex justify-center items-center mt-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#e0c33e]"></div>
            </div>
          )}

          {/* Page Results Display */}
          {pageVerses.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="text-3xl font-bold text-center text-[#055160]">Page {pageNumber}</h2>
              {pageVerses.map((verse) => (
                <div
                  key={verse.number}
                  className="p-6 bg-[#e0c33e]/10 rounded-xl shadow-inner border-b border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-[#055160] mb-2">
                    Surah {verse.surah.number}. {verse.surah.englishName} — Ayah {verse.numberInSurah}
                  </h4>
                  <p className="text-3xl font-muhammadi text-right leading-relaxed text-gray-900 mb-4" dir="rtl">
                    {verse.text}
                  </p>
                  <p className="text-lg text-left text-gray-600">{verse.englishText}</p>
                </div>
              ))}
            </div>
          )}

          {/* Juz Results Display */}
          {juzVerses.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="text-3xl font-bold text-center text-[#055160]">Juz {juzNumber}</h2>
              {juzVerses.map((verse) => (
                <div
                  key={verse.number}
                  className="p-6 bg-[#e0c33e]/10 rounded-xl shadow-inner border-b border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-[#055160] mb-2">
                    Surah {verse.surah.number}. {verse.surah.englishName} — Ayah {verse.numberInSurah}
                  </h4>
                  <p className="text-3xl font-muhammadi text-right leading-relaxed text-gray-900 mb-4" dir="rtl">
                    {verse.text}
                  </p>
                  <p className="text-lg text-right text-gray-600" dir="rtl">{verse.urduText}</p>
                </div>
              ))}
            </div>
          )}

          {result && result.type === 'surah' && (
            <div className="mt-8 space-y-6">
              <h2 className="text-3xl font-bold text-center text-[#055160]">Surah {result.data.name}</h2>
              {result.data.ayahs.map(ayah => (
                <div key={ayah.number} className="p-6 bg-[#e0c33e]/10 rounded-xl shadow-inner">
                  <p className="text-3xl font-muhammadi text-right leading-relaxed text-gray-900 mb-4" dir="rtl">{ayah.arabic} <span className="text-xl text-[#055160]">({ayah.number})</span></p>
                  <p className="text-lg text-right text-gray-600" dir="rtl">{ayah.urdu}</p>
                </div>
              ))}
            </div>
          )}

          {result && result.type === 'ayah' && (
            <div className="mt-8 p-8 bg-[#e0c33e]/10 rounded-xl shadow-inner space-y-6">
              <h2 className="text-3xl font-bold text-center text-[#055160]">Surah {result.data.surahName}, Ayah {result.data.number}</h2>
              <div>
                <h3 className="text-2xl font-semibold text-[#055160] mb-5 text-right" dir="rtl">الآية الكريمة</h3>
                <p className="text-4xl md:text-5xl font-muhammadi text-right leading-relaxed text-gray-900" dir="rtl">{result.data.arabic}</p>
              </div>
              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-2xl font-semibold text-[#055160] mb-2 text-right" dir="rtl">ترجمہ</h3>
                <p className="text-xl text-right text-gray-600" dir="rtl">{result.data.urdu}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuranReader;
