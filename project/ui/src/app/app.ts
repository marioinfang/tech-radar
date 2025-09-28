import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navigation} from './components/navigation/navigation';
import {AuthService} from './features/login/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
