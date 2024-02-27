import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IAboutDeveloperItem } from '../../shared/models/about-developer.model';

@Component({
  selector: 'app-about-developer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-developer.component.html',
  styleUrl: './about-developer.component.scss',
})
export class AboutDeveloperComponent {
  myPhoto: string = '/assets/images/my-photo.jpg';
  aboutDeveloperInfo: IAboutDeveloperItem[] = [
    {
      title: 'Who am I?',
      text: 'I, Dmitri Krapyvianskiy, am a front-end web developer living in Chernihiv, Ukraine. Currently, I am on 3 year od studing in Chernihiv Polytechnic National University, speciality Software Engineering. Mainly I specialize in creating Angular + TS applications, but also I have experiance in Vanilla JS and React programming.',
    },
    {
      title:
        'Why have I decided to become a programmer? And why exactly JS and frameworks?',
      text: "I've always wanted to be a programmer, event if this path is a complicated one. My programming journey began from C++ and was headed through different languages such as Python, Assembly, C#, Java, PHP and so on. But when I tried to write in JS, I realized that it was what I needed.",
    },
    {
      title: 'Something about myself',
      text: 'My biggest passion is making myself a better person and the world a better place. In addition, I love learning languages, reading (without books my life would by a misery xd) and of course programming.',
    },
    {
      title: 'Conclusion',
      text: "I do not have much production experiance, but I'm looking forward to it. If you have something to offer or just want to ask me something, contact me!",
    },
  ];
}
