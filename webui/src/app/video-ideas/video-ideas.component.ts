import { Component } from '@angular/core';

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
            <button class="suggestion-pill">👑 Write a story about Sleeping Beauty</button>
            <button class="suggestion-pill">⛵ Write a story about Noah's Ark</button>
            <button class="suggestion-pill">🏛️ Create a documentary about ancient Rome</button>
          </div>

          <div class="controls-row">
            <div class="control-group">
              <label class="input-label">Output language</label>
              <select><option>English</option><option>Spanish</option></select>
            </div>
            <div class="control-group">
              <label class="input-label">Tone</label>
              <select><option>Academic</option><option>Neutral</option></select>
            </div>
            <button class="btn-primary" (click)="generateIdeas()">Generate</button>
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
export class VideoIdeasComponent {
  prompt = '';
  ideas: string[] = [
    'Uncovering the Secrets of Pyramid Construction',
    'Ancient Egyptian Myths Behind the Pyramids',
    'The Pyramids: A Time Capsule of Ancient Life',
    'Exploring Pyramid Technology: Was It Alien Help?',
    'Mysteries of the Sphinx: The Guardian of the Pyramids',
    'Life After Death: Pyramids and the Egyptian Afterlife',
    'Hidden Treasures: What Lies Within the Pyramids?',
    'The Great Pyramid: A Marvel of Ancient Engineering',
    'Pyramids Through the Ages: Their Evolving Significance',
    'Ancient Egyptian Art: Stories Carved in Stone'
  ];

  generateIdeas() {
    // In a real app, this would call the backend API to generate 10 ideas based on this.prompt.
    // Since we are mocking the ideas as per User UI, we just simulate the loading state if needed.
  }
}
