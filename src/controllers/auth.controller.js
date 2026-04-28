import { githubConfig } from "../config/github.js";
import env from "../config/env.js";
import { generateCodeChallenge , generateCodeVerifier } from "../utils/pkce.js";
import { getGitHubAccessToken, getGitHubUser } from "../services/github.service.js";
import { userLogin, refreshToken, logout } from "../services/auth.service.js";
import { validateState, generateState } from "../utils/state.js";

const pkceStore = new Map();



const initiateGitHubAuth = (req, res) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    // Store the code verifier and challenge for later verification
    pkceStore.set(state, { codeVerifier, codeChallenge });

    const authUrl = `${githubConfig.authorizationUrl}?client_id=${env.githubClientId}&redirect_uri=${env.redirectUri}&scope=read:user&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    
    // Return JSON for CLI/programmatic clients
    // Clients should open this URL in a browser
    res.json({
        success: true,
        message: "Authorization URL generated successfully",
        authorizationUrl: authUrl,
        state: state,
        codeVerifier: codeVerifier
    });
}

const handleGitHubCallback = async (req, res) => {
    const { code, state } = req.query;
    if (!validateState(state)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid state parameter",
        });
    }
    
    // Retrieve the stored code verifier and challenge
    const pkceData = pkceStore.get(state);
    if (!pkceData) {
        return res.status(400).json({
            success: false,
            message: "PKCE data not found. State may have expired."
        });
    }
    
    const codeVerifier = pkceData.codeVerifier;

    try{
        const accessToken = await getGitHubAccessToken(code, codeVerifier);
        const githubUser = await getGitHubUser(accessToken);
        const authResult = await userLogin(githubUser);
        
        // Clean up the stored PKCE data after successful use
        pkceStore.delete(state);
        
        res.json({ 
            success: true,
            message: "Authentication successful",
            data: authResult
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while processing GitHub authentication" });
    }
}


const refreshAccessToken = async (req, res) => {
    const { refreshToken: oldRefreshToken } = req.body;
    try {
        const newTokens = await refreshToken(oldRefreshToken);
        res.json({
            success: true,
            message: "Access token refreshed successfully",
        })


    }catch(error){
        console.error("Error refreshing access token:", error);
        res.status(500).json({ success: false, message: "Error occurred while refreshing access token" });
    }
}

const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        await logout(refreshToken);
        res.json({
            success: true,
            message: "Logout successful",
        })

    }catch(error){
        console.error("Error during logout",error)
        res.status(500).json({ success: false, message: "Error occurred while logging out" });
    }
}

export { initiateGitHubAuth, handleGitHubCallback, refreshAccessToken, logoutUser };