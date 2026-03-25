import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-side-bar',
  imports: [RouterModule,NgClass],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.css'
})
export class LeftSideBarComponent {
isLeftSideBarCollapsed = input.required<boolean>()
changeIsLeftSidebarCollapsed = output<boolean>();

 items =[
  {
   routerLink:'DashBoard',
   icon:'bi bi-bar-chart',
   label:'DashBoard'
  },
  {
   routerLink:'menu',
   icon:'bi-journal-text',
   label:'Menu'
  },
  {
  routerLink:'orders',
   icon:'bi bi-basket3',
   label:'Orders'
  },{
  routerLink:'itemmaster',
   icon:'bi bi-clipboard-check',
   label:'Item Master'
  },{
      routerLink:'Report',
   icon:'bi bi-file-bar-graph',
   label:'Sales Report'
  },{
      routerLink:'itemsaleregister',
   icon:'bi bi-journal-check',
   label:'Item Sale Register'
  }
 ]





   toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSideBarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  
}
