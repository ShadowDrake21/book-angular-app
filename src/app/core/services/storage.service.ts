import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
export interface FilesUploadMetadata {
  uploadProgress$: Observable<number | undefined>;
  downloadUrl$: Observable<string>;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = inject(AngularFireStorage);

  uploadFileAndGetMetadata(
    mediaFolderPath: string,
    fileToUpload: File
  ): FilesUploadMetadata {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(
      filePath,
      fileToUpload
    );
    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }

  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL())
    );
  }
}
