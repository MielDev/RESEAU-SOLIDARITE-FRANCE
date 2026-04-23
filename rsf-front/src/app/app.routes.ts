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
import { settingsResolver, accueilResolver, pageResolver, listResolver } from './resolvers/data.resolver';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    resolve: { data: settingsResolver },
    children: [
      { path: '', component: Accueil, resolve: { data: accueilResolver } },
      { path: 'accueil', component: Accueil, resolve: { data: accueilResolver } },
      { path: 'qui-sommes-nous', component: QuiSommesNous, resolve: { pageContent: pageResolver }, data: { pageKey: 'qui-sommes-nous' } },
      { path: 'organisation', component: Organisation, resolve: { pageContent: pageResolver, team: listResolver }, data: { pageKey: 'organisation', listType: 'team' } },
      { path: 'nos-missions', component: NosMissions, resolve: { missions: listResolver }, data: { listType: 'missions' } },
      { path: 'actions-solidaires', component: ActionsSolidaires },
      { path: 'soutien-aux-membres', component: SoutienAuxMembres },
      { path: 'actions-internationales', component: ActionsInternationales },
      { path: 'evenements', component: Evenements, resolve: { events: listResolver }, data: { listType: 'events' } },
      { path: 'rencontre-annuelle', component: RencontreAnnuelle, resolve: { pageContent: pageResolver }, data: { pageKey: 'rencontre-annuelle' } },
      { path: 'temoignages', component: Temoignages, resolve: { testimonials: listResolver }, data: { listType: 'testimonials' } },
      { path: 'nous-rejoindre', component: NousRejoindre },
      { path: 'actualites', component: Actualites, resolve: { actualities: listResolver }, data: { listType: 'actualities' } },
      { path: 'contact', component: Contact },
      { path: 'don', component: Don },
    ]
  },
  { path: '**', redirectTo: '' }
];
