import axios from "axios";
import { githubConfig } from "../config/github.js";
import env from "../config/env.js";

const getGitHubAccessToken = async (code, codeVerifier) => {
    if (!code) {
        throw new Error("Missing authorization code");
    }
    if (!codeVerifier) {
        throw new Error("Missing PKCE code verifier");
    }

    try {
        const params = new URLSearchParams({
            client_id: env.githubClientId,
            client_secret: env.githubClientSecret,
            code,
            redirect_uri: env.redirectUri,
            code_verifier: codeVerifier
        });

        const response = await axios.post(
            githubConfig.tokenUrl,
            params.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json"
                }
            }
        );

        if (response.data.error) {
            throw new Error(response.data.error_description || response.data.error);
        }

        if (!response.data.access_token) {
            throw new Error("GitHub did not return an access token");
        }

        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching GitHub access token:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const getGitHubUser = async (accessToken) => {
    if (!accessToken) {
        throw new Error("Access token is required to fetch GitHub user");
    }

    try {
        const response = await axios.get(githubConfig.apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching GitHub user data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export { getGitHubAccessToken, getGitHubUser };