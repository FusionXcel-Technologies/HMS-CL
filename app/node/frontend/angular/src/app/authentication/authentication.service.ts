import { Injectable } from '@angular/core';
import { ModulesService } from '../modules.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userInfo: any | undefined;
  constructor(private modulesService: ModulesService) {
  }
  sideBar: any;
  cou: number = 0;
  /**
   * signUp - This method is used for user sign-up.
   * It sends a request to the server to create a new user account.
   * @param formData - The data containing user sign-up information.
   * @returns A Promise that resolves to a boolean indicating the success of the sign-up operation.
   */
  public signUp(formData: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.modulesService.sendRequestToServer<Response>('/auth/signup', 'post', formData)
        .subscribe(
          (response: any) => {
            const auth_token = this.saveAuthToken(response.auth_token);
            resolve(true); // Resolve the Promise with true to indicate successful sign-up
          },
          (error: any) => {
            console.error(error);
            reject(error); // Reject the Promise with the error for error handling
          }
        );
    });
  };


  /**
   * signIn - This method is used for user sign-in.
   * It sends a request to the server to authenticate the user.
   * @param formData - The data containing user sign-in information.
   * @returns A Promise that resolves to a boolean indicating the success of the sign-in operation.
   */
  public signIn(formData: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.modulesService.sendRequestToServer<Response>('/auth/signin', 'post', formData)
        .subscribe(
          (response: any) => {
            const auth_token = this.saveAuthToken(response.auth_token);
            resolve(true); // Resolve the Promise with true to indicate successful sign-in
          },
          (error: any) => {
            console.error(error);
            reject(error); // Reject the Promise with the error for error handling
          }
        );
    });
  };

  /**
  * signOut - This method is used for user sign-out.
  * It clears the authentication token from the local storage.
  */
  public signOut(): void {
    localStorage.removeItem('auth_token');
  }



  /**
  * isAuthenticated - This method checks if the user is authenticated.
  * @returns A Promise that resolves to a boolean indicating if the user is authenticated.
  */
  public isAuthenticated(): Promise<boolean> {

    this.cou += this.cou + 1;

    return new Promise<boolean>((resolve, reject) => {
      this.getUserInfoByAuthToken()
        .then((userInfo) => {
          if (userInfo) {
            // if (((Math.floor(Math.random() * 999) % 33) == 0) || (this.cou < 2) || ((this.cou % 20) == 0)) {
            this.modulesService.sendRequestToServer<Response>('/auth/authenticated', 'get')
              .subscribe(
                (response: any) => {

                  let auth_t = response != false ? true : false;
                  this.sideBar = auth_t ? this.sideBar : undefined;

                  if (!auth_t) {
                    localStorage.removeItem('auth_token');
                  }

                  resolve(auth_t); // Resolve the Promise with true to indicate successful sign-in
                },
                (error: any) => {
                  this.sideBar = undefined;
                  resolve(false)
                }
              );
            // } else {
            //   resolve(true)
            // }

          } else {
            this.sideBar = undefined;
            resolve(false)
          }

        })

        .catch(error => { this.sideBar = undefined; resolve(false); });
    });
  }


  /**
   * getUserInfoByAuthToken - This method retrieves user information based on the authentication token.
   * @returns A Promise that resolves to the user information.
   */
  public getUserInfoByAuthToken(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        const tokenParts = authToken.split('.');
        if (tokenParts.length === 3) {
          const tokenPayload = this.base64Decode(tokenParts[1]);
          const decodedToken = JSON.parse(tokenPayload);
          this.userInfo = decodedToken;
          this.userInfo.name = !this.userInfo.name ? 'no name' : this.userInfo.name;
          resolve(decodedToken); // Resolve the Promise with the decoded token payload
        } else {
          reject('Invalid authentication token'); // Reject the Promise if the token is invalid
        }
      } else {
        reject('Authentication token not found'); // Reject the Promise if authentication token is not found
      }
    });
  }


  /**
   * base64Decode - This method decodes a base64-encoded string.
   * @param str - The base64-encoded string to decode.
   * @returns The decoded string.
   */
  private base64Decode(str: string): string {
    try {
      const decodedString = atob(str);
      return decodedString;
    } catch (error) {
      console.error('Error decoding base64 string:', error);
      throw new Error('Failed to decode base64 string');
    }
  }

  /**
   * saveAuthToken - This method is used to save the authentication token in the local storage.
   * @param authToken - The authentication token to be saved.
   * @returns The saved authentication token.
   */
  private saveAuthToken(authToken: any): any {
    localStorage.setItem('auth_token', authToken);
    this.getUserInfoByAuthToken()
    return authToken;
  }


  public getSidebar(): any {
    return new Promise((resolve, reject) => {
      if (!this.sideBar) {
        this.modulesService.sendRequestToServer<any>('/auth/getSidebar', 'get').subscribe(
          (response: any) => {
            this.sideBar = response;
            resolve(this.sideBar);
            //  localStorage.setItem('menu', JSON.stringify(response))
          },
          (error: any) => {
            this.sideBar = [{ name: 'Homes', link: '/home' }]
            console.error(error);

            resolve(this.sideBar);
          }
        );
      } else {

        resolve(this.sideBar);
      }
    });
  }
}
