import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState({
    Imsak: "04:30",
    Gunes_Dogus: "08:00",
    Sabah: "05:00",
    Ogle: "12:00",
    Ikindi: "15:00",
    Aksam: "18:00",
    Yatsi: "21:00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Türkiye");
  const [selectedCity, setSelectedCity] = useState("İstanbul");

  // API'den gerçek namaz vakitleri al
  const fetchPrayerTimes = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=13&school=0`,
      );

      if (!response.ok) throw new Error("API hatası");

      const data = await response.json();
      const timings = data.data.timings;

      setPrayerTimes({
        Imsak: timings.Imsak,
        Gunes_Dogus: timings.Sunrise,
        Sabah: timings.Fajr,
        Ogle: timings.Dhuhr,
        Ikindi: timings.Asr,
        Aksam: timings.Maghrib,
        Yatsi: timings.Isha,
      });
    } catch (err) {
      setError("Namaz vakitleri yüklenemedi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const countriesData = [
    {
      name: "Türkiye",
      flag: "🇹🇷",
      cities: [
        { name: "İstanbul", lat: 41.0082, lon: 28.9784 },
        { name: "Ankara", lat: 39.9208, lon: 32.8541 },
        { name: "İzmir", lat: 38.4161, lon: 27.1302 },
        { name: "Bursa", lat: 40.1955, lon: 29.1758 },
        { name: "Gaziantep", lat: 37.0662, lon: 37.3833 },
      ],
    },
    {
      name: "Afghanistan",
      flag: "🇦🇫",
      cities: [
        { name: "Kabul", lat: 34.5553, lon: 69.2075 },
        { name: "Herat", lat: 34.3425, lon: 62.1981 },
      ],
    },
    {
      name: "Albania",
      flag: "🇦🇱",
      cities: [{ name: "Tirana", lat: 41.3275, lon: 19.8187 }],
    },
    {
      name: "Algeria",
      flag: "🇩🇿",
      cities: [
        { name: "Algiers", lat: 36.7538, lon: 3.0588 },
        { name: "Constantine", lat: 36.3658, lon: 6.6147 },
      ],
    },
    {
      name: "Argentina",
      flag: "🇦🇷",
      cities: [{ name: "Buenos Aires", lat: -34.6037, lon: -58.3816 }],
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      cities: [
        { name: "Sydney", lat: -33.8688, lon: 151.2093 },
        { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
      ],
    },
    {
      name: "Austria",
      flag: "🇦🇹",
      cities: [{ name: "Vienna", lat: 48.2082, lon: 16.3738 }],
    },
    {
      name: "Bahrain",
      flag: "🇧🇭",
      cities: [{ name: "Manama", lat: 26.0667, lon: 50.5577 }],
    },
    {
      name: "Bangladesh",
      flag: "🇧🇩",
      cities: [
        { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
        { name: "Chittagong", lat: 22.3569, lon: 91.7832 },
      ],
    },
    {
      name: "Belgium",
      flag: "🇧🇪",
      cities: [{ name: "Brussels", lat: 50.8503, lon: 4.3517 }],
    },
    {
      name: "Brazil",
      flag: "🇧🇷",
      cities: [
        { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
        { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
      ],
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      cities: [
        { name: "Toronto", lat: 43.6629, lon: -79.3957 },
        { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
      ],
    },
    {
      name: "Chile",
      flag: "🇨🇱",
      cities: [{ name: "Santiago", lat: -33.4489, lon: -70.6693 }],
    },
    {
      name: "China",
      flag: "🇨🇳",
      cities: [
        { name: "Beijing", lat: 39.9042, lon: 116.4074 },
        { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
      ],
    },
    {
      name: "Colombia",
      flag: "🇨🇴",
      cities: [{ name: "Bogotá", lat: 4.711, lon: -74.0721 }],
    },
    {
      name: "Cyprus",
      flag: "🇨🇾",
      cities: [{ name: "Nicosia", lat: 35.1264, lon: 33.4299 }],
    },
    {
      name: "Egypt",
      flag: "🇪🇬",
      cities: [
        { name: "Cairo", lat: 30.0444, lon: 31.2357 },
        { name: "Alexandria", lat: 31.2001, lon: 29.9187 },
      ],
    },
    {
      name: "France",
      flag: "🇫🇷",
      cities: [
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Marseille", lat: 43.2965, lon: 5.3698 },
      ],
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      cities: [
        { name: "Berlin", lat: 52.52, lon: 13.405 },
        { name: "Munich", lat: 48.1351, lon: 11.582 },
      ],
    },
    {
      name: "Greece",
      flag: "🇬🇷",
      cities: [{ name: "Athens", lat: 37.9838, lon: 23.7275 }],
    },
    {
      name: "India",
      flag: "🇮🇳",
      cities: [
        { name: "New Delhi", lat: 28.6139, lon: 77.209 },
        { name: "Mumbai", lat: 19.076, lon: 72.8777 },
      ],
    },
    {
      name: "Indonesia",
      flag: "🇮🇩",
      cities: [
        { name: "Jakarta", lat: -6.2088, lon: 106.8456 },
        { name: "Surabaya", lat: -7.2575, lon: 112.7521 },
      ],
    },
    {
      name: "Iran",
      flag: "🇮🇷",
      cities: [
        { name: "Tehran", lat: 35.6892, lon: 51.389 },
        { name: "Isfahan", lat: 32.6546, lon: 51.6243 },
      ],
    },
    {
      name: "Iraq",
      flag: "🇮🇶",
      cities: [
        { name: "Baghdad", lat: 33.2232, lon: 43.6793 },
        { name: "Basra", lat: 30.4958, lon: 47.8079 },
      ],
    },
    {
      name: "Italy",
      flag: "🇮🇹",
      cities: [
        { name: "Rome", lat: 41.9028, lon: 12.4964 },
        { name: "Milan", lat: 45.4642, lon: 9.19 },
      ],
    },
    {
      name: "Japan",
      flag: "🇯🇵",
      cities: [
        { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
        { name: "Osaka", lat: 34.6937, lon: 135.5023 },
      ],
    },
    {
      name: "Jordan",
      flag: "🇯🇴",
      cities: [{ name: "Amman", lat: 31.9454, lon: 35.9284 }],
    },
    {
      name: "Kuwait",
      flag: "🇰🇼",
      cities: [{ name: "Kuwait City", lat: 29.3759, lon: 47.9774 }],
    },
    {
      name: "Lebanon",
      flag: "🇱🇧",
      cities: [{ name: "Beirut", lat: 33.8886, lon: 35.4955 }],
    },
    {
      name: "Malaysia",
      flag: "🇲🇾",
      cities: [{ name: "Kuala Lumpur", lat: 3.139, lon: 101.6869 }],
    },
    {
      name: "Mexico",
      flag: "🇲🇽",
      cities: [{ name: "Mexico City", lat: 19.4326, lon: -99.1332 }],
    },
    {
      name: "Morocco",
      flag: "🇲🇦",
      cities: [
        { name: "Rabat", lat: 34.0209, lon: -6.8416 },
        { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
      ],
    },
    {
      name: "Netherlands",
      flag: "🇳🇱",
      cities: [{ name: "Amsterdam", lat: 52.3676, lon: 4.9041 }],
    },
    {
      name: "Nigeria",
      flag: "🇳🇬",
      cities: [{ name: "Lagos", lat: 6.4969, lon: 3.3915 }],
    },
    {
      name: "Pakistan",
      flag: "🇵🇰",
      cities: [
        { name: "Islamabad", lat: 33.6844, lon: 73.0479 },
        { name: "Karachi", lat: 24.8607, lon: 67.0011 },
      ],
    },
    {
      name: "Peru",
      flag: "🇵🇪",
      cities: [{ name: "Lima", lat: -12.0464, lon: -77.0428 }],
    },
    {
      name: "Philippines",
      flag: "🇵🇭",
      cities: [{ name: "Manila", lat: 14.5995, lon: 120.9842 }],
    },
    {
      name: "Poland",
      flag: "🇵🇱",
      cities: [{ name: "Warsaw", lat: 52.2297, lon: 21.0122 }],
    },
    {
      name: "Qatar",
      flag: "🇶🇦",
      cities: [{ name: "Doha", lat: 25.2854, lon: 51.531 }],
    },
    {
      name: "Russia",
      flag: "🇷🇺",
      cities: [{ name: "Moscow", lat: 55.7558, lon: 37.6173 }],
    },
    {
      name: "Saudi Arabia",
      flag: "🇸🇦",
      cities: [
        { name: "Riyadh", lat: 24.7136, lon: 46.6753 },
        { name: "Mecca", lat: 21.4225, lon: 39.8264 },
      ],
    },
    {
      name: "Singapore",
      flag: "🇸🇬",
      cities: [{ name: "Singapore", lat: 1.3521, lon: 103.8198 }],
    },
    {
      name: "South Africa",
      flag: "🇿🇦",
      cities: [{ name: "Johannesburg", lat: -26.2023, lon: 28.0436 }],
    },
    {
      name: "South Korea",
      flag: "🇰🇷",
      cities: [{ name: "Seoul", lat: 37.5665, lon: 126.978 }],
    },
    {
      name: "Spain",
      flag: "🇪🇸",
      cities: [
        { name: "Madrid", lat: 40.4168, lon: -3.7038 },
        { name: "Barcelona", lat: 41.3851, lon: 2.1734 },
      ],
    },
    {
      name: "Sweden",
      flag: "🇸🇪",
      cities: [{ name: "Stockholm", lat: 59.3293, lon: 18.0686 }],
    },
    {
      name: "Switzerland",
      flag: "🇨🇭",
      cities: [{ name: "Zurich", lat: 47.3769, lon: 8.5472 }],
    },
    {
      name: "United Arab Emirates",
      flag: "🇦🇪",
      cities: [
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
        { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773 },
      ],
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      cities: [{ name: "London", lat: 51.5074, lon: -0.1278 }],
    },
    {
      name: "United States",
      flag: "🇺🇸",
      cities: [
        { name: "Washington DC", lat: 38.9072, lon: -77.0369 },
        { name: "New York", lat: 40.7128, lon: -74.006 },
      ],
    },
    {
      name: "Vietnam",
      flag: "🇻🇳",
      cities: [
        { name: "Hanoi", lat: 21.0285, lon: 105.8542 },
        { name: "Ho Chi Minh City", lat: 10.7769, lon: 106.7009 },
      ],
    },
    {
      name: "Yemen",
      flag: "🇾🇪",
      cities: [{ name: "Sana'a", lat: 15.3694, lon: 48.515 }],
    },
  ];

  // Build all cities lookup
  const allCities = {};
  countriesData.forEach((country) => {
    country.cities.forEach((city) => {
      const cityKey = `${country.name}|${city.name}`;
      allCities[cityKey] = { flag: country.flag, ...city };
    });
  });

  const currentCountryData = countriesData.find(
    (c) => c.name === selectedCountry,
  );
  const availableCities = currentCountryData?.cities || [];

  // If selected city not in current country, select first city
  const validCity = availableCities.find((c) => c.name === selectedCity)
    ? selectedCity
    : availableCities[0]?.name || "";

  // Şehir değiştiğinde API'yi çağır
  useEffect(() => {
    if (validCity) {
      const cityKey = `${selectedCountry}|${validCity}`;
      const currentCityData = allCities[cityKey];

      if (currentCityData) {
        fetchPrayerTimes(currentCityData.lat, currentCityData.lon);
      }
    }
  }, [selectedCountry, validCity]);

  function setNearest(lat, lon) {
    let best = null;
    let bestDist = Infinity;
    Object.entries(allCities).forEach(([key, cityData]) => {
      const dx = cityData.lat - lat;
      const dy = cityData.lon - lon;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = key;
      }
    });
    if (best) {
      const [country, city] = best.split("|");
      setSelectedCountry(country);
      setSelectedCity(city);
    }
  }

  function tryUseGeolocation() {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum API'sini desteklemiyor.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setNearest(pos.coords.latitude, pos.coords.longitude),
      () => alert("Konum alınamadı. Lütfen ülke ve şehir seçiniz."),
    );
  }

  const cityKey = `${selectedCountry}|${validCity}`;
  const currentCityData = allCities[cityKey];
  const flag = currentCityData?.flag || "🌍";

  return (
    <section className="featured-section prayer-global">
      <div className="section-header">
        <h2>🌍 Dünya Namaz Vakitleri</h2>
        <div className="location-row">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              const country = countriesData.find(
                (c) => c.name === e.target.value,
              );
              if (country?.cities[0]) {
                setSelectedCity(country.cities[0].name);
              }
            }}
            className="location-select"
          >
            {countriesData.map((c) => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <select
            value={validCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="location-select"
          >
            {availableCities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="geo-btn" onClick={tryUseGeolocation}>
            📍 Konumumu Kullan
          </button>
        </div>
      </div>
      {loading && (
        <p className="loading-text">⏳ Namaz vakitleri yükleniyor...</p>
      )}
      {error && <p className="error-text">⚠️ {error}</p>}
      <div className="prayer-times">
        {Object.entries(prayerTimes).map(([name, time]) => {
          const labels = {
            Imsak: "🌙 Imsak",
            Gunes_Dogus: "🌅 Gunes Dogus",
            Sabah: "🕌 Sabah Ezani",
            Ogle: "☀️ Ogle",
            Ikindi: "🕐 Ikindi",
            Aksam: "🌆 Aksam",
            Yatsi: "🌃 Yatsi",
          };
          return (
            <div className="prayer-row" key={name}>
              <div className="prayer-name">{labels[name] || name}</div>
              <div className="prayer-time">{time}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="page-content home-page">
      {/* Namaz Vakitleri */}
      <PrayerTimes />

      {/* Okuma Hedefi */}
      <section className="reading-goal-section">
        <h2>Okuma Hedefi</h2>
        <p className="goal-subtitle">
          Bu hafta icin hedefini belirle ve ilerlemeni takip et.
        </p>
        <div className="goal-card">
          <div className="goal-metric">
            <span className="goal-label">Haftalik Hedef</span>
            <span className="goal-value">7 Sure</span>
          </div>
          <div className="goal-progress">
            <div className="goal-bar">
              <span style={{ width: "35%" }} />
            </div>
            <div className="goal-status">2/7 tamamlandi</div>
          </div>
          <div className="goal-actions">
            <Link to="/sureler" className="goal-btn">
              Okumaya Devam Et
            </Link>
          </div>
        </div>
      </section>

      <div className="books-meta">
        <div className="books-card">
          <h3>Surelerde Sik Kullanilanlar</h3>
          <div className="chip-row">
            <span className="meta-chip">Fatiha</span>
            <span className="meta-chip">Yasin</span>
            <span className="meta-chip">Mulk</span>
          </div>
        </div>
        <div className="books-card">
          <h3>Surelerde Ilerleme</h3>
          <div className="progress-row">
            <span>Fatiha</span>
            <span>100%</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: "100%" }} />
          </div>
          <div className="progress-row">
            <span>Yasin</span>
            <span>45%</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: "45%" }} />
          </div>
        </div>
      </div>

      <section className="reading-goal-section">
        <h2>Okuma Hedefi</h2>
        <p className="goal-subtitle">
          Bu ay icin kitap okuma hedefini belirle ve ilerlemeni gor.
        </p>
        <div className="goal-card">
          <div className="goal-metric">
            <span className="goal-label">Aylik Hedef</span>
            <span className="goal-value">3 Kitap</span>
          </div>
          <div className="goal-progress">
            <div className="goal-bar">
              <span style={{ width: "33%" }} />
            </div>
            <div className="goal-status">1/3 tamamlandi</div>
          </div>
          <div className="goal-actions">
            <Link to="/kitaplar" className="goal-btn">
              Okumaya Devam Et
            </Link>
          </div>
        </div>
      </section>

      <div className="books-meta">
        <div className="books-card">
          <h3>Sik Kullanilanlar</h3>
          <div className="chip-row">
            <span className="meta-chip">Kur'an-i Kerim</span>
            <span className="meta-chip">Yasin Suresi</span>
            <span className="meta-chip">Cevsen</span>
          </div>
        </div>
        <div className="books-card">
          <h3>Ilerleme</h3>
          <div className="progress-row">
            <span>Kur'an-i Kerim</span>
            <span>35%</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: "35%" }} />
          </div>
          <div className="progress-row">
            <span>Yasin Suresi</span>
            <span>60%</span>
          </div>
          <div className="progress-bar">
            <span style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
