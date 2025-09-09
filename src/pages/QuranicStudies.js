import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaQuran, FaBrain, FaLanguage, FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import './Prayer.css'; // We'll reuse the Prayer.css styles
import './emotionbase.css'; // Import for MUHAMMADIBOLD font
import Footer from '../components/Footer';
const quranTopics = {
  'tajweed': {
    title: 'Tajweed Rules & Pronunciation',
    titleAr: 'قَوَاعِدُ التَّجْوِيدِ وَالنُّطْقُ',
    titleUrdu: 'تجوید کے قوانین اور تلفظ',
    icon: <FaQuran className="topic-icon" />,
    content: [
      { 
        item: 'Makharij al-Huruf:', 
        description: 'The articulation points of the letters.', 
        descriptionUrdu: 'حروف کے اخراج کے مقامات۔',
        itemAr: 'مَخَارِجُ الْحُرُوفِ:', 
        descriptionAr: 'مَوَاضِعُ نُطْقِ الْحُرُوفِ.',
        arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
        translation: 'And recite the Quran with measured recitation.',
        translationUrdu: 'اور قرآن کو ٹھہر ٹھہر کر پڑھیں۔',
        reference: 'Qur\'an 73:4',
        source: 'Qur\'an'
      },
      { 
        item: 'Sifat al-Huruf:', 
        description: 'The attributes of the letters.', 
        descriptionUrdu: 'حروف کی خصوصیات۔',
        itemAr: 'صِفَاتُ الْحُرُوفِ:', 
        descriptionAr: 'خَصَائِصُ الْحُرُوفِ.',
        arabic: 'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ',
        translation: 'Those to whom We have given the Book recite it with its true recital.',
        translationUrdu: 'جن لوگوں کو ہم نے کتاب دی ہے وہ اس کی صحیح تلاوت کرتے ہیں۔',
        reference: 'Qur\'an 2:121',
        source: 'Qur\'an'
      },
      { 
        item: 'Rules of Noon Sakinah & Tanween:', 
        description: 'Idgham, Iqlab, Ikhfa, and Izhar.', 
        descriptionUrdu: 'ادغام، اقلاب، اخفاء، اور اظہار۔',
        itemAr: 'أَحْكَامُ النُّونِ السَّاكِنَةِ وَالتَّنْوِينِ:', 
        descriptionAr: 'اَلْإِدْغَامُ، اَلْإِقْلَابُ، اَلْإِخْفَاءُ، وَالْإِظْهَارُ.',
        arabic: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ',
        translation: 'And We have certainly made the Quran easy for remembrance, so is there any who will remember?',
        translationUrdu: 'اور ہم نے قرآن کو یاد کرنے کے لیے آسان بنا دیا ہے، پس کیا کوئی نصیحت حاصل کرنے والا ہے؟',
        reference: 'Qur\'an 54:17',
        source: 'Qur\'an'
      },
      { 
        item: 'Madd Rules:', 
        description: 'The rules of elongation.', 
        descriptionUrdu: 'کھینچنے کے قوانین۔',
        itemAr: 'أَحْكَامُ الْمَدِّ:', 
        descriptionAr: 'قَوَاعِدُ إِطَالَةِ الصَّوْتِ.',
        arabic: 'وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ عَلَى مُكْثٍ',
        translation: 'And it is a Quran which We have separated that you might recite it to the people over a prolonged period.',
        translationUrdu: 'اور یہ ایک قرآن ہے جسے ہم نے الگ الگ کیا ہے تاکہ آپ اسے لوگوں کو ٹھہر ٹھہر کر پڑھ کر سنائیں۔',
        reference: 'Qur\'an 17:106',
        source: 'Qur\'an'
      },
    ]
  },
  'memorization': {
    title: 'Memorization Techniques',
    titleAr: 'أَسَالِيبُ الْحِفْظِ',
    titleUrdu: 'حفظ کرنے کی تکنیکیں',
    icon: <FaBrain className="topic-icon" />,
    content: [
      { 
        item: 'Consistency:', 
        description: 'Set a daily schedule for memorization.', 
        descriptionUrdu: 'حفظ کے لیے روزانہ کا شیڈول مقرر کریں۔',
        itemAr: 'اَلِاسْتِمْرَارِيَّةُ:', 
        descriptionAr: 'تَحْدِيدُ جَدْوَلٍ يَوْمِيٍّ لِلْحِفْظِ.',
        arabic: 'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَكَ',
        translation: 'And from the night, pray with it as additional worship for you.',
        translationUrdu: 'اور رات کے وقت قرآن کے ساتھ تہجد پڑھیں، یہ آپ کے لیے اضافی عبادت ہے۔',
        reference: 'Qur\'an 17:79',
        source: 'Qur\'an'
      },
      { 
        item: 'Repetition:', 
        description: 'Repeat verses multiple times to commit them to memory.', 
        descriptionUrdu: 'آیات کو یاد کرنے کے لیے کئی بار دہرائیں۔',
        itemAr: 'اَلتِّكْرَارُ:', 
        descriptionAr: 'تِكْرَارُ الْآيَاتِ عِدَّةَ مَرَّاتٍ لِتَثْبِيتِهَا فِي الذَّاكِرَةِ.',
        arabic: 'وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ',
        translation: 'And remember Allah often that you may succeed.',
        translationUrdu: 'اور اللہ کو کثرت سے یاد کرو تاکہ تم کامیاب ہو سکو۔',
        reference: 'Qur\'an 8:45',
        source: 'Qur\'an'
      },
      { 
        item: 'Listen & Recite:', 
        description: 'Listen to a Qari and recite along.', 
        descriptionUrdu: 'قاری کو سنیں اور ساتھ تلاوت کریں۔',
        itemAr: 'اَلِاسْتِمَاعُ وَالتِّلَاوَةُ:', 
        descriptionAr: 'اَلِاسْتِمَاعُ لِقَارِئٍ وَالتِّلَاوَةُ مَعَهُ.',
        arabic: 'وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنْصِتُوا',
        translation: 'So when the Quran is recited, then listen to it and pay attention.',
        translationUrdu: 'جب قرآن پڑھا جائے تو اسے سنو اور خاموش رہو۔',
        reference: 'Qur\'an 7:204',
        source: 'Qur\'an'
      },
      { 
        item: 'Understand the Meaning:', 
        description: 'Understanding the context helps in retention.', 
        descriptionUrdu: 'معنی کو سمجھنا یاد رکھنے میں مدد کرتا ہے۔',
        itemAr: 'فَهْمُ الْمَعْنَى:', 
        descriptionAr: 'فَهْمُ السِّيَاقِ يُسَاعِدُ عَلَى الْحِفْظِ.',
        arabic: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ',
        translation: 'Then do they not reflect upon the Quran?',
        translationUrdu: 'کیا یہ لوگ قرآن میں غور و فکر نہیں کرتے؟',
        reference: 'Qur\'an 4:82',
        source: 'Qur\'an'
      },
    ]
  },
  'translation': {
    title: 'Translation & Meaning',
    titleAr: 'اَلتَّرْجَمَةُ وَالْمَعْنَى',
    titleUrdu: 'ترجمہ اور معنی',
    icon: <FaLanguage className="topic-icon" />,
    content: [
      { 
        item: 'Word-by-Word:', 
        description: 'Understanding the meaning of each Arabic word.', 
        descriptionUrdu: 'ہر عربی لفظ کا معنی سمجھنا۔',
        itemAr: 'كَلِمَةٌ بِكَلِمَةٍ:', 
        descriptionAr: 'فَهْمُ مَعْنَى كُلِّ كَلِمَةٍ عَرَبِيَّةٍ.',
        arabic: 'وَمَا أَرْسَلْنَا مِنْ رَسُولٍ إِلَّا بِلِسَانِ قَوْمِهِ لِيُبَيِّنَ لَهُمْ',
        translation: 'And We did not send any messenger except in the language of his people to state clearly for them.',
        translationUrdu: 'اور ہم نے کوئی رسول نہیں بھیجا مگر اپنی قوم کی زبان میں تاکہ وہ ان کے لیے واضح کر دے۔',
        reference: 'Qur\'an 14:4',
        source: 'Qur\'an'
      },
      { 
        item: 'Literal Translation:', 
        description: 'A direct translation of the text.', 
        descriptionUrdu: 'متن کا براہ راست ترجمہ۔',
        itemAr: 'اَلتَّرْجَمَةُ الْحَرْفِيَّةُ:', 
        descriptionAr: 'تَرْجَمَةٌ مُبَاشِرَةٌ لِلنَّصِّ.',
        arabic: 'هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَى وَالْفُرْقَانِ',
        translation: 'As guidance for the people and clear proofs of guidance and criterion.',
        translationUrdu: 'لوگوں کے لیے ہدایت اور رہنمائی اور فرقان کی واضح دلیلیں۔',
        reference: 'Qur\'an 2:185',
        source: 'Qur\'an'
      },
      { 
        item: 'Interpretive Translation:', 
        description: 'A translation that also explains the meaning.', 
        descriptionUrdu: 'ترجمہ جو معنی کی وضاحت بھی کرے۔',
        itemAr: 'اَلتَّرْجَمَةُ التَّفْسِيرِيَّةُ:', 
        descriptionAr: 'تَرْجَمَةٌ تَشْرَحُ الْمَعْنَى أَيْضًا.',
        arabic: 'هُوَ الَّذِي أَنْزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ آيَاتٌ مُحْكَمَاتٌ',
        translation: 'It is He who has sent down to you the Book; in it are verses that are entirely clear.',
        translationUrdu: 'وہی ہے جس نے آپ پر کتاب نازل کی، اس میں کچھ آیات محکم ہیں۔',
        reference: 'Qur\'an 3:7',
        source: 'Qur\'an'
      },
      { 
        item: 'Comparative Study:', 
        description: 'Comparing different translations for deeper insight.', 
        descriptionUrdu: 'گہری بصیرت کے لیے مختلف تراجم کا موازنہ۔',
        itemAr: 'اَلدِّرَاسَةُ الْمُقَارَنَةُ:', 
        descriptionAr: 'مُقَارَنَةُ التَّرْجَمَاتِ الْمُخْتَلِفَةِ لِفَهْمٍ أَعْمَقَ.',
        arabic: 'يُؤْتِي الْحِكْمَةَ مَنْ يَشَاءُ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',
        translation: 'He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good.',
        translationUrdu: 'وہ جسے چاہتا ہے حکمت عطا کرتا ہے، اور جسے حکمت مل گئی اسے بہت خیر مل گیا۔',
        reference: 'Qur\'an 2:269',
        source: 'Qur\'an'
      },
    ]
  },
  'tafsir': {
    title: 'Tafsir & Commentary',
    titleAr: 'اَلتَّفْسِيرُ وَالشَّرْحُ',
    titleUrdu: 'تفسیر اور تبصرہ',
    icon: <FaCommentDots className="topic-icon" />,
    content: [
      { 
        item: 'Tafsir ibn Kathir:', 
        description: 'A widely renowned classical commentary.', 
        descriptionUrdu: 'ایک مشہور کلاسیکی تفسیر۔',
        itemAr: 'تَفْسِيرُ ابْنِ كَثِيرٍ:', 
        descriptionAr: 'تَفْسِيرٌ كَلَاسِيكِيٌّ مَشْهُورٌ.',
        arabic: 'وَلَقَدْ آتَيْنَا مُوسَى الْكِتَابَ فَلَا تَكُنْ فِي مِرْيَةٍ مِنْ لِقَائِهِ',
        translation: 'And We certainly gave Moses the Scripture, so do not be in doubt over his meeting.',
        translationUrdu: 'اور ہم نے موسیٰ کو کتاب دی تھی، لہذا آپ اس کی ملاقات میں شک نہ کریں۔',
        reference: 'Tafsir Ibn Kathir',
        source: 'Classical Commentary'
      },
      { 
        item: 'Tafsir al-Jalalayn:', 
        description: 'A concise and easy-to-understand commentary.', 
        descriptionUrdu: 'ایک مختصر اور آسان فہم تفسیر۔',
        itemAr: 'تَفْسِيرُ الْجَلَالَيْنِ:', 
        descriptionAr: 'تَفْسِيرٌ مُخْتَصَرٌ وَسَهْلُ الْفَهْمِ.',
        arabic: 'وَأَنْزَلْنَا إِلَيْكَ الذِّكْرَ لِتُبَيِّنَ لِلنَّاسِ مَا نُزِّلَ إِلَيْهِمْ',
        translation: 'And We revealed to you the message that you may make clear to the people what was sent down to them.',
        translationUrdu: 'اور ہم نے آپ پر ذکر نازل کیا تاکہ آپ لوگوں کے لیے واضح کر دیں جو ان کی طرف نازل کیا گیا۔',
        reference: 'Tafsir al-Jalalayn',
        source: 'Classical Commentary'
      },
      { 
        item: 'Asbab al-Nuzul:', 
        description: 'The circumstances of revelation for the verses.', 
        descriptionUrdu: 'آیات کے نزول کے حالات۔',
        itemAr: 'أَسْبَابُ النُّزُولِ:', 
        descriptionAr: 'الظُّرُوفُ الَّتِي نَزَلَتْ فِيهَا الْآيَاتُ.',
        arabic: 'وَقُرْآنًا فَرَقْنَاهُ لِتَقْرَأَهُ عَلَى النَّاسِ عَلَى مُكْثٍ وَنَزَّلْنَاهُ تَنْزِيلًا',
        translation: 'And it is a Quran which We have separated that you might recite it to the people over a prolonged period, and We have sent it down progressively.',
        translationUrdu: 'اور یہ قرآن ہے جسے ہم نے الگ الگ کیا ہے تاکہ آپ اسے لوگوں کو ٹھہر کر پڑھیں اور ہم نے اسے تھوڑا تھوڑا نازل کیا ہے۔',
        reference: 'Al-Wahidi\'s Asbab al-Nuzul',
        source: 'Historical Commentary'
      },
      { 
        item: 'Thematic Tafsir:', 
        description: 'Studying the Quran based on specific themes.', 
        descriptionUrdu: 'مخصوص موضوعات کی بنیاد پر قرآن کا مطالعہ۔',
        itemAr: 'اَلتَّفْسِيرُ الْمَوْضُوعِيُّ:', 
        descriptionAr: 'دِرَاسَةُ الْقُرْآنِ بِنَاءً عَلَى مَوَاضِيعَ مُحَدَّدَةٍ.',
        arabic: 'مَا فَرَّطْنَا فِي الْكِتَابِ مِنْ شَيْءٍ',
        translation: 'We have not neglected in the Register a thing.',
        translationUrdu: 'ہم نے کتاب میں کوئی چیز نہیں چھوڑی۔',
        reference: 'Qur\'an 6:38',
        source: 'Qur\'an'
      },
    ]
  }
};

const QuranicStudies = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const { topic } = useParams();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(topic || 'tajweed');

  useEffect(() => {
    if (topic && quranTopics[topic]) {
      setActiveTopic(topic);
    } else {
      navigate('/learn/quran/tajweed');
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
              Quranic Studies
            </h3>
            <ul className="space-y-2">
              {Object.keys(quranTopics).map(topicKey => (
                <li key={topicKey}>
                  <Link
                    to={`/learn/quran/${topicKey}`}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[89px]
                      ${activeTopic === topicKey
                        ? 'bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg'
                        : 'bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]'}
                    `}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {quranTopics[topicKey].icon}
                        {topicKey === 'tajweed' ? (
                          <span className="font-semibold">
                            Tajweed Rules<br/>& Pronunciation
                          </span>
                        ) : topicKey === 'memorization' ? (
                          <span className="font-semibold">
                            Memorization<br/>Techniques
                          </span>
                        ) : topicKey === 'translation' ? (
                          <span className="font-semibold">
                            Translation<br/>& Meaning
                          </span>
                        ) : topicKey === 'tafsir' ? (
                          <span className="font-semibold">
                            Tafsir<br/>& Commentary
                          </span>
                        ) : (
                          <span className="font-semibold">{quranTopics[topicKey].title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-semibold text-right font-urdu">{quranTopics[topicKey].titleUrdu}</span>
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
                <h2 className="text-3xl font-extrabold text-[#055160]">{quranTopics[activeTopic].title}</h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">{quranTopics[activeTopic].titleUrdu}</h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2 className="text-3xl font-extrabold text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{quranTopics[activeTopic].titleAr}</h2>
              </div>
            </div>
            <div className="topic-details">
              <div className="space-y-6">
                {quranTopics[activeTopic].content.map((item, idx) => (
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

export default QuranicStudies;