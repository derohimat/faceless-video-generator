import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-layout">
      <app-sidebar class="app-sidebar"></app-sidebar>
      <main class="app-main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: var(--bg-main);
      color: var(--text-primary);
      overflow: hidden;
    }
    .app-sidebar {
      width: 260px;
      flex-shrink: 0;
      background-color: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 10;
    }
    .app-main-content {
      flex: 1;
      height: 100vh;
      overflow-y: auto;
      background-color: var(--bg-main);
      position: relative;
    }
  `]
})
export class AppComponent { }
