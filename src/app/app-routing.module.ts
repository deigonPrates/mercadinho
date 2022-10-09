import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () => import('./component/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'vendas',
    loadChildren: () => import('./component/vendas/vendas.module').then((m) => m.VendasModule),
  },
  {
    path: 'produtos',
    loadChildren: () => import('./component/produtos/produtos.module').then((m) => m.ProdutosModule),
  },
  {
    path: 'tipos',
    loadChildren: () => import('./component/tipos/tipos.module').then((m) => m.TiposModule),
  },
  {
    path: 'historico',
    loadChildren: () => import('./component/historico/historico.module').then((m) => m.HistoricoModule),
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
