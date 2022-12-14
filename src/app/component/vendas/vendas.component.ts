import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { IPedido } from 'src/app/models/pedido.models';
import { IProdutos } from 'src/app/models/produtos.models';
import { environment } from 'src/environments/environment';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  public selectProdutos: Array<IProdutos> = [];
  public items: Array<IPedido> = [];
  public formGroup: FormGroup;
  public totalNota: number = 0.0;
  public totalImposto: number = 0.0;
  public qtdNota: number = 0;

  private endPoint: string;
  private endPointProduct: string;

  constructor(
    private http : HttpClient,
    private formBuilder: FormBuilder,
    private config: NgSelectConfig,
    private toast: NgToastService
  ){
    this.config.notFoundText = 'Não encontrado';
    this.endPointProduct = environment.url_api+'/produto/';
    this.endPoint        = environment.url_api+'/venda/';

    this.formGroup = this.formBuilder.group({
      produto_id: ['', Validators.compose([Validators.required])],
      quantidade: ['', Validators.compose([Validators.required,  Validators.min(1)])],
    });
  }

  ngOnInit(): void {
    this.http.get(this.endPointProduct).subscribe((data) => {
      this.selectProdutos = data as Array<IProdutos>;
    });
  }

  create(){
    const item = this.formGroup.value;
    this.http.get(this.endPointProduct+'?id='+item.produto_id).subscribe((data) => {
       const produto     = data as IProdutos;
       const total       = parseFloat(produto.valor) * parseInt(item.quantidade);
       const impostos    = (total / 100) * parseFloat(produto.imposto);
       this.totalNota    += total;
       this.totalImposto += impostos;
       this.qtdNota      +=  item.quantidade;

       this.items.push({
          id: produto.id,
          descricao: produto.nome,
          quantidade: item.quantidade,
          preco_unitario: produto.valor,
          impostos: impostos,
          valor_total: total
       });

    });

  }

  finishSale(){
    this.http.post(this.endPoint,
      {
        imposto: this.totalImposto,
        valor: this.totalNota,
        quantidade: this.qtdNota,
        itens: this.items
      }
    ).subscribe((result) => {
      this.toast.success({detail: 'Operação realizada com sucesso!', summary:'A compra foi cadastrada', position:'tr', duration: 3000});
      this.clear();
      this.items = [];
     });
  }

  remove(id: any){
    if (window.confirm("Deseja remover?")) {
        this.items.splice(id,1);
    }
  }

  clear(){
    this.formGroup.reset();
  }

}
