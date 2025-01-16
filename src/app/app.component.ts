import { Component, computed, effect, OnInit, signal, viewChild, viewChildren, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private cdRef: ChangeDetectorRef) {}
  
  balloonOnScreen = 5;
  balloons: IBalloon[] = [];          //creates an array named balloons that will hold 5 instances of balloon class. starts by creating an array with length of 5 and then use map() to replace each of 0 initial values with a new balloon object.
  score = 0;
  missed = signal(0);               //signal(0) is used to make it reactive (updates other parts of the application when its value changes).
  maxMisses = 10;
  gameOver = computed(() => {         //computed signal that takes a reactive value
    return this.missed() == this.maxMisses;     
  });

  balloonElements = viewChildren(BalloonComponent);   //Collects references to all child components of type BalloonComponent.This allows the parent component to interact with and manage individual balloon components dynamically.

  createBalloonElements = effect(() => {
    if(!this.gameOver() && this.balloonElements().length < this.balloonOnScreen) {
      this.balloons = [...this.balloons, new balloon()];      //new balloon is added to the balloons array
    }
  })

  ngOnInit(): void {
      this.startGame();
  }

  startGame(){
    this.missed.set(0);
    this.score = 0;
    this.balloons = new Array(this.balloonOnScreen)
    .fill(0)
    .map(() => new balloon());
  }

  balloonPopHandler(balloonId: string) {
    this.score++;
    this.balloons = this.balloons.filter((balloon) => balloon.id != balloonId);         //removes the popped balloon from the balloons array.
    this.balloons = [...this.balloons, new balloon()];    
  }

  balloonMissedHandler(balloonId: string) {
    this.missed.update(val => val +1);
    this.balloons = this.balloons.filter((balloon) => balloon.id != balloonId);
    this.cdRef.detectChanges();
    }
}
 