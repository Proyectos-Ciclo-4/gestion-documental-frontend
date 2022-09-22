import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'inicio',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  categorias(){
      this.router.navigate(['category'])
  }

  subcategorias(){
    this.router.navigate(['sub-category'])
  }

  documentos(){
    this.router.navigate(['document'])
  }

  reportes(){
    this.router.navigate(['reports'])
  }

}
