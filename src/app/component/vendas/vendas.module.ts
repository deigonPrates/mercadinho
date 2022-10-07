import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendasRoutingModule } from './vendas-routing.module';
import { VendasComponent } from './vendas.component';


@NgModule({
  declarations: [
    VendasComponent
  ],
  imports: [
    CommonModule,
    VendasRoutingModule
  ],
  exports: [VendasComponent]
})
export class VendasModule { }
