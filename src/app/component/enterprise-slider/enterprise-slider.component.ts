import { Component, Input, OnInit } from '@angular/core';
import { Enterprise } from 'src/app/models/enterprise.model';

@Component({
  selector: 'app-enterprise-slider',
  templateUrl: './enterprise-slider.component.html',
  styleUrls: ['./enterprise-slider.component.css']
})
export class EnterpriseSliderComponent implements OnInit {

  @Input() enterprises: Array<any>;
  sliderCompany = {
    slidesToShow: 5,
    infinite: true,
    autoplay: true,
    arrows: true,
    slidesToScroll: 1,
    fadeSpeed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 749,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  constructor() { }

  ngOnInit(): void {
  }

}
