const axios = require('axios');

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get coordinates from query parameters
        const { lat, lon } = event.queryStringParameters || {};
        
        if (!lat || !lon) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Latitude and longitude are required' })
            };
        }

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude) || 
            latitude < -90 || latitude > 90 || 
            longitude < -180 || longitude > 180) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid coordinates' })
            };
        }

        // Get OpenWeatherMap API key
        const apiKey = process.env.OPENWEATHER_API_KEY;
        
        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Weather API key not configured' })
            };
        }

        // Get current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const currentResponse = await axios.get(currentWeatherUrl);
        
        // Get 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const forecastResponse = await axios.get(forecastUrl);

        // Process current weather data
        const current = currentResponse.data;
        const weatherData = {
            current: {
                temperature: Math.round(current.main.temp),
                feels_like: Math.round(current.main.feels_like),
                humidity: current.main.humidity,
                pressure: current.main.pressure,
                description: current.weather[0].description,
                icon: current.weather[0].icon,
                wind_speed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
                wind_direction: current.wind.deg,
                visibility: current.visibility / 1000, // Convert m to km
                sunrise: new Date(current.sys.sunrise * 1000).toISOString(),
                sunset: new Date(current.sys.sunset * 1000).toISOString(),
                timestamp: new Date().toISOString()
            },
            forecast: {
                daily: this.processDailyForecast(forecastResponse.data.list),
                hourly: this.processHourlyForecast(forecastResponse.data.list)
            },
            location: {
                city: current.name,
                country: current.sys.country,
                coordinates: [latitude, longitude]
            }
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=1800' // Cache for 30 minutes
            },
            body: JSON.stringify(weatherData)
        };

    } catch (error) {
        console.error('Weather API error:', error);
        
        // Check if it's an API error
        if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data?.message || 'Weather service error';
            
            return {
                statusCode: statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: errorMessage,
                    status: statusCode
                })
            };
        }
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Failed to fetch weather data. Please try again later.' 
            })
        };
    }
};

// Helper function to process daily forecast
function processDailyForecast(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
                date: dayKey,
                min_temp: item.main.temp_min,
                max_temp: item.main.temp_max,
                humidity: item.main.humidity,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                wind_speed: item.wind.speed,
                precipitation: item.pop * 100 // Probability of precipitation
            };
        } else {
            // Update min/max temperatures
            dailyData[dayKey].min_temp = Math.min(dailyData[dayKey].min_temp, item.main.temp_min);
            dailyData[dayKey].max_temp = Math.max(dailyData[dayKey].max_temp, item.main.temp_max);
        }
    });
    
    // Convert to array and sort by date
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Helper function to process hourly forecast
function processHourlyForecast(forecastList) {
    return forecastList.slice(0, 24).map(item => ({
        time: new Date(item.dt * 1000).toISOString(),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind_speed: Math.round(item.wind.speed * 3.6),
        precipitation: item.pop * 100
    }));
}