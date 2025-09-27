import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  files: { _id: string; name: string }[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.http
      .get('http://localhost:5000/files', {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: (res: any) => {
          console.log('Files from backend:', res); // <- Check this
          this.files = res;
        },
        error: (err) => console.error(err),
      });
  }

  downloadFile(fileId: string, fileName: string) {
    console.log('Downloading file ID:', fileId);

    this.http
      .get(`http://localhost:5000/download/${fileId}`, {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
        responseType: 'blob',
      })
      .subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (err) => console.error(err)
      );
  }
  deleteFile(fileId: string) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    this.http
      .delete(`http://localhost:5000/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: () => {
          alert('File deleted successfully');
          this.files = this.files.filter((f) => f._id !== fileId); // update list
          this.loadFiles(); // <-- re-fetch all files after delete
        },
        error: (err) => console.error(err),
      });
  }
}
