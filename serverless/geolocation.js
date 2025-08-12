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
        // Get client IP from various headers
        const clientIP = event.headers['x-forwarded-for'] || 
                        event.headers['x-real-ip'] || 
                        event.headers['cf-connecting-ip'] ||
                        event.connection?.remoteAddress ||
                        '127.0.0.1';

        // Use AbstractAPI for geolocation (free tier available)
        const apiKey = process.env.ABSTRACT_API_KEY;
        
        if (!apiKey) {
            // Fallback to IPinfo (free tier available)
            const ipinfoResponse = await axios.get(`https://ipinfo.io/${clientIP}/json`);
            
            const locationData = {
                ip: clientIP,
                country: ipinfoResponse.data.country,
                region: ipinfoResponse.data.region,
                city: ipinfoResponse.data.city,
                timezone: ipinfoResponse.data.timezone,
                coordinates: ipinfoResponse.data.loc ? ipinfoResponse.data.loc.split(',').map(Number) : null,
                provider: 'ipinfo.io'
            };

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
                },
                body: JSON.stringify(locationData)
            };
        }

        // Use AbstractAPI if key is available
        const abstractResponse = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${clientIP}`);
        
        const locationData = {
            ip: clientIP,
            country: abstractResponse.data.country,
            region: abstractResponse.data.region,
            city: abstractResponse.data.city,
            timezone: abstractResponse.data.timezone?.name,
            coordinates: abstractResponse.data.latitude && abstractResponse.data.longitude ? 
                [abstractResponse.data.latitude, abstractResponse.data.longitude] : null,
            provider: 'abstractapi.com'
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            },
            body: JSON.stringify(locationData)
        };

    } catch (error) {
        console.error('Geolocation error:', error);
        
        // Return fallback data
        const fallbackData = {
            ip: '127.0.0.1',
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            timezone: 'UTC',
            coordinates: null,
            provider: 'fallback',
            error: 'Could not determine location'
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes on error
            },
            body: JSON.stringify(fallbackData)
        };
    }
};