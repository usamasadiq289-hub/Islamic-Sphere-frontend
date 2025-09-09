import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaHandHoldingHeart, FaBalanceScale, FaUsers, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import './Prayer.css'; // We'll reuse the Prayer.css styles
import './emotionbase.css'; // Import for MUHAMMADIBOLD font
import Footer from '../components/Footer';
const characterTopics = {
  'manners': {
    title: 'Islamic Manners (Adab)',
    titleAr: 'الْآدَابُ الْإِسْلَامِيَّةُ',
    titleUrdu: 'اسلامی آداب',
    icon: <FaHandHoldingHeart className="topic-icon" />,
    content: [
      { 
        item: 'Greeting:', 
        description: 'The etiquette of saying Salam.', 
        descriptionUrdu: 'سلام کہنے کے آداب۔',
        itemAr: 'التَّحِيَّةُ:', 
        descriptionAr: 'آدَابُ إلقاءِ السَّلَامِ.',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
        translation: 'Peace be upon you and the mercy of Allah and His blessings.',
        translationUrdu: 'آپ پر سلام اور اللہ کی رحمت اور اس کی برکتیں ہوں۔',
        reference: 'Sunan Abu Dawood 5195',
        source: 'Hadith'
      },
      { 
        item: 'Eating & Drinking:', 
        description: 'Manners related to meals.', 
        descriptionUrdu: 'کھانے پینے کے آداب۔',
        itemAr: 'الْأَكْلُ وَالشُّرْبُ:', 
        descriptionAr: 'آدَابٌ تَتَعَلَّقُ بِالْوَجَبَاتِ.',
        arabic: 'بِسْمِ اللَّهِ وَالْحَمْدُ لِلَّهِ',
        translation: 'In the name of Allah, and praise be to Allah.',
        translationUrdu: 'اللہ کے نام سے، اور تمام تعریف اللہ کے لیے۔',
        reference: 'Sahih al-Bukhari 5459',
        source: 'Hadith'
      },
      { 
        item: 'Respect for Elders:', 
        description: 'Showing honor and respect to older people.', 
        descriptionUrdu: 'بزرگوں کا احترام اور تعظیم۔',
        itemAr: 'احْتِرَامُ الْكِبَارِ:', 
        descriptionAr: 'إِظْهَارُ التَّقْدِيرِ وَالِاحْتِرَامِ لِكِبَارِ السِّنِّ.',
        arabic: 'لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيرَنَا وَيُوَقِّرْ كَبِيرَنَا',
        translation: 'He is not one of us who does not have mercy on our young and does not honor our elders.',
        translationUrdu: 'وہ ہم میں سے نہیں جو ہمارے چھوٹوں پر رحم نہ کرے اور بڑوں کا احترام نہ کرے۔',
        reference: 'Sunan al-Tirmidhi 1919',
        source: 'Hadith'
      },
      { 
        item: 'Visiting the Sick:', 
        description: 'The importance and manners of visiting those who are ill.', 
        descriptionUrdu: 'مریضوں کی عیادت کی اہمیت اور آداب۔',
        itemAr: 'عِيَادَةُ الْمَرِيضِ:', 
        descriptionAr: 'أَهَمِّيَّةُ وَآدَابُ زِيَارَةِ الْمَرْضَى.',
        arabic: 'مَنْ عَادَ مَرِيضًا لَمْ يَزَلْ فِي خُرْفَةِ الْجَنَّةِ',
        translation: 'Whoever visits a sick person remains in the harvest of Paradise.',
        translationUrdu: 'جو کوئی کسی مریض کی عیادت کرتا ہے وہ جنت کی کھجوروں میں رہتا ہے۔',
        reference: 'Sahih Muslim 2568',
        source: 'Hadith'
      },
    ]
  },
  'ethics': {
    title: 'Ethics & Morality',
    titleAr: 'الْأَخْلَاقُ وَالْقِيَمُ',
    titleUrdu: 'اخلاق اور اقدار',
    icon: <FaBalanceScale className="topic-icon" />,
    content: [
      { 
        item: 'Honesty (Sidq):', 
        description: 'Truthfulness in speech and actions.', 
        descriptionUrdu: 'قول اور عمل میں سچائی۔',
        itemAr: 'الصِّدْقُ:', 
        descriptionAr: 'قَوْلُ الْحَقِّ فِي الْأَقْوَالِ وَالْأَفْعَالِ.',
        arabic: 'إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ',
        translation: 'Verily, truthfulness leads to righteousness, and righteousness leads to Paradise.',
        translationUrdu: 'بے شک سچائی نیکی کی طرف ہدایت کرتی ہے اور نیکی جنت کی طرف ہدایت کرتی ہے۔',
        reference: 'Sahih al-Bukhari 6094',
        source: 'Hadith'
      },
      { 
        item: 'Trustworthiness (Amanah):', 
        description: 'Fulfilling trusts and responsibilities.', 
        descriptionUrdu: 'امانات اور ذمہ داریوں کو پورا کرنا۔',
        itemAr: 'الْأَمَانَةُ:', 
        descriptionAr: 'أَدَاءُ الْأَمَانَاتِ وَالْمَسْؤُولِيَّاتِ.',
        arabic: 'إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَى أَهْلِهَا',
        translation: 'Indeed, Allah orders you to render trusts to whom they are due.',
        translationUrdu: 'بے شک اللہ تمہیں حکم دیتا ہے کہ امانتیں ان کے حقداروں کو واپس کرو۔',
        reference: 'Qur\'an 4:58',
        source: 'Qur\'an'
      },
      { 
        item: 'Patience (Sabr):', 
        description: 'Endurance and perseverance in difficult times.', 
        descriptionUrdu: 'مشکل وقتوں میں برداشت اور ثابت قدمی۔',
        itemAr: 'الصَّبْرُ:', 
        descriptionAr: 'التَّحَمُّلُ وَالثَّبَاتُ فِي الْأَوْقَاتِ الصَّعْبَةِ.',
        arabic: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
        translation: 'And be patient, and your patience is not but through Allah.',
        translationUrdu: 'اور صبر کرو، اور تمہارا صبر اللہ کی مدد کے بغیر نہیں۔',
        reference: 'Qur\'an 16:127',
        source: 'Qur\'an'
      },
      { 
        item: 'Humility (Tawadu):', 
        description: 'Avoiding arrogance and showing modesty.', 
        descriptionUrdu: 'تکبر سے بچنا اور عاجزی دکھانا۔',
        itemAr: 'التَّوَاضُعُ:', 
        descriptionAr: 'تَجَنُّبُ الْكِبْرِ وَإِظْهَارُ الْحَيَاءِ.',
        arabic: 'مَنْ تَوَاضَعَ لِلَّهِ رَفَعَهُ اللَّهُ',
        translation: 'Whoever humbles himself for Allah, Allah will elevate him.',
        translationUrdu: 'جو کوئی اللہ کے لیے عاجزی اختیار کرتا ہے، اللہ اسے بلند کرتا ہے۔',
        reference: 'Sahih Muslim 2588',
        source: 'Hadith'
      },
    ]
  },
  'social': {
    title: 'Social Relations',
    titleAr: 'الْعَلَاقَاتُ الْاجْتِمَاعِيَّةُ',
    titleUrdu: 'سماجی تعلقات',
    icon: <FaUsers className="topic-icon" />,
    content: [
      { 
        item: 'Family Ties:', 
        description: 'Maintaining good relationships with relatives.', 
        descriptionUrdu: 'رشتہ داروں کے ساتھ اچھے تعلقات برقرار رکھنا۔',
        itemAr: 'صِلَةُ الرَّحِمِ:', 
        descriptionAr: 'الْحِفَاظُ عَلَى عَلَاقَاتٍ جَيِّدَةٍ مَعَ الْأَقَارِبِ.',
        arabic: 'مَنْ وَصَلَ رَحِمَهُ وَصَلَهُ اللَّهُ',
        translation: 'Whoever maintains family ties, Allah will maintain His connection with him.',
        translationUrdu: 'جو اپنے رشتہ داروں سے تعلق رکھتا ہے، اللہ اس سے اپنا تعلق رکھتا ہے۔',
        reference: 'Sahih al-Bukhari 5987',
        source: 'Hadith'
      },
      { 
        item: 'Neighbor Rights:', 
        description: 'The importance of being good to neighbors.', 
        descriptionUrdu: 'پڑوسیوں کے ساتھ اچھا سلوک کرنے کی اہمیت۔',
        itemAr: 'حُقُوقُ الْجَارِ:', 
        descriptionAr: 'أَهَمِّيَّةُ الْإِحْسَانِ إِلَى الْجِيرَانِ.',
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُحْسِنْ إِلَى جَارِهِ',
        translation: 'Whoever believes in Allah and the Last Day should be good to his neighbor.',
        translationUrdu: 'جو اللہ اور قیامت کے دن پر ایمان رکھتا ہے اسے چاہیے کہ اپنے پڑوسی کے ساتھ اچھا سلوک کرے۔',
        reference: 'Sahih al-Bukhari 6018',
        source: 'Hadith'
      },
      { 
        item: 'Brotherhood/Sisterhood:', 
        description: 'The bond of faith between Muslims.', 
        descriptionUrdu: 'مسلمانوں کے درمیان ایمان کا رشتہ۔',
        itemAr: 'الْأُخُوَّةُ:', 
        descriptionAr: 'رَابِطَةُ الْإِيمَانِ بَيْنَ الْمُسْلِمِينَ.',
        arabic: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ',
        translation: 'The believers are but brothers.',
        translationUrdu: 'مؤمن تو بس بھائی بھائی ہیں۔',
        reference: 'Qur\'an 49:10',
        source: 'Qur\'an'
      },
      { 
        item: 'Community Service:', 
        description: 'Contributing positively to society.', 
        descriptionUrdu: 'معاشرے میں مثبت کردار ادا کرنا۔',
        itemAr: 'خِدْمَةُ الْمُجْتَمَعِ:', 
        descriptionAr: 'الْمُسَاهَمَةُ بِشَكْلٍ إِيجَابِيٍّ فِي الْمُجْتَمَعِ.',
        arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
        translation: 'The best of people are those who are most beneficial to others.',
        translationUrdu: 'لوگوں میں سب سے بہتر وہ ہے جو لوگوں کے لیے سب سے زیادہ مفید ہو۔',
        reference: 'Sunan al-Daraqutni 4/337',
        source: 'Hadith'
      },
    ]
  },
  'development': {
    title: 'Personal Development',
    titleAr: 'التَّطْوِيرُ الشَّخْصِيُّ',
    titleUrdu: 'ذاتی ترقی',
    icon: <FaChartLine className="topic-icon" />,
    content: [
      { 
        item: 'Self-Accountability (Muhasabah):', 
        description: 'Reflecting on one\'s own actions.', 
        descriptionUrdu: 'اپنے اعمال پر غور و فکر کرنا۔',
        itemAr: 'الْمُحَاسَبَةُ:', 
        descriptionAr: 'التَّفَكُّرُ فِي أَعْمَالِ الْإِنْسَانِ.',
        arabic: 'حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا',
        translation: 'Hold yourselves accountable before you are held accountable.',
        translationUrdu: 'اپنا حساب کتاب کرو قبل اس کے کہ تمہارا حساب لیا جائے۔',
        reference: 'Sunan al-Tirmidhi 2459',
        source: 'Hadith'
      },
      { 
        item: 'Seeking Knowledge (Talab al-Ilm):', 
        description: 'The continuous pursuit of beneficial knowledge.', 
        descriptionUrdu: 'مفید علم کی مسلسل تلاش۔',
        itemAr: 'طَلَبُ الْعِلْمِ:', 
        descriptionAr: 'السَّعْيُ الْمُسْتَمِرُّ لِطَلَبِ الْعِلْمِ النَّافِعِ.',
        arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
        translation: 'Seeking knowledge is an obligation upon every Muslim.',
        translationUrdu: 'علم حاصل کرنا ہر مسلمان پر فرض ہے۔',
        reference: 'Sunan Ibn Majah 224',
        source: 'Hadith'
      },
      { 
        item: 'Gratitude (Shukr):', 
        description: 'Showing thankfulness to Allah and people.', 
        descriptionUrdu: 'اللہ اور لوگوں کا شکر ادا کرنا۔',
        itemAr: 'الشُّكْرُ:', 
        descriptionAr: 'إِظْهَارُ الْامْتِنَانِ لِلَّهِ وَلِلنَّاسِ.',
        arabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
        translation: 'And when your Lord proclaimed: If you give thanks, I will certainly give you more.',
        translationUrdu: 'اور جب تمہارے رب نے اعلان کیا: اگر تم شکر کرو گے تو میں ضرور تمہیں اور زیادہ دوں گا۔',
        reference: 'Qur\'an 14:7',
        source: 'Qur\'an'
      },
      { 
        item: 'Time Management:', 
        description: 'Making the most of one\'s time.', 
        descriptionUrdu: 'وقت کا بہترین استعمال۔',
        itemAr: 'إِدَارَةُ الْوَقْتِ:', 
        descriptionAr: 'الِاسْتِفَادَةُ الْقُصْوَى مِنَ الْوَقْتِ.',
        arabic: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ',
        translation: 'There are two blessings which many people are deceived into losing: health and free time.',
        translationUrdu: 'دو نعمتیں ہیں جن میں بہت سے لوگ نقصان اٹھاتے ہیں: صحت اور فراغت۔',
        reference: 'Sahih al-Bukhari 6412',
        source: 'Hadith'
      },
    ]
  }
};

const IslamicCharacter = () => {


useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const { topic } = useParams();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(topic || 'manners');

  useEffect(() => {
    if (topic && characterTopics[topic]) {
      setActiveTopic(topic);
    } else {
      navigate('/learn/character/manners');
    }
  }, [topic, navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#ffffff]/10 mt-10">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-8 gap-8 flex-1 mt-10">
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

        {/* Sidebar */}
        <aside className="md:w-1/3 lg:w-1/4 py-6">
          <div className="bg-white/90 p-4 rounded-2xl shadow-xl">
            <h3 className="text-xl font-extrabold text-[#055160] mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-8 bg-gradient-to-b from-[#e0c33e] to-[#055160] rounded-full"></span>
              Islamic Character Topics
            </h3>
            <ul className="space-y-2">
              {Object.keys(characterTopics).map(topicKey => (
                <li key={topicKey}>
                  <Link
                    to={`/learn/character/${topicKey}`}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[72px]
                      ${activeTopic === topicKey
                        ? 'bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg'
                        : 'bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]'}
                    `}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {characterTopics[topicKey].icon}
                        <span className="font-semibold">{characterTopics[topicKey].title}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-semibold text-right font-urdu">{characterTopics[topicKey].titleUrdu}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-2/3 lg:w-3/4 py-6">
          <div className="bg-gradient-to-br from-[#033642]/10 to-[#e0c33e]/10 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-[#055160]">{characterTopics[activeTopic].title}</h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">{characterTopics[activeTopic].titleUrdu}</h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2 className="text-3xl font-extrabold text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{characterTopics[activeTopic].titleAr}</h2>
              </div>
            </div>
            <div className="topic-details">
              <div className="space-y-6">
                {characterTopics[activeTopic].content.map((item, idx) => (
                  <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-3xl text-[#055160]">{item.item}</strong>
                        <p className="text-gray-700 mt-3 text-xl">{item.description}</p>
                        {item.descriptionUrdu && (
                          <p className="text-gray-700 mt-1 font-urdu text-xl">{item.descriptionUrdu}</p>
                        )}
                        {item.translation && (
                          <p className="text-gray-700 mt-3 text-xl">{item.translation}</p>
                        )}
                        {item.translationUrdu && (
                          <p className="text-gray-700 mt-1 font-urdu text-xl">{item.translationUrdu}</p>
                        )}
                        {item.reference && item.source && (
                          <div className="text-lg text-gray-500 mt-1">
                            <span className="font-semibold">{item.source}:</span> {item.reference}
                          </div>
                        )}
                      </div>
                      <div className="text-right" dir="rtl">
                        <strong className="text-3xl text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{item.itemAr}</strong>
                        <p className="text-gray-700 mt-3 text-xl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{item.descriptionAr}</p>
                        {item.arabic && (
                          <p className="text-gray-700 mt-3 text-xl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{item.arabic}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default IslamicCharacter;
