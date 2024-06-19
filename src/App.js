import React, {useEffect , useState} from 'react';
import { getToken, getAccessTokenFromUrl } from './Auth';
import axios from 'axios';

function App() {
  
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [track, setTrack] = useState(null);
  const [position, setPosition] = useState(null);
  const [duration, setDuration] = useState(null);
  const [paused, setPaused] = useState(true);

  useEffect(()=> {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
        setToken(accessToken);
    }
  },[])

  useEffect(() => {
    if (token) {
        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                axios.put('https://api.spotify.com/v1/me/player', {
                  device_ids: [device_id],
                  play: false,
                },{
                  headers:{
                    'Authorization': `Bearer ${token}`
                  }
                });
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state) => {
              if (!state) {
                return;
              }
              setTrack(state.track_window.current_track);
              setPaused(state.paused);
              setPosition(state.position);
              setDuration(state.duration);
            })

            player.connect();
            setPlayer(player);
        };
    }
}, [token]);
  
const handlePlayPause = () => {
  player.togglePlay().then(() => {
    console.log('Toggled playback!');
  }).catch(error => {
    console.error('Error toggling playback', error);
  });
};

const handleNextTrack = () => {
  player.nextTrack().then(() => {
    console.log('Skipped to next track!');
  }).catch(error => {
    console.error('Error skipping to next track', error);
  });
};

const handlePrevTrack = () => {
  player.previousTrack().then(() => {
    console.log('Skipped to previous track!');
  }).catch(error => {
    console.error('Error skipping to previous track', error);
  });
};


  return (
    <div className="App">
    {!token ? (
      <button onClick={getToken}>Login with Spotify</button>
    ) : (
      <div>
        <button onClick={handlePlayPause}>Play/Pause</button>
        <button onClick={handleNextTrack}>Next</button>
        <button onClick={handlePrevTrack}>Previous</button>
        <div>
          <h2>Now Playing</h2>
          {track && (
            <div>
              <img src={track.album.images[0].url} alt={track.name} style={{ width: 100, height: 100 }} />
              <div>{track.name}</div>
              <div>{track.artists[0].name}</div>
              <div>{position} / {duration}</div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
}

export default App;
