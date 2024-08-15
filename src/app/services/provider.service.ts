// import { Injectable } from '@angular/core';

//  /* 1. Importe el módulo del HttpClient */
//  import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProviderService {
//      /* 2.Atributo URL */
//      private URL: string = 'https://<NOMBRE_DEL_PROYECTO>.firebaseio.com/collection.json';

//      /* 3. Inyección de dependencia del HttpClient */
//      constructor(private http:HttpClient) { }

//      /* 4. Método con la petición HTTP */
//      getResponse() {
//          return this.http.get(this.URL);
//      }

//      /* 5. Método con la petición HTTP */ 
//      postResponse(data: any) {
//          return this.http.post(this.URL, data);
//      }
// }
// src/app/services/provider.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Activity } from '../interfaces/activity';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private ACTIVITY_STORAGE: string = 'activities';
  public activities: Activity[] = [];
  public pendingActivities: Activity[] = [];


  constructor() {
    this.loadActivities();
  }

  public async loadActivities() {
    const { value } = await Preferences.get({ key: this.ACTIVITY_STORAGE });
    this.activities = value ? JSON.parse(value) : [];
    this.sortActivities();
    this.updatePendingActivities();
  }

  public async addActivity(activity: Activity) {
    this.activities.push(activity);
    this.sortActivities();
    await Preferences.set({
      key: this.ACTIVITY_STORAGE,
      value: JSON.stringify(this.activities),
    });
    this.updatePendingActivities();
  }

  public async removeActivity(activityId: string) {
    this.activities = this.activities.filter(activity => activity.id !== activityId);
    await Preferences.set({
      key: this.ACTIVITY_STORAGE,
      value: JSON.stringify(this.activities),
    });
    this.updatePendingActivities();
  }

  public async completeActivity(activityId: string) {
    const activity = this.activities.find(activity => activity.id === activityId);
    if (activity) {
      activity.completed = true;
      await Preferences.set({
        key: this.ACTIVITY_STORAGE,
        value: JSON.stringify(this.activities),
      });
      
    }
    this.updatePendingActivities();
  }

  private updatePendingActivities() {
    this.pendingActivities = this.activities.filter(activity => !activity.completed);
  }
  private sortActivities() {
    this.activities.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }
}