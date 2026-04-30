import crypto from 'crypto';

const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
}

const base64UrlEncode = (buffer) => {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const generateCodeChallenge = (codeVerifier) => {
    return base64UrlEncode(
        crypto.createHash('sha256').update(codeVerifier).digest()
    );
};

export { generateCodeVerifier, generateCodeChallenge };