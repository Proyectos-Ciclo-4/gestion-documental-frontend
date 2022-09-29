import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControlSesion } from 'src/app/utils/controlSesion';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  menuVisible = false;
  controlSesion: ControlSesion = new ControlSesion();
  showBtnMenu = true;

  constructor(private router: Router, private login$: LoginService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((r) => {
      location.pathname == "/" ? this.showBtnMenu = false : this.showBtnMenu = true;
    })
  }

  controlMenu() {
    this.menuVisible = !this.menuVisible;
    setTimeout(() => {
      this.menuVisible = false;
    }, 5000);
  }

  goToHome() {
    this.router.navigate(['menu-admin'])
  }

  closeSesionGG() {
    this.showBtnMenu = false
    this.controlSesion.cleanSesionStorage();
    this.login$.loggout();
    this.router.navigate(['']);
  }

}
