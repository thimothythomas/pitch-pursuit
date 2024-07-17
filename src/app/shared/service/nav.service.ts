import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
   path?: string;
   title?: string;
   type?: string;
   icon?: string;
   badgeType?: string;
   badgeValue?: string;
   active?: boolean;
   megaMenu?: boolean;
   megaMenuType?: string; // small, medium, large
   bookmark?: boolean;
   children?: Menu[];
   id?: string;
}

@Injectable({
   providedIn: 'root'
})
export class NavService {

   constructor() { }

   MENUITEMS: Menu[] = [
      {
         title: 'Home', type: 'link', id: 'home', path: '/'
      },
      {
         title: 'Booked Turf', type: 'link', id: 'bookedTurf', path: '/admin/dashboard'
      },
   ]

   // Array
   items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

}
