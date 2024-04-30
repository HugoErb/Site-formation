import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.scss'
})
export class TrainingFormComponent implements OnInit {
  constructor(private router: Router) {}
  burgerMenuOpened: boolean = false;
  chosenTrainingName?: string;

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.chosenTrainingName = (navigation.extras.state as { chosenTrainingName: string }).chosenTrainingName;
    }
  }

  @ViewChild('menuContainerRef') menuContainerRef!: ElementRef;
  @ViewChild('menuBurger') menuBurger!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.burgerMenuOpened && !this.menuBurger.nativeElement.contains(event.target)) {
      this.burgerMenuOpened = false;
    }
  }

  scrollToSection(sectionId: string): void {
    if (this.burgerMenuOpened) {
      this.burgerMenuOpened = !this.burgerMenuOpened;
    }

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const headerHeight = 64;
        const position = sectionTop - headerHeight;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    }, 50);
  }

  toggleBurgerMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.burgerMenuOpened = !this.burgerMenuOpened;
  }

  sendMail() {
  }
}