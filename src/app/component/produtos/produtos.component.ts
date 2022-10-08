import { ITipo } from './../../models/tipos.models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProdutos } from 'src/app/models/produtos.models';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {

  public selectTipos: Array<ITipo> = [];

  public items: Array<IProdutos> = [];
  public formGroup: FormGroup;
  public modal: boolean = false;
  public action = 'new';

  private endPoint: string;
  private tempID: number = 0;

  constructor(
    private http : HttpClient,
    private formBuilder: FormBuilder,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Não encontrado';
    this.endPoint = environment.url_api+'/produto/';

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      tipo_id: ['', Validators.compose([Validators.required])],
      valor: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.list();
    this.http.get(environment.url_api+'/tipo/').subscribe((data) => {
      this.selectTipos = data as Array<ITipo>;
    });
  }

  showModal(){
    this.modal = true;
  }

  hideModal(){
    this.modal = false;
    this.tempID = 0;
    this.action = 'new';
    this.formGroup.reset();
  }

  list(){
    this.http.get(this.endPoint).subscribe((data) => {
      this.items = data as Array<IProdutos>;
    });
  }

  create(){
    const form = this.formGroup.value;
    let formData = new FormData();
    formData.append('nome', form.nome);
    formData.append('tipo_id', form.tipo_id);
    formData.append('valor', form.valor);

    this.http.post(this.endPoint,formData).subscribe(() => {
      this.formGroup.reset();
      this.list();
      this.hideModal();
    });
  }

  edit(id: number){
    this.http.get(this.endPoint+'?id='+id).subscribe((data) => {
      const item = data as IProdutos;
      this.showModal();
      this.tempID = id;
      this.action = 'edit';

      this.formGroup.setValue({
        nome: item.nome,
        tipo_id: item.tipo_id,
        valor: item.valor
      });
    });

  }

  update(){
    if(this.tempID !== 0){
      const {nome, tipo_id, valor} = this.formGroup.value;
      this.http.put(this.endPoint+`\?id=${this.tempID}&nome=${nome}&tipo_id=${tipo_id}&valor=${valor}`,{})
      .subscribe(() => {
        this.hideModal();
        this.formGroup.reset();
        this.list();
      });
    }
  }

  delete(id: number){
    if (window.confirm("Deseja remover?")) {
      this.http.delete(this.endPoint+'?id='+id).subscribe(() => {
        this.list();
      });
    }
  }


}
