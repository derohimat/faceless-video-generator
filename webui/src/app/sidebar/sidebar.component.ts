import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar-container">
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14V10Z" fill="currentColor"/>
            <rect x="3" y="6" width="12" height="12" rx="2" fill="currentColor"/>
          </svg>
        </div>
        <span class="logo-text">FacelessVideos</span>
      </div>

      <nav class="nav-menu">
        <a routerLink="/list" routerLinkActive="active" class="nav-item">
          <span class="icon">📁</span>
          <span>My Videos</span>
        </a>

        <div class="nav-section">
          <div class="nav-section-title">
            <span class="icon">✨</span> Create
          </div>
          <a routerLink="/create" routerLinkActive="active" class="nav-item sub-item">
            <span>Faceless Video</span>
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">
            <span class="icon">💡</span> Free Tools
          </div>
          <a routerLink="/ideas" routerLinkActive="active" class="nav-item sub-item">
            <span>Video Ideas</span>
          </a>
          <a href="#" class="nav-item sub-item">
            <span>TikTok Transcript</span>
          </a>
        </div>
      </nav>

      <div class="mt-auto bottom-section">
        <div class="upgrade-banner">
          <div class="upgrade-icon">👑</div>
          <div class="upgrade-text">
            <strong>Upgrade</strong>
            <span>Get Pro features</span>
          </div>
        </div>

        <div class="profile-section">
          <div class="avatar">
            <img src="https://ui-avatars.com/api/?name=User&background=6C5CE7&color=fff" alt="User">
          </div>
          <div class="user-info">
            <span class="user-name">User</span>
            <span class="user-email">user@example.com</span>
          </div>
          <span class="expand-icon">↕</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.5rem 1rem;
      color: var(--text-primary);
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding-left: 0.5rem;
    }
    .logo-icon {
      color: var(--primary-accent);
      display: flex;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-item:hover {
      color: var(--text-primary);
      background-color: rgba(255,255,255,0.03);
    }
    .nav-item.active {
      color: var(--text-primary);
      background-color: rgba(255,255,255,0.05);
    }
    .nav-item.sub-item {
      padding-left: 2rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .nav-section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
      padding-left: 0.75rem;
      font-weight: 600;
    }

    .mt-auto {
      margin-top: auto;
    }
    .bottom-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .upgrade-banner {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: #000;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .upgrade-banner:hover {
      transform: translateY(-2px);
    }
    .upgrade-icon {
      font-size: 1.25rem;
    }
    .upgrade-text {
      display: flex;
      flex-direction: column;
    }
    .upgrade-text strong {
      font-size: 0.95rem;
    }
    .upgrade-text span {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .profile-section:hover {
      background-color: rgba(255,255,255,0.03);
    }
    .avatar img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .user-email {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .expand-icon {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
  `]
})
export class SidebarComponent { }
