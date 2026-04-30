import axios from "axios";
import { githubConfig } from "../config/github.js";
import env from "../config/env.js";


const getGitHubAccessToken = async (code, codeVerifier) => {
    try {
        const response = await axios.post(
            githubConfig.tokenUrl,
            {
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: env.redirectUri,
                code_verifier: codeVerifier
            },{
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            }
        }
        )
        return response.data.access_token;

    }catch (error) {
            console.error("Error fetching GitHub access token:", error.response ? error.response.data : error.message);
    }
}

const getGitHubUser = async (accessToken) => {
    try {
        const response = await axios.get(githubConfig.apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    }catch (error) {
        console.error("Error fetching GitHub user data:", error.response ? error.response.data : error.message);
    }
}


export { getGitHubAccessToken, getGitHubUser };