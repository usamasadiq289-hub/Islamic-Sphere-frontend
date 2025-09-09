import React, { useState } from "react";
import CityPrayerSearch from "./CityPrayerSearch";
import PrayerTimesModal from "./PrayerTimesModal";

export default function PrayerFinderPage() {
  const [modalData, setModalData] = useState(null);

  const handleShowPrayerTimes = (city, country, times) => {
    setModalData({ city, country, times });
  };

  return (
    <div>
      <CityPrayerSearch onShowPrayerTimes={handleShowPrayerTimes} />
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
}
