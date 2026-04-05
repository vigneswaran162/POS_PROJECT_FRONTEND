import { Routes } from '@angular/router';
import { LoginComponent } from './Admin/login/login.component';
import { DashBoardComponent } from './Admin/dash-board/dash-board.component';
import { MenuComponent } from './Admin/menu/menu.component';
import { OrdersComponent } from './Admin/orders/orders.component';
import { ItemMasterComponent } from './Admin/item-master/item-master.component';
import { ReportComponent } from './Admin/report/report.component';
import { ItemSaleRegisterComponent } from './Admin/item-sale-register/item-sale-register.component';
import { TableMasterComponent } from './Admin/table-master/table-master.component';

export const routes: Routes = [
    // {
    //  path:'',
    //  component:LoginComponent
    // },
      {
        path:'DashBoard',
        component:DashBoardComponent
    },
    {
        path:'',
        component:DashBoardComponent
    },{
        path:'menu',
        component:MenuComponent
    },{
        path:'orders',
        component:OrdersComponent
    },{
        path:'itemmaster',
        component:ItemMasterComponent
    },{
        path:'Report',
        component:ReportComponent
    },
   {
        path:'itemsaleregister',
        component:ItemSaleRegisterComponent
    },{
        path:'TableMaster',
        component:TableMasterComponent
    }
];
