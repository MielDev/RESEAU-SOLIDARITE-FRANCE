import { Routes } from '@angular/router';
import { UserLayout } from './utilisateurs/user-layout/user-layout';
import { Accueil } from './utilisateurs/accueil/accueil';
import { QuiSommesNous } from './utilisateurs/qui-sommes-nous/qui-sommes-nous';
import { Organisation } from './utilisateurs/organisation/organisation';
import { NosMissions } from './utilisateurs/nos-missions/nos-missions';
import { ActionsSolidaires } from './utilisateurs/actions-solidaires/actions-solidaires';
import { SoutienAuxMembres } from './utilisateurs/soutien-aux-membres/soutien-aux-membres';
import { ActionsInternationales } from './utilisateurs/actions-internationales/actions-internationales';
import { Evenements } from './utilisateurs/evenements/evenements';
import { RencontreAnnuelle } from './utilisateurs/rencontre-annuelle/rencontre-annuelle';
import { Temoignages } from './utilisateurs/temoignages/temoignages';
import { NousRejoindre } from './utilisateurs/nous-rejoindre/nous-rejoindre';
import { Actualites } from './utilisateurs/actualites/actualites';
import { Contact } from './utilisateurs/contact/contact';
import { Don } from './utilisateurs/don/don';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', component: Accueil },
      { path: 'accueil', component: Accueil },
      { path: 'qui-sommes-nous', component: QuiSommesNous },
      { path: 'organisation', component: Organisation },
      { path: 'nos-missions', component: NosMissions },
      { path: 'actions-solidaires', component: ActionsSolidaires },
      { path: 'soutien-aux-membres', component: SoutienAuxMembres },
      { path: 'actions-internationales', component: ActionsInternationales },
      { path: 'evenements', component: Evenements },
      { path: 'rencontre-annuelle', component: RencontreAnnuelle },
      { path: 'temoignages', component: Temoignages },
      { path: 'nous-rejoindre', component: NousRejoindre },
      { path: 'actualites', component: Actualites },
      { path: 'contact', component: Contact },
      { path: 'don', component: Don },
    ]
  },
  { path: '**', redirectTo: '' }
];
