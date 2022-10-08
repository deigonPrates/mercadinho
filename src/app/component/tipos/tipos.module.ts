import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposRoutingModule } from './tipos-routing.module';
import { TiposComponent } from './tipos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TiposComponent],
  imports: [
    CommonModule,
    TiposRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[TiposComponent]
})
export class TiposModule { }
