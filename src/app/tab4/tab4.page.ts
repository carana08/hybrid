//implementación funcional
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonDatetime, IonButton, IonList, IonInput, IonFabButton, IonIcon, IonFab, AlertController } from '@ionic/angular/standalone';
import { v4 as uuidv4 } from 'uuid';
import { ProviderService } from '../services/provider.service';
import { Activity } from '../interfaces/activity';
import { AddActivityModalComponent } from '../add-activity-modal/add-activity-modal.component';
import * as moment from 'moment-timezone';

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
  selectedDate: string = new Date().toISOString(); // Variable para almacenar la fecha seleccionada
  maxDate: string = '2060-12-31';
  newActivityTitle: string = '';

  constructor(public providerService: ProviderService, private modalController: ModalController,private alertController: AlertController ) {
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

  get filteredActivities() {
    const selectedDateOnly = this.selectedDate.split('T')[0]; // Obtiene solo la parte de la fecha
    return this.providerService.activities.filter(activity => {
      const activityDateOnly = activity.date.split('T')[0]; // Obtiene solo la parte de la fecha
      return activityDateOnly === selectedDateOnly;
    });
  }



  async openAddActivityModal() {
    const modal = await this.modalController.create({
      component: AddActivityModalComponent,
      componentProps: { selectedDate: this.selectedDate }, // Pasar la fecha seleccionada si es necesario
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      const newActivity: Activity = {
        id: uuidv4(),
        title: data.title,
        date: data.date,
        completed: false,
      };
      this.providerService.addActivity(newActivity);
    }
  }

  adjustToLocalTime(dateString: string): string {
    const localDate = moment.tz(dateString, moment.tz.guess()); // Ajusta la fecha a la zona horaria local
    return localDate.toISOString();
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
            this.providerService.removeActivity(activityId);
          },
        },
      ],
    });

    await alert.present();
  }
}
