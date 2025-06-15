import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit{

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  dadosUsuario: any = {}

  ngOnInit(): void{

  }

  ngAfterViewInit(): void {
      this.dadosUsuario = this.authService.decodificarJwt(localStorage.getItem('jwtToken') || '')
      
      this.cdr.detectChanges()
  }

   
}
