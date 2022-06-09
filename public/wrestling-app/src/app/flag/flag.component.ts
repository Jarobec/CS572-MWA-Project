import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.css'],
})
export class FlagComponent implements OnInit {
  flags = [
    { name: 'Mongolia', flag: '🇲🇳' },
    { name: 'United States of America', flag: '🇺🇸' },
    { name: 'Russian Federation', flag: '🇷🇺' },
    { name: 'Japan', flag: '🇯🇵' },
  ];

  selectedFlag!: string;

  constructor() {}

  @Input()
  set country(country: string) {
    this.flags.forEach((val) => {
      if (val.name === country) {
        this.selectedFlag = val.flag;
      }
    });
  }

  ngOnInit(): void {}
}
