// AddToPlaylistModal.jsx
import React from "react";
import "./AddToPlaylistModal.css";

const AddToPlaylistModal = ({ isOpen, playlists, onClose, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Chọn Playlist</h3>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button onClick={() => onAdd(playlist.id)}>{playlist.name}</button>
            </li>
          ))}
        </ul>
        <button className="close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;