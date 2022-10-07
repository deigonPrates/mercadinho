import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposRoutingModule } from './tipos-routing.module';
import { TiposComponent } from './tipos.component';


@NgModule({
  declarations: [TiposComponent],
  imports: [
    CommonModule,
    TiposRoutingModule
  ],
  exports:[TiposComponent]
})
export class TiposModule { }
