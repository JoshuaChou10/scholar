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
                start: '2024-05-22', // Ensure this is a valid date for forecasts
                end: '2024-05-22',
                timezone: 'Europe/Berlin'
            };
            const queryString = new URLSearchParams(params as any).toString();
            const url = `https://api.open-meteo.com/v1/forecast?${queryString}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.hourly && data.hourly.time.length > 0) {
                    // Extract data for 11 AM and 3 PM using slice
                    const indices = [11, 15]; // Assuming data starts at 00:00 and hourly intervals
                    const hourlyData = {
                        time: indices.map(index => new Date(data.hourly.time[index] * 1000)),
                        temperature2m: indices.map(index => data.hourly.temperature_2m[index]),
                        precipitationProbability: indices.map(index => data.hourly.precipitation_probability[index]),
                        windSpeed10m: indices.map(index => data.hourly.wind_speed_10m[index]),
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
            <h1>Weather at Lunch and After School</h1>
            {weatherData && (
                <div>
                    {weatherData.time.map((time, index) => (
                        <div key={index}>
                                             <br></br>
                            <b>{(index==0)? "Weather at 3pm"
                            : "Weather at 11pm "}</b>
           
                            <p>Temperature: <b> {weatherData.temperature2m[index]} °C </b></p>
                            <p>Precipitation Probability: {weatherData.precipitationProbability[index]}%</p>
                            <p>Wind Speed: {weatherData.windSpeed10m[index]} m/s</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
