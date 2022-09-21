import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EndpointsService } from 'src/app/services/endpoints/endpoints.service';
import { LoginService } from 'src/app/services/login/login.service';
import { ControlSesion } from 'src/app/utils/controlSesion';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formUserLogin!: FormGroup;
  disableLoginWithEmail = true;
  controlSesion: ControlSesion = new ControlSesion();
  showModalNoUser = false;

  constructor(
    private router: Router,
    private login$: LoginService,
    private endpoint$: EndpointsService
  ) {

    this.formUserLogin = new FormGroup({
      email: new FormControl(["", Validators.email])
    });
  }

  ngOnInit(): void {

  }

  loginWithEmail() {
    return false;
  }

  loginWithGoogle() {

    this.showModalNoUser = true;

    //  this.login$.login().then((data) => {

    // this.endpoint$.verifyUser({ email: data.user.email })
    //   .subscribe(data => {

    //     if (data.response === 'ok') {
    //       this.controlSesion.writeSesionUser(data);
    //       this.router.navigate(['/menu-admin']);

    //     } else this.showModalNoUser = true;

    //   });
    //   this.router.navigate(['/menu-admin']);

    //   });
    return false;
  }

  noUserGenerate() {

  }

  hiddenModarNoUser() {
    this.showModalNoUser = false;
  }

}
