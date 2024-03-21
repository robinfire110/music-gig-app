module.exports = {
        authRequired: false,
        auth0Logout: true,
        secret: process.env.SECRET,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        issuerBaseURL: process.env.ISSUER_BASE_URL
}


