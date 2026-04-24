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
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminAccueil } from './admin/admin-accueil/admin-accueil';
import { AdminQuiSommesNous } from './admin/admin-qui-sommes-nous/admin-qui-sommes-nous';
import { AdminOrganisation } from './admin/admin-organisation/admin-organisation';
import { AdminMissions } from './admin/admin-missions/admin-missions';
import { AdminActionsSolidaires } from './admin/admin-actions-solidaires/admin-actions-solidaires';
import { AdminSoutien } from './admin/admin-soutien/admin-soutien';
import { AdminInternational } from './admin/admin-international/admin-international';
import { AdminEvenements } from './admin/admin-evenements/admin-evenements';
import { AdminRencontre } from './admin/admin-rencontre/admin-rencontre';
import { AdminTemoignages } from './admin/admin-temoignages/admin-temoignages';
import { AdminActualites } from './admin/admin-actualites/admin-actualites';
import { AdminContact } from './admin/admin-contact/admin-contact';
import { AdminDon } from './admin/admin-don/admin-don';
import { AdminRejoindre } from './admin/admin-rejoindre/admin-rejoindre';
import { AdminSettings } from './admin/admin-settings/admin-settings';

export const routes: Routes = [
  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboard, data: { title: 'Tableau de bord', section: 'General' } },
      { path: 'accueil', component: AdminAccueil, data: { title: 'Accueil', section: 'Pages publiques' } },
      { path: 'qui-sommes-nous', component: AdminQuiSommesNous, data: { title: 'Qui sommes-nous', section: 'Pages publiques' } },
      { path: 'organisation', component: AdminOrganisation, data: { title: 'Organisation', section: 'Pages publiques' } },
      { path: 'missions', component: AdminMissions, data: { title: 'Missions', section: 'Pages publiques' } },
      { path: 'actions-solidaires', component: AdminActionsSolidaires, data: { title: 'Actions solidaires', section: 'Pages publiques' } },
      { path: 'soutien', component: AdminSoutien, data: { title: 'Soutien aux membres', section: 'Pages publiques' } },
      { path: 'international', component: AdminInternational, data: { title: 'International', section: 'Pages publiques' } },
      { path: 'evenements', component: AdminEvenements, data: { title: 'Evenements', section: 'Pages publiques' } },
      { path: 'rencontre', component: AdminRencontre, data: { title: 'Rencontre annuelle', section: 'Pages publiques' } },
      { path: 'temoignages', component: AdminTemoignages, data: { title: 'Temoignages', section: 'Pages publiques' } },
      { path: 'actualites', component: AdminActualites, data: { title: 'Actualites', section: 'Pages publiques' } },
      { path: 'contact', component: AdminContact, data: { title: 'Contact', section: 'Pages publiques' } },
      { path: 'don', component: AdminDon, data: { title: 'Don', section: 'Pages publiques' } },
      { path: 'rejoindre', component: AdminRejoindre, data: { title: 'Nous rejoindre', section: 'Pages publiques' } },
      { path: 'settings', component: AdminSettings, data: { title: 'Parametres', section: 'General' } },
    ]
  },
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
