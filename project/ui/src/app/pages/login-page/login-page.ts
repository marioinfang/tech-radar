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
      grid-template-columns: 25% 50% 25%;
    }
    @media only screen and (max-width: 600px) {
      :host {
        grid-template-columns: 10% 80% 10%;
      }
    }

    div {
      grid-column: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class LoginPage {

}
