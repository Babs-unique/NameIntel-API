import crypto from 'crypto';

const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
}

const generateCodeChallenge = (codeVerifier) => {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return hash.toString('base64url');
}

export { generateCodeVerifier, generateCodeChallenge };