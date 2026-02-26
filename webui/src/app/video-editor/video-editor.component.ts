import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-video-editor',
  template: `
    <div class="editor-container">
      <header class="editor-header">
        <div class="breadcrumbs">Dashboard > Video Editor</div>
        <div class="header-main">
          <h2>Video Editor</h2>
          <div class="credits-badge">💎 0 / 30</div>
        </div>
      </header>

      <div class="editor-layout">
        <div class="left-panel">
          <nav class="editor-tabs">
            <button [class.active]="activeTab === 'captions'" (click)="activeTab = 'captions'">💬 Captions</button>
            <button [class.active]="activeTab === 'style'" (click)="activeTab = 'style'">🎨 Caption Style</button>
            <button [class.active]="activeTab === 'music'" (click)="activeTab = 'music'">🎵 Background Music</button>
          </nav>

          <div class="tab-content">
            <!-- Captions Tab -->
            <div *ngIf="activeTab === 'captions'" class="captions-list">
              <div *ngFor="let scene of scenes; let i = index" class="caption-item" [class.selected]="selectedSceneIndex === i" (click)="selectedSceneIndex = i">
                <div class="scene-preview">
                  <img [src]="getSceneThumbnail(scene)" alt="Scene preview">
                </div>
                <div class="scene-details">
                  <div class="scene-time">{{getSceneTime(i)}}</div>
                  <p class="scene-text">{{scene.subtitles}}</p>
                  <button class="edit-scene-btn">✏️</button>
                </div>
              </div>
            </div>

            <!-- Caption Style Tab -->
            <div *ngIf="activeTab === 'style'" class="style-tab-content">
              <section class="editor-section">
                <h3>Font Style</h3>
                <div class="font-grid">
                  <button *ngFor="let font of fonts" 
                          class="font-tile" 
                          [class.active]="selectedFont === font"
                          (click)="selectedFont = font"
                          [style.font-family]="font">
                    {{font}}
                  </button>
                </div>
              </section>

              <section class="editor-section">
                <h3>Font Settings</h3>
                <div class="settings-grid">
                  <div class="setting-item">
                    <label>Font Size</label>
                    <div class="slider-row">
                      <input type="range" min="12" max="120" [(ngModel)]="fontSize">
                      <span>{{fontSize}}px</span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label>Vertical Position</label>
                    <div class="slider-row">
                      <input type="range" min="0" max="1" step="0.01" [(ngModel)]="verticalPos">
                      <span>{{verticalPos}}</span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label>Font Color</label>
                    <div class="color-row">
                      <input type="color" [(ngModel)]="fontColor">
                      <span>{{fontColor.toUpperCase()}}</span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label>Stroke Color</label>
                    <div class="color-row">
                      <input type="color" [(ngModel)]="strokeColor">
                      <span>{{strokeColor.toUpperCase()}}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section class="editor-section">
                <h3>Animation Settings</h3>
                <div class="settings-grid">
                  <div class="setting-item">
                    <label>Words Per Caption</label>
                    <div class="counter-row">
                      <button (click)="wordsPerCaption = wordsPerCaption > 1 ? wordsPerCaption - 1 : 1">-</button>
                      <input type="number" [(ngModel)]="wordsPerCaption">
                      <button (click)="wordsPerCaption = wordsPerCaption + 1">+</button>
                    </div>
                  </div>
                  <div class="setting-item">
                    <label>Animation Style</label>
                    <select [(ngModel)]="animationStyle">
                      <option value="TikTok">TikTok</option>
                      <option value="Classic">Classic</option>
                      <option value="Typewriter">Typewriter</option>
                    </select>
                  </div>
                  <div class="setting-item full-width">
                    <label>Animation Speed</label>
                    <div class="slider-row">
                      <input type="range" min="0.5" max="2.0" step="0.1" [(ngModel)]="animationSpeed">
                      <span>{{animationSpeed}}x</span>
                    </div>
                  </div>
                </div>
              </section>

              <section class="editor-section">
                <h3>Background Settings</h3>
                <div class="settings-grid">
                  <div class="setting-item">
                    <label>Background Style</label>
                    <select [(ngModel)]="bgStyle">
                      <option value="Default">Default</option>
                      <option value="Rounded">Rounded</option>
                      <option value="Outline">Outline</option>
                    </select>
                  </div>
                  <div class="setting-item">
                    <label>Background Color</label>
                    <div class="color-row">
                      <input type="color" [(ngModel)]="bgColor">
                      <span>{{bgColor.toUpperCase()}}</span>
                    </div>
                  </div>
                  <div class="setting-item full-width">
                    <label>Background Opacity</label>
                    <div class="slider-row">
                      <input type="range" min="0" max="100" [(ngModel)]="bgOpacity">
                      <span>{{bgOpacity}}%</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Background Music Tab -->
            <div *ngIf="activeTab === 'music'" class="music-tab-content">
              <div class="music-grid">
                <div *ngFor="let track of musicTracks" 
                     class="music-card" 
                     [class.active]="selectedMusic === track"
                     (click)="selectedMusic = track">
                  <div class="music-info">
                    <div class="music-name">{{track.name}}</div>
                    <div class="music-category">{{track.category}}</div>
                  </div>
                  <button class="music-play-btn" (click)="$event.stopPropagation()">▶</button>
                </div>
              </div>
              <div class="music-footer">
                <div class="volume-control">
                  <span>🔊</span>
                  <input type="range" min="0" max="100" [(ngModel)]="musicVolume">
                  <span>{{musicVolume}}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-panel">
          <div class="preview-player">
            <div class="video-placeholder">
              <img *ngIf="scenes.length > 0" [src]="getSceneThumbnail(scenes[selectedSceneIndex])" alt="Preview">
              
              <!-- Caption Preview Overlay -->
              <div *ngIf="scenes.length > 0" class="caption-preview-overlay" [style.bottom.%]="(1 - verticalPos) * 100">
                <div class="caption-text-preview" 
                     [style.font-family]="selectedFont"
                     [style.font-size.px]="fontSize"
                     [style.color]="fontColor"
                     [style.text-shadow]="'0 0 10px ' + strokeColor"
                     [style.background-color]="bgStyle !== 'Default' ? getRGBA(bgColor, bgOpacity) : 'transparent'"
                     [style.padding]="bgStyle !== 'Default' ? '0.5rem 1rem' : '0'"
                     [style.border-radius]="bgStyle === 'Rounded' ? '12px' : '0'"
                     [class.tiktok-style]="animationStyle === 'TikTok'">
                  {{ getCurrentDisplaySubtitles() }}
                </div>
              </div>

              <div class="player-controls">
                <button class="play-btn" (click)="togglePlay()">{{ isPlaying ? '⏸' : '▶' }}</button>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="playbackProgress"></div>
                </div>
                <div class="time-display">{{formatTime(currentTime)}} / {{formatTime(totalDuration)}}</div>
              </div>
            </div>
            
            <button class="export-btn" (click)="exportVideo()" [disabled]="isExporting">
              {{ isExporting ? 'Exporting...' : 'Export Video' }}
            </button>

            <div class="notice-info free-plan">
              <p>Free Plan Notice: Videos created with the free plan will include a watermark. Upgrade to a premium plan to remove the watermark and unlock additional features.</p>
              <button class="upgrade-btn">👑 Upgrade Now</button>
            </div>

            <div class="notice-warning">
              <p>Note: This is a draft video and you might experience some flickering/pauses with images and audio, or occasional black screens during transitions. These won't be an issue in the final video.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      background: var(--bg-main);
      color: var(--text-primary);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .editor-header {
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    .breadcrumbs {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-main h2 { margin: 0; font-size: 1.1rem; }
    .credits-badge {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-color);
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
    }

    .editor-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .left-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
    }
    .editor-tabs {
      display: flex;
      padding: 6px;
      gap: 4px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      margin: 1.5rem 1.5rem 0 1.5rem;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .editor-tabs button {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }
    .editor-tabs button:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    .editor-tabs button.active {
      background: var(--primary-accent);
      color: white;
      box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
    }

    /* Column layout for settings tabs */
    .style-tab-content, .music-tab-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .editor-section h3 {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .font-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }
    .font-tile {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 1rem 0.5rem;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .font-tile:hover { background: rgba(255,255,255,0.06); }
    .font-tile.active {
      background: rgba(108, 92, 231, 0.1);
      border-color: var(--primary-accent);
      color: white;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    .setting-item { display: flex; flex-direction: column; gap: 0.5rem; }
    .setting-item.full-width { grid-column: span 2; }
    .setting-item label { font-size: 0.85rem; color: var(--text-secondary); }

    .slider-row, .color-row, .counter-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-color);
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
    }
    .slider-row input { flex: 1; }
    .slider-row span, .color-row span { font-size: 0.8rem; min-width: 40px; }
    .color-row input { background: none; border: none; width: 30px; height: 30px; cursor: pointer; }

    .counter-row { justify-content: space-between; width: 120px; }
    .counter-row button { 
      background: rgba(255,255,255,0.1); 
      border: none; 
      color: white; 
      width: 24px; 
      height: 24px; 
      border-radius: 4px; 
      cursor: pointer; 
    }
    .counter-row input { 
      background: transparent; 
      border: none; 
      color: white; 
      text-align: center; 
      width: 30px; 
    }

    select {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border-color);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
    }

    .music-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .music-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .music-card:hover { background: rgba(255,255,255,0.06); }
    .music-card.active {
      background: rgba(108, 92, 231, 0.1);
      border-color: var(--primary-accent);
    }
    .music-name { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.25rem; }
    .music-category { font-size: 0.75rem; color: var(--text-muted); }
    .music-play-btn {
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

    .music-footer {
      margin-top: auto;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }
    .volume-control {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255,255,255,0.03);
      padding: 0.75rem 1rem;
      border-radius: 30px;
      width: 250px;
    }
    .volume-control input { flex: 1; }
    .volume-control span { font-size: 0.8rem; }
    .caption-item {
      display: flex;
      gap: 1rem;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: rgba(255,255,255,0.02);
      cursor: pointer;
      transition: all 0.2s;
    }
    .caption-item:hover {
      background: rgba(255,255,255,0.05);
    }
    .caption-item.selected {
      border-color: var(--primary-accent);
      background: rgba(108, 92, 231, 0.05);
    }
    .caption-text-preview {
      display: inline-block;
      line-height: 1.2;
      word-wrap: break-word;
      white-space: pre-wrap;
      transition: all 0.1s ease;
    }
    .tiktok-style {
      text-transform: uppercase;
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    .scene-preview {
      width: 100px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      background: #000;
      flex-shrink: 0;
    }
    .scene-preview img { width: 100%; height: 100%; object-fit: cover; }
    .scene-details {
      flex: 1;
      position: relative;
    }
    .scene-time {
      font-size: 0.75rem;
      background: rgba(0,0,0,0.5);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 0.4rem;
    }
    .scene-text {
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--text-secondary);
    }
    .edit-scene-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      opacity: 0.5;
    }

    .right-panel {
      width: 400px;
      background: rgba(0,0,0,0.2);
      padding: 2rem;
      overflow-y: auto;
    }
    .preview-player {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .video-placeholder {
      width: 100%;
      aspect-ratio: 9/16;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    .video-placeholder img { width: 100%; height: 100%; object-fit: cover; }
    .player-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .progress-bar {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
    }
    .progress-fill { height: 100%; background: var(--primary-accent); border-radius: 2px; }
    .time-display { font-size: 0.75rem; white-space: nowrap; }

    .export-btn {
      background: var(--primary-accent);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    .notice-info {
      background: rgba(108, 92, 231, 0.05);
      border: 1px solid rgba(108, 92, 231, 0.2);
      padding: 1.25rem;
      border-radius: 12px;
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .upgrade-btn {
      margin-top: 1rem;
      background: var(--primary-accent);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      z-index: 3;
    }
  `],
})
export class VideoEditorComponent implements OnInit {
  activeTab = 'captions';
  scenes: any[] = [];
  selectedSceneIndex = 0;
  isExporting = false;
  storyboardProject: any;

  // Caption Styling Properties
  fonts = [
    'Titan One', 'Ranchers', 'Rampart One', 'Permanent Marker',
    'Open Sans', 'Noto Sans', 'Montserrat', 'Luckiest Guy',
    'Knewave', 'Jua', 'Creepster', 'Caveat',
    'Bungee', 'Bebas Neue', 'Bangers', 'Bakbak One'
  ];
  selectedFont = 'Titan One';
  fontSize = 64;
  verticalPos = 0.60;
  fontColor = '#FFFFFF';
  strokeColor = '#000000';

  wordsPerCaption = 1;
  animationStyle = 'TikTok';
  animationSpeed = 1.4;

  bgStyle = 'Default';
  bgColor = '#FF0000';
  bgOpacity = 60;

  // Music Properties
  musicTracks: any[] = [];
  selectedMusic: any;
  musicVolume = 15;

  // Playback Properties
  isPlaying = false;
  currentTime = 0;
  playbackProgress = 0;
  totalDuration = 0;
  private playbackTimer: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchConfig();
    this.route.queryParams.subscribe(params => {
      if (params['edit_type'] && params['edit_title']) {
        this.loadVideoDetails(params['edit_type'], params['edit_title']);
      }
    });
  }

  fetchConfig() {
    this.http.get<any>('http://localhost:8000/api/config').subscribe({
      next: (res) => {
        this.musicTracks = res.music_tracks;
        if (this.musicTracks.length > 0) this.selectedMusic = this.musicTracks[0];
        // Note: voices and styles could also be dynamic if needed
      },
      error: (err) => console.error('Failed to fetch config', err)
    });
  }

  loadVideoDetails(type: string, title: string) {
    console.log('Loading video details for:', { type, title });
    const url = `http://localhost:8000/api/video_details/${encodeURIComponent(type)}/${encodeURIComponent(title)}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Project data loaded:', res);
        this.storyboardProject = res;
        this.scenes = res.storyboards || [];
        this.calculateTotalDuration();
      },
      error: (err) => {
        console.error('Failed to load project details from ' + url, err);
        alert('Gagal memuat detail video. Pastikan server berjalan.');
      }
    });
  }

  calculateTotalDuration() {
    this.totalDuration = this.scenes.reduce((acc, scene) => acc + (scene.duration || 5.0), 0);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.playbackTimer = setInterval(() => {
        this.currentTime += 0.1 * this.animationSpeed;
        if (this.currentTime >= this.totalDuration) {
          this.currentTime = 0;
          this.isPlaying = false;
          clearInterval(this.playbackTimer);
        }
        this.playbackProgress = (this.currentTime / this.totalDuration) * 100;

        // Auto-select scene based on real cumulative time
        let cumulativeTime = 0;
        for (let i = 0; i < this.scenes.length; i++) {
          cumulativeTime += this.scenes[i].duration || 5.0;
          if (this.currentTime <= cumulativeTime) {
            if (this.selectedSceneIndex !== i) {
              this.selectedSceneIndex = i;
            }
            break;
          }
        }
      }, 100);
    } else {
      clearInterval(this.playbackTimer);
    }
  }

  getCurrentDisplaySubtitles(): string {
    if (!this.scenes || this.scenes.length === 0 || !this.scenes[this.selectedSceneIndex]) return '';
    const scene = this.scenes[this.selectedSceneIndex];
    const subtitles = scene.subtitles;
    if (this.animationStyle !== 'TikTok') return subtitles;

    const words = subtitles.split(' ');

    // Calculate scene start time
    let sceneStartTime = 0;
    for (let i = 0; i < this.selectedSceneIndex; i++) {
      sceneStartTime += this.scenes[i].duration || 5.0;
    }

    const sceneDuration = scene.duration || 5.0;
    const progressInScene = (this.currentTime - sceneStartTime) / sceneDuration;

    // Safety check for progress
    const clampedProgress = Math.max(0, Math.min(0.99, progressInScene));
    const wordIndex = Math.floor(clampedProgress * words.length);

    // Show a group of words based on wordsPerCaption
    const displayWords = words.slice(wordIndex, wordIndex + this.wordsPerCaption);
    return displayWords.join(' ');
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getRGBA(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }

  getSceneThumbnail(scene: any): string {
    if (!scene || !scene.image) return 'assets/placeholder-image.png';
    return `http://localhost:8000/api/image?path=${encodeURIComponent(scene.image)}`;
  }

  getSceneTime(index: number): string {
    // Simple mock time: each scene 5 seconds
    const totalSeconds = index * 7;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  exportVideo() {
    if (!this.storyboardProject) return;
    this.isExporting = true;

    const payload = {
      storyboard_project: this.storyboardProject,
      image_style: this.storyboardProject.metadata?.image_style || 'anime',
      voice_name: this.storyboardProject.metadata?.voice_name || 'alloy',
      story_type: this.storyboardProject.metadata?.story_type || 'Faceless Video'
    };

    this.http.post<any>('http://localhost:8000/api/generate_from_script', payload).subscribe({
      next: (res) => {
        alert('Export started! Job ID: ' + res.job_id);
        this.isExporting = false;
      },
      error: (err) => {
        alert('Export failed: ' + err.message);
        this.isExporting = false;
      }
    });
  }
}
