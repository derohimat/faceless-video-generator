import { Component } from '@angular/core';

@Component({
  selector: 'app-video-list',
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="title-area">
          <h1>Video list</h1>
          <span class="badge" *ngIf="videos.length === 0">No Videos left</span>
        </div>
        
        <div class="header-actions">
          <button class="icon-btn">🔍</button>
          <button class="btn-primary" routerLink="/create">✨ Create video</button>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="videos-grid" *ngIf="videos.length > 0">
          <div class="video-card" *ngFor="let video of videos">
            <div class="thumbnail-wrapper">
              <img [src]="video.thumbnail" alt="Video Thumbnail">
              <span class="duration">⏱ {{video.duration}}</span>
            </div>
            
            <div class="video-info">
              <h3 class="video-title">{{video.title}}</h3>
              <button class="delete-btn">🗑️</button>
            </div>
            
            <div class="video-meta">
              <span class="date">📅 {{video.date}}</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="videos.length === 0">
          <p>You haven't created any videos yet.</p>
        </div>
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
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }
    
    .title-area {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .title-area h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .badge {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger-color);
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.25rem;
      cursor: pointer;
    }

    .content-wrapper {
      padding: 2rem;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .video-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.3);
      border-color: var(--primary-accent);
    }

    .thumbnail-wrapper {
      position: relative;
      width: 100%;
      padding-top: 177%; /* 9:16 Aspect ratio approximately */
      background: #111;
    }
    .thumbnail-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .duration {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
      backdrop-filter: blur(4px);
    }

    .video-info {
      padding: 1rem 1rem 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .video-title {
      font-size: 0.95rem;
      margin: 0;
      font-weight: 600;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .delete-btn {
      background: transparent;
      border: none;
      color: var(--danger-color);
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .video-card:hover .delete-btn {
      opacity: 1;
    }

    .video-meta {
      padding: 0.5rem 1rem 1rem;
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
    }
  `]
})
export class VideoListComponent {
  videos = [
    {
      title: 'How AI Will Change Our Daily Lives',
      thumbnail: 'https://source.unsplash.com/random/400x711/?cyberpunk,city',
      duration: '00:28',
      date: 'Feb 21, 2026'
    }
  ];
}
