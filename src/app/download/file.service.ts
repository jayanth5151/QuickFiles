import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service'; // import your AuthService

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'https://quickfiles.onrender.com';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`, { headers: this.getHeaders() });
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }
}
