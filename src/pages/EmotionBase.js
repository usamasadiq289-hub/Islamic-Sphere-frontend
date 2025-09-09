import React, { useState, useEffect } from "react";
import "./emotionbase.css";
import Navbar from "../components/Navbar";
import EmotionService from '../apis/emotion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";

const EmotionBase = () => {

useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const [emotion, setEmotion] = useState("happy");
  const [quranCount, setQuranCount] = useState(2);
  const [hadithCount, setHadithCount] = useState(1);
  const [selectedAyats, setSelectedAyats] = useState([]);
  const [selectedHadeeths, setSelectedHadeeths] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleEmotionClick("happy", 2, 1);
  }, []);

  const handleEmotionClick = async (emotionType, quranCount, hadithCount) => {
    setLoading(true);
    try {
      const response = await EmotionService.getRandomDuas(
        emotionType,
        quranCount,
        hadithCount
      );

      if (response.success) {
        const { quranicDuas, hadithDuas } = EmotionService.formatDuaResponse(response.data);
        setSelectedAyats(quranicDuas);
        setSelectedHadeeths(hadithDuas);
        setEmotion(emotionType);
      } else {
        toast.error("Failed to fetch duas. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (type, value) => {
    if (type === 'quran') {
      setQuranCount(value);
    } else {
      setHadithCount(value);
    }

    let quranValue = quranCount;
    let hadithValue = hadithCount;

    if (type === 'quran') {
      quranValue = value;
    } else {
      hadithValue = value;
    }

    handleEmotionClick(emotion, quranValue, hadithValue);
  };

  return (
    <div className="bgc-emotion">

      <Navbar />
      <div className="main-content-wrapper">
        <div className="emotion-base-section">
          <div className="header-sectioning">
            <div className="header-content">
              <div className="hero-badge">Islamic Emotions</div>
              <h1 className="animated-gradient-heading">Islamic Emotional Guidance</h1>
              <p className="header-description">
                Find spiritual comfort through Quranic verses and Hadith based on your emotional state.
              </p>

              <div className="content-controls">
                <div className="selector-group">
                  <label htmlFor="quranCount">
                    <span className="selector-hint">Select verses (1-5)</span>
                  </label>
                  <select
                    id="quranCount"
                    value={quranCount}
                    onChange={(e) => handleCountChange('quran', Number(e.target.value))}
                    className="count-select"
                    disabled={loading}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="selector-group">
                  <label htmlFor="hadithCount">
                    <span className="selector-hint">Select hadiths (1-5)</span>
                  </label>
                  <select
                    id="hadithCount"
                    value={hadithCount}
                    onChange={(e) => handleCountChange('hadith', Number(e.target.value))}
                    className="count-select"
                    disabled={loading}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="hero-scroll-indicator">
              <div className="scroll-arrow"></div>
              <div className="scroll-text">Explore Emotions</div>
            </div>
          </div>

          <div className="content-sections">
            <div className="emotions-section">
              <h2>How are you feeling?</h2>
              <div className="emotion-buttons">
                {["happy", "sad", "angry", "anxious", "grateful", "hopeful"].map((emotionType) => (
                  <button
                    key={emotionType}
                    onClick={() => handleEmotionClick(emotionType)}
                    className={`emotion-btn ${emotion === emotionType ? "active" : ""}`}
                    disabled={loading}
                  >
                    {getEmotionEmoji(emotionType)} {capitalizeFirstLetter(emotionType)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="loading-section">
                <div className="loader"></div>
                <p>Loading guidance...</p>
              </div>
            ) : (
              selectedAyats.length > 0 && (
                <div className="emotion-result">
                  <div className="verses-section">
                    <div className="section-header">
                      <h3 className="text-2xl font-bold text-primary-700 mb-2">Quranic Guidance</h3>
                      <p className="text-gray-600 mb-6">
                        Find solace in these verses from the Holy Quran
                      </p>
                    </div>
                    {selectedAyats.map((ayat, index) => (
                      <div key={`ayat-${index}`} className="result-item bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-primary-500">
                        <div className="mb-4">
                          <p className="arabic-text text-2xl text-right mb-4" dir="rtl">
                            {ayat.arabic}
                          </p>
                          <p className="translation text-lg mb-2" dir="rtl">
                            {ayat.urduTranslation}
                          </p>
                        </div>
                        <div className="reference-container">
                          <p className="reference text-sm text-gray-600">
                            <span className="font-semibold">Reference:</span> {ayat.reference}
                          </p>
                          {ayat.createdAt && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Added:</span> {new Date(ayat.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hadith-section mt-8">
                    <div className="section-header">
                      <h3 className="text-2xl font-bold text-primary-700 mb-2">Prophetic Wisdom</h3>
                      <p className="text-gray-600 mb-6">
                        Guidance from the teachings of Prophet Muhammad ﷺ
                      </p>
                    </div>
                    {selectedHadeeths.map((hadith, index) => (
                      <div key={`hadith-${index}`} className="result-item bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-primary-500">
                        <div className="mb-4">
                          <p className="arabic-text text-2xl text-right mb-4" dir="rtl">
                            {hadith.arabic}
                          </p>
                          <p className="translation text-lg mb-2" dir="rtl">
                            {hadith.urduTranslation}
                          </p>
                        </div>
                        <div className="reference-container">
                          <p className="reference text-sm text-gray-600">
                            <span className="font-semibold">Source:</span> {hadith.reference}
                          </p>
                          {hadith.createdAt && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Added:</span> {new Date(hadith.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

// Helper functions
const getEmotionEmoji = (emotion) => {
  const emojis = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    anxious: "😰",
    grateful: "🙏",
    hopeful: "🌟"
  };
  return emojis[emotion];
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default EmotionBase;
