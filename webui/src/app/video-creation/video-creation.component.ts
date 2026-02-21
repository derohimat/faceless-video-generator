import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-creation',
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Faceless Video</h1>
      </header>

      <div class="content-wrapper">
        <section class="form-section">
          <h2><span class="icon">🎥</span> What is your video about?</h2>
          <p class="section-desc">Write your idea or reference content</p>
          
          <div class="textarea-wrapper">
            <textarea 
              [(ngModel)]="prompt" 
              placeholder="e.g. Uncovering the Secrets of Pyramid Construction" 
              rows="4"></textarea>
            <div class="textarea-footer">
              <button class="btn-micro" (click)="generateScript()" [disabled]="isGeneratingScript">
                <span class="icon">✨</span> {{ isGeneratingScript ? 'Generating...' : 'Generate Script' }}
              </button>
              <button class="btn-micro">Quick pace</button>
              <span class="char-count">{{prompt.length}}/20000</span>
            </div>
          </div>

          <div class="suggestions">
            <button class="suggestion-pill">🤖 How AI will change our daily lives in the next 10 years</button>
            <button class="suggestion-pill">🌊 Exploring the mysterious depths of the ocean and its creatures</button>
          </div>

          <div class="controls-row">
            <div class="control-group">
              <label class="input-label">Output language</label>
              <select [(ngModel)]="selectedLanguage">
                <option *ngFor="let lang of availableLanguages" [value]="lang">{{lang}}</option>
              </select>
            </div>
            <div class="control-group">
              <label class="input-label">Tone</label>
              <select [(ngModel)]="selectedTone">
                <option *ngFor="let tone of availableTones" [value]="tone">{{tone}}</option>
              </select>
            </div>
            <div class="control-group slider-group">
              <label class="input-label">Video Scenes ({{sceneCount}}) <span class="help-icon">?</span></label>
              <input type="range" min="1" max="15" [(ngModel)]="sceneCount" class="scene-slider">
              <div class="slider-labels"><span>1</span><span>15</span></div>
            </div>
          </div>
        </section>

        <section class="form-section">
          <label class="input-label">Video Title <span class="required">*</span></label>
          <p class="section-desc">AI suggested title (you can edit)</p>
          <div class="input-wrapper">
            <input type="text" [(ngModel)]="videoTitle" placeholder="e.g. Uncovering the Secrets of Pyramid Construction">
            <span class="char-count">{{videoTitle.length}}/100</span>
          </div>
        </section>

        <section class="form-section scenes-section" *ngIf="scenes.length > 0">
          <p class="section-desc">Write your story in up to 15 scenes. Each scene will be transformed into a unique image.</p>
          <div class="scene-list">
            <div *ngFor="let scene of scenes; let i = index" class="scene-item">
              <div class="scene-number">{{i + 1}}</div>
              <div class="scene-input-wrapper">
                <input type="text" [(ngModel)]="scene.subtitles" placeholder="Enter scene subtitles...">
              </div>
              <button class="delete-scene" (click)="removeScene(i)">🗑️</button>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2><span class="icon">🔊</span> Choose a Voice</h2>
          <p class="section-desc">Select the perfect voice for your content</p>
          
          <div class="voice-grid">
            <div *ngFor="let voice of availableVoices" 
                 class="voice-card" 
                 [class.selected]="selectedVoice === voice"
                 (click)="selectedVoice = voice">
              <div class="voice-name">{{voice}}</div>
                <button class="play-btn" (click)="$event.stopPropagation(); previewVoice(voice)">▶</button>
              <div *ngIf="selectedVoice === voice" class="check-badge">✓</div>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2><span class="icon">🖼️</span> Choose an Image Style</h2>
          <p class="section-desc">Select the style for your content's images</p>
          
          <div class="style-grid">
            <div *ngFor="let style of availableStyles" 
                 class="style-card" 
                 [class.selected]="selectedStyle === style"
                 (click)="selectedStyle = style">
              <img [src]="'assets/styles/' + style.toLowerCase() + '.png'" alt="Style preview">
              <div class="style-name">{{style}}</div>
              <div *ngIf="selectedStyle === style" class="check-badge">✓</div>
            </div>
          </div>
        </section>

        <section class="form-section aspect-ratio-section">
          <h2>Aspect ratio</h2>
          <div class="ratio-group">
            <button class="ratio-btn" [class.selected]="aspectRatio === '16:9'" (click)="aspectRatio = '16:9'">▭ 16:9</button>
            <button class="ratio-btn" [class.selected]="aspectRatio === '9:16'" (click)="aspectRatio = '9:16'">▯ 9:16</button>
            <button class="ratio-btn" [class.selected]="aspectRatio === '1:1'" (click)="aspectRatio = '1:1'">□ 1:1</button>
          </div>
        </section>

        <div class="action-footer">
          <button class="btn-generate-huge" (click)="generateVideo()" [disabled]="isGenerating || scenes.length === 0">
            {{ isGenerating ? 'Creating Video...' : '📸 Create my video' }}
          </button>
          
          <div *ngIf="statusMessage" class="status-panel">
            <div class="loader" *ngIf="isGenerating"></div>
            <p>{{ statusMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 0;
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 5rem;
    }
    .page-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
      position: sticky;
      top: 0;
      background: var(--bg-main);
      z-index: 10;
    }
    .page-header h1 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .content-wrapper {
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .form-section h2 {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .section-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .textarea-wrapper {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1rem;
      position: relative;
    }
    .textarea-wrapper textarea {
      background: transparent;
      border: none;
      padding: 0;
      resize: vertical;
      min-height: 80px;
    }
    .textarea-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
    }
    .btn-micro {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    .char-count {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-left: auto;
    }

    .suggestions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .suggestion-pill {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .suggestion-pill:hover {
      background: rgba(255,255,255,0.08);
      color: var(--text-primary);
    }

    .controls-row {
      display: flex;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .control-group {
      flex: 1;
    }
    
    .scene-slider {
      width: 100%;
      accent-color: var(--primary-accent);
      margin-top: 0.5rem;
    }
    .slider-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-wrapper .char-count {
      position: absolute;
      right: 1rem;
      pointer-events: none;
    }

    .scene-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .scene-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .scene-number {
      background: var(--primary-accent);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
      flex-shrink: 0;
    }
    .scene-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }
    .delete-scene {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.5rem;
    }
    .delete-scene:hover {
      color: var(--danger-color);
    }

    .voice-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .voice-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: var(--radius-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }
    .voice-card.selected {
      border-color: var(--primary-accent);
      background: rgba(108, 92, 231, 0.1);
    }
    .voice-name {
      font-size: 0.9rem;
      font-weight: 500;
    }
    .play-btn {
      background: var(--primary-accent);
      color: white;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      cursor: pointer;
    }
    
    .style-grid {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 1rem;
    }
    .style-card {
      width: 120px;
      flex-shrink: 0;
      background: var(--bg-card);
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }
    .style-card.selected {
      border-color: var(--primary-accent);
    }
    .style-card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      display: block;
    }
    .style-name {
      padding: 0.5rem;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .check-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--primary-accent);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      border: 2px solid white;
    }

    .ratio-group {
      display: flex;
      gap: 1rem;
    }
    .ratio-btn {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .ratio-btn.selected {
      border-color: var(--primary-accent);
      background: rgba(108, 92, 231, 0.1);
    }

    .action-footer {
      margin-top: 2rem;
    }
    .btn-generate-huge {
      width: 100%;
      background: var(--primary-accent);
      color: white;
      border: none;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-generate-huge:hover {
      background: var(--primary-hover);
    }
    .btn-generate-huge:disabled {
      opacity: 0.7;
    }

    .status-panel {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .loader {
      border: 3px solid rgba(255,255,255,0.1);
      border-left-color: var(--primary-accent);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class VideoCreationComponent implements OnInit {
  prompt = '';
  videoTitle = '';
  sceneCount = 5;
  scenes: any[] = [];
  storyboardProject: any = null;
  isGeneratingScript = false;

  availableLanguages: string[] = [];
  availableTones: string[] = [];
  availableVoices: string[] = [];
  availableStyles: string[] = [];

  selectedLanguage = 'English';
  selectedTone = 'Neutral';
  selectedVoice = '';
  selectedStyle = '';
  aspectRatio = '9:16';

  isGenerating = false;
  statusMessage = '';
  pollInterval: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.fetchConfig();
  }

  fetchConfig() {
    this.http.get<any>('http://localhost:8000/api/config').subscribe({
      next: (config) => {
        this.availableStyles = config.image_styles || ['photorealistic', 'cinematic', 'anime', 'comic', 'pixar art'];
        this.availableVoices = config.voices || ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
        this.availableLanguages = config.languages || ['English', 'Bahasa Indonesia'];
        this.availableTones = config.tones || ['Neutral', 'Professional', 'Humorous'];

        if (this.availableVoices.length > 0) this.selectedVoice = this.availableVoices[0];
        if (this.availableStyles.length > 0) this.selectedStyle = this.availableStyles[0];
        if (this.availableLanguages.length > 0) this.selectedLanguage = this.availableLanguages[0];
        if (this.availableTones.length > 0) this.selectedTone = this.availableTones[0];
      },
      error: (err) => {
        console.error('Failed to fetch config', err);
        // Fallback mock data
        this.availableStyles = ['Photorealistic', 'Cinematic', 'Anime', 'Comic', 'Pixar Art'];
        this.availableVoices = ['Radiant Girl', 'Magnetic Voiced Man', 'Compelling Lady'];
        this.availableLanguages = ['English', 'Bahasa Indonesia'];
        this.availableTones = ['Neutral', 'Professional', 'Humorous'];

        this.selectedStyle = 'Photorealistic';
        this.selectedVoice = 'Radiant Girl';
        this.selectedLanguage = 'English';
        this.selectedTone = 'Neutral';
      }
    });
  }

  generateScript() {
    if (!this.prompt.trim()) {
      alert('Please enter a topic or prompt first.');
      return;
    }

    this.isGeneratingScript = true;
    this.statusMessage = 'Generating script and scenes...';

    const payload = {
      story_type: this.prompt,
      language: this.selectedLanguage,
      tone: this.selectedTone
    };

    this.http.post<any>('http://localhost:8000/api/script', payload).subscribe({
      next: (res) => {
        this.storyboardProject = res;
        this.scenes = res.storyboards;
        this.videoTitle = res.project_info.title;
        this.isGeneratingScript = false;
        this.statusMessage = 'Script generated! You can now edit the scenes below.';
      },
      error: (err) => {
        this.statusMessage = 'Failed to generate script: ' + err.message;
        this.isGeneratingScript = false;
      }
    });
  }

  removeScene(index: number) {
    this.scenes.splice(index, 1);
  }

  generateVideo() {
    if (!this.storyboardProject) return;

    // Update the storyboard project with potentially edited scenes
    this.storyboardProject.storyboards = this.scenes;

    const payload = {
      storyboard_project: this.storyboardProject,
      image_style: this.selectedStyle || 'anime',
      voice_name: this.selectedVoice || 'alloy',
      story_type: this.prompt || 'Faceless Video'
    };

    this.isGenerating = true;
    this.statusMessage = 'Starting generation job...';

    this.http.post<any>('http://localhost:8000/api/generate_from_script', payload).subscribe({
      next: (res) => {
        this.statusMessage = 'Job started. Waiting for progress...';
        this.pollStatus(res.job_id);
      },
      error: (err) => {
        this.statusMessage = 'Failed to start job: ' + err.message;
        this.isGenerating = false;
      }
    });
  }

  pollStatus(jobId: string) {
    this.pollInterval = setInterval(() => {
      this.http.get<any>(`http://localhost:8000/api/status/${jobId}`).subscribe({
        next: (res) => {
          if (res.status === 'completed') {
            this.statusMessage = 'Video generation completed successfully!';
            this.isGenerating = false;
            clearInterval(this.pollInterval);
            // Optionally redirect to video list or show a video player here
            setTimeout(() => this.router.navigate(['/list']), 2000);
          } else if (res.status === 'error') {
            this.statusMessage = 'Error: ' + res.error;
            this.isGenerating = false;
            clearInterval(this.pollInterval);
          } else {
            this.statusMessage = res.step || `Status: ${res.status}`;
          }
        },
        error: (err) => {
          this.statusMessage = 'Failed to fetch status: ' + err.message;
          this.isGenerating = false;
          clearInterval(this.pollInterval);
        }
      });
    }, 2000);
  }

  previewVoice(voice: string) {
    const audio = new Audio();
    audio.src = `assets/voices/${voice.toLowerCase()}.mp3`;
    audio.load();
    audio.play().catch(err => {
      console.error('Audio preview failed:', err);
      alert('Could not play audio preview. Please make sure the voice assets are generated.');
    });
  }
}
