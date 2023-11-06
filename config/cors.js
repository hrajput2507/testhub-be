// CORS configuration
export const cors_options = {
    origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:4300', 'http://localhost:4100', 'https://testkart.in', 'https://crm.testkart.in', 'https://studio.testkart.in', 'https://portal.testkart.in'],
    methods: ["GET", "POST", "DELETE", "PUT", "FETCH"],
    allowedHeaders: ["Content-Type", "authorization", "user_type"],
    credentials: true
};