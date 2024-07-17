import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../../shared/model/e-commerce/cart.model';
import { CartService } from '../../../shared/service/e-commerce/cart.service';
import { ProductsService } from '../../../shared/service/e-commerce/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecommerce-header',
  templateUrl: './ecommerce-header.component.html',
  styleUrls: ['./ecommerce-header.component.scss']
})
export class EcommerceHeaderComponent implements OnInit {
  public shoppingCartItems  :   CartItem[] = [];
  public  showItem: boolean = false;

  constructor(private cartService: CartService, private productService: ProductsService, private router: Router) { 
    this.cartService.getItems().subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);
  }

  ngOnInit() {
  }

  public updateCurrency(curr) {
    this.productService.currency = curr;
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }


}
