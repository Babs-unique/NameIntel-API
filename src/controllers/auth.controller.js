import { githubConfig } from "../config/github.js";
import env from "../config/env.js";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce.js";
import { getGitHubAccessToken, getGitHubUser } from "../services/github.service.js";
import { userLogin, refreshToken, logout } from "../services/auth.service.js";
import { validateState, generateState } from "../utils/state.js";
import User from "../models/user.model.js";

const pkceStore = new Map();

const initiateGitHubAuth = (req, res) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    pkceStore.set(state, { codeVerifier, codeChallenge });

    const authUrl = `${githubConfig.authorizationUrl}?client_id=${env.githubClientId}&redirect_uri=${encodeURIComponent(env.redirectUri)}&scope=read:user&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    if (req.query.json === 'true' || req.headers.accept?.includes('application/json')) {
        return res.json({
            success: true,
            message: "Authorization URL generated successfully",
            authorizationUrl: authUrl,
            state,
            codeVerifier
        });
    }

    return res.redirect(authUrl);
};

const handleGitHubCallback = async (req, res) => {
    const { code, state } = req.query;

    if (!state) {
        return res.status(400).json({ success: false, message: "Missing state parameter" });
    }

    if (!code) {
        return res.status(400).json({ success: false, message: "Missing code parameter" });
    }

    if (!validateState(state)) {
        return res.status(400).json({ success: false, message: "Invalid state parameter" });
    }

    const pkceData = pkceStore.get(state);
    if (!pkceData) {
        return res.status(400).json({ success: false, message: "PKCE data not found. State may have expired." });
    }

    const codeVerifier = pkceData.codeVerifier;

    try {
        const accessToken = await getGitHubAccessToken(code, codeVerifier);
        const githubUser = await getGitHubUser(accessToken);
        const authResult = await userLogin(githubUser);

        pkceStore.delete(state);

        return res.json({
            success: true,
            message: "Authentication successful",
            data: authResult
        });
    } catch (error) {
        console.error("Error in github callback", error);
        return res.status(400).json({ success: false, message: error.message || "Error occurred while processing GitHub authentication" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('id github_id username email avatar_url role');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken: oldRefreshToken } = req.body;
    if (!oldRefreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    try {
        const newTokens = await refreshToken(oldRefreshToken);
        return res.json({ success: true, message: "Access token refreshed successfully", data: newTokens });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(401).json({ success: false, message: error.message || "Invalid refresh token" });
    }
};

const logoutUser = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    try {
        await logout(refreshToken);
        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout", error);
        return res.status(500).json({ success: false, message: "Error occurred while logging out" });
    }
};

export { initiateGitHubAuth, handleGitHubCallback, refreshAccessToken, logoutUser, getCurrentUser };