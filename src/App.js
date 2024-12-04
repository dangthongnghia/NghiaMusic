import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "./components/ProgressBar";
import NavaBar from "./components/NavaBar";
import SideBar from "./components/SideBar";
import SongList from "./components/SongList";
import './App.css';
import { songs } from "./data/songs";

const App = () => {
  const audioRef = useRef(new Audio());
  
  // Cấu trúc mới cho playlists: mỗi playlist có tên và danh sách các bài hát
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'Playlist 1', songs: [] },
    { id: 2, name: 'Playlist 2', songs: [] },
    { id: 3, name: 'Playlist 3', songs: [] },
  ]);
  
  const [history, setHistory] = useState([]); // Lịch sử nghe nhạc
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [currentPlaylist, setCurrentPlaylist] = useState(null); // New state

  useEffect(() => {
    const audio = audioRef.current;

    // Dừng audio trước khi thay đổi src
    audio.pause();

    audio.src = currentSong.url;
    audio.loop = isRepeat;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext(); // Chuyển sang bài hát tiếp theo
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded); // Thêm sự kiện 'ended'

    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded); // Xóa sự kiện 'ended'
    };
  }, [currentSong, isPlaying, isRepeat]); // Loại bỏ 'volume' khỏi mảng phụ thuộc

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
  }, [volume]); // Chỉ chạy khi 'volume' thay đổi

  useEffect(() => {
    // Tải playlists từ localStorage khi component mount
    const storedPlaylists = JSON.parse(localStorage.getItem('playlists'));
    if (storedPlaylists && Array.isArray(storedPlaylists)) {
      setPlaylists(storedPlaylists);
    }
  }, []);

  useEffect(() => {
    // Lưu playlists vào localStorage mỗi khi chúng thay đổi
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song =>
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNext = () => {
    const songList = currentPlaylist ? currentPlaylist.songs : songs;
    const currentIndex = songList.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songList.length;
    const nextSong = songList[nextIndex];
    setCurrentSong(nextSong);
    setIsPlaying(true);
    addToHistory(nextSong);
  };

  const handlePrev = () => {
    const songList = currentPlaylist ? currentPlaylist.songs : songs;
    const currentIndex = songList.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    const prevSong = songList[prevIndex];
    setCurrentSong(prevSong);
    setIsPlaying(true);
    addToHistory(prevSong);
  };

  const handleRepeat = () => {
    setIsRepeat(prev => !prev);
  };

  const handleSeek = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    addToHistory(song);
    setCurrentPlaylist(null); // Reset current playlist when a single song is selected
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectPlaylist = (playlistId) => {
    const selectedPlaylist = playlists.find(p => p.id === playlistId);
    if (selectedPlaylist && selectedPlaylist.songs.length > 0) {
      setCurrentPlaylist(selectedPlaylist);
      setCurrentSong(selectedPlaylist.songs[0]);
      setIsPlaying(true);
    } else {
      alert('Playlist này không có bài hát nào.');
    }
  };

  // Hàm thêm bài hát vào lịch sử
  const addToHistory = (song) => {
    setHistory(prevHistory => {
      const updatedHistory = [song, ...prevHistory.filter(item => item.id !== song.id)];
      return updatedHistory.slice(0, 20);
    });
  };

  // Hàm thêm bài hát vào một playlist cụ thể
  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          // Kiểm tra xem bài hát đã tồn tại trong playlist chưa
          const exists = playlist.songs.some(s => s.id === song.id);
          if (!exists) {
            return { ...playlist, songs: [...playlist.songs, song] };
          }
        }
        return playlist;
      })
    );
  };

  return (
    <div className="app">
      <NavaBar onSearch={handleSearch} />
      <div className="main-content">
        <SideBar 
          playlists={playlists} 
          history={history} 
          onSelectPlaylist={handleSelectPlaylist} // Pass the handler to SideBar
        />
        <div className="song-list">
          <SongList 
            songs={filteredSongs} 
            onSelectSong={handleSelectSong} 
            playlists={playlists} 
            onAddToPlaylist={addSongToPlaylist} 
          />
        </div>
      </div>
      <ProgressBar 
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isRepeat={isRepeat}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onRepeat={handleRepeat}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default App;
