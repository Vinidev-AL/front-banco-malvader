import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertaPopUpComponent } from "./components/alerta-pop-up/alerta-pop-up.component";
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Component({
    providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  selector: 'app-root',
  imports: [RouterOutlet, AlertaPopUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-banco-malvader';

  
}
