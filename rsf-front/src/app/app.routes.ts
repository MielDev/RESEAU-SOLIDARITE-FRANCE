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
import { EvenementDetail } from './utilisateurs/evenement-detail/evenement-detail';
import { RencontreAnnuelle } from './utilisateurs/rencontre-annuelle/rencontre-annuelle';
import { Temoignages } from './utilisateurs/temoignages/temoignages';
import { NousRejoindre } from './utilisateurs/nous-rejoindre/nous-rejoindre';
import { Actualites } from './utilisateurs/actualites/actualites';
import { Contact } from './utilisateurs/contact/contact';
import { Don } from './utilisateurs/don/don';
import { settingsResolver, listResolver, pageResolver } from './resolvers/data.resolver';
import { adminAuthGuard } from './admin/admin-auth.guard';

export const routes: Routes = [
  { path: 'admin/login', loadComponent: () => import('./admin/admin-login/admin-login').then((m) => m.AdminLogin) },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [adminAuthGuard],
    canActivateChild: [adminAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
        data: { title: 'Tableau de bord', section: 'General' },
      },
      {
        path: 'accueil',
        loadComponent: () => import('./admin/admin-accueil/admin-accueil').then((m) => m.AdminAccueil),
        data: { title: 'Accueil', section: 'Pages publiques' },
      },
      {
        path: 'qui-sommes-nous',
        loadComponent: () =>
          import('./admin/admin-qui-sommes-nous/admin-qui-sommes-nous').then((m) => m.AdminQuiSommesNous),
        data: { title: 'Qui sommes-nous', section: 'Pages publiques' },
      },
      {
        path: 'organisation',
        loadComponent: () => import('./admin/admin-organisation/admin-organisation').then((m) => m.AdminOrganisation),
        data: { title: 'Organisation', section: 'Pages publiques' },
      },
      {
        path: 'missions',
        loadComponent: () => import('./admin/admin-missions/admin-missions').then((m) => m.AdminMissions),
        data: { title: 'Missions', section: 'Pages publiques' },
      },
      {
        path: 'actions-solidaires',
        loadComponent: () =>
          import('./admin/admin-actions-solidaires/admin-actions-solidaires').then((m) => m.AdminActionsSolidaires),
        data: { title: 'Actions solidaires', section: 'Pages publiques' },
      },
      {
        path: 'soutien',
        loadComponent: () => import('./admin/admin-soutien/admin-soutien').then((m) => m.AdminSoutien),
        data: { title: 'Soutien aux membres', section: 'Pages publiques' },
      },
      {
        path: 'international',
        loadComponent: () => import('./admin/admin-international/admin-international').then((m) => m.AdminInternational),
        data: { title: 'International', section: 'Pages publiques' },
      },
      {
        path: 'evenements',
        loadComponent: () => import('./admin/admin-evenements/admin-evenements').then((m) => m.AdminEvenements),
        data: { title: 'Evenements', section: 'Pages publiques' },
      },
      {
        path: 'rencontre',
        loadComponent: () => import('./admin/admin-rencontre/admin-rencontre').then((m) => m.AdminRencontre),
        data: { title: 'Rencontre annuelle', section: 'Pages publiques' },
      },
      {
        path: 'temoignages',
        loadComponent: () => import('./admin/admin-temoignages/admin-temoignages').then((m) => m.AdminTemoignages),
        data: { title: 'Temoignages', section: 'Pages publiques' },
      },
      {
        path: 'actualites',
        loadComponent: () => import('./admin/admin-actualites/admin-actualites').then((m) => m.AdminActualites),
        data: { title: 'Actualites', section: 'Pages publiques' },
      },
      {
        path: 'contact',
        loadComponent: () => import('./admin/admin-contact/admin-contact').then((m) => m.AdminContact),
        data: { title: 'Contact', section: 'Pages publiques' },
      },
      {
        path: 'creneaux',
        loadComponent: () => import('./admin/admin-creneaux/admin-creneaux').then((m) => m.AdminCreneaux),
        data: { title: 'Creneaux', section: 'Accompagnement' },
      },
      {
        path: 'rendez-vous',
        loadComponent: () => import('./admin/admin-rendez-vous/admin-rendez-vous').then((m) => m.AdminRendezVous),
        data: { title: 'Rendez-vous', section: 'Accompagnement' },
      },
      {
        path: 'don',
        loadComponent: () => import('./admin/admin-don/admin-don').then((m) => m.AdminDon),
        data: { title: 'Don', section: 'Pages publiques' },
      },
      {
        path: 'rejoindre',
        loadComponent: () => import('./admin/admin-rejoindre/admin-rejoindre').then((m) => m.AdminRejoindre),
        data: { title: 'Nous rejoindre', section: 'Pages publiques' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/admin-settings/admin-settings').then((m) => m.AdminSettings),
        data: { title: 'Parametres', section: 'General' },
      },
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
        path: 'evenements/:id',
        component: EvenementDetail,
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
        path: 'inscription',
        loadComponent: () => import('./utilisateurs/inscription/inscription').then((m) => m.Inscription),
      },
      {
        path: 'connexion',
        loadComponent: () => import('./utilisateurs/connexion/connexion').then((m) => m.Connexion),
      },
      {
        path: 'mot-de-passe-oublie',
        loadComponent: () =>
          import('./utilisateurs/mot-de-passe-oublie/mot-de-passe-oublie').then((m) => m.MotDePasseOublie),
      },
      {
        path: 'rendez-vous',
        loadComponent: () => import('./utilisateurs/rendez-vous/rendez-vous').then((m) => m.RendezVous),
      },
      {
        path: 'mentions-legales',
        loadComponent: () => import('./utilisateurs/legal/legal').then((m) => m.Legal),
        data: { legalPage: 'mentions' },
      },
      {
        path: 'politique-confidentialite',
        loadComponent: () => import('./utilisateurs/legal/legal').then((m) => m.Legal),
        data: { legalPage: 'privacy' },
      },
      {
        path: 'cookies',
        loadComponent: () => import('./utilisateurs/legal/legal').then((m) => m.Legal),
        data: { legalPage: 'cookies' },
      },
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
