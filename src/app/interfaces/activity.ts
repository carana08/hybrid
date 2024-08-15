export interface Activity {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  type: 'estudio' | 'trabajo' | 'hogar' | 'ocio';
}