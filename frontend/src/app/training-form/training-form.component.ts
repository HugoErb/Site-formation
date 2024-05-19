import { Component, ElementRef, HostListener, ViewChild, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../common.service';

// Font Awesome Icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// Définition de l'interface pour la réponse de l'API de MailCheck.ai
interface EmailValidityResponse {
  disposable: boolean;
  mx: boolean;
}

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule,],
  templateUrl: './training-form.component.html'
})
export class TrainingFormComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private commonService: CommonService) {
    this.todayDate = new Date();
  }
  icons = { faCircleArrowLeft, faBars };
  burgerMenuOpened: boolean = false;
  todayDate: Date;

  // Variables pour le mail
  @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;
  public inputLabelMap = new Map<string, string>();
  postalCodeMail: string = "";
  cityMail: string = "";
  countryMail: string = "";
  addressMail: string = "";
  nameMail: string = "";
  emailMail: string = "";
  phoneNumberMail: string = "";
  companyMail: string = "";
  chosenTrainingName = "";
  personNumberMail: string = "";
  jobTrainedMail: string = "";
  trainingDateMail: string = "";
  moreInformationMail: string = "";

  ngOnInit() {

    // On récupère le nom de la formation de la page home
    if (this.activatedRoute.snapshot.params.hasOwnProperty('chosenTrainingName')) {
      this.chosenTrainingName = this.activatedRoute.snapshot.params['chosenTrainingName'];
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

  navigateToHome(section: string) {
    this.router.navigate(['home', { redirectionSection: section }]);
  }

  toggleBurgerMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.burgerMenuOpened = !this.burgerMenuOpened;
  }

  /**
  * Filtre et formate la saisie d'un numéro de téléphone dans un champ de saisie HTML.
  * Seules les valeurs numériques sont conservées, et un espace est ajouté tous les deux chiffres.
  * Limite la saisie à un maximum de 10 chiffres.
  * 
  * @param event L'événement d'entrée déclenché lors de la saisie dans le champ de saisie.
  *              L'événement doit être de type `Event`.
  */
  formatAndRestrictPhoneInput(event: Event): void {
    this.phoneNumberMail = this.commonService.formatAndRestrictPhoneInput(event);
  }

  /**
  * Filtre et formate la saisie d'un code postal dans un champ de saisie HTML.
  * Seules les valeurs numériques sont conservées.
  * Limite la saisie à un maximum de 5 chiffres et s'assure que la valeur ne dépasse pas 98890.
  * 
  * @param event L'événement d'entrée déclenché lors de la saisie dans le champ de saisie.
  *              L'événement doit être de type `Event`.
  */
  formatAndRestrictPostalCodeInput(event: Event): void {
    let input = event.target as HTMLInputElement;
    let value = input.value;

    // Supprimer tout caractère non numérique
    let numbers = value.replace(/\D/g, '');

    // Limiter à 5 chiffres
    numbers = numbers.slice(0, 5);

    // S'assurer que la valeur ne dépasse pas 98890
    if (parseInt(numbers) > 98890) {
      numbers = '98890';
    }

    // Mettre à jour la valeur du modèle et de l'input
    this.postalCodeMail = numbers;
    input.value = numbers;
  }

  /**
  * Prépare et envoie un email en utilisant le service commun.
  * Si l'envoi de l'email réussit, on réinitialise les champs de saisie.
  *
  * @returns {Promise<void>} Une promesse qui se résout une fois que l'email a été envoyé et que les 
  * champs de saisie ont été réinitialisés en cas de succès.
  */
  async sendMail(): Promise<void> {
    this.getDataIntoDictionary();
    if (await this.commonService.sendMail(this.inputLabelMap)) {
      this.resetInputFields();
    }
  }

  /**
  * Parcourt les champs de saisie dans le HTML et mappe leurs valeurs à leurs labels correspondants.
  * La méthode utilise `inputFields` pour obtenir une liste des éléments de saisie. Pour chaque champ de saisie, elle récupère
  * le label associé en utilisant son attribut 'id'. Si un label est trouvé pour une valeur de champ, la méthode les mappent dans `inputLabelMap`.
  */
  private getDataIntoDictionary() {
    this.inputFields.forEach(input => {
      const label = document.querySelector(`label[for="${input.nativeElement.id}"]`);
      if (label) {
        this.inputLabelMap.set(label.textContent!.trim(), input.nativeElement.value);
      }
    });
  }

  /**
  * Réinitialise les valeurs de tous les champs de saisie marqués avec la directive locale #inputField.
  * En l'occurence, la méthode permet de réinitialiser la valeur des champs de l'envoi de mail.
  */
  resetInputFields() {
    this.inputFields.forEach(field => {
      if (field.nativeElement instanceof HTMLInputElement || field.nativeElement instanceof HTMLTextAreaElement) {
        field.nativeElement.value = '';
      }
    });
  }
}
