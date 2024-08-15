import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonDatetime, IonButton, IonList, IonInput, IonFabButton, IonIcon, IonFab, IonButtons, IonFooter } from '@ionic/angular/standalone';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-add-activity-modal',
  templateUrl: './add-activity-modal.component.html',
  styleUrls: ['./add-activity-modal.component.scss'],
  standalone: true,
  imports: [IonFooter, IonButtons, IonFab, IonIcon, IonFabButton, 
    IonInput, IonList, IonButton, IonDatetime, IonLabel, IonItem,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
  ]
})
export class AddActivityModalComponent implements OnInit {
  activityTitle: string = '';
  activityDate: string = new Date().toISOString(); // Inicializa con la fecha actual

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Ajusta la fecha y hora al horario local
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Desfase en milisegundos
    this.activityDate = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, -1); // Ajustar a la zona horaria local
  }

  closeModal() {
    this.modalController.dismiss();
  }

  submit() {
    const date = new Date(this.activityDate);
  
    // Ajusta la fecha a la zona horaria local antes de almacenarla
    const localDate = moment.tz(date, moment.tz.guess());
    const formattedActivityDate = localDate.format('YYYY-MM-DDTHH:mm:ss'); 
  
    const activity = {
      title: this.activityTitle,
      date: formattedActivityDate,
    };
  
    // Envía la actividad con la fecha en formato ISO
    this.modalController.dismiss(activity);
  }
  
}
