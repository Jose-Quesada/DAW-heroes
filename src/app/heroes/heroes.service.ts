import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/enviroments';
import { Observable } from 'rxjs';
import { Hero } from './interfaces/hero.inteface';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseURL: string = environments.baseURL

  constructor(private httpClient: HttpClient) { }

  getHeroes():Observable<Hero[]>{
    return this.httpClient.get<Hero[]>(`${ this.baseURL }/heroes`);
  }


}
