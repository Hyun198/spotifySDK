import axios from 'axios'

const clientId = '7291bcb33e0b424a863a0947005b6a6c';
const redirectURI = 'http://localhost:3000/callback';

const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state'
]

export const getToken = () => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const responseType = 'token';
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectURI)}&scope=${scopes.join('%20')}&response_type=${responseType}`;

    window.location = authUrl;
}

export const getAccessTokenFromUrl = () => {
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            if (item) {
                const parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    window.location.hash = '';
    return hash.access_token;
};