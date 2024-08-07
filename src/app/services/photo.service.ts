import { Injectable } from '@angular/core';
/* 1. Importe los módulos con la funcionalidad nativa */
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

/* 2. Importe la interfaz */
import { UserPhoto } from '../interfaces/user-photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  /* 2. Referencia local a la plataforma utilizada 'hybrid' o 'web' */
  private platform: Platform;
  private PHOTO_STORAGE: string = 'photos';

  /* 3. Atributo para almacenar las fotos */
  public photos: UserPhoto[] = [];

  /* 3. Referencia en la inyección de dependencias */
  constructor(platform: Platform) {
    this.platform = platform;
  }
  public async addNewToGallery() {
    /* 4. Tome una foto */
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto, 'Actividad realizada el ');
    this.photos.unshift(savedImageFile);

    /* 3. Ruta de almacenamiento */
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // /* 5. Agregue el archivo al inicio del arreglo */
    // this.photos.unshift({
    //   filepath: 'soon...',
    //   webviewPath: capturedPhoto.webPath!,
    // });
  }


  private async savePicture(photo: Photo, photoName: string): Promise<UserPhoto> {

    const base64Data = await this.readAsBase64(photo);

    const formattedDate = this.formatDate(new Date());
    const fileName = `${photoName}_${formattedDate}.jpeg`;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {

      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {

      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };

    }
  }

  /* 2. La función readAsBase64 convierte una foto a formato base64, ajustando el proceso según la plataforma. */

  private async readAsBase64(photo: Photo) {

    if (this.platform.is('hybrid')) {

      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;

    } else {

      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }

  }
  /* 3. La función convertBlobToBase64 convierte un blob a formato base64. */

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


     /* 1. La función loadSaved recupera y carga fotos guardadas previamente, 
   adaptando el proceso según la plataforma en la que se ejecuta la aplicación (híbrida o web). */

   public async loadSaved() {

    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];


    if (!this.platform.is('hybrid')) {

      for (let photo of this.photos) {

        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} a las ${hours}:${minutes}`;
  }
}
