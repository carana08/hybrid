import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController,IonSelect, IonSelectOption , IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonDatetime, IonButton, IonList, IonInput, IonFabButton, IonIcon, IonFab, IonButtons, IonFooter } from '@ionic/angular/standalone';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-legend-modal',
  templateUrl: './legend-modal.component.html',
  styleUrls: ['./legend-modal.component.scss'],
  standalone: true,
  imports: [IonFooter, IonButtons, IonFab, IonIcon, IonFabButton, 
    IonInput, IonList, IonButton, IonDatetime, IonLabel, IonItem,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelectOption, IonSelect,
  ]
})
export class LegendModalComponent {
  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}