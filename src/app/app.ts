import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Logo } from './core/logo';

@Component({
  imports: [RouterOutlet, RouterLink, Logo],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
