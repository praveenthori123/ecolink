import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CardSliderComponent } from './card-slider/card-slider.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { MediaBannerComponent } from './media-banner/media-banner.component';
import { TrendingPostComponent } from './trending-post/trending-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsRequestComponent } from './Forms/products-request/products-request.component';
import { ReturnProductListingComponent } from './return-product-listing/return-product-listing.component';
import { GoogleMapComponent } from './Forms/google-map/google-map.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AskChemistComponent } from './Forms/ask-chemist/ask-chemist.component';
import { SupportFormComponent } from './Forms/support-form/support-form.component';
import { BulkPricingComponent } from './Forms/bulk-pricing/bulk-pricing.component';
import { GSAProductComponent } from './gsa-product/gsa-product.component';
import { PipemoduleModule } from '../pipemodule/pipemodule.module';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { NgSelectModule } from '@ng-select/ng-select';

const exportdata: any = [
  HeaderComponent,
  FooterComponent,
  CardSliderComponent,
  CallToActionComponent,
  ProductsRequestComponent,
  MediaBannerComponent,
  AskChemistComponent,
  GoogleMapComponent,
  SupportFormComponent,
  TrendingPostComponent,
  BulkPricingComponent, 
  GSAProductComponent,
  PageNotFoundComponent
]

@NgModule({
  declarations: [
    SharedComponent,
    HeaderComponent,
    FooterComponent,
    CardSliderComponent,
    ...exportdata,
    CallToActionComponent,
    MediaBannerComponent,
    TrendingPostComponent,
    ReturnProductListingComponent,
    ThankYouComponent,
    OrderFailComponent,
    PageNotFoundComponent,
    AskChemistComponent,
    SupportFormComponent,
  ],
  imports: [
    CommonModule,
    PipemoduleModule,
    SharedRoutingModule,
    SharelibraryModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [
    ...exportdata,
    PageNotFoundComponent,
  ],
  providers:[
    GeolocationService
  ]
})
export class SharedModule { }
