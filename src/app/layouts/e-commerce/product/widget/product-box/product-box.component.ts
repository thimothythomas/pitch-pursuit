import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Products } from '../../../../../shared/model/e-commerce/product.model';
import { CartService } from '../../../../../shared/service/e-commerce/cart.service';
import { ProductsService } from '../../../../../shared/service/e-commerce/products.service';
import { WishListService } from '../../../../../shared/service/e-commerce/wish-list.service';
import { Options } from 'ngx-slider-v2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent implements OnInit {

  @Input() products: Products;
  timeOptions: string[] = [
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // public product           :   Products = {};
  closeResult: string;
  public selectedSize: any = '';
  public counter: number = 1;

  selectedPitch: string = '5s';
  selectedDate: NgbDateStruct;
  selectedTime: number = 6; // Default time value

  today: NgbDateStruct;
  maxDate: NgbDateStruct;
  selectedStartTime: string;
  selectedEndTime: string;

  timeSliderOptions: Options = {
    floor: 0,
    ceil: 24,
    step: 1,
    showTicks: true,
    translate: (value: number): string => {
      const hour = value % 12 === 0 ? 12 : value % 12;
      const ampm = value < 12 ? 'AM' : 'PM';
      return `${hour} ${ampm}`;
    }
  };
  availabilitySliderOptions: Options = {
    floor: 6,
    ceil: 23,
    step: 1,
    showTicks: true,
    translate: (value: number): string => {
      const hour = value % 12 === 0 ? 12 : value % 12;
      const ampm = value < 12 ? 'AM' : 'PM';
      return `${hour} ${ampm}`;
    }
  };

  constructor(private cartService: CartService,
    public productsService: ProductsService, private wishlistService: WishListService,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    private snackbar: MatSnackBar
  ) {
    // start time should be greater than current time
    // this.selectedStartTime = this.timeOptions[this.timeOptions.indexOf(this.timeOptions[new Date().getHours()])];
    // this.selectedEndTime = this.timeOptions[this.timeOptions.indexOf(this.timeOptions[new Date().getHours() + 1])];


    this.selectedDate = this.calendar.getToday();

    this.today = this.calendar.getToday();
    this.maxDate = this.calendar.getNext(NgbDate.from(this.today), 'd', 5);
  }

  ngOnInit() {
    this.getCurrentTime();
  }

  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    console.log('hours:', hours);
    // Format the current time as 'HH:mm'
    let currentHour = `${hours}:00`;
    console.log('currentHour:', currentHour);
    let currentTimeOption = this.matchCurrentTime(currentHour);
    console.log('currentTimeOption:', currentTimeOption);
    if (currentTimeOption) {
      this.selectedStartTime = currentTimeOption;
      this.selectedEndTime = this.timeOptions[this.timeOptions.indexOf(currentTimeOption) + 1];
    } else {
      this.selectedStartTime = this.timeOptions[0];
      this.selectedEndTime = this.timeOptions[1];
    }
  }

  matchCurrentTime(currentHour) {
    // Check if the current time exists in the timeOptions array
    if (this.timeOptions.includes(currentHour)) {
      console.log('Current time matches with one of the options.');
      return currentHour;
    } else {
      console.log('Current time does not match with any options.');
      return null;
    }
  }

  bookTurf() {
    // user should choose pitch type and date
    if (!this.selectedPitch) {
      alert('Please select a pitch type');
      return;
    }
    if (!this.selectedDate) {
      alert('Please select a date');
      return;
    }
    // Implement your booking logic here
    let selectedDate = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
    // date in this format: 2021-07-01
    let date = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const startDateTime = new Date(`${date} ${this.selectedStartTime}`);
    const endDateTime = new Date(`${date} ${this.selectedEndTime}`);
    // only take name, id and price from the product
    let turfDetails = {
      id: this.products.id,
      name: this.products.name,
      price: this.products.price,
      image: this.products.img
    }
    let bookingDetails = {
      pitch: this.selectedPitch,
      date: date,
      startTime: this.selectedStartTime,
      endTime: this.selectedEndTime,
      startDateTime,
      endDateTime,
      turfDetails
    };

    try {
      let bookedTurfDetails = this.productsService.setBookedTurf(bookingDetails);
      if (bookedTurfDetails) {
        console.log('bookedTurfDetails:', bookedTurfDetails);
        alert('Turf booked successfully!');
        this.closeModal();
      } else {
        console.error('Slot already booked or overlaps with an existing booking.');
        alert('Slot already booked or overlaps with an existing booking.');
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onAvailabilityChange() {
    // Handle logic when the user updates the selected availability time
    console.log('Selected Start Time:', this.selectedStartTime);
    console.log('Selected End Time:', this.selectedEndTime);
  }

  // Add to cart
  public addToCart(product: Products, quantity: number = 1) {
    this.cartService.addToCart(product, quantity);
  }

  // Add to compare
  public addToCompare(product: Products) {
    this.productsService.addToCompare(product);
  }

  // Add to wishlist
  public addToWishlist(product: Products) {
    this.wishlistService.addToWishlist(product);
  }

  open(content, id) {
    this.productsService.getProduct(id).subscribe(product => this.products = product)
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Change variant
  public changeVariantSize(variant) {
    this.selectedSize = variant;
  }


  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

}
