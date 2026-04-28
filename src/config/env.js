const extractEnvVariables = () => {
    return {
        port: process.env.PORT,
        mongoUri: process.env.MONGO_URI,
        authRateLimit: process.env.AUTH_RATE_LIMIT,
        apiRateLimit: process.env.API_RATE_LIMIT,
        githubClientId: process.env.GITHUB_CLIENT_ID,
        githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
        redirectUri: process.env.GITHUB_OAUTH_REDIRECT_URI,
        jwtSecret: process.env.JWT_SECRET,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET
    }
    
}

export default extractEnvVariables;