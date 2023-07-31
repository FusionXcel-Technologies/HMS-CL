import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private baseUrl: string = `${window.location.origin}/api`;
  private reqUrls: any; // Add "undefined" type
  private currentReqUrlIndex: number = 0; // Initialize the property
  private ReqStartUrlIndex: number | undefined;

  constructor(private httpClient: HttpClient) { }

  /**
  * Retrieves the request URLs
  */
  private getRequestUrls(): Observable<string> {

    if (!this.reqUrls) {
      return this.sendHttpRequest<{ urls: string[] }>(`${this.baseUrl}/getUrls456`, 'get')
        .pipe(
          map((response: { urls: string[] }) => {
            this.reqUrls = [];
            for (let index = 0; index < response.urls.length; index++) {
              let url = response.urls[index];
              const [protocol, host] = url.split('://');
              const [hostname, port] = host.split(':');


              if (hostname == 'localhost' && !this.baseUrl.includes('localhost')) {
                const newHost = this.baseUrl.split('://')[1].split(':')[0];
                this.reqUrls.push(`${protocol}://${newHost}${port ? ':' + port : ''}`);
              } else {
                this.reqUrls.push(url)
              }
            }
            //  console.log(this.reqUrls);
            let reqUrl = this.reqUrls[this.currentReqUrlIndex];

            this.currentReqUrlIndex = (this.currentReqUrlIndex + 1) % this.reqUrls.length;
            return reqUrl;
          }),
          catchError((error: any) => {
            console.error(error);
            return throwError(error);
          })
        );
    } else {
      //  console.log(this.reqUrls);

      const reqUrl = this.reqUrls[this.currentReqUrlIndex];
      this.currentReqUrlIndex = (this.currentReqUrlIndex + 1) % this.reqUrls.length;
      return of(reqUrl);
    }
  }

  /**
   * Sends an HTTP request
   */
  private sendHttpRequest<T>(url: string, method: string, data?: any, options?: any): Observable<T> {
    // let auth_token = localStorage.getItem('auth_token');
    // if (auth_token) {
    //   options.headers['authorization'] = auth_token;
    // }


    options = { headers: { authorization: localStorage.getItem('auth_token') || "auth" } };
    // console.log('options: ', options);
    switch (method) {
      case 'get':
        return this.httpClient.get<T>(url, options) as Observable<T>; // Cast to the correct type
      case 'post':
        return this.httpClient.post<T>(url, data, options) as Observable<T>; // Cast to the correct type
      case 'put':
        return this.httpClient.put<T>(url, data, options) as Observable<T>; // Cast to the correct type
      case 'delete':
        return this.httpClient.delete<T>(url, options) as Observable<T>; // Cast to the correct type
      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }
  }

  /**
 * Sends a request to the server
 */
  public sendRequestToServer<T>(path: string, method: string, data?: any, options?: any): Observable<T> {
    options = options ? options : {};
    options.headers = options.headers ? options.headers : {};
    options.headers.authorization = options.headers.authorization ? options.headers.authorization : localStorage.getItem('auth_token');

    //   ['authorization'] = localStorage.getItem('auth_token') || 'null';
    // let auth_token = localStorage.getItem('auth_token');
    // if (auth_token) {
    //   options.headers['authorization'] = auth_token;
    // }
    //console.log('options: ', options);

    return this.getRequestUrls().pipe(
      catchError(() => {
        return throwError('Failed to fetch request URLs. Please try again later.');
      }),
      switchMap((url: string) => {
        const reqUrl: string = `${url}${path}`;
        return this.sendHttpRequest<T>(reqUrl, method, data, options).pipe(
          catchError((error) => {
            if ((error.status == 404) || (error.status == 0) || (error.status == 500)) {
              const nextUrl: string | undefined = this.getNextUrl();
              if (nextUrl) {
                console.warn(`Retrying request on next URL: ${nextUrl}`);
                this.baseUrl = nextUrl; // Set baseUrl to the original url that returned a successful response
                return this.sendRequestToServer<T>(path, method, data, options).pipe(
                  map((response: T) => {
                    this.ReqStartUrlIndex = undefined;
                    this.reqUrls = undefined; // Reset reqUrls to undefined after receiving a successful response
                    return response;
                  })
                );
              } else {
                return throwError(error);
              }

            }
            return throwError(error);
          })
        );
      })
    );
  }


  private getNextUrl(): string | undefined {
    let isReqStartUrlIndexRefreshedNow = false;
    if (!this.ReqStartUrlIndex) {
      this.ReqStartUrlIndex = this.currentReqUrlIndex;
      isReqStartUrlIndexRefreshedNow = true;
    }
    if (this.ReqStartUrlIndex != this.currentReqUrlIndex || isReqStartUrlIndexRefreshedNow) {
      return this.reqUrls[this.currentReqUrlIndex];
    } else {
      return undefined;
    }
  }
}
