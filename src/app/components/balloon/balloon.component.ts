import { Component, ElementRef, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import { animate, AnimationBuilder, keyframes, style } from '@angular/animations';

@Component({
  selector: 'app-balloon',
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss'
})
export class BalloonComponent implements OnInit{

  balloon = input.required<IBalloon>();   //input signal 
  animBuilder = inject(AnimationBuilder);
  elRef = inject(ElementRef);
  @Output() balloonPopped = new EventEmitter<string>();          // output event emitter that notifies the parent component when the balloon is popped.
  @Output() balloonMissed = new EventEmitter();

  ngOnInit(): void {
      this.animateBalloon();
  }

  animateBalloon() {
    const buffer = 20;          //to ensure the balloon doesn't touch the edges of the screen.
    const maxWidth = window.innerWidth - this.elRef.nativeElement.firstChild.clientWidth - buffer;
    const minSpeed = 3;
    const speedVariation = 5;       //variability to the speed, ensuring each balloon moves differently
    const speed = minSpeed + Math.random() * speedVariation;          //will be between 5s - 10s
    const leftPosition = Math.floor(Math.random() * maxWidth);  

    const flyAnimations = this.animBuilder.build([
      style({
        translate: `${leftPosition}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${speed}s ease-in-out`,
        style({
          translate: `${leftPosition}px -100vh`,
        })
      ),
    ]);
     const player = flyAnimations.create(this.elRef.nativeElement.firstChild);
     player.play();
     player.onDone(() => {
      console.log('animations finished');
      this.balloonMissed.emit(this.balloon().id);
     })
  }
  
  pop(){                                            
    const popAnimation = this.animBuilder.build([
      animate(
        '0.1s ease-out',
        keyframes([
          style({                                   //The balloon scales up then shrinks slightly and finally disappears .
            transform: 'scale(1.2)',
            offset: 0.5
        }), 
        style({
          transform: 'scale(0.8)',
          offset: 0.75
        }),
        style({
          transform: 'scale(0)',
          offset: 1
        }),
      ])
      )
    ]);
    const player = popAnimation.create(
      this.elRef.nativeElement.firstChild
    );
    player.play();
    player.onDone(() => {
      this.balloonPopped.emit(this.balloon().id);
    });
  }
}
