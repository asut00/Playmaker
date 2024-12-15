const BASE_URL = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = '?response_type=token';
const CLIENT_ID = "&client_id=92b7e448f7fe406eaef359748343fe84";
// const REDIRECT_URL = "&redirect_uri=http://localhost:3000/";
const REDIRECT_URL = "&redirect_uri=https://alexs9090909.github.io/playmakerapp/";
const SCOPE = '&scope=ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
let TOKEN = null;

const getToken = () => {
   
    if (TOKEN) {
        return TOKEN;
    } else if (window.location.hash.length > 1) {

        const hashParameters = {}
        window.location.hash
            .slice(1) // to remove # sign
            .split('&') // to split to paramater/value groups))
            .forEach(item => {
                const parameter = item.split('=')
                hashParameters[parameter[0]] = parameter[1];
            });

        TOKEN = hashParameters.access_token;
        window.history.pushState('Access Token', '', '/');
        return TOKEN;
        
    } else if (!TOKEN) {
        const URL = BASE_URL + RESPONSE_TYPE + CLIENT_ID + SCOPE + REDIRECT_URL;
        window.location = URL;
    }
} 

const Spotify = {
    search(term) {

        let apiKey = getToken();
        if (!apiKey) return [];        

        return fetch(
            `https://api.spotify.com/v1/search?q=${term}&type=track`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                const items = jsonResponse.tracks && jsonResponse.tracks.items; // Vérification de l'existence de jsonResponse.tracks
                if (items) {
                    const itemsArray = Object.values(items);
                    return itemsArray;
                } else {
                    console.log(apiKey)
                    console.error('La propriété "tracks" est manquante dans la réponse de l\'API.');
                    return [];
                }
            })
    },

    save(playlistTitle, playlistTracks) {

        let apiKey = getToken();
        if (!apiKey) return [];   

        return fetch(
            `https://api.spotify.com/v1/me`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                console.log(jsonResponse)
                const user_id = jsonResponse.id;
                return fetch(
                    `https://api.spotify.com/v1/users/${user_id}/playlists`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            "name": playlistTitle,
                            "description": "New playlist description",
                            "public": false
                        }),
                    }
                )
                    .then((secondResponse) => {
                        return secondResponse.json();
                    }, networkError => console.log(networkError.message)
                    ).then(secondJsonResponse => {
                        const playlist_id = secondJsonResponse.id;
                        // console.log('is playlistTracks an array ? > ' + Array.isArray(playlistTracks));
                        // console.log("content of playlistTracks is : " + playlistTracks);
                        return fetch(
                            `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${apiKey}`
                                },
                                body: JSON.stringify({
                                    "uris": playlistTracks,
                                }),
                            }
                        )
                    })
                    ;
            })

            .catch((error) => {
                console.error('Erreur lors de la requête  :', error);
            });
    }
}

export { Spotify, getToken, REDIRECT_URL, TOKEN };
