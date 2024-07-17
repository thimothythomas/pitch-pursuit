import { animate, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorFilter, Products } from '../../../../../../shared/model/e-commerce/product.model';
import { ProductsService } from '../../../../../../shared/service/e-commerce/products.service';
import { AuthService } from 'src/app/layouts/auth/auth.service';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss'],
  animations: [  // angular animation
    trigger('Animation', [
      transition('* => fadeOut', [
        style({ opacity: 0.1 }),
        animate(1000, style({ opacity: 0.1 }))
      ]),
      transition('* => fadeIn', [
        style({ opacity: 0.1 }),
        animate(1000, style({ opacity: 0.1 }))
      ])
    ])
  ]
})
export class CollectionLeftSidebarComponent implements OnInit {
  bookedTurfDetails: any;
  filteredTurfDetails: any;
  selectedDate: any;

  constructor(private route: ActivatedRoute, private router: Router,
    public productsService: ProductsService, private authService: AuthService) {
    // check if current user is admin
    if (!this.authService.checkRole('ADMIN')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.bookedTurfDetails = this.productsService.bookedTurfDetails;
    this.filteredTurfDetails = this.bookedTurfDetails;
  }

  search() {
    // Convert NgbDate to string in the format "YYYY-M-D"
    const selectedDateStr = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;

    // Filter bookedTurfDetails based on the selected date
    this.filteredTurfDetails = this.bookedTurfDetails.filter(turf => {
      // Assuming turf.date is a string in the format "YYYY-M-D"
      return turf.date === selectedDateStr;
    });

    console.log('Filtered Turf Details:', this.filteredTurfDetails);
  }

  reset() {
    this.filteredTurfDetails = this.bookedTurfDetails;
    this.selectedDate = null;
  }

  filterDateSelected(event) {
    console.log('filterDateSelected:', event);
    this.selectedDate = event;
  }

  formatDate(date: string): string {
    try {
      // Format date to 11 Jan 2021
      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('default', { month: 'short' });
      const year = dateObj.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      return date;
    }
  }

}

