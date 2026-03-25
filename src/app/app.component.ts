import { Component, HostListener, OnInit, signal } from '@angular/core';

import { LeftSideBarComponent } from './Admin/left-side-bar/left-side-bar.component';
import { MainComponent } from './Admin/main/main.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [LeftSideBarComponent, MainComponent , CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'webapp';

  isLeftSideBarCollapsed = signal<boolean>(false);


  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSideBarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSideBarCollapsed.set(this.screenWidth() < 768);
  }


  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSideBarCollapsed.set(isLeftSidebarCollapsed);
  }


  get islogintoken(): boolean {
    return !!localStorage.getItem('login');
  }
}
