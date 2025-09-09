export default function PrayerTimesModal({ city, country, times, onClose }) {
  return (
    <div className='modal' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>
          Prayer Times - {city}, {country}
        </h2>
        <ul>
          {Object.entries(times).map(([name, time]) => (
            <li key={name}>
              <strong>{name}:</strong> <span>{time}</span>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
