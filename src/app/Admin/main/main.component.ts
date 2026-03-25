import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet,NgClass],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

isLeftSideBarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSideBarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });


}
