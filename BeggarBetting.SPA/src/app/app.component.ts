import { Component } from '@angular/core';
import { Meta } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private meta: Meta) {
    meta.addTags([
      { name: 'author', content: 'Beggar Betting' },
      { name: 'keywords', content: 'Klaytn, crypto betting, sports betting, smart contract' },
      { name: 'description', content: 'Beggar Betting is a random sports betting website which runs on a Klaytn network utilizing smart contract.' }
    ]);
  }
}