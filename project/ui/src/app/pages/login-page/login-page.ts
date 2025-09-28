import { Component } from '@angular/core';
import {LoginForm} from '../../features/login/smart_container/login-form/login-form';

@Component({
  selector: 'app-login-page',
  imports: [
    LoginForm
  ],
  template: `
    <div>
      <app-login-form />
    </div>
  `,
  styles: `
    :host {
        display: grid;
        grid-template-rows: 25% 50% 25%;
        grid-template-columns: 25% 50% 25%;
        height: 100vh;
    }
    div {
      grid-row: 2;
      grid-column: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class LoginPage {

}
