const axios = require('axios');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkZ3NoYW5rYXI3MTFAZ21haWwuY29tIiwiZXhwIjoxNzUxMDg2NTU1LCJpYXQiOjE3NTEwODU2NTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiOWY2MzdjZC1lYzU0LTRjZTAtOGNkMi04OWM4OTI1ODM1YTkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkYW50aGFuYWxhIGdvd3JpIHNoYW5rYXIiLCJzdWIiOiJkMTdiYzIxYy0yODBmLTRlYzEtYjU2Yi0wNmMyN2I3ZTc0NDIifSwiZW1haWwiOiJkZ3NoYW5rYXI3MTFAZ21haWwuY29tIiwibmFtZSI6ImRhbnRoYW5hbGEgZ293cmkgc2hhbmthciIsInJvbGxObyI6IjIyNTAxYTQ0MTEiLCJhY2Nlc3NDb2RlIjoiZUhXTnp0IiwiY2xpZW50SUQiOiJkMTdiYzIxYy0yODBmLTRlYzEtYjU2Yi0wNmMyN2I3ZTc0NDIiLCJjbGllbnRTZWNyZXQiOiJNa2tubXdOVFJTemRySGZqIn0.En8wXiiXBd9oBP7oTlAY7-GsKeuXfYoJvrBhO2kLi0M';

async function Log(stack, level, pkg, ...messages) {
    try {
        await axios.post(
            'http://20.244.56.144/evaluation-service/logs',
            {
                stack,
                level,
                package: pkg,
                message: messages.join(',')
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );
    } catch (err) {
        console.error('Failed to log:', err.message);
    }
}

module.exports = Log;