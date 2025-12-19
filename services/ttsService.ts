import { Language } from '../types';

// @ts-ignore
const API_BASE = (import.meta.env?.VITE_API_URL as string) || 'https://doclyst-backend.onrender.com';

export class TTSPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private onEndCallback: (() => void) | null = null;

  async speak(text: string, language: Language): Promise<void> {
    this.stop();
    
    try {
      const response = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.audio = new Audio(audioUrl);
      this.isPlaying = true;
      
      this.audio.onended = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        this.onEndCallback?.();
      };

      this.audio.onerror = () => {
        this.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
        this.onEndCallback?.();
      };

      await this.audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      this.isPlaying = false;
      this.onEndCallback?.();
      throw error;
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    this.isPlaying = false;
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ttsPlayer = new TTSPlayer();
