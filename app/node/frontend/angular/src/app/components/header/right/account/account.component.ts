import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'component-header-right-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  shortName: string = '';
  colorCode: string = '';

  constructor(private authservice: AuthenticationService) {
    let letters = authservice.userInfo.name;
    letters = letters.split(' ');
    //console.log(letters, letters[0][0]);
    letters = letters[0][0] + (letters[1] ? letters[1][0] : '');
    this.shortName = letters.toLocaleUpperCase();
    this.colorCode = this.convertLettersToHexColor(authservice.userInfo.name, authservice.userInfo.id);
  }

  convertLettersToHexColor(letters: string, id: any) {

    let codeNum = Date.now() + parseInt(id) * 21;
    for (let index = 0; index < letters.length; index++) {
      const letter = letters[index];
      codeNum += letter.charCodeAt(0);
    }

    let colorCode = `rgb(${(codeNum * 7) % 254}, ${(codeNum * 42) % 254}, ${(codeNum * 14) % 254})`;

    return colorCode;
  }
}
