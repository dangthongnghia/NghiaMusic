// SideBar.jsx
import React from "react";
import "./SideBar.css";
import { FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';

const SideBar = ({ playlists, history, onSelectPlaylist }) => {
  return (
    <div className="sidebar">
      {/* Playlists Section */}
      <div className="sidebar-section">
        <h3>Playlists</h3>
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <span
                className="playlist-name"
                onClick={() => onSelectPlaylist(playlist.id)}
              >
                {playlist.name}
              </span>
              {playlist.songs.length > 0 && (
                <ul className="nested-playlist">
                  {playlist.songs.map((song) => (
                    <li key={song.id}>
                      {song.name} - {song.artist}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Listening History Section */}
      <div className="sidebar-section">
        <h3>Listening History</h3>
        <ul>
          {history.length === 0 ? (
            <li>Không có lịch sử nghe</li>
          ) : (
            history.map((song) => (
              <li key={song.id}>
                {song.name} - {song.artist}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Settings Section */}
      <div className="sidebar-section">
        <h3>Settings</h3>
        <ul>
          <li>
            <FaUser className="sidebar-icon" />
            Account
          </li>
          <li>
            <FaCog className="sidebar-icon" />
            Preferences
          </li>
          <li>
            <FaSignOutAlt className="sidebar-icon" />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;