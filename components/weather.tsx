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

    useEffect(() => {
        const fetchWeather = async () => {
            const params = {
                latitude: 52.52,
                longitude: 13.41,
                hourly: ['temperature_2m', 'precipitation_probability', 'wind_speed_10m'],
                start: '2024-05-20', 
                end: '2024-05-20',
                timezone: 'Europe/Berlin'
            };
            const queryString = new URLSearchParams(params as any).toString();
            const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.hourly && data.hourly.time) {
                    const hourlyData = {
                        time: data.hourly.time.map((t: number) => new Date(t * 1000)),
                        temperature2m: data.hourly.temperature_2m,
                        precipitationProbability: data.hourly.precipitation_probability,
                        windSpeed10m: data.hourly.wind_speed_10m,
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

        fetchWeather();
    }, []);

    if (loading) return <p>Loading weather...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Hourly Weather Updates</h1>
            {weatherData && (
                <div>
                    {weatherData.time.map((time, index) => (
                        <div key={index}>
                            <h2>{time.toLocaleTimeString()}</h2>
                            <p>Temperature: {weatherData.temperature2m[index]} °C</p>
                            <p>Precipitation Probability: {weatherData.precipitationProbability[index]}%</p>
                            <p>Wind Speed: {weatherData.windSpeed10m[index]} m/s</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
