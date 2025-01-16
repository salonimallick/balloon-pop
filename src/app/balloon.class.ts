import { IBalloon } from "./balloon.interface";

const colors = ['red', 'pink', 'blue', 'orange', 'green', 'black'];

export class balloon implements IBalloon{
    id: string;
    color: string;

    constructor(){
        this.id = window.crypto.randomUUID();
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
}