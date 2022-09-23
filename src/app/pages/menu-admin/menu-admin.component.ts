import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControlSesion } from 'src/app/utils/controlSesion';
@Component({
  selector: 'inicio',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  controlSesion = new ControlSesion();

  constructor(private router: Router) { }

  ngOnInit(): void {
    switch (this.controlSesion.getTypeUser()) {
      case null:
        this.router.navigate(['']);
        break;
      case 555:
        this.router.navigate(['document']);
        break;
    };
  }

  categorias() {
    this.router.navigate(['category'])
  }

  subcategorias() {
    this.router.navigate(['sub-category'])
  }

  documentos() {
    this.router.navigate(['document'])
  }

  reportes() {
    this.router.navigate(['reports'])
  }

}
