import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
// import 'rxjs/add/operator/map';
// import { map } from 'rxjs/operators';
import { ColorFilter, Products } from '../../model/e-commerce/product.model';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public currency: string = 'USD';
  public catalogMode: boolean = false;

  // For toggling filter of detail page in mobile view
  public filterBar: boolean = false;

  constructor(private http: HttpClient, private toastrService: ToastrService) {

  }

  private products(): Observable<Products[]> {
    return this.http.get('assets/data/ecommerce/products.json').pipe(map((res: any) => {
      return res;
    }))
  }

  public getProducts(): Observable<Products[]> {
    return this.products();
  }

  public getProduct(id: number): Observable<Products> {

    return this.products().pipe(map(items => {
      return items.find((item: Products) => {
        return item.id === id;
      });
    }));
  }

  public get bookedTurfDetails(): any | Error {
    return JSON.parse(localStorage.getItem('bookedTurfDetails')) || [];
  }

  public setBookedTurf(bookingDetails: any): any {
    // Retrieve existing booked turf details
    let bookedTurfDetailsArray = this.bookedTurfDetails;
    console.log('bookedTurfDetailsArray:', bookedTurfDetailsArray);

    if (!bookedTurfDetailsArray) {
      bookedTurfDetailsArray = [];
    }
    // Check for duplicates and overlapping slots
    const isDuplicateOrOverlapping = bookedTurfDetailsArray.some(
      (existingBooking) => {
        // Check for exact duplicate
        console.log('bookingDetails:', bookingDetails);
        console.log('existingBooking:', existingBooking);
        // existing booking startDateTime is in this format "2024-01-11T16:30:00.000Z"
        let existingBookingStartDateTime = new Date(existingBooking.startDateTime);
        let existingBookingEndDateTime = new Date(existingBooking.endDateTime);
        if (
          existingBooking.turfDetails.id === bookingDetails.turfDetails.id &&
          existingBookingStartDateTime.getTime() === bookingDetails.startDateTime.getTime() &&
          existingBookingEndDateTime.getTime() === bookingDetails.endDateTime.getTime()
        ) {
          return true;
        }

        // Check for overlapping slots
        return (
          bookingDetails.startDateTime.getTime() <= existingBookingEndDateTime.getTime() &&
          existingBookingStartDateTime.getTime() <= bookingDetails.endDateTime.getTime()
        );
      }
    );

    if (isDuplicateOrOverlapping) {
      // Handle the error appropriately, e.g., notify the user
      return false;
    }
    let currentUser = this.currentUser;
    // Add the current user to the booking details
    bookingDetails.user = currentUser;
    
    // Add the new booking to the array
    bookedTurfDetailsArray.push(bookingDetails);

    // Save the updated array to local storage
    localStorage.setItem('bookedTurfDetails', JSON.stringify(bookedTurfDetailsArray));

    return bookedTurfDetailsArray;
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  public checkDuplicateInObject(tag, Products) {
    var seenDuplicate = false,
      testObject = {};

    Products.map(function (item) {
      var itemPropertyName = item[tag];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return seenDuplicate;
  }

  public getProductByCategory(category: string): Observable<Products[]> {
    return this.products().pipe(map(items =>
      items.filter((item: Products) => {
        if (category == 'all') {
          return item
        }
        else if (category === 'top_rated') {
          return item.sale === true;
        }
      })
    ));
  }
  private tag(): Observable<Products[]> {
    return this.http.get('assets/data/products.json').pipe(map((res: any) => {
      return res;
    }));
  }

  public getTags(): Observable<Products[]> {
    return this.products();
  }

  /*
     ---------------------------------------------
     ----------  Compare Product  ----------------
     ---------------------------------------------
  */

  // Get Compare Products
  public getComapreProducts(): Observable<Products[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Products[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Products): boolean {
    const item = products.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Products): Products | boolean {
    var item: Products | boolean = false;
    if (this.hasProduct(product)) {
      item = products.filter(item => item.id === product.id)[0];
      const index = products.indexOf(item);
    } else {
      if (products.length < 4)
        products.push(product);
      else
        this.toastrService.warning('Maximum 4 products are in compare.'); // toasr services
    }
    localStorage.setItem("compareItem", JSON.stringify(products));
    return item;
  }

  // Removed Product
  public removeFromCompare(product: Products) {
    if (product === undefined) { return; }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem("compareItem", JSON.stringify(products));
  }

}