import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-adress-bar',
  templateUrl: './adress-bar.component.html',
  styleUrls: ['./adress-bar.component.scss']
})
export class AdressBarComponent {
  @Input() adressText: string = '';
}
