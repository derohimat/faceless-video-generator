import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-ideas',
  template: `
    <div class="page-container">
      <header class="page-header center-text">
        <div class="free-tool-badge">✨ Free Tool</div>
        <h1>Faceless Video Ideas Generator</h1>
        <p class="subtitle">From 1 idea to 10 video ideas.</p>
      </header>

      <div class="content-wrapper max-w-800">
        <div class="generator-box">
          <textarea 
            [(ngModel)]="prompt" 
            placeholder="Create a documentary about ancient Egyptian pyramids" 
            rows="5"></textarea>
          <span class="char-count">{{prompt.length}}/20000</span>

          <div class="suggestions-slider">
            <button class="suggestion-pill" (click)="prompt = 'Write a story about Sleeping Beauty'">👑 Write a story about Sleeping Beauty</button>
            <button class="suggestion-pill" (click)="prompt = 'Write a story about Noah\'s Ark'">⛵ Write a story about Noah's Ark</button>
            <button class="suggestion-pill" (click)="prompt = 'Create a documentary about ancient Rome'">🏛️ Create a documentary about ancient Rome</button>
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
            <button class="btn-primary" [disabled]="isGenerating" (click)="generateIdeas()">
              {{ isGenerating ? 'Generating...' : 'Generate' }}
            </button>
          </div>
        </div>

        <section class="results-section" *ngIf="ideas.length > 0">
          <h2>Faceless Video Ideas for Your YouTube Channel</h2>
          <div class="ideas-grid">
            <div class="idea-card" *ngFor="let idea of ideas" routerLink="/create" [queryParams]="{topic: idea}">
              <p class="idea-text">{{idea}}</p>
              <div class="idea-footer">
                <span class="action-text">Click any idea to create video</span>
                <span class="wand-icon">🪄</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 0;
      width: 100%;
      height: 100%;
    }
    .page-header {
      padding: 4rem 2rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .free-tool-badge {
      background: rgba(108, 92, 231, 0.1);
      color: var(--primary-accent);
      border: 1px solid var(--primary-accent);
      padding: 0.25rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    h1 {
      font-size: 2.5rem;
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .max-w-800 {
      max-width: 800px;
      margin: 0 auto;
    }

    .generator-box {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      position: relative;
    }
    
    .generator-box textarea {
      background: transparent;
      border: none;
      padding: 0;
      font-size: 1rem;
      min-height: 100px;
    }
    .generator-box .char-count {
      position: absolute;
      right: 1.5rem;
      top: 6rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .suggestions-slider {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 1rem;
    }
    .suggestion-pill {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .suggestion-pill:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-primary);
    }

    .controls-row {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
    }
    .control-group {
      flex: 1;
    }

    .results-section {
      margin-top: 3rem;
      padding-bottom: 5rem;
    }
    .results-section h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .ideas-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .idea-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s;
    }
    .idea-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary-accent);
      background: rgba(108, 92, 231, 0.05);
    }
    .idea-text {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary);
      flex: 1;
    }
    .idea-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--primary-accent);
      font-size: 0.85rem;
    }
    .wand-icon {
      color: var(--text-muted);
    }
    .idea-card:hover .wand-icon {
      color: var(--primary-accent);
    }
  `]
})
export class VideoIdeasComponent implements OnInit {
  prompt = '';
  ideas: string[] = [];
  isGenerating = false;

  availableLanguages: string[] = ['English', 'Bahasa Indonesia'];
  availableTones: string[] = ['Neutral', 'Professional', 'Humorous'];

  selectedLanguage = 'English';
  selectedTone = 'Neutral';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchConfig();
  }

  fetchConfig() {
    this.http.get<any>('http://localhost:8000/api/config').subscribe({
      next: (config) => {
        this.availableLanguages = config.languages || ['English', 'Bahasa Indonesia'];
        this.availableTones = config.tones || ['Neutral', 'Professional', 'Humorous'];
        if (this.availableLanguages.length > 0) this.selectedLanguage = this.availableLanguages[0];
        if (this.availableTones.length > 0) this.selectedTone = this.availableTones[0];
      },
      error: (err) => console.error('Failed to fetch config', err)
    });
  }

  generateIdeas() {
    if (!this.prompt.trim()) {
      alert('Please enter a topic first.');
      return;
    }

    this.isGenerating = true;
    const payload = {
      prompt: this.prompt,
      language: this.selectedLanguage,
      tone: this.selectedTone
    };

    this.http.post<any>('http://localhost:8000/api/ideas', payload).subscribe({
      next: (res) => {
        this.ideas = res.ideas;
        this.isGenerating = false;
      },
      error: (err) => {
        alert('Failed to generate ideas: ' + err.message);
        this.isGenerating = false;
      }
    });
  }
}
