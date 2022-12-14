import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITipo } from 'src/app/models/tipos.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.css']
})
export class TiposComponent  implements OnInit{

  public items: Array<ITipo> = [];
  public formGroup: FormGroup;
  public modal: boolean = false;
  public action = 'new';

  private endPoint: string;
  private tempID: number = 0;

  constructor(
    private http : HttpClient,
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {
    this.endPoint = environment.url_api+'/tipo/';

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      imposto: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    });
  }

  ngOnInit(): void {
    this.list();
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
      this.items = data as Array<ITipo>;
    });
  }

  create(){
    const {nome, imposto} = this.formGroup.value;
    var formData: any = new FormData();
    formData.append('nome', nome);
    formData.append('imposto', imposto);

    this.http.post(this.endPoint,formData).subscribe(() => {
      this.formGroup.reset();
      this.list();
      this.hideModal();
      this.toast.success({detail: 'Operação realizada com sucesso!', summary:'O item foi cadastrado', position:'tr', duration: 3000});
    });
  }

  edit(id: number){
    this.http.get(this.endPoint+'?id='+id).subscribe((data) => {
      const item = data as ITipo;
      this.showModal();
      this.tempID = id;
      this.action = 'edit';
      this.formGroup.setValue({
        nome: item.nome,
        imposto: item.imposto
      });
    });

  }

  update(){
    if(this.tempID !== 0){
      const {nome, imposto} = this.formGroup.value;
      this.http.put(this.endPoint+`\?id=${this.tempID}&nome=${nome}&imposto=${imposto}`,{}).subscribe(() => {
        this.hideModal();
        this.formGroup.reset();
        this.list();
        this.toast.success({detail: 'Operação realizada com sucesso!', summary:'O item foi atualizado', position:'tr', duration: 3000});
      });
    }
  }

  delete(id: number){
    if (window.confirm("Deseja remover?")) {
      this.http.delete(this.endPoint+'?id='+id).subscribe({
        next: ()=> {
          this.list();
          this.toast.success({detail: 'Operação realizada com sucesso!', summary:'O tipo foi removido', position:'tr', duration: 3000});
        },
        error: () => {
          this.toast.error({detail: 'Falha ao remover!', summary:'O tipo já foi associado', position:'tr', duration: 3000});
        }
      });
    }
  }

}
