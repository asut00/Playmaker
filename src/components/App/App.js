import React, { useState } from 'react';
// import './App.css';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import Tracklist from '../Tracklist/Tracklist';
import { getToken, Spotify, TOKEN } from '../../utils/Spotify';
import PlaylistBar from '../PlaylistBar/PlaylistBar';
import Playlist from '../Playlist/Playlist';
import logo from '../../logo.svg';
import LandingPage from '../LandingPage/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {

  // on déclare le state de la liste de résultats de la recherche
  const [trackSearchList, setTrackSearchList] = useState([]);

  // on déclare la fonction de recherche qui renvoie au fetch situé dans utils/Spotify et on met à jour le state de la liste de résultat avec
  const searchSpotify = async (term) => {
    const trackSearchResults = await Spotify.search(term);
    setTrackSearchList(trackSearchResults);
  }

  // on déclare le state de la liste de tracks destinées à la playlist
  const [playlistTracks, setPlaylistTracks] = useState([]);


  // on déclare la fonction qui permet de rajouter des tracks
  const addPlaylistTracks = (newPlaylistTrack) => {
    setPlaylistTracks([...playlistTracks, newPlaylistTrack]);
  };


  // on déclare la fonction qui enlève les tracks de la playlist
  const removePlaylistTrack = (indexToRemove) => {
    const updatedArray = playlistTracks.filter((_, index) => index !== indexToRemove);
    setPlaylistTracks(updatedArray);
  }

  // on déclare la fonction qui va sauvegarder la playlist en renvoyant vers un fetch POST
  const saveSpotifyPlaylist = async (playlistTitle, playlistTracks) => {
    const uriArray = playlistTracks.map((element) => element.uri);
    await Spotify.save(playlistTitle, uriArray);
  };

  let popupDisplay = 'none';
  if (TOKEN === null) {
    popupDisplay = 'block';
  }

  if (window.location.hash.length > 1) {
    popupDisplay = 'none'
  }

  console.log(TOKEN);



  return (
    <div className={styles.Container}>
      <div className={styles.AppTitle}>Playmaker</div>
      <div className={styles.popupWindowContainer} style={{ display: popupDisplay }}>
        <div className={styles.PopupWindow}>
          <LandingPage />
        </div>
        <div className={styles.WhiteLayer}></div>
      </div>
      <div className={styles.BlueSection}>
        <div className={styles.SearchContainerBackground}></div>
        <div className={styles.SearchContainer}>
          <h1 className={styles.SearchTitle}>Search</h1>
          <SearchBar className={styles.SearchBar} searchSpotify={searchSpotify} />
          <Tracklist tracklistData={trackSearchList} addPlaylistTracks={addPlaylistTracks} />
        </div>
      </div>
      <div className={styles.RedSection}>
        <div className={styles.PlaylistContainerBackground}></div>
        <div className={styles.PlaylistContainer}>
          <h1 className={styles.PlaylistTitle}>Playlist</h1>
          <PlaylistBar className={styles.PlaylistTitle} saveSpotifyPlaylist={saveSpotifyPlaylist} playlistTracks={playlistTracks} />
          <Playlist playlistData={playlistTracks} removePlaylistTrack={removePlaylistTrack} />
        </div>
      </div>
    </div>
  );
};

export default App;