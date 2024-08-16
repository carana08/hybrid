import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent , IonFab, IonFabButton, IonIcon, IonImg, IonCol, IonRow, IonGrid, IonButton, AlertController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
/* 1. Importe el módulo con la directiva @ngFor */
import { CommonModule } from '@angular/common';
 /* 3. Importe el servicio */
 import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule, IonFab, IonFabButton, IonIcon, IonImg, IonCol, IonRow, IonGrid]
})
export class Tab2Page {

  /* 5. Inyecte la dependencia del servicio */
  constructor(public photoService: PhotoService, private alertController: AlertController) {}

  // /* 6. Método a invocar */
  // addPhotoToGallery() {
  //   this.photoService.addNewToGallery();
  // }
  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  //  // Método para eliminar una foto
  async deletePhoto(position: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar la imagen de esta actividad?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.photoService.photos.splice(position, 1);
            this.photoService.savePhotos();
          },
        },
      ],
    });
  
    await alert.present();
  }

}
