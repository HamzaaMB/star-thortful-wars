import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/?page=${page}`);
  }

  getCharacterDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/${id}`);
  }

  getFilmDetail(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
