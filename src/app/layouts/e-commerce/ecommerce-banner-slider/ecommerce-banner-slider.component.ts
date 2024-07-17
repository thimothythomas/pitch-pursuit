import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ecommerce-banner-slider',
  templateUrl: './ecommerce-banner-slider.component.html',
  styleUrls: ['./ecommerce-banner-slider.component.scss']
})
export class EcommerceBannerSliderComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  banner = [
    {
      img: 'assets/images/football/pitch-4.jpg',
      title: 'Book Your Playtime',
      description: 'Explore our top-notch turfs for football, cricket, and more. Secure your spot and experience the thrill of the game.',
      btn: 'Book Now',
      link: '/book-now'
    },
    {
      img: 'assets/images/football/pitch-2.jpg',
      title: 'Exclusive Turf Offer',
      description: 'Limited-time offer! Book a turf now and enjoy exclusive benefits. Don’t miss out on this opportunity to elevate your sports experience.',
      btn: 'Claim Offer',
      link: '/exclusive-offer'
    }
  ];


  ecombannerOptions = {
    items: 1,
    nav: true,
    navClass: ['owl-prev', 'owl-next'],
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    dots: false,
    autoplay: true,
    slideSpeed: 300,
    loop: true
  }

  offers = [
    {
      img: 'assets/images/turf/turf-1.jpg'
    },
    {
      img: 'assets/images/turf/turf-2.jpg'
    },
    {
      img: 'assets/images/turf/turf-3.jpg'
    }
  ]


}