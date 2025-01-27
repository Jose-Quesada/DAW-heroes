import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/enviroments';
import { User } from '../interfaces/user.inteface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  private baseURL = environments.baseURL;
  private user?: User;

  constructor(private httpClient: HttpClient) { }


  get currentUser():User|undefined {
    if ( !this.user ) return undefined;
    return structuredClone( this.user );
  }

  login ( email: string, password: string): Observable<User> {
    // http.post ('login', {email,password});
    return this.httpClient.get<User>(`${ this.baseURL }/users/1`)
      .pipe(
        tap( user => this.user = user),
        tap(user => localStorage.setItem('token', user.id.toString()))
      )
  }


  logout () {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthenticacion(): Observable<boolean>{

    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.httpClient.get<User>(`${ this.baseURL }/users/${token}`)
            .pipe (
              tap ( user => this.user=user),
              map ( user => !!user),
              catchError ( err => of(false))
            )
  }


}
