import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { Activity } from '../interfaces/activity';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonList,
  IonItem,
  IonLabel,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonIcon,
  IonButton,
  AlertController,
  IonListHeader,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonListHeader,
    CommonModule,
    IonButton,
    IonIcon,
    IonInput,
    IonCardContent,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonList,
    IonCardHeader,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab1Page implements OnInit {
  pendingActivities: Activity[] = [];
  completedActivities: Activity[] = [];

  constructor(
    private providerService: ProviderService,
    private alertController: AlertController
  ) {}

  get sortedActivities() {
    console.log('Original activities:', this.providerService.activities);
    const sorted = this.providerService.activities.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateA - dateB;
    });
    console.log('Sorted activities:', sorted);
    return sorted;
  }

  async ngOnInit() {
    await this.providerService.loadActivities(); // Cargar las actividades al iniciar
    this.updateActivityLists();
  }

  async ionViewWillEnter() {
    await this.providerService.loadActivities();
    this.updateActivityLists();
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
            this.updateActivityLists();
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmComplete(activityId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Completar',
      message:
        '¿Estás seguro de que deseas marcar esta actividad como completada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Completar',
          handler: () => {
            this.providerService.completeActivity(activityId);
            this.updateActivityLists();
          },
        },
      ],
    });

    await alert.present();
  }

  private updateActivityLists() {
    this.pendingActivities = this.providerService.activities.filter(
      (activity) => !activity.completed
    );
    this.completedActivities = this.providerService.activities.filter(
      (activity) => activity.completed
    );
  }
}
