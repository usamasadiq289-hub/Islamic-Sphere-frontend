import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaSuitcase, FaKaaba, FaBookOpen, FaLightbulb, FaArrowLeft } from 'react-icons/fa';
import './Prayer.css'; // We'll reuse the Prayer.css styles
import './emotionbase.css'; // Import for MUHAMMADIBOLD font
import Footer from '../components/Footer';

const hajjTopics = {
  'preparation': {
    title: 'Pilgrimage Preparation',
    titleAr: 'اَلتَّحْضِيرُ لِلْحَجِّ',
    titleUrdu: 'سفر حج کی تیاری',
    icon: <FaSuitcase className="topic-icon" />,
    content: [
      { 
        item: 'Ihram:', 
        description: 'Entering the sacred state of purity.', 
        descriptionUrdu: 'پاکیزگی کی مقدس حالت میں داخل ہونا۔',
        itemAr: 'اَلْإِحْرَامُ:', 
        descriptionAr: 'اَلدُّخُولُ فِي حَالَةِ الْإِحْرَامِ.',
        reference: 'Sahih al-Bukhari 1545',
        source: 'Hadith'
      },
      { 
        item: 'Travel:', 
        description: 'Booking flights, accommodation, and transport.', 
        descriptionUrdu: 'پروازیں، رہائش اور نقل و حمل بک کرنا۔',
        itemAr: 'اَلسَّفَرُ:', 
        descriptionAr: 'حَجْزُ الرِّحْلَاتِ الْجَوِّيَّةِ وَالْإِقَامَةِ وَالْمُوَاصَلَاتِ.',
        reference: 'Sunan Abu Dawood 1892',
        source: 'Hadith'
      },
      { 
        item: 'Health:', 
        description: 'Ensuring necessary vaccinations and physical fitness.', 
        descriptionUrdu: 'ضروری ویکسینیشن اور جسمانی صحت کو یقینی بنانا۔',
        itemAr: 'اَلصِّحَّةُ:', 
        descriptionAr: 'اَلتَّأَكُّدُ مِنْ الْحُصُولِ عَلَى التَّطْعِيمَاتِ اللَّازِمَةِ وَاللِّيَاقَةِ الْبَدَنِيَّةِ.',
        reference: 'Sahih Muslim 1337',
        source: 'Hadith'
      },
      { 
        item: 'Education:', 
        description: 'Learning the rituals and supplications.', 
        descriptionUrdu: 'مناسک اور دعاؤں کو سیکھنا۔',
        itemAr: 'اَلتَّعْلِيمُ:', 
        descriptionAr: 'تَعَلُّمُ الْمَنَاسِكِ وَالْأَدْعِيَةِ.',
        reference: 'Sunan Ibn Majah 2896',
        source: 'Hadith'
      },
    ]
  },
  'rituals': {
    title: 'Sacred Rituals',
    titleAr: 'اَلْمَنَاسِكُ الْمُقَدَّسَةُ',
    titleUrdu: 'مقدس مناسک',
    icon: <FaKaaba className="topic-icon" />,
    content: [
      { 
        item: 'Tawaf:', 
        description: 'Circumambulating the Kaaba seven times.', 
        descriptionUrdu: 'کعبہ کے گرد سات چکر لگانا۔',
        itemAr: 'اَلطَّوَافُ:', 
        descriptionAr: 'اَلطَّوَافُ حَوْلَ الْكَعْبَةِ سَبْعَ مَرَّاتٍ.',
        reference: 'Sahih al-Bukhari 1618',
        source: 'Hadith'
      },
      { 
        item: 'Sa\'i:', 
        description: 'Walking between the hills of Safa and Marwa.', 
        descriptionUrdu: 'صفا اور مروہ کے پہاڑوں کے درمیان چلنا۔',
        itemAr: 'اَلسَّعْيُ:', 
        descriptionAr: 'اَلسَّعْيُ بَيْنَ الصَّفَا وَالْمَرْوَةِ.',
        reference: 'Qur\'an 2:158',
        source: 'Qur\'an'
      },
      { 
        item: 'Arafat:', 
        description: 'Spending the day in prayer on the plains of Arafat.', 
        descriptionUrdu: 'میدان عرفات میں دعا میں دن گزارنا۔',
        itemAr: 'عَرَفَاتُ:', 
        descriptionAr: 'قَضَاءُ الْيَوْمِ فِي الدُّعَاءِ فِي صَعِيدِ عَرَفَاتَ.',
        reference: 'Sahih Muslim 1218',
        source: 'Hadith'
      },
      { 
        item: 'Jamarat:', 
        description: 'The symbolic stoning of the devil.', 
        descriptionUrdu: 'شیطان کو سنگساری کی علامتی رسم۔',
        itemAr: 'اَلْجَمَرَاتُ:', 
        descriptionAr: 'رَمْيُ الْجَمَرَاتِ رَمْزِيًّا.',
        reference: 'Sahih al-Bukhari 1751',
        source: 'Hadith'
      },
      { 
        item: 'Qurbani:', 
        description: 'The sacrifice of an animal.', 
        descriptionUrdu: 'جانور کی قربانی۔',
        itemAr: 'اَلْقُرْبَانُ:', 
        descriptionAr: 'ذَبْحُ الْأُضْحِيَةِ.',
        reference: 'Qur\'an 22:28',
        source: 'Qur\'an'
      },
    ]
  },
  'duas': {
    title: 'Essential Duas',
    titleAr: 'اَلْأَدْعِيَةُ الْأَسَاسِيَّةُ',
    titleUrdu: 'ضروری دعائیں',
    icon: <FaBookOpen className="topic-icon" />,
    content: [
      { 
        item: 'For Traveling:', 
        description: 'Supplication for a safe and blessed journey.', 
        descriptionUrdu: 'سفر کی حفاظت اور برکت کے لیے دعا۔',
        itemAr: 'دُعَاءُ السَّفَرِ:', 
        descriptionAr: 'دُعَاءٌ لِرِحْلَةٍ آمِنَةٍ وَمُبَارَكَةٍ.',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        translation: 'Glory to Him who has subjected this to us, and we could never have it by our efforts.',
        translationUrdu: 'پاک ہے وہ جس نے اس کو ہمارے لیے مسخر کیا اور ہم اس کے قابو میں لانے والے نہ تھے۔',
        reference: 'Sunan Abu Dawood 2602',
        source: 'Hadith'
      },
      { 
        item: 'Entering Mecca:', 
        description: 'Dua upon arriving in the sacred city.', 
        descriptionUrdu: 'مقدس شہر میں داخل ہوتے وقت کی دعا۔',
        itemAr: 'دُعَاءُ دُخُولِ مَكَّةَ:', 
        descriptionAr: 'دُعَاءٌ عِنْدَ الْوُصُولِ إِلَى الْمَدِينَةِ الْمُقَدَّسَةِ.',
        arabic: 'اللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ فَحَرِّمْنِي عَلَى النَّارِ',
        translation: 'O Allah, this is Your sanctuary and Your place of safety, so make me forbidden to the Fire.',
        translationUrdu: 'اے اللہ، یہ تیرا حرم اور تیری امان ہے، پس مجھے آگ پر حرام کر دے۔',
        reference: 'Sunan Ibn Majah 2957',
        source: 'Hadith'
      },
      { 
        item: 'During Tawaf:', 
        description: 'Specific prayers for each circuit.', 
        descriptionUrdu: 'ہر چکر کے لیے مخصوص دعائیں۔',
        itemAr: 'دُعَاءٌ أَثْنَاءَ الطَّوَافِ:', 
        descriptionAr: 'أَدْعِيَةٌ خَاصَّةٌ بِكُلِّ شَوْطٍ.',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translation: 'Our Lord! Give us good in this world and good in the next world, and save us from the punishment of the Fire.',
        translationUrdu: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔',
        reference: 'Qur\'an 2:201',
        source: 'Qur\'an'
      },
      { 
        item: 'At Arafat:', 
        description: 'The most important supplication of Hajj.', 
        descriptionUrdu: 'حج کی سب سے اہم دعا۔',
        itemAr: 'دُعَاءُ يَوْمِ عَرَفَةَ:', 
        descriptionAr: 'أَهَمُّ دُعَاءٍ فِي الْحَجِّ.',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        translation: 'There is no god but Allah, alone, without partner. His is the dominion and His is the praise, and He is Able to do all things.',
        translationUrdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔',
        reference: 'Sunan al-Tirmidhi 3585',
        source: 'Hadith'
      },
    ]
  },
  'tips': {
    title: 'Practical Tips & Guidelines',
    titleAr: 'نَصَائِحُ وَإِرْشَادَاتٌ عَمَلِيَّةٌ',
    titleUrdu: 'عملی مشورے و ہدایات',
    icon: <FaLightbulb className="topic-icon" />,
    content: [
      { 
        item: 'Packing:', 
        description: 'What to pack for the journey.', 
        descriptionUrdu: 'سفر کے لیے کیا سامان پیک کرنا ہے۔',
        itemAr: 'تَجْهِيزُ الْأَمْتِعَةِ:', 
        descriptionAr: 'مَاذَا تَحْزِمُ لِلرِّحْلَةِ.',
        reference: 'Sahih Muslim 1341',
        source: 'Hadith'
      },
      { 
        item: 'Safety:', 
        description: 'Staying safe in large crowds.', 
        descriptionUrdu: 'بڑی بھیڑ میں محفوظ رہنا۔',
        itemAr: 'اَلسَّلَامَةُ:', 
        descriptionAr: 'اَلْحِفَاظُ عَلَى السَّلَامَةِ فِي الزِّحَامِ.',
        reference: 'Sahih al-Bukhari 1654',
        source: 'Hadith'
      },
      { 
        item: 'Health:', 
        description: 'Tips for staying healthy during the pilgrimage.', 
        descriptionUrdu: 'حج کے دوران صحت مند رہنے کے مشورے۔',
        itemAr: 'اَلصِّحَّةُ:', 
        descriptionAr: 'نَصَائِحُ لِلْحِفَاظِ عَلَى الصِّحَّةِ أَثْنَاءَ الْحَجِّ.',
        reference: 'Sunan Ibn Majah 3436',
        source: 'Hadith'
      },
      { 
        item: 'Communication:', 
        description: 'Staying connected with family and group members.', 
        descriptionUrdu: 'خاندان اور گروپ کے ارکان کے ساتھ رابطے میں رہنا۔',
        itemAr: 'اَلتَّوَاصُلُ:', 
        descriptionAr: 'اَلْبَقَاءُ عَلَى تَوَاصُلٍ مَعَ الْعَائِلَةِ وَأَعْضَاءِ الْمَجْمُوعَةِ.',
        reference: 'Sahih al-Bukhari 6018',
        source: 'Hadith'
      },
    ]
  }
}; 

const HajjUmrah = () => {


useEffect(() => {
    window.scrollTo(0, 0);
  }, []);






  const { topic } = useParams();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(topic || 'preparation');

  useEffect(() => {
    if (topic && hajjTopics[topic]) {
      setActiveTopic(topic);
    } else {
      navigate('/learn/hajj/preparation');
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
              Hajj & Umrah Topics
            </h3>
            <ul className="space-y-2">
              {Object.keys(hajjTopics).map(topicKey => (
                <li key={topicKey}>
                  <Link
                    to={`/learn/hajj/${topicKey}`}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[72px]
                      ${activeTopic === topicKey
                        ? 'bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg'
                        : 'bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]'}
                    `}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {hajjTopics[topicKey].icon}
                        <span className="font-semibold">{hajjTopics[topicKey].title}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-semibold text-right font-urdu">{hajjTopics[topicKey].titleUrdu}</span>
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
                <h2 className="text-3xl font-extrabold text-[#055160]">{hajjTopics[activeTopic].title}</h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">{hajjTopics[activeTopic].titleUrdu}</h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2 className="text-3xl font-extrabold text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{hajjTopics[activeTopic].titleAr}</h2>
              </div>
            </div>
            <div className="topic-details">
              <div className="space-y-6">
                {hajjTopics[activeTopic].content.map((item, idx) => (
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

export default HajjUmrah;
