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
import { settingsResolver, listResolver, pageResolver } from './resolvers/data.resolver';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    resolve: { data: settingsResolver },
    children: [
      { path: '', component: Accueil, resolve: { pageContent: pageResolver }, data: { pageKey: 'accueil' } },
      { path: 'accueil', component: Accueil, resolve: { pageContent: pageResolver }, data: { pageKey: 'accueil' } },
      { path: 'qui-sommes-nous', component: QuiSommesNous, resolve: { pageContent: pageResolver }, data: { pageKey: 'qui-sommes-nous' } },
      {
        path: 'organisation',
        component: Organisation,
        resolve: { pageContent: pageResolver, team: listResolver },
        data: { pageKey: 'organisation', listType: 'team' }
      },
      {
        path: 'nos-missions',
        component: NosMissions,
        resolve: { pageContent: pageResolver, missions: listResolver },
        data: { pageKey: 'nos-missions', listType: 'missions' }
      },
      {
        path: 'actions-solidaires',
        component: ActionsSolidaires,
        resolve: { pageContent: pageResolver, actions: listResolver },
        data: { pageKey: 'actions-solidaires', listType: 'actions', actionPageType: 'solidaire' }
      },
      { path: 'soutien-aux-membres', component: SoutienAuxMembres, resolve: { pageContent: pageResolver }, data: { pageKey: 'soutien-aux-membres' } },
      { path: 'actions-internationales', component: ActionsInternationales, resolve: { pageContent: pageResolver }, data: { pageKey: 'actions-internationales' } },
      {
        path: 'evenements',
        component: Evenements,
        resolve: { pageContent: pageResolver, events: listResolver },
        data: { pageKey: 'evenements', listType: 'events' }
      },
      {
        path: 'rencontre-annuelle',
        component: RencontreAnnuelle,
        resolve: { pageContent: pageResolver, events: listResolver },
        data: { pageKey: 'rencontre-annuelle', listType: 'events' }
      },
      {
        path: 'temoignages',
        component: Temoignages,
        resolve: { pageContent: pageResolver, testimonials: listResolver },
        data: { pageKey: 'temoignages', listType: 'testimonials' }
      },
      { path: 'nous-rejoindre', component: NousRejoindre, resolve: { pageContent: pageResolver }, data: { pageKey: 'nous-rejoindre' } },
      {
        path: 'actualites',
        component: Actualites,
        resolve: { pageContent: pageResolver, actualities: listResolver },
        data: { pageKey: 'actualites', listType: 'actualities' }
      },
      { path: 'contact', component: Contact, resolve: { pageContent: pageResolver }, data: { pageKey: 'contact' } },
      {
        path: 'don',
        component: Don,
        resolve: { pageContent: pageResolver, donModes: listResolver },
        data: { pageKey: 'don', listType: 'donModes' }
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
