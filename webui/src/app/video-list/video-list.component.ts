import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="title-area">
          <h1>Video list</h1>
          <span class="badge" *ngIf="videos.length === 0">No Videos</span>
        </div>
        
        <div class="header-actions">
          <button class="icon-btn">🔍</button>
          <button class="btn-primary" routerLink="/create">✨ Create video</button>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="loading-state" *ngIf="isLoading">
           <p>Loading your videos...</p>
        </div>

        <div class="videos-grid" *ngIf="!isLoading && videos.length > 0">
          <div class="video-card" *ngFor="let video of videos">
            <div class="thumbnail-wrapper" (click)="playVideo(video)">
              <img [src]="'http://localhost:8000/' + video.thumbnail" alt="Video Thumbnail" *ngIf="video.thumbnail">
              <div class="no-thumb" *ngIf="!video.thumbnail">🎬</div>
              <div class="play-overlay">▶</div>
            </div>
            
            <div class="video-info">
              <h3 class="video-title">{{video.title}}</h3>
              <div class="card-actions">
                <button class="edit-btn" (click)="$event.stopPropagation(); editVideo(video)">✏️</button>
                <button class="delete-btn" (click)="$event.stopPropagation(); deleteVideo(video)">🗑️</button>
              </div>
            </div>
            
            <div class="video-meta">
              <span class="date">📅 {{video.date}}</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!isLoading && videos.length === 0">
          <div class="empty-icon">📂</div>
          <p>You haven't generated any videos yet.</p>
          <button class="btn-primary" routerLink="/create">Start Creating</button>
        </div>
      </div>

      <!-- Simple Video Modal -->
      <div class="video-modal" *ngIf="playingVideo" (click)="playingVideo = null">
         <div class="modal-content" (click)="$event.stopPropagation()">
            <video [src]="'http://localhost:8000/' + playingVideo.video_url" controls autoplay></video>
            <button class="close-modal" (click)="playingVideo = null">×</button>
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
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
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
      padding-top: 177%; /* 9:16 Aspect ratio */
      background: #111;
      cursor: pointer;
    }
    .thumbnail-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-thumb {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      opacity: 0.3;
    }
    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      background: rgba(108, 92, 231, 0.8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      opacity: 0;
      transition: opacity 0.2s, transform 0.2s;
    }
    .video-card:hover .play-overlay {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
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
    .card-actions {
      display: flex;
      gap: 0.5rem;
    }
    .edit-btn, .delete-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    .video-card:hover .edit-btn, .video-card:hover .delete-btn {
      opacity: 1;
    }
    .edit-btn { color: var(--primary-accent); }
    .delete-btn { color: var(--danger-color); }

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
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.2;
    }

    .video-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }
    .modal-content {
      position: relative;
      width: 90%;
      max-width: 400px;
      aspect-ratio: 9/16;
      background: black;
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .modal-content video {
      width: 100%;
      height: 100%;
    }
    .close-modal {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `]
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];
  isLoading = true;
  playingVideo: any = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.fetchVideos();
  }

  fetchVideos() {
    this.isLoading = true;
    this.http.get<any>('http://localhost:8000/api/videos').subscribe({
      next: (res) => {
        this.videos = res.videos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch videos', err);
        this.isLoading = false;
      }
    });
  }

  playVideo(video: any) {
    this.playingVideo = video;
  }

  deleteVideo(video: any) {
    if (confirm(`Apakah Anda yakin ingin menghapus video "${video.title}"?`)) {
      const url = `http://localhost:8000/api/delete_video/${encodeURIComponent(video.story_type)}/${encodeURIComponent(video.video_id)}`;
      this.http.delete<any>(url).subscribe({
        next: (res) => {
          console.log('Video deleted:', res);
          this.fetchVideos();
        },
        error: (err) => {
          console.error('Failed to delete video', err);
          alert('Gagal menghapus video.');
        }
      });
    }
  }

  editVideo(video: any) {
    this.router.navigate(['/editor'], {
      queryParams: {
        edit_type: video.story_type,
        edit_title: video.video_id
      }
    });
  }
}
