import { AccountService } from './../../shared/services/account.service';
import { Component, trigger, transition, style, animate, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate("1s ease-in-out", style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate("1s ease-in-out", style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class LoginComponent {
  keystore: any;
  message: string;
  password: string;

  constructor(public acctService: AccountService,
    private renderer: Renderer2) { }

  handleImport(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var fileReader = new FileReader();
      fileReader.readAsText(fileInput.target.files[0]);

      fileReader.onload = (event) => {
        try {
          if (!this.acctService.checkValidKeystore(event.target["result"])) {
            this.message = 'Not a valid keystore file.';
            return;
          }
          this.acctService.setAuthKeystore(event.target["result"]);
          this.message = 'Valid keystore. Please enter the password.';
          this.renderer.selectRootElement('#password').focus()
        } catch (event) {
          this.message = 'Not a valid keystore file.';
          return;
        }
      }
    }
    return;
  }

  handleLogin() {
    if (this.password == null || this.password == '') {
      return;
    }
    this.acctService.setAuthPassword(this.password);

    var flag = this.acctService.handleLogin();
    if (!flag) {
      this.message = 'Account authentication failed!';
    }
  }
}