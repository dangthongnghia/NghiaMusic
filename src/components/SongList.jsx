import React, { useState } from "react";
import "./SongList.css";
import { FaPlus } from 'react-icons/fa';
import AddToPlaylistModal from "./AddToPlaylistModal";

const SongList = ({ songs, onSelectSong, playlists, onAddToPlaylist }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const openModal = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSong(null);
    setIsModalOpen(false);
  };

  const handleAdd = (playlistId) => {
    if (selectedSong) {
      onAddToPlaylist(playlistId, selectedSong);
      alert(`Đã thêm "${selectedSong.name}" vào "${playlists.find(p => p.id === playlistId)?.name}"`);
      closeModal();
    }
  };

  return (
    <div className="list-music">
      {songs.map((song) => (
        <div key={song.id} className="song-item">
          <img src={song.image} alt={song.name} onClick={() => onSelectSong(song)} />
          <div className="song-details" onClick={() => onSelectSong(song)}>
            <h3>{song.name}</h3>
            <p>{song.artist}</p>
          </div>
          <button 
            className="add-playlist-btn" 
            onClick={() => openModal(song)}
            title="Thêm vào Playlist"
          >
            <FaPlus />
          </button>
        </div>
      ))}

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal 
        isOpen={isModalOpen}
        playlists={playlists}
        onClose={closeModal}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default SongList;
