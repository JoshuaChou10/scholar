import React, { useState, useEffect } from 'react';

interface WeatherData {
    time: Date[];
    temperature2m: number[];
    precipitationProbability: number[];
    windSpeed10m: number[];
}

export default function WeatherDisplay() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        const params = {
            latitude: 43.5890,  // Latitude for Mississauga
            longitude: -79.6441,  // Longitude for Mississauga
            hourly: ['temperature_2m', 'precipitation_probability', 'wind_speed_10m'],
            timezone: "America/Toronto"  // Timezone for Eastern Time
        };
        const queryString = new URLSearchParams(params as any).toString();
        const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.hourly && data.hourly.time.length > 0) {
                const indicesToday = [11, 15]; // Indices for 11 AM and 3 PM today
                const indicesTomorrow = indicesToday.map(index => index + 24); // Indices for 11 AM and 3 PM tomorrow, assuming 24 hourly entries/day

                const allIndices = indicesToday.concat(indicesTomorrow); // Combine today and tomorrow indices

                const hourlyData = {
                    time: allIndices.map(index => new Date(data.hourly.time[index] * 1000)),
                    temperature2m: allIndices.map(index => data.hourly.temperature_2m[index]),
                    precipitationProbability: allIndices.map(index => data.hourly.precipitation_probability[index]),
                    windSpeed10m: allIndices.map(index => data.hourly.wind_speed_10m[index]),
                };

                setWeatherData(hourlyData);
            } else {
                setError("No hourly data available");
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            setError('Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <div className="bg-blue-300 rounded-2xl p-5">
            <h1 className="font-extrabold">Weather at Lunch and After School</h1>
            {loading && <p>Loading weather...</p>}
            {error && <p>Error: {error}</p>}
            {weatherData && (
                <div>
                    {weatherData.time.map((time, index) => (
                        <div key={index}>
                            <br />
                            <h2>{(index === 2) ? <b>Weather Tomorrow<br /></b> : ""} </h2>
                            <b>{(index % 2 === 0) ? "Weather at 11am" : "Weather at 3pm "}</b>
                            <p>Temperature: <b>{weatherData.temperature2m[index]} °C </b></p>
                            <p>Precipitation Probability: {weatherData.precipitationProbability[index]}%</p>
                            <p>Wind Speed: {weatherData.windSpeed10m[index]} m/s</p>
                        </div>
                    ))}
                </div>
            )}
            <button 
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
                onClick={fetchWeather}
                disabled={loading}
            >
                {loading ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    );
}
