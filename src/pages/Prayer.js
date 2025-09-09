import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { FaClock, FaHandsWash, FaPray, FaBookOpen, FaMapMarkerAlt, FaExclamationTriangle, FaArrowLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import './Prayer.css';
import './emotionbase.css'; // Import for MUHAMMADIBOLD font
import { format, addDays, startOfWeek } from "date-fns";
import { getPrayerTimes, reverseGeocode } from '../apis/prayerService';
import PrayerSectionService from '../apis/prayerSectionService';
import Footer from "../components/Footer";
import CityPrayerSearch from "../components/citySearch";
import PrayerTimesModal from "../components/modalComponent";

const prayerTopics = {
  'prayer-times': {
    title: 'Prayer Times',
    titleAr: 'مَوَاقِيتُ الصَّلَاةِ',
    titleUrdu: 'نماز کے اوقات',
    icon: <FaClock className="topic-icon" />,
    content: [
      {
        title: 'Fajr',
        time: 'Dawn until sunrise',
        titleAr: 'الفَجْرُ',
        titleUrdu: 'فجر',
        timeAr: 'مِنَ الفَجْرِ إِلَى الشُّرُوقِ',
        timeUrdu: 'صبح صادق سے طلوع آفتاب تک'
      },
      {
        title: 'Dhuhr',
        time: 'After noon until mid-afternoon',
        titleAr: 'الظُّهْرُ',
        titleUrdu: 'ظہر',
        timeAr: 'مِنْ بَعْدِ الظُّهْرِ إِلَى مُنْتَصَفِ الْعَصْرِ',
        timeUrdu: 'زوال آفتاب کے بعد سے دوپہر تک'
      },
      {
        title: 'Asr',
        time: 'Mid-afternoon until just before sunset',
        titleAr: 'الْعَصْرُ',
        titleUrdu: 'عصر',
        timeAr: 'مِنْ مُنْتَصَفِ الْعَصْرِ إِلَى قَبْلَ الْمَغْرِبِ',
        timeUrdu: 'دوپہر سے غروب آفتاب سے کچھ پہلے تک'
      },
      {
        title: 'Maghrib',
        time: 'After sunset',
        titleAr: 'الْمَغْرِبُ',
        titleUrdu: 'مغرب',
        timeAr: 'بَعْدَ الْمَغْرِبِ',
        timeUrdu: 'غروب آفتاب کے بعد'
      },
      {
        title: 'Isha',
        time: 'Night time until dawn',
        titleAr: 'الْعِشَاءُ',
        titleUrdu: 'عشاء',
        timeAr: 'مِنَ اللَّيْلِ إِلَى الْفَجْرِ',
        timeUrdu: 'رات سے صبح صادق تک'
      }
    ]
  },
  'wudu': {
    title: 'Wudu (Ablution)',
    titleAr: 'الْوُضُوءُ',
    titleUrdu: 'وضو',
    icon: <FaHandsWash className="topic-icon" />,
    content: [
      {
        step: "1. Niyyah (Intention)",
        stepAr: "١. النِّيَّةُ",
        stepUrdu: "١. نیت",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        translation: "Actions are but by intention.",
        translationUrdu: "اعمال کا دارومدار نیت پر ہے۔",
        reference: "Sahih al-Bukhari 1",
        source: "Hadith"
      },
      {
        step: "2. Bismillah",
        stepAr: "٢. بِسْمِ اللَّهِ",
        stepUrdu: "٢. بسم اللہ",
        arabic: "بِسْمِ اللَّهِ",
        translation: "In the name of Allah.",
        translationUrdu: "اللہ کے نام سے۔",
        reference: "Abu Dawood 101",
        source: "Hadith"
      },
      {
        step: "3. Washing Hands",
        stepAr: "٣. غَسْلُ الْيَدَيْنِ",
        stepUrdu: "٣. ہاتھ دھونا",
        arabic: "فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
        translation: "Wash your faces and your hands up to the elbows.",
        translationUrdu: "اپنے چہروں کو اور اپنے ہاتھوں کو کہنیوں تک دھوؤ۔",
        reference: "Qur'an 5:6",
        source: "Qur'an"
      },
      {
        step: "4. Rinsing Mouth",
        stepAr: "٤. الْمَضْمَضَةُ",
        stepUrdu: "٤. کلی کرنا",
        arabic: "مَضْمَضَ وَاسْتَنْشَقَ مِنْ كَفٍّ وَاحِدَةٍ",
        translation: "He rinsed his mouth and nose with a single handful of water.",
        translationUrdu: "آپ نے ایک چلو پانی سے کلی اور ناک میں پانی ڈالا۔",
        reference: "Sahih al-Bukhari 191",
        source: "Hadith"
      },
      {
        step: "5. Rinsing Nose",
        stepAr: "٥. الاِسْتِنْشَاقُ",
        stepUrdu: "٥. ناک میں پانی ڈالنا",
        arabic: "وَبَالَغَ فِي الاِسْتِنْشَاقِ إِلاَّ أَنْ يَكُونَ صَائِمًا",
        translation: "And he exaggerated in rinsing the nose unless he was fasting.",
        translationUrdu: "اور ناک میں پانی ڈالنے میں مبالغہ کرتے تھے سوائے روزے کی حالت میں۔",
        reference: "Abu Dawood 142",
        source: "Hadith"
      },
      {
        step: "6. Washing Face",
        stepAr: "٦. غَسْلُ الْوَجْهِ",
        stepUrdu: "٦. چہرہ دھونا",
        arabic: "فَاغْسِلُوا وُجُوهَكُمْ",
        translation: "Wash your faces.",
        translationUrdu: "اپنے چہروں کو دھوؤ۔",
        reference: "Qur'an 5:6",
        source: "Qur'an"
      },
      {
        step: "7. Washing Arms",
        stepAr: "٧. غَسْلُ الذِّرَاعَيْنِ",
        stepUrdu: "٧. بازو دھونا",
        arabic: "وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
        translation: "And your hands up to the elbows.",
        translationUrdu: "اور اپنے ہاتھوں کو کہنیوں تک دھوؤ۔",
        reference: "Qur'an 5:6",
        source: "Qur'an"
      },
      {
        step: "8. Wiping Head (Masah)",
        stepAr: "٨. مَسْحُ الرَّأْسِ",
        stepUrdu: "٨. سر کا مسح",
        arabic: "وَامْسَحُوا بِرُءُوسِكُمْ",
        translation: "And wipe over your heads.",
        translationUrdu: "اور اپنے سروں کا مسح کریں۔",
        reference: "Qur'an 5:6",
        source: "Qur'an"
      },
      {
        step: "9. Wiping Ears",
        stepAr: "٩. مَسْحُ الْأُذُنَيْنِ",
        stepUrdu: "٩. کانوں کا مسح",
        arabic: "مَسَحَ رَأْسَهُ وَأُذُنَيْهِ مَرَّةً وَاحِدَةً",
        translation: "He wiped his head and his ears once.",
        translationUrdu: "آپ نے اپنے سر اور کانوں کا ایک بار مسح کیا۔",
        reference: "Abu Dawood 123",
        source: "Hadith"
      },
      {
        step: "10. Washing Feet",
        stepAr: "١٠. غَسْلُ الْقَدَمَيْنِ",
        stepUrdu: "١٠. پاؤں دھونا",
        arabic: "وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ",
        translation: "And your feet up to the ankles.",
        translationUrdu: "اور اپنے پاؤں ٹخنوں تک دھوؤ۔",
        reference: "Qur'an 5:6",
        source: "Qur'an"
      },
      {
        step: "11. Dua after Wudu",
        stepAr: "١١. دُعَاءُ بَعْدَ الْوُضُوءِ",
        stepUrdu: "١١. وضو کے بعد دعا",
        arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        translation: "I bear witness that there is no god but Allah alone, He has no partner, and I bear witness that Muhammad is His servant and Messenger.",
        translationUrdu: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔",
        reference: "Sahih Muslim 234",
        source: "Hadith"
      }
    ]
  },
  'prayer-positions': {
    title: 'Prayer Positions',
    titleAr: 'أَوْضَاعُ الصَّلَاةِ',
    titleUrdu: 'نماز کی حالات',
    icon: <FaPray className="topic-icon" />,
    content: [
      {
        position: "1. Takbir (Standing/Qiyam)",
        positionAr: "١. التَّكْبِيرُ (الْقِيَامُ)",
        positionUrdu: "١. تکبیر (کھڑا ہونا)",
        arabic: "اللّٰهُ أَكْبَرُ",
        translation: "Allah is the Greatest.",
        translationUrdu: "اللہ سب سے عظیم ہے۔",
        reference: "Sahih al-Bukhari 6251",
        source: "Hadith"
      },
      {
        position: "2. Ruku (Bowing)",
        positionAr: "٢. الرُّكُوعُ",
        positionUrdu: "٢. رکوع",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        translation: "Glory is to my Lord, the Most Great.",
        translationUrdu: "میرے عظیم رب کی تسبیح۔",
        reference: "Sahih Muslim 772",
        source: "Hadith"
      },
      {
        position: "3. Qiyam (Standing after Ruku)",
        positionAr: "٣. الْقِيَامُ بَعْدَ الرُّكُوعِ",
        positionUrdu: "٣. رکوع کے بعد کھڑا ہونا",
        arabic: "سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
        translation: "Allah hears the one who praises Him; Our Lord, to You is due all praise.",
        translationUrdu: "اللہ اس کی سنتا ہے جو اس کی تعریف کرتا ہے؛ اے ہمارے رب، تیرے لیے ہی تمام تعریف ہے۔",
        reference: "Sahih al-Bukhari 789",
        source: "Hadith"
      },
      {
        position: "4. Sujud (Prostration)",
        positionAr: "٤. السُّجُودُ",
        positionUrdu: "٤. سجدہ",
        arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
        translation: "Glory is to my Lord, the Most High.",
        translationUrdu: "میرے بلند ترین رب کی تسبیح۔",
        reference: "Sahih Muslim 772",
        source: "Hadith"
      },
      {
        position: "5. Jalsa (Sitting between Sujud)",
        positionAr: "٥. الْجِلْسَةُ بَيْنَ السَّجْدَتَيْنِ",
        positionUrdu: "٥. دو سجدوں کے درمیان بیٹھنا",
        arabic: "رَبِّ اغْفِرْ لِي",
        translation: "My Lord, forgive me.",
        translationUrdu: "اے میرے رب، مجھے معاف فرما۔",
        reference: "Sunan Ibn Majah 898",
        source: "Hadith"
      },
      {
        position: "6. Second Sujud",
        positionAr: "٦. السَّجْدَةُ الثَّانِيَةُ",
        positionUrdu: "٦. دوسرا سجدہ",
        arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
        translation: "Glory is to my Lord, the Most High.",
        translationUrdu: "میرے بلند ترین رب کی تسبیح۔",
        reference: "Sahih Muslim 772",
        source: "Hadith"
      },
      {
        position: "7. Tashahhud (Final Sitting)",
        positionAr: "٧. التَّشَهُّدُ",
        positionUrdu: "٧. تشہد",
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        translation: "All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and Messenger.",
        translationUrdu: "تمام تحیات، نمازیں اور اچھی چیزیں اللہ کے لیے ہیں۔ اے نبی، آپ پر سلام اور اللہ کی رحمت اور اس کی برکتیں ہوں۔ ہم پر اور اللہ کے نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔",
        reference: "Sahih al-Bukhari 831",
        source: "Hadith"
      }
    ]
  },
  'duas': {
    title: 'Duas in Prayer',
    titleAr: 'أَدْعِيَةُ الصَّلَاةِ',
    titleUrdu: 'نماز میں دعائیں',
    icon: <FaBookOpen className="topic-icon" />,
    content: [
      {
        name: "Opening Dua (Dua al-Istiftah)",
        nameAr: "دُعَاءُ الاِسْتِفْتَاحِ",
        nameUrdu: "شروعاتی دعا",
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
        translation: "Glory is to You, O Allah, and praise; blessed is Your Name and exalted is Your Majesty; there is no god but You.",
        translationUrdu: "اے اللہ، تیری تسبیح اور تیری تعریف، تیرا نام بابرکت ہے اور تیری شان بلند ہے، اور تیرے سوا کوئی معبود نہیں۔",
        reference: "Sunan Abi Dawood 775",
        source: "Hadith"
      },
      {
        name: "Dua in Ruku",
        nameAr: "دُعَاءُ الرُّكُوعِ",
        nameUrdu: "رکوع میں دعا",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        translation: "Glory is to my Lord, the Most Great.",
        translationUrdu: "میرے عظیم رب کی تسبیح۔",
        reference: "Sahih Muslim 772",
        source: "Hadith"
      },
      {
        name: "Dua in Sujud",
        nameAr: "دُعَاءُ السُّجُودِ",
        nameUrdu: "سجدے میں دعا",
        arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
        translation: "Glory is to my Lord, the Most High.",
        translationUrdu: "میرے بلند ترین رب کی تسبیح۔",
        reference: "Sahih Muslim 772",
        source: "Hadith"
      },
      {
        name: "Dua between Sujud",
        nameAr: "دُعَاءٌ بَيْنَ السَّجْدَتَيْنِ",
        nameUrdu: "دو سجدوں کے درمیان دعا",
        arabic: "رَبِّ اغْفِرْ لِي",
        translation: "My Lord, forgive me.",
        translationUrdu: "اے میرے رب، مجھے معاف فرما۔",
        reference: "Sunan Ibn Majah 898",
        source: "Hadith"
      },
      {
        name: "Tashahhud",
        nameAr: "التَّشَهُّدُ",
        nameUrdu: "تشہد",
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        translation: "All greetings, prayers, and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and Messenger.",
        translationUrdu: "تمام تحیات، نمازیں اور اچھی چیزیں اللہ کے لیے ہیں۔ اے نبی، آپ پر سلام اور اللہ کی رحمت اور اس کی برکتیں ہوں۔ ہم پر اور اللہ کے نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔",
        reference: "Sahih al-Bukhari 831",
        source: "Hadith"
      },
      {
        name: "Salawat (Sending blessings on the Prophet)",
        nameAr: "الصَّلَاةُ عَلَى النَّبِيِّ",
        nameUrdu: "نبی پر درود",
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        translation: "O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. Verily, You are Praiseworthy and Glorious.",
        translationUrdu: "اے اللہ، محمد اور آل محمد پر رحمت بھیج جیسا کہ تو نے ابراہیم اور آل ابراہیم پر رحمت بھیجی۔ بے شک تو قابل تعریف اور بزرگ ہے۔",
        reference: "Sahih al-Bukhari 3370",
        source: "Hadith"
      },
      {
        name: "Final Salutations",
        nameAr: "السَّلَامُ النِّهَائِيُّ",
        nameUrdu: "آخری سلام",
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        translation: "Peace and mercy of Allah be upon you.",
        translationUrdu: "آپ پر سلام اور اللہ کی رحمت ہو۔",
        reference: "Sahih Muslim 582",
        source: "Hadith"
      }
    ]
  }
};

// Default prayer times (fallback)
const DEFAULT_PRAYER_TIMES = [
  { name: "Fajr", time: "05:00", end: "06:00" },
  { name: "Dhuhr", time: "12:30", end: "15:30" },
  { name: "Asr", time: "15:30", end: "18:00" },
  { name: "Maghrib", time: "18:30", end: "19:30" },
  { name: "Isha", time: "20:00", end: "23:59" }
];

// Helper to format time from API response
const formatTime = (timeStr) => {
  if (!timeStr) return '--:--';
  // Handle different time formats (e.g., "04:45 (PKT)" or just "04:45")
  const time = timeStr.split(' ')[0];
  return time;
};

// Transform API timings to our format
const transformPrayerTimes = (timings) => {
  if (!timings) return [];
  return [
    { name: "Fajr", time: formatTime(timings.Fajr), end: formatTime(timings.Sunrise) },
    { name: "Dhuhr", time: formatTime(timings.Dhuhr), end: formatTime(timings.Asr) },
    { name: "Asr", time: formatTime(timings.Asr), end: formatTime(timings.Sunset) },
    { name: "Maghrib", time: formatTime(timings.Maghrib), end: formatTime(timings.Isha) },
    { name: "Isha", time: formatTime(timings.Isha), end: "23:59" }
  ];
};

const Prayer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [activeTopic, setActiveTopic] = useState('prayer-times');
  const [now, setNow] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [completed, setCompleted] = useState({});
  const [prayerDataLoading, setPrayerDataLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('week'); // 'week' or 'month'

  // Modal state for prayer times modal
  const [modalData, setModalData] = useState(null);

  // Load prayer records from API
  const loadPrayerRecords = async (date = selectedDate) => {
    try {
      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      const weekEnd = addDays(weekStart, 6);
      const startDate = format(weekStart, "yyyy-MM-dd");
      const endDate = format(weekEnd, "yyyy-MM-dd");
      
      const calendarData = await PrayerSectionService.getPrayerCalendarData(startDate, endDate);
      setCompleted(calendarData);
    } catch (error) {
      console.error('Error loading prayer records:', error);
      // Keep existing completed state if API fails
    }
  };

  // Handle prayer times from city search
  const handleShowPrayerTimes = (city, country, times) => {
    // Only set modal data - don't update the main prayer times
    setModalData({ city, country, times });
    // Don't clear location or update main prayer times
    // The main prayer times should remain unchanged (showing current location)
  };

  // Fetch prayer times on component mount
  useEffect(() => {
    const fetchAndSetPrayerTimes = async () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
              
              // Fetch prayer times
              const timings = await getPrayerTimes(latitude, longitude);
              setPrayerTimes(transformPrayerTimes(timings));
              
              // Fetch location name
              try {
                const locationInfo = await reverseGeocode(latitude, longitude);
                let displayName = 'Current Location';
                
                if (locationInfo.city && locationInfo.country) {
                  displayName = `Current Location - ${locationInfo.city}, ${locationInfo.country}`;
                } else if (locationInfo.country) {
                  displayName = `Current Location - ${locationInfo.country}`;
                } else if (locationInfo.formatted) {
                  displayName = `Current Location - ${locationInfo.formatted}`;
                }
                
                setLocationName(displayName);
              } catch (geoError) {
                console.warn('Could not get location name:', geoError);
                setLocationName('Current Location');
              }
              
              setError('');
            } catch (err) {
              console.error('Error processing prayer times:', err);
              setError('Failed to load prayer times. Using default times.');
              setPrayerTimes(DEFAULT_PRAYER_TIMES);
            }
            setLoading(false);
          },
          (geoError) => {
            console.error('Geolocation error:', geoError);
            setError('Please enable location services for accurate prayer times. Using default times.');
            setPrayerTimes(DEFAULT_PRAYER_TIMES);
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser. Using default times.');
        setPrayerTimes(DEFAULT_PRAYER_TIMES);
        setLoading(false);
      }
    };

    fetchAndSetPrayerTimes();
  }, []);

  // Load prayer records when component mounts or selected date changes
  useEffect(() => {
    loadPrayerRecords();
  }, [selectedDate]); // Reload when selected date changes

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper: is prayer tick enabled?
  const isTickEnabled = (prayer) => {
    const today = format(now, "yyyy-MM-dd");
    if (completed[today]?.[prayer.name]?.completed) return false;

    try {
      const [h, m] = prayer.time.split(":").map(Number);
      const [eh, em] = prayer.end?.split(":").map(Number) || [23, 59];

      const start = new Date(now);
      start.setHours(h, m || 0, 0, 0);

      const end = new Date(now);
      end.setHours(eh || 23, em || 59, 0, 0);

      return now >= start && now < end;
    } catch (e) {
      console.error('Error in isTickEnabled:', e);
      return false;
    }
  };

  // Mark prayer as completed
  const markCompleted = async (prayer) => {
    const today = format(now, "yyyy-MM-dd");
    
    try {
      setPrayerDataLoading(true);
      
      // Prepare location data if available
      const locationData = location ? {
        latitude: location.lat,
        longitude: location.lng
      } : null;

      // Call API to mark prayer as completed
      await PrayerSectionService.markPrayerCompleted(today, prayer.name, locationData);
      
      // Update local state
      setCompleted((prev) => ({
        ...prev,
        [today]: { 
          ...prev[today], 
          [prayer.name]: { completed: true, completedAt: new Date() }
        }
      }));
      
    } catch (error) {
      console.error('Error marking prayer as completed:', error);
      // Optionally show error message to user
      alert('Failed to save prayer completion. Please try again.');
    } finally {
      setPrayerDataLoading(false);
    }
  };

  // Calendar: days based on selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Navigation functions
  const goToPreviousWeek = () => {
    setSelectedDate(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const selectSpecificDate = (date) => {
    setSelectedDate(date);
  };

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white mt-10">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e0c33e] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prayer times...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#ffffff]/10 mt-10">
      <Navbar />

      {/* Region Bar */}
      <div className="w-full max-w-7xl mx-auto px-2 md:px-8 mt-4">
        <div className="bg-white/90 rounded-2xl shadow-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-[#055160] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#e0c33e]" />
                Prayer Times Region
              </h3>
              {location && (
                <div className="bg-[#e0c33e]/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-[#055160] font-semibold">
                    {locationName || 'Current Location'}
                  </span>
                </div>
              )}
            </div>

            <div className="city-search-wrapper">
              <CityPrayerSearch onShowPrayerTimes={handleShowPrayerTimes} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-8 gap-8 flex-1 mt-4">
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
              Prayer Topics
            </h3>
            <ul className="space-y-2">
              {Object.keys(prayerTopics).map(topicKey => (
                <li key={topicKey}>
                  <button
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors duration-200 font-semibold border-2 shadow-sm h-[72px]
                      ${activeTopic === topicKey
                        ? 'bg-gradient-to-br from-[#e0c33e]/80 to-[#055160]/80 text-[#033642] border-[#e0c33e] shadow-lg'
                        : 'bg-white border-[#055160]/10 text-[#055160] hover:bg-[#e0c33e]/10 hover:text-[#055160]'}
                    `}
                    onClick={() => setActiveTopic(topicKey)}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        {prayerTopics[topicKey].icon}
                        <span className="font-semibold">{prayerTopics[topicKey].title}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-semibold text-right font-urdu">{prayerTopics[topicKey].titleUrdu}</span>
                    </div>
                  </button>
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
                <h2 className="text-3xl font-extrabold text-[#055160]">{prayerTopics[activeTopic].title}</h2>
                <h3 className="text-xl font-bold text-[#055160] mt-2 font-urdu">{prayerTopics[activeTopic].titleUrdu}</h3>
              </div>
              <div className="text-right" dir="rtl">
                <h2 className="text-3xl font-extrabold text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{prayerTopics[activeTopic].titleAr}</h2>
              </div>
            </div>
            <div className="topic-details">
              {activeTopic === 'prayer-times' && (
                <div className="w-full mb-8">
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                    {prayerTimes && prayerTimes.map((prayer, idx) => {
                      const today = format(now, "yyyy-MM-dd");
                      const isDone = completed[today]?.[prayer.name]?.completed || false;
                      const enabled = isTickEnabled(prayer);
                      return (
                        <div key={prayer.name} className={`flex items-center justify-between py-2 border-b last:border-b-0`}>
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#e0c33e] to-[#055160] shadow text-white font-bold">
                              {prayer.name.charAt(0)}
                            </span>
                            <div>
                              <div className="font-bold text-[#055160]">{prayer.name}</div>
                              <div className="text-xs text-gray-500">
                                {prayer.name === "Fajr" && prayer.end && `Sunrise ${prayer.end}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-bold text-lg text-[#055160]">
                                {prayer.time}
                                {prayer.time !== '--:--' && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    {prayer.end && `- ${prayer.end}`}
                                  </span>
                                )}
                              </div>
                              {location && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  <FaMapMarkerAlt className="mr-1" />
                                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </div>
                              )}
                            </div>
                            <button
                              disabled={!enabled || prayerDataLoading}
                              onClick={() => markCompleted(prayer)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition
                                ${isDone ? "bg-[#e0c33e] border-[#e0c33e] text-white" : enabled && !prayerDataLoading ? "bg-white border-[#055160] text-[#055160] hover:bg-[#e0c33e]/80 hover:text-white" : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"}
                              `}
                              title={isDone ? "Completed" : enabled && !prayerDataLoading ? "Mark as completed" : prayerDataLoading ? "Saving..." : "Not available"}
                            >
                              {prayerDataLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                              ) : isDone ? "✔" : ""}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Prayer Calendar Section */}
                  <div className="mt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <h3 className="text-2xl font-bold text-[#055160] flex items-center gap-2">
                        <FaClock className="text-[#e0c33e]" />
                        Prayer Calendar
                      </h3>
                      
                      {/* Calendar Navigation */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={goToPreviousWeek}
                          className="p-2 rounded-lg bg-white border-2 border-[#055160]/20 hover:border-[#e0c33e] hover:bg-[#e0c33e]/10 transition-all"
                          title="Previous Week"
                        >
                          <FaChevronLeft className="text-[#055160]" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={format(selectedDate, "yyyy-MM-dd")}
                            onChange={(e) => selectSpecificDate(new Date(e.target.value))}
                            className="px-3 py-2 border-2 border-[#055160]/20 rounded-lg focus:border-[#e0c33e] focus:outline-none text-[#055160] font-semibold"
                          />
                          
                          <button
                            onClick={goToToday}
                            className="px-3 py-2 bg-[#e0c33e] text-[#055160] rounded-lg font-semibold hover:bg-[#e0c33e]/80 transition-all"
                            title="Go to Today"
                          >
                            Today
                          </button>
                        </div>
                        
                        <button
                          onClick={goToNextWeek}
                          className="p-2 rounded-lg bg-white border-2 border-[#055160]/20 hover:border-[#e0c33e] hover:bg-[#e0c33e]/10 transition-all"
                          title="Next Week"
                        >
                          <FaChevronRight className="text-[#055160]" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Current Week Display */}
                    <div className="mb-4 text-center">
                      <p className="text-[#055160] font-semibold">
                        Week of {format(weekStart, "MMM dd")} - {format(addDays(weekStart, 6), "MMM dd, yyyy")}
                      </p>
                    </div>
                    
                    {/* Calendar */}
                    <div className="prayer-calendar">
                      <div className="calendar-header">
                        <span></span>
                        {weekDays.map((d, i) => (
                          <div key={i} className="text-center">
                            <div className="calendar-day-header">{format(d, "E")}</div>
                            <div className={`text-xs mt-1 font-semibold px-2 py-1 rounded ${
                              format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                                ? "bg-[#e0c33e] text-[#055160]"
                                : format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                                ? "bg-[#055160] text-white"
                                : "text-[#055160]"
                            }`}>
                              {format(d, "dd")}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {prayerTimes && prayerTimes.map((prayer) => (
                        <div key={prayer.name} className="calendar-prayer-row">
                          <span className="calendar-prayer-name">{prayer.name}</span>
                          {weekDays.map((d, i) => {
                            const dayKey = format(d, "yyyy-MM-dd");
                            const done = completed[dayKey]?.[prayer.name]?.completed || false;
                            const isToday = format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                            const isFutureDate = d > new Date();
                            
                            return (
                              <div
                                key={i}
                                className={`calendar-prayer-circle ${
                                  done ? "completed" : 
                                  isFutureDate ? "future" : 
                                  "incomplete"
                                } ${isToday ? "today" : ""}`}
                                title={`${prayer.name} - ${format(d, "MMM dd, yyyy")} ${
                                  done ? "✓ Completed" : 
                                  isFutureDate ? "Future Date" : 
                                  "Not Completed"
                                }`}
                              >
                                {done ? "✔" : isFutureDate ? "" : ""}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTopic === 'wudu' && (
                <div className="space-y-6">
                  {prayerTopics[activeTopic].content.map((step, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-3xl text-[#055160]">{step.step}</strong>
                          <p className="text-gray-700 mt-3 text-xl">{step.translation}</p>
                          {step.translationUrdu && (
                            <p className="text-gray-700 mt-1 font-urdu text-xl">{step.translationUrdu}</p>
                          )}
                          <div className="text-lg text-gray-500 mt-1">
                            <span className="font-semibold">{step.source}:</span> {step.reference}
                          </div>
                        </div>
                        <div className="text-right" dir="rtl">
                          <strong className="text-3xl text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{step.stepAr}</strong>
                          <p className="text-gray-700 mt-3 text-xl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{step.arabic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTopic === 'prayer-positions' && (
                <div className="space-y-6">
                  {prayerTopics[activeTopic].content.map((pos, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-3xl text-[#055160]">{pos.position}</strong>
                          <p className="text-gray-700 mt-3 text-xl">{pos.translation}</p>
                          {pos.translationUrdu && (
                            <p className="text-gray-700 mt-1 font-urdu text-xl">{pos.translationUrdu}</p>
                          )}
                          <div className="text-lg text-gray-500 mt-1">
                            <span className="font-semibold">{pos.source}:</span> {pos.reference}
                          </div>
                        </div>
                        <div className="text-right" dir="rtl">
                          <strong className="text-3xl text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{pos.positionAr}</strong>
                          <p className="text-gray-700 mt-3 text-xl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{pos.arabic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTopic === 'duas' && (
                <div className="space-y-6">
                  {prayerTopics[activeTopic].content.map((dua, idx) => (
                    <div key={idx} className="bg-[#e0c33e]/10 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-3xl text-[#055160]">{dua.name}</strong>
                          <p className="text-gray-700 mt-3 text-xl">{dua.translation}</p>
                          {dua.translationUrdu && (
                            <p className="text-gray-700 mt-1 font-urdu text-xl">{dua.translationUrdu}</p>
                          )}
                          <div className="text-lg text-gray-500 mt-1">
                            <span className="font-semibold">{dua.source}:</span> {dua.reference}
                          </div>
                        </div>
                        <div className="text-right" dir="rtl">
                          <strong className="text-3xl text-[#055160]" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{dua.nameAr}</strong>
                          <p className="text-gray-700 mt-3 text-xl" style={{ fontFamily: 'MUHAMMADIBOLD, serif' }}>{dua.arabic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* Prayer Times Modal */}
      {modalData && (
        <PrayerTimesModal
          city={modalData.city}
          country={modalData.country}
          times={modalData.times}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

export default Prayer;