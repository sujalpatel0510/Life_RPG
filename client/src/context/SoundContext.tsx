import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playCoin: () => void;
  playQuestComplete: () => void;
  playLevelUp: () => void;
  playAttack: () => void;
  playEquip: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleMute = () => {
    const updated = sound.toggleMute();
    setIsMuted(updated);
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playCoin: () => sound.playCoin(),
        playQuestComplete: () => sound.playQuestComplete(),
        playLevelUp: () => sound.playLevelUp(),
        playAttack: () => sound.playAttack(),
        playEquip: () => sound.playEquip(),
        playClick: () => sound.playClick(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};