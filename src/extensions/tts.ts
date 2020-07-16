/// <reference path="../phosphorus.ts" />
/// <reference path="extension.ts" />

/**
 * Text-to-speech
 */
namespace P.ext.tts {
  export class TextToSpeechExtension extends P.ext.Extension {
    public voice: string = 'ALTO'; // unused
    public language: string = 'en';
    private supported: boolean;

    constructor(stage: P.core.Stage) {
      super(stage);
      this.supported = 'speechSynthesis' in window;
      if (!this.supported) {
        console.warn('TTS extension is not supported in this browser: it requires the speechSynthesis API https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis');
      }
    }

    speak(text: string): Promise<void> {
      if (!this.supported) {
        return Promise.resolve();
      }

      if (this.voice === 'KITTEN') {
        text = text.replace(/\w+?\b/g, 'meow');
      }

      return new Promise((resolve, reject) => {
        const end = () => resolve();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        utterance.onerror = end;
        utterance.onend = end;
        speechSynthesis.speak(utterance);
        speechSynthesis.resume();
      });
    }

    onstart() {
      if (this.supported) {
        speechSynthesis.resume();
      }
    }

    onpause() {
      if (this.supported) {
        speechSynthesis.pause();
      }
    }

    destroy() {
      if (this.supported) {
        speechSynthesis.cancel();
      }
    }
  }
}
