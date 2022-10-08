import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { IPedido } from 'src/app/models/pedido.models';
import { IProdutos } from 'src/app/models/produtos.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  public selectProdutos: Array<IProdutos> = [];
  public items: Array<IPedido> = [];
  public formGroup: FormGroup;
  public totalNota = '0';
  public totalImposto = '0';
  public qtdNota = 0;

  private endPoint: string;
  private endPointProduct: string;

  constructor(
    private http : HttpClient,
    private formBuilder: FormBuilder,
    private config: NgSelectConfig
  ){
    this.config.notFoundText = 'Não encontrado';
    this.endPointProduct = environment.url_api+'/produto/';
    this.endPoint        = environment.url_api+'/venda/';

    this.formGroup = this.formBuilder.group({
      produto_id: ['', Validators.compose([Validators.required])],
      quantidade: ['', Validators.compose([Validators.required])],
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
       const valor       = this.converterMoedaEmFloat(produto.valor);
       const total       = valor * parseInt(item.quantidade);
       const impostos    = (total / 100) * parseFloat(produto.imposto);
       this.totalNota    = this.parseMoney(this.converterMoedaEmFloat(this.totalNota)+total)
       this.totalImposto = this.parseMoney(this.converterMoedaEmFloat(this.totalImposto)+impostos)
       this.qtdNota +=  item.quantidade;
       this.items.push({
          id: produto.id,
          descricao: produto.nome,
          quantidade: item.quantidade,
          preco_unitario: produto.valor,
          impostos:    this.parseMoney(impostos),
          valor_total: this.parseMoney(total)
       });

    });

  }

  finishSale(){
    this.http.post(this.endPoint,
      {
        imposto:    this.totalImposto,
        valor:      this.totalNota,
        quantidade: this.qtdNota,
        itens:      this.items
      }
    ).subscribe((result) => {
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


  private parseMoney(valor: number): string{
      let money = valor.toFixed(2);
      money = money.replace('.', ',');

      return 'R$ '+money;
  }

  private converterMoedaEmFloat(moeda: string): number{
      moeda = moeda.replace('R$', '');
      moeda = moeda.replace('.', '');
      moeda = moeda.replace(',', '.');

      return parseFloat(moeda);
  }
}
