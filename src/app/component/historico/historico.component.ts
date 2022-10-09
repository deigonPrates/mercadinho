import { IPedido } from './../../models/pedido.models';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IHistorico } from 'src/app/models/historico.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {

  itens: Array<IHistorico> = [];
  itensPedido: Array<IPedido> = [];

  public modal: boolean = false;

  private endPoint: string;

  constructor(private http: HttpClient) {
    this.endPoint = environment.url_api+'/venda/';
  }

  ngOnInit(): void {
    this.http.get(this.endPoint).subscribe((data) => {
      this.itens = data as Array<IHistorico>;
    });
  }


  showModal($id:number){
    this.modal = true;
    this.itensPedido = [];
    this.http.get(environment.url_api+'/historico/?id='+$id).subscribe((data) => {
        this.itensPedido = data as Array<IPedido>;
        console.log((this.itensPedido));
    });
  }

  hideModal(){
    this.modal = false;
  }


}
