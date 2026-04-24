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

import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminAccueil } from './admin/admin-accueil/admin-accueil';
import { AdminQuiSommesNous } from './admin/admin-qui-sommes-nous/admin-qui-sommes-nous';
import { AdminOrganisation } from './admin/admin-organisation/admin-organisation';
import { AdminMissions } from './admin/admin-missions/admin-missions';
import { AdminActionsSolidaires } from './admin/admin-actions-solidaires/admin-actions-solidaires';
import { AdminSoutien } from './admin/admin-soutien/admin-soutien';
import { AdminEvenements } from './admin/admin-evenements/admin-evenements';
import { AdminRencontre } from './admin/admin-rencontre/admin-rencontre';
import { AdminInternational } from './admin/admin-international/admin-international';
import { AdminTemoignages } from './admin/admin-temoignages/admin-temoignages';
import { AdminRejoindre } from './admin/admin-rejoindre/admin-rejoindre';
import { AdminActualites } from './admin/admin-actualites/admin-actualites';
import { AdminDon } from './admin/admin-don/admin-don';
import { AdminContact } from './admin/admin-contact/admin-contact';
import { AdminSettings } from './admin/admin-settings/admin-settings';

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
    ],
  },
  { path: 'admin/login', component: AdminLogin, data: { title: 'Connexion' } },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: AdminDashboard,
        data: { title: 'Tableau de bord', breadcrumb: 'Dashboard' },
      },
      {
        path: 'accueil',
        component: AdminAccueil,
        data: { title: 'Accueil', breadcrumb: 'Accueil', preview: '/' },
      },
      {
        path: 'qui-sommes-nous',
        component: AdminQuiSommesNous,
        data: {
          title: 'Qui sommes-nous ?',
          breadcrumb: 'Qui sommes-nous',
          preview: '/qui-sommes-nous',
        },
      },
      {
        path: 'organisation',
        component: AdminOrganisation,
        data: {
          title: 'Organisation',
          breadcrumb: 'Organisation',
          preview: '/organisation',
        },
      },
      {
        path: 'missions',
        component: AdminMissions,
        data: {
          title: 'Nos missions',
          breadcrumb: 'Nos missions',
          preview: '/nos-missions',
        },
      },
      {
        path: 'actions-solidaires',
        component: AdminActionsSolidaires,
        data: {
          title: 'Actions solidaires',
          breadcrumb: 'Actions solidaires',
          preview: '/actions-solidaires',
        },
      },
      {
        path: 'soutien',
        component: AdminSoutien,
        data: {
          title: 'Soutien aux membres',
          breadcrumb: 'Soutien',
          preview: '/soutien-aux-membres',
        },
      },
      {
        path: 'evenements',
        component: AdminEvenements,
        data: {
          title: 'Événements',
          breadcrumb: 'Événements',
          preview: '/evenements',
        },
      },
      {
        path: 'rencontre',
        component: AdminRencontre,
        data: {
          title: 'Rencontre annuelle',
          breadcrumb: 'Rencontre',
          preview: '/rencontre-annuelle',
        },
      },
      {
        path: 'international',
        component: AdminInternational,
        data: {
          title: 'Actions internationales',
          breadcrumb: 'International',
          preview: '/actions-internationales',
        },
      },
      {
        path: 'temoignages',
        component: AdminTemoignages,
        data: {
          title: 'Témoignages',
          breadcrumb: 'Témoignages',
          preview: '/temoignages',
        },
      },
      {
        path: 'rejoindre',
        component: AdminRejoindre,
        data: {
          title: 'Nous rejoindre',
          breadcrumb: 'Rejoindre',
          preview: '/nous-rejoindre',
        },
      },
      {
        path: 'actualites',
        component: AdminActualites,
        data: {
          title: 'Actualités',
          breadcrumb: 'Actualités',
          preview: '/actualites',
        },
      },
      {
        path: 'don',
        component: AdminDon,
        data: { title: 'Faire un don', breadcrumb: 'Don', preview: '/don' },
      },
      {
        path: 'contact',
        component: AdminContact,
        data: { title: 'Contact', breadcrumb: 'Contact', preview: '/contact' },
      },
      {
        path: 'settings',
        component: AdminSettings,
        data: { title: 'Paramètres généraux', breadcrumb: 'Paramètres' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
