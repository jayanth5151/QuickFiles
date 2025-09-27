import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient , HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule, // basic directives like *ngIf, *ngFor
    FormsModule, // for ngModel binding
    HttpClientModule // <-- required for HttpClient

  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  dragOver = false;
  selectedFile?: File;

    constructor(private http: HttpClient, private auth: AuthService) {}


  // Triggered when user selects file via input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }

  // Drag-and-drop events
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }


  uploadFile() {
  if (!this.selectedFile) return alert("Select a file first");

  const formData = new FormData();
  formData.append("file", this.selectedFile);

  this.http.post("https://quickfiles.onrender.com/upload", formData, {
    headers: { Authorization: `Bearer ${this.auth.getToken()}` },
  }).subscribe({
    next: (res: any) => alert(res.message),
    error: (err) => alert(err.error?.error || 'Upload failed'),
  });
}
}
