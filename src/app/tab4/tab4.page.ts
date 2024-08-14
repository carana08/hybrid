import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonDatetime, IonButton, IonList, IonInput, IonFabButton, IonIcon, IonFab, AlertController } from '@ionic/angular/standalone';
import { v4 as uuidv4 } from 'uuid';
import { ProviderService } from '../services/provider.service';
import { Activity } from '../interfaces/activity';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonFab, IonIcon, IonFabButton, 
    IonInput, IonList, IonButton, IonDatetime, IonLabel, IonItem,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class Tab4Page implements OnInit {
  selectedDate: string =''; // Solo la fecha y hora sin la parte GMT
  maxDate: string = '2060-12-31';
  newActivityTitle: string = '';

  constructor(
    public providerService: ProviderService, 
    private modalController: ModalController,
    private alertController: AlertController // Importar AlertController
  ) {
    this.initializeDateTime();
  }

  ngOnInit() {
    this.providerService.loadActivities(); // Cargar actividades al iniciar
  }

  initializeDateTime() {
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset(); // Obtiene la diferencia en minutos entre UTC y la hora local
    const localDateTime = new Date(localDate.getTime() - offset * 60000); // Ajusta la hora a la hora local
    this.selectedDate = localDateTime.toISOString().slice(0, 16); // Convierte a formato ISO y recorta a "YYYY-MM-DDTHH:mm"
  }

  async confirmDelete(activityId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta actividad?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.removeActivity(activityId);
          },
        },
      ],
    });

    await alert.present();
  }

  addActivity() {
    const newActivity: Activity = {
      id: uuidv4(),
      title: this.newActivityTitle,
      date: this.selectedDate, // Utiliza la fecha y hora seleccionadas
    };
    this.providerService.addActivity(newActivity);
    this.newActivityTitle = '';
  }

  removeActivity(activityId: string) {
    this.providerService.removeActivity(activityId);
  }
}
