import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
 Home, 
 PieChart, 
 Settings, 
 Plus, 
 Bell, 
 ChevronRight, 
 Search,
 ArrowLeft,
 AlertCircle,
 CheckCircle2,
 ExternalLink,
 Trash2,
 Moon,
 Sun,
 Globe,
 DollarSign,
 Users,
 Image as ImageIcon
} from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { CURRENCIES } from '../data/currencies';

export interface Subscription {
 id: string;
 name: string;
 cost: number;
 currency: string;
 billingCycle: 'monthly' | 'yearly';
 nextPaymentDate: string;
 logo: string;
 category: string;
 cancelUrl?: string;
 instructions?: string;
 familyMemberId?: string;
}

export const PREDEFINED_SERVICES = [
 // 1. Streaming Services
 { name: 'Netflix', category: 'Streaming', logo: 'https://logo.clearbit.com/netflix.com', cancelUrl: 'https://www.netflix.com/CancelPlan', instructions: 'Log in, go to Account, click Cancel Membership.', defaultCost: 15.49 },
 { name: 'Amazon Prime Video', category: 'Streaming', logo: 'https://logo.clearbit.com/amazon.com', cancelUrl: 'https://www.amazon.com/mc', instructions: 'Go to Manage Prime Membership, click End Membership and Benefits.', defaultCost: 14.99 },
 { name: 'Disney+', category: 'Streaming', logo: 'https://logo.clearbit.com/disneyplus.com', cancelUrl: 'https://www.disneyplus.com/account/cancel', instructions: 'Log in, go to Account, select your subscription, click Cancel Subscription.', defaultCost: 13.99 },
 { name: 'Hulu', category: 'Streaming', logo: 'https://logo.clearbit.com/hulu.com', cancelUrl: 'https://secure.hulu.com/account/cancel', instructions: 'Go to your Account page, scroll down and click Cancel Your Subscription.', defaultCost: 7.99 },
 { name: 'HBO Max / Max', category: 'Streaming', logo: 'https://logo.clearbit.com/max.com', cancelUrl: 'https://play.max.com/account', instructions: 'Go to Settings, select Subscription, and click Cancel Subscription.', defaultCost: 15.99 },
 { name: 'Apple TV+', category: 'Streaming', logo: 'https://logo.clearbit.com/tv.apple.com', cancelUrl: 'https://tv.apple.com/settings', instructions: 'Go to Settings, select Subscriptions, click Manage, then Cancel Subscription.', defaultCost: 9.99 },
 { name: 'Spotify', category: 'Music', logo: 'https://logo.clearbit.com/spotify.com', cancelUrl: 'https://www.spotify.com/account/cancel/', instructions: 'Go to your account page, scroll to Your Plan, click Change Plan, scroll to Cancel Premium.', defaultCost: 10.99 },
 { name: 'YouTube Premium', category: 'Streaming', logo: 'https://logo.clearbit.com/youtube.com', cancelUrl: 'https://www.youtube.com/paid_memberships', instructions: 'Go to Paid Memberships, click Manage Membership, then Deactivate.', defaultCost: 13.99 },
 { name: 'Pandora', category: 'Music', logo: 'https://logo.clearbit.com/pandora.com', cancelUrl: 'https://www.pandora.com/settings/subscription', instructions: 'Go to Settings, select Subscription, and click Cancel Subscription.', defaultCost: 4.99 },
 { name: 'Tidal', category: 'Music', logo: 'https://logo.clearbit.com/tidal.com', cancelUrl: 'https://my.tidal.com/ww/subscription', instructions: 'Log in, go to Subscription, and click Cancel my subscription.', defaultCost: 10.99 },
 { name: 'Audible', category: 'Audiobooks', logo: 'https://logo.clearbit.com/audible.com', cancelUrl: 'https://www.audible.com/account/details', instructions: 'Go to Account Details, click Cancel membership.', defaultCost: 14.95 },
 { name: 'Deezer', category: 'Music', logo: 'https://logo.clearbit.com/deezer.com', cancelUrl: 'https://www.deezer.com/account/subscription', instructions: 'Go to Account Settings, select Manage my subscription, click Cancel my subscription.', defaultCost: 10.99 },

 // 2. Fitness and Wellness
 { name: 'Fitbit Premium', category: 'Fitness', logo: 'https://logo.clearbit.com/fitbit.com', cancelUrl: 'https://www.fitbit.com/settings/premium', instructions: 'Go to Settings, select Subscriptions, and cancel Fitbit Premium.', defaultCost: 9.99 },
 { name: 'Peloton', category: 'Fitness', logo: 'https://logo.clearbit.com/onepeloton.com', cancelUrl: 'https://members.onepeloton.com/preferences/subscriptions', instructions: 'Go to Subscriptions, select your membership, and click Cancel Subscription.', defaultCost: 44.00 },
 { name: 'Apple Fitness+', category: 'Fitness', logo: 'https://logo.clearbit.com/apple.com', cancelUrl: 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions', instructions: 'Open Settings, tap your name, select Subscriptions, and cancel Apple Fitness+.', defaultCost: 9.99 },
 { name: 'MyFitnessPal Premium', category: 'Fitness', logo: 'https://logo.clearbit.com/myfitnesspal.com', cancelUrl: 'https://www.myfitnesspal.com/premium', instructions: 'Go to Premium settings, select Cancel Auto-Renewal.', defaultCost: 19.99 },
 { name: 'ClassPass', category: 'Fitness', logo: 'https://logo.clearbit.com/classpass.com', cancelUrl: 'https://classpass.com/account/settings', instructions: 'Go to Account Settings, select Manage Plan, and click Cancel my membership.', defaultCost: 49.00 },
 { name: 'Calm', category: 'Wellness', logo: 'https://logo.clearbit.com/calm.com', cancelUrl: 'https://www.calm.com/profile/manage-subscription', instructions: 'Go to Profile, select Manage Subscription, and click Cancel.', defaultCost: 14.99 },
 { name: 'Headspace', category: 'Wellness', logo: 'https://logo.clearbit.com/headspace.com', cancelUrl: 'https://www.headspace.com/subscription/manage', instructions: 'Go to Subscription settings, turn off auto-renew.', defaultCost: 12.99 },
 { name: 'Noom', category: 'Wellness', logo: 'https://logo.clearbit.com/noom.com', cancelUrl: 'https://account.noom.com/', instructions: 'Log in to your account portal and select Cancel Subscription.', defaultCost: 60.00 },
 { name: 'Strava Premium', category: 'Fitness', logo: 'https://logo.clearbit.com/strava.com', cancelUrl: 'https://www.strava.com/settings/billing', instructions: 'Go to Settings, select My Account, and click Cancel Premium.', defaultCost: 11.99 },
 { name: 'WHOOP', category: 'Fitness', logo: 'https://logo.clearbit.com/whoop.com', cancelUrl: 'https://app.whoop.com/membership', instructions: 'Go to Membership settings and select Cancel Membership.', defaultCost: 30.00 },

 // 3. Beauty and Personal Care
 { name: 'Ipsy', category: 'Beauty', logo: 'https://logo.clearbit.com/ipsy.com', cancelUrl: 'https://www.ipsy.com/account/membership', instructions: 'Go to Account, select Membership, and click Cancel Membership.', defaultCost: 13.00 },
 { name: 'Birchbox', category: 'Beauty', logo: 'https://logo.clearbit.com/birchbox.com', cancelUrl: 'https://www.birchbox.com/me/account', instructions: 'Go to Account Settings, select Subscription, and click Cancel.', defaultCost: 15.00 },
 { name: 'GlossyBox', category: 'Beauty', logo: 'https://logo.clearbit.com/glossybox.com', cancelUrl: 'https://www.glossybox.com/myaccount.list', instructions: 'Go to My Account, select Subscriptions, and cancel.', defaultCost: 21.00 },
 { name: 'Soko Glam', category: 'Beauty', logo: 'https://logo.clearbit.com/sokoglam.com', cancelUrl: 'https://sokoglam.com/account', instructions: 'Log in to your account and manage your subscriptions.', defaultCost: 35.00 },
 { name: 'Dollar Shave Club', category: 'Personal Care', logo: 'https://logo.clearbit.com/dollarshaveclub.com', cancelUrl: 'https://www.dollarshaveclub.com/my-account/membership', instructions: 'Go to Membership settings and click Cancel.', defaultCost: 10.00 },
 { name: 'FabFitFun', category: 'Lifestyle', logo: 'https://logo.clearbit.com/fabfitfun.com', cancelUrl: 'https://fabfitfun.com/my-account/', instructions: 'Go to My Account, select Edit Subscription, and click Cancel.', defaultCost: 59.99 },
 { name: 'Sephora Play!', category: 'Beauty', logo: 'https://logo.clearbit.com/sephora.com', cancelUrl: 'https://www.sephora.com/profile/MyAccount', instructions: 'Go to My Account, select Subscriptions, and cancel.', defaultCost: 10.00 },
 { name: 'Allure Beauty Box', category: 'Beauty', logo: 'https://logo.clearbit.com/allure.com', cancelUrl: 'https://beautybox.allure.com/account', instructions: 'Log in to your account to manage or cancel your subscription.', defaultCost: 25.00 },
 { name: 'Billie', category: 'Personal Care', logo: 'https://logo.clearbit.com/mybillie.com', cancelUrl: 'https://mybillie.com/account', instructions: 'Go to Account, select your subscription, and click Cancel.', defaultCost: 10.00 },
 { name: 'Function of Beauty', category: 'Personal Care', logo: 'https://logo.clearbit.com/functionofbeauty.com', cancelUrl: 'https://www.functionofbeauty.com/account', instructions: 'Go to Account, select Subscriptions, and cancel.', defaultCost: 29.99 },

 // 4. Food and Drink
 { name: 'HelloFresh', category: 'Food', logo: 'https://logo.clearbit.com/hellofresh.com', cancelUrl: 'https://www.hellofresh.com/settings/plan', instructions: 'Go to Plan Settings, scroll down, and click Cancel Plan.', defaultCost: 60.00 },
 { name: 'Blue Apron', category: 'Food', logo: 'https://logo.clearbit.com/blueapron.com', cancelUrl: 'https://www.blueapron.com/account', instructions: 'Go to Account Settings, select Manage Your Account, and click Cancel.', defaultCost: 55.00 },
 { name: 'SnackCrate', category: 'Food', logo: 'https://logo.clearbit.com/snackcrate.com', cancelUrl: 'https://www.snackcrate.com/account', instructions: 'Log in to your account and select Cancel Subscription.', defaultCost: 15.00 },
 { name: 'Winc', category: 'Food', logo: 'https://logo.clearbit.com/winc.com', cancelUrl: 'https://www.winc.com/account', instructions: 'Go to Account Settings, select Membership, and click Cancel.', defaultCost: 60.00 },
 { name: 'Craft Coffee', category: 'Food', logo: 'https://logo.clearbit.com/craftcoffee.com', cancelUrl: 'https://www.craftcoffee.com/account', instructions: 'Log in to your account to manage or cancel your subscription.', defaultCost: 15.00 },
 { name: 'Graze', category: 'Food', logo: 'https://logo.clearbit.com/graze.com', cancelUrl: 'https://www.graze.com/us/account', instructions: 'Go to Account Settings, select Manage Subscription, and click Cancel.', defaultCost: 14.00 },
 { name: 'ButcherBox', category: 'Food', logo: 'https://logo.clearbit.com/butcherbox.com', cancelUrl: 'https://www.butcherbox.com/account', instructions: 'Go to Account Settings, select Box Settings, and click Stop Subscription.', defaultCost: 146.00 },
 { name: 'Daily Harvest', category: 'Food', logo: 'https://logo.clearbit.com/daily-harvest.com', cancelUrl: 'https://www.daily-harvest.com/account', instructions: 'Go to Account Settings, select Plan, and click Pause or Cancel.', defaultCost: 75.00 },
 { name: 'Green Chef', category: 'Food', logo: 'https://logo.clearbit.com/greenchef.com', cancelUrl: 'https://www.greenchef.com/settings/plan', instructions: 'Go to Plan Settings, scroll down, and click Deactivate your plan.', defaultCost: 80.00 },
 { name: 'Try The World', category: 'Food', logo: 'https://logo.clearbit.com/trytheworld.com', cancelUrl: 'https://www.trytheworld.com/account', instructions: 'Log in to your account to manage or cancel your subscription.', defaultCost: 39.00 },

 // 5. Entertainment (Movies, TV, Live Events)
 { name: 'Regal Unlimited', category: 'Entertainment', logo: 'https://logo.clearbit.com/regmovies.com', cancelUrl: 'https://www.regmovies.com/unlimited', instructions: 'Contact customer support or manage via the Regal app.', defaultCost: 18.00 },
 { name: 'AMC Stubs A-List', category: 'Entertainment', logo: 'https://logo.clearbit.com/amctheatres.com', cancelUrl: 'https://www.amctheatres.com/amcstubs/alist', instructions: 'Go to Account, select Manage A-List, and click Cancel.', defaultCost: 19.95 },
 { name: 'BroadwayHD', category: 'Entertainment', logo: 'https://logo.clearbit.com/broadwayhd.com', cancelUrl: 'https://www.broadwayhd.com/account', instructions: 'Go to Account Settings, select Subscription, and click Cancel.', defaultCost: 11.99 },
 { name: 'Ticketmaster Fan Subscription', category: 'Entertainment', logo: 'https://logo.clearbit.com/ticketmaster.com', cancelUrl: 'https://www.ticketmaster.com/user', instructions: 'Log in to your account to manage your subscriptions.', defaultCost: 10.00 },
 { name: 'Cineplex Unlimited', category: 'Entertainment', logo: 'https://logo.clearbit.com/cineplex.com', cancelUrl: 'https://www.cineplex.com/CineClub', instructions: 'Go to your CineClub account settings and select Cancel.', defaultCost: 9.99 },
 { name: 'VRV', category: 'Entertainment', logo: 'https://logo.clearbit.com/vrv.co', cancelUrl: 'https://vrv.co/account', instructions: 'Go to Account Settings, select Premium Membership, and click Cancel.', defaultCost: 9.99 },
 { name: 'Funimation / Crunchyroll', category: 'Entertainment', logo: 'https://logo.clearbit.com/crunchyroll.com', cancelUrl: 'https://www.crunchyroll.com/acct/membership', instructions: 'Go to Account Settings, select Premium Membership Status, and click Cancel.', defaultCost: 7.99 },
 { name: 'FandangoNOW', category: 'Entertainment', logo: 'https://logo.clearbit.com/fandango.com', cancelUrl: 'https://www.fandango.com/account', instructions: 'Log in to your account to manage your subscriptions.', defaultCost: 5.99 },

 // 6. Gadgets, Tech, and Accessories
 { name: 'AppleCare+', category: 'Tech', logo: 'https://logo.clearbit.com/apple.com', cancelUrl: 'https://mysupport.apple.com/', instructions: 'Go to My Support, select your device, and manage your AppleCare+ plan.', defaultCost: 9.99 },
 { name: 'Samsung Care+', category: 'Tech', logo: 'https://logo.clearbit.com/samsung.com', cancelUrl: 'https://www.samsung.com/us/support/samsung-care-plus/', instructions: 'Log in to your Samsung account to manage your Care+ plan.', defaultCost: 11.99 },
 { name: 'Bose Music Subscription', category: 'Tech', logo: 'https://logo.clearbit.com/bose.com', cancelUrl: 'https://www.bose.com/en_us/my_account.html', instructions: 'Log in to your account to manage your subscriptions.', defaultCost: 9.99 },
 { name: 'Google One', category: 'Tech', logo: 'https://logo.clearbit.com/one.google.com', cancelUrl: 'https://one.google.com/settings', instructions: 'Go to Settings, select Cancel membership.', defaultCost: 1.99 },
 { name: 'Adobe Creative Cloud', category: 'Software', logo: 'https://logo.clearbit.com/adobe.com', cancelUrl: 'https://account.adobe.com/plans', instructions: 'Log in, go to Plans, click Manage Plan, select Cancel your plan.', defaultCost: 54.99 },
 { name: 'Microsoft 365', category: 'Software', logo: 'https://logo.clearbit.com/microsoft.com', cancelUrl: 'https://account.microsoft.com/services', instructions: 'Go to Services & subscriptions, select Manage, and click Cancel subscription.', defaultCost: 6.99 },
 { name: 'Amazon Kindle Unlimited', category: 'Tech', logo: 'https://logo.clearbit.com/amazon.com', cancelUrl: 'https://www.amazon.com/ku/central', instructions: 'Go to Manage your Kindle Unlimited Membership and click Cancel.', defaultCost: 11.99 },
 { name: 'PlayStation Plus', category: 'Gaming', logo: 'https://logo.clearbit.com/playstation.com', cancelUrl: 'https://store.playstation.com/', instructions: 'Go to Subscription Management in your account settings and turn off Auto-Renew.', defaultCost: 9.99 },
 { name: 'Xbox Game Pass', category: 'Gaming', logo: 'https://logo.clearbit.com/xbox.com', cancelUrl: 'https://account.microsoft.com/services', instructions: 'Go to Services & subscriptions, select Manage next to Xbox Game Pass, and click Cancel.', defaultCost: 9.99 },

  // 7. VPN Services
  { name: 'NordVPN', category: 'VPN', logo: 'https://logo.clearbit.com/nordvpn.com', cancelUrl: 'https://my.nordaccount.com/dashboard/', instructions: 'Log in, go to Billing, select Subscriptions, and click Cancel auto-renewal.', defaultCost: 11.99 },
  { name: 'ExpressVPN', category: 'VPN', logo: 'https://logo.clearbit.com/expressvpn.com', cancelUrl: 'https://www.expressvpn.com/sign-in', instructions: 'Log in, go to My Subscription, and click Manage Subscription to turn off auto-renew.', defaultCost: 12.95 },
  { name: 'Surfshark', category: 'VPN', logo: 'https://logo.clearbit.com/surfshark.com', cancelUrl: 'https://my.surfshark.com/login', instructions: 'Log in, go to Subscription, and contact support or click Cancel subscription if available.', defaultCost: 10.99 },
  { name: 'CyberGhost', category: 'VPN', logo: 'https://logo.clearbit.com/cyberghostvpn.com', cancelUrl: 'https://my.cyberghostvpn.com/login', instructions: 'Log in, go to My Subscriptions, and click Turn off auto-renewal.', defaultCost: 12.99 },
  { name: 'ProtonVPN', category: 'VPN', logo: 'https://logo.clearbit.com/protonvpn.com', cancelUrl: 'https://account.protonvpn.com/login', instructions: 'Log in, go to Dashboard, select your plan, and click Downgrade to Free.', defaultCost: 9.99 },
  { name: 'Private Internet Access', category: 'VPN', logo: 'https://logo.clearbit.com/privateinternetaccess.com', cancelUrl: 'https://www.privateinternetaccess.com/pages/client-sign-in', instructions: 'Log in, go to Subscription Overview, and click Turn Off Auto-Renewal.', defaultCost: 11.95 },
  { name: 'Mullvad VPN', category: 'VPN', logo: 'https://logo.clearbit.com/mullvad.net', cancelUrl: 'https://mullvad.net/en/account/#/login', instructions: 'Log in and manage your subscription or simply stop paying (it is prepaid).', defaultCost: 5.50 },
  { name: 'Windscribe', category: 'VPN', logo: 'https://logo.clearbit.com/windscribe.com', cancelUrl: 'https://windscribe.com/login', instructions: 'Log in, go to My Account, and click Cancel Subscription.', defaultCost: 9.00 },
  { name: 'TunnelBear', category: 'VPN', logo: 'https://logo.clearbit.com/tunnelbear.com', cancelUrl: 'https://www.tunnelbear.com/account/login', instructions: 'Log in, go to Overview, and click Cancel Subscription.', defaultCost: 9.99 },
  { name: 'IPVanish', category: 'VPN', logo: 'https://logo.clearbit.com/ipvanish.com', cancelUrl: 'https://account.ipvanish.com/', instructions: 'Log in, go to Subscription, and click I wish to cancel my subscription.', defaultCost: 10.99 },

  // 8. Dating
  { name: 'Tinder', category: 'Dating', logo: 'https://logo.clearbit.com/tinder.com', cancelUrl: 'https://tinder.com/app/settings', instructions: 'Go to Settings, scroll down to Manage Payment Account, and cancel your subscription.', defaultCost: 9.99 },

  // 9. Streaming / Gaming
  { name: 'Twitch', category: 'Gaming', logo: 'https://logo.clearbit.com/twitch.tv', cancelUrl: 'https://www.twitch.tv/subscriptions', instructions: 'Go to your Subscriptions page, click the cog icon next to the subscription, and select Don\'t Renew Subscription.', defaultCost: 4.99 },
];

const ServiceLogo = ({ logo, name, className }: { logo: string, name: string, className?: string }) => {
 const [errorCount, setErrorCount] = useState(0);
 const isUrl = logo.startsWith('http');
 
 const domainMatch = logo.match(/logo\.clearbit\.com\/(.+)/);
 const domain = domainMatch ? domainMatch[1] : null;

 const getSrc = () => {
 if (!isUrl) return null;
 if (errorCount === 0) return logo;
 if (domain) {
 if (errorCount === 1) return `https://icon.horse/icon/${domain}`;
 if (errorCount === 2) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
 }
 return null;
 };

 const src = getSrc();

 return (
 <div className={`flex items-center justify-center overflow-hidden ${className}`}>
 {src ? (
 <img 
 src={src} 
 alt={name} 
 className="w-full h-full object-contain p-1 bg-white" 
 onError={() => setErrorCount(prev => prev + 1)}
 referrerPolicy="no-referrer"
 />
 ) : (
 <span>{name.charAt(0).toUpperCase()}</span>
 )}
 </div>
 );
};

const TRANSLATIONS: Record<string, Record<string, string>> = {
 en: {
 home: 'Home',
 settings: 'Settings',
 mySubscriptions: 'My Subscriptions',
 active: 'active',
 totalMonthlySpend: 'Total Monthly Spend',
 upcomingPayments: 'Upcoming Payments',
 noSubscriptions: 'No subscriptions added yet.',
 due: 'Due',
 addSubscription: 'Add Subscription',
 searchService: 'Search for a service...',
 popularServices: 'Popular Services',
 customSubscription: 'Custom Subscription',
 cancel: 'Cancel',
 planCost: 'Plan Cost',
 nextPayment: 'Next Payment',
 status: 'Status',
 activeStatus: 'Active',
 cancelSubscription: 'Cancel Subscription',
 deepLink: 'Deep Link Cancellation',
 manualInstructions: 'Manual Instructions',
 openCancelPage: 'Open Cancellation Page',
 iveCancelled: "I've Cancelled It (Remove from Tracker)",
 account: 'Account',
 upgradePlan: 'Upgrade Plan',
 logOut: 'Log Out',
 preferences: 'Preferences',
 appearance: 'Appearance',
 language: 'Language',
 currency: 'Currency',
 light: 'Light',
 dark: 'Dark',
 proPlan: 'Pro Plan',
 premiumPlan: 'Premium Plan',
 unlimitedSubs: 'Unlimited subscriptions',
 advancedReminders: 'Advanced reminders',
 analytics: 'Analytics',
 everythingInPro: 'Everything in Pro',
 cancelAutomation: 'Cancel automation',
 priorityNotifications: 'Priority notifications',
 payWithYoco: 'Pay with Yoco',
 processing: 'Processing...',
 popular: 'Popular',
 familyMembers: 'Family Members',
 customBackground: 'Custom Background',
 premiumFeature: 'Premium Feature',
 addFamilyMember: 'Add Family Member',
 enterName: 'Enter name',
 enterImageUrl: 'Enter image URL',
 save: 'Save',
 remove: 'Remove',
 profilePicture: 'Profile Picture',
 uploadImage: 'Upload Image',
 supportAndLegal: 'Support & Legal',
 helpAndFaq: 'Help & FAQ',
 about: 'About',
 privacyPolicy: 'Privacy Policy',
 legal: 'Legal',
 },
 es: {
 home: 'Inicio',
 settings: 'Ajustes',
 mySubscriptions: 'Mis Suscripciones',
 active: 'activas',
 totalMonthlySpend: 'Gasto Mensual Total',
 upcomingPayments: 'Próximos Pagos',
 noSubscriptions: 'Aún no hay suscripciones.',
 due: 'Vence',
 addSubscription: 'Añadir Suscripción',
 searchService: 'Buscar un servicio...',
 popularServices: 'Servicios Populares',
 customSubscription: 'Suscripción Personalizada',
 cancel: 'Cancelar',
 planCost: 'Costo del Plan',
 nextPayment: 'Próximo Pago',
 status: 'Estado',
 activeStatus: 'Activo',
 cancelSubscription: 'Cancelar Suscripción',
 deepLink: 'Cancelación con Enlace Directo',
 manualInstructions: 'Instrucciones Manuales',
 openCancelPage: 'Abrir Página de Cancelación',
 iveCancelled: "Lo he cancelado (Eliminar del rastreador)",
 account: 'Cuenta',
 upgradePlan: 'Mejorar Plan',
 logOut: 'Cerrar Sesión',
 preferences: 'Preferencias',
 appearance: 'Apariencia',
 language: 'Idioma',
 currency: 'Moneda',
 light: 'Claro',
 dark: 'Oscuro',
 proPlan: 'Plan Pro',
 premiumPlan: 'Plan Premium',
 unlimitedSubs: 'Suscripciones ilimitadas',
 advancedReminders: 'Recordatorios avanzados',
 analytics: 'Analítica',
 everythingInPro: 'Todo lo de Pro',
 cancelAutomation: 'Automatización de cancelación',
 priorityNotifications: 'Notificaciones prioritarias',
 payWithYoco: 'Pagar con Yoco',
 processing: 'Procesando...',
 popular: 'Popular',
 familyMembers: 'Miembros de la familia',
 customBackground: 'Fondo personalizado',
 premiumFeature: 'Función Premium',
 addFamilyMember: 'Añadir miembro de la familia',
 enterName: 'Introduzca el nombre',
 enterImageUrl: 'Introduzca la URL de la imagen',
 save: 'Guardar',
 remove: 'Eliminar',
 profilePicture: 'Foto de perfil',
 uploadImage: 'Subir imagen',
 supportAndLegal: 'Soporte y Legal',
 helpAndFaq: 'Ayuda y FAQ',
 about: 'Acerca de',
 privacyPolicy: 'Política de Privacidad',
 legal: 'Legal',
 },
 fr: {
 home: 'Accueil',
 settings: 'Paramètres',
 mySubscriptions: 'Mes Abonnements',
 active: 'actifs',
 totalMonthlySpend: 'Dépenses Mensuelles Totales',
 upcomingPayments: 'Prochains Paiements',
 noSubscriptions: 'Aucun abonnement ajouté.',
 due: 'Dû le',
 addSubscription: 'Ajouter un Abonnement',
 searchService: 'Rechercher un service...',
 popularServices: 'Services Populaires',
 customSubscription: 'Abonnement Personnalisé',
 cancel: 'Annuler',
 planCost: 'Coût du Forfait',
 nextPayment: 'Prochain Paiement',
 status: 'Statut',
 activeStatus: 'Actif',
 cancelSubscription: 'Annuler l\'Abonnement',
 deepLink: 'Annulation par Lien Direct',
 manualInstructions: 'Instructions Manuelles',
 openCancelPage: 'Ouvrir la Page d\'Annulation',
 iveCancelled: "Je l'ai annulé (Retirer du suivi)",
 account: 'Compte',
 upgradePlan: 'Améliorer le Forfait',
 logOut: 'Se Déconnecter',
 preferences: 'Préférences',
 appearance: 'Apparence',
 language: 'Langue',
 currency: 'Devise',
 light: 'Clair',
 dark: 'Sombre',
 proPlan: 'Forfait Pro',
 premiumPlan: 'Forfait Premium',
 unlimitedSubs: 'Abonnements illimités',
 advancedReminders: 'Rappels avancés',
 analytics: 'Analytique',
 everythingInPro: 'Tout de Pro',
 cancelAutomation: 'Automatisation de l\'annulation',
 priorityNotifications: 'Notifications prioritaires',
 payWithYoco: 'Payer avec Yoco',
 processing: 'Traitement...',
 popular: 'Populaire',
 familyMembers: 'Membres de la famille',
 customBackground: 'Fond personnalisé',
 premiumFeature: 'Fonction Premium',
 addFamilyMember: 'Ajouter un membre',
 enterName: 'Entrez le nom',
 enterImageUrl: 'Entrez l\'URL de l\'image',
 save: 'Enregistrer',
 remove: 'Retirer',
 profilePicture: 'Photo de profil',
 uploadImage: 'Télécharger une image',
 supportAndLegal: 'Support et Légal',
 helpAndFaq: 'Aide et FAQ',
 about: 'À propos',
 privacyPolicy: 'Politique de Confidentialité',
 legal: 'Légal',
 },
 de: {
 home: 'Startseite',
 settings: 'Einstellungen',
 mySubscriptions: 'Meine Abonnements',
 active: 'aktiv',
 totalMonthlySpend: 'Monatliche Gesamtausgaben',
 upcomingPayments: 'Anstehende Zahlungen',
 noSubscriptions: 'Noch keine Abonnements hinzugefügt.',
 due: 'Fällig am',
 addSubscription: 'Abonnement Hinzufügen',
 searchService: 'Nach einem Dienst suchen...',
 popularServices: 'Beliebte Dienste',
 customSubscription: 'Benutzerdefiniertes Abonnement',
 cancel: 'Abbrechen',
 planCost: 'Plankosten',
 nextPayment: 'Nächste Zahlung',
 status: 'Status',
 activeStatus: 'Aktiv',
 cancelSubscription: 'Abonnement Kündigen',
 deepLink: 'Deep-Link-Kündigung',
 manualInstructions: 'Manuelle Anleitung',
 openCancelPage: 'Kündigungsseite Öffnen',
 iveCancelled: "Ich habe es gekündigt (Aus Tracker entfernen)",
 account: 'Konto',
 upgradePlan: 'Plan Aktualisieren',
 logOut: 'Abmelden',
 preferences: 'Präferenzen',
 appearance: 'Erscheinungsbild',
 language: 'Sprache',
 currency: 'Währung',
 light: 'Hell',
 dark: 'Dunkel',
 proPlan: 'Pro-Plan',
 premiumPlan: 'Premium-Plan',
 unlimitedSubs: 'Unbegrenzte Abonnements',
 advancedReminders: 'Erweiterte Erinnerungen',
 analytics: 'Analytik',
 everythingInPro: 'Alles in Pro',
 cancelAutomation: 'Kündigungsautomatisierung',
 priorityNotifications: 'Prioritätsbenachrichtigungen',
 payWithYoco: 'Mit Yoco bezahlen',
 processing: 'Wird bearbeitet...',
 popular: 'Beliebt',
 familyMembers: 'Familienmitglieder',
 customBackground: 'Benutzerdefinierter Hintergrund',
 premiumFeature: 'Premium-Funktion',
 addFamilyMember: 'Familienmitglied hinzufügen',
 enterName: 'Name eingeben',
 enterImageUrl: 'Bild-URL eingeben',
 save: 'Speichern',
 remove: 'Entfernen',
 profilePicture: 'Profilbild',
 uploadImage: 'Bild hochladen',
 supportAndLegal: 'Support & Rechtliches',
 helpAndFaq: 'Hilfe & FAQ',
 about: 'Über uns',
 privacyPolicy: 'Datenschutzrichtlinie',
 legal: 'Rechtliches',
 }
};

export function UserApp() {
 const [showSplash, setShowSplash] = useState(true);
 const [activeScreen, setActiveScreen] = useState('dashboard');
 const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
 const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
 const saved = localStorage.getItem('subpilot_subscriptions');
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch (e) {
 return [];
 }
 }
 return [
 {
 id: '1',
 name: 'Netflix',
 cost: 15.49,
 currency: '$',
 billingCycle: 'monthly',
 nextPaymentDate: '2026-03-15',
 logo: 'N',
 category: 'Streaming',
 cancelUrl: 'https://www.netflix.com/CancelPlan',
 instructions: 'Log in, go to Account, click Cancel Membership.'
 }
 ];
 });

 const [userPlan, setUserPlan] = useState(() => {
 return localStorage.getItem('subpilot_plan') || 'Free';
 });

 const [language, setLanguage] = useState(() => {
 return localStorage.getItem('subpilot_language') || 'en';
 });
 const [currency, setCurrency] = useState(() => {
 return localStorage.getItem('subpilot_currency') || 'USD';
 });

 const [customBackground, setCustomBackground] = useState(() => {
 return localStorage.getItem('subpilot_background') || '';
 });

 const [profilePicture, setProfilePicture] = useState(() => {
 return localStorage.getItem('subpilot_profile_pic') || '';
 });

 const [familyMembers, setFamilyMembers] = useState<{id: string, name: string}[]>(() => {
 const saved = localStorage.getItem('subpilot_family');
 return saved ? JSON.parse(saved) : [];
 });

 const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

 useEffect(() => {
 fetch('https://open.er-api.com/v6/latest/USD')
 .then(res => res.json())
 .then(data => {
 if (data && data.rates) {
 setExchangeRates(data.rates);
 }
 })
 .catch(err => console.error('Failed to fetch exchange rates:', err));
 }, []);

 useEffect(() => {
 const timer = setTimeout(() => {
 setShowSplash(false);
 }, 2000);
 return () => clearTimeout(timer);
 }, []);

 const handleCurrencyChange = (newCurrency: string) => {
 if (newCurrency === currency) return;
 if (exchangeRates[currency] && exchangeRates[newCurrency]) {
 const oldRate = exchangeRates[currency];
 const newRate = exchangeRates[newCurrency];
 const conversionFactor = newRate / oldRate;
 
 setSubscriptions(subs => subs.map(sub => ({
 ...sub,
 cost: sub.cost * conversionFactor
 })));
 }
 setCurrency(newCurrency);
 };

 
 useEffect(() => {
 localStorage.setItem('subpilot_language', language);
 }, [language]);

 useEffect(() => {
 localStorage.setItem('subpilot_currency', currency);
 }, [currency]);

 useEffect(() => {
 localStorage.setItem('subpilot_background', customBackground);
 }, [customBackground]);

 useEffect(() => {
 localStorage.setItem('subpilot_profile_pic', profilePicture);
 }, [profilePicture]);

 useEffect(() => {
 localStorage.setItem('subpilot_family', JSON.stringify(familyMembers));
 }, [familyMembers]);

 useEffect(() => {
 localStorage.setItem('subpilot_subscriptions', JSON.stringify(subscriptions));
 }, [subscriptions]);

 useEffect(() => {
 localStorage.setItem('subpilot_plan', userPlan);
 }, [userPlan]);

 const addSubscription = (sub: Omit<Subscription, 'id'>) => {
 const newSub = { ...sub, id: Math.random().toString(36).substr(2, 9) };
 setSubscriptions([...subscriptions, newSub]);
 setActiveScreen('dashboard');
 };

 const removeSubscription = (id: string) => {
 setSubscriptions(subscriptions.filter(s => s.id !== id));
 setActiveScreen('dashboard');
 };

 const t = (key: string) => {
 // If we have the exact language (e.g., 'es')
 if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
 return TRANSLATIONS[language][key];
 }
 // If we have a regional language (e.g., 'es-MX') but only 'es' is defined
 const baseLang = language.split('-')[0];
 if (TRANSLATIONS[baseLang] && TRANSLATIONS[baseLang][key]) {
 return TRANSLATIONS[baseLang][key];
 }
 // Fallback to English, then to the key itself
 return TRANSLATIONS['en'][key] || key;
 };

 const renderScreen = () => {
 switch (activeScreen) {
 case 'dashboard':
 return <DashboardScreen 
 subscriptions={subscriptions} 
 onNavigate={setActiveScreen} 
 onSelectSub={(sub) => { setSelectedSub(sub); setActiveScreen('details'); }} 
 currency={currency}
 t={t}
 />;
 case 'add':
 return <AddSubscriptionScreen onAdd={addSubscription} onNavigate={setActiveScreen} currency={currency} userPlan={userPlan} familyMembers={familyMembers} t={t} />;
 case 'details':
 return <SubscriptionDetailsScreen 
 sub={selectedSub} 
 onNavigate={setActiveScreen} 
 onRemove={removeSubscription}
 currency={currency}
 familyMembers={familyMembers}
 t={t}
 />;
 case 'cancel':
 return <CancelScreen sub={selectedSub} onNavigate={setActiveScreen} onRemove={removeSubscription} currency={currency} userPlan={userPlan} t={t} />;
 case 'analytics':
 return <AnalyticsScreen subscriptions={subscriptions} onNavigate={setActiveScreen} currency={currency} t={t} />;
 case 'settings':
 return <SettingsScreen 
 userPlan={userPlan} 
 onNavigate={(screen) => {
 if (screen === 'logout') {
 localStorage.removeItem('subpilot_token');
 window.location.reload();
 } else {
 setActiveScreen(screen);
 }
 }} 
 
 language={language} setLanguage={setLanguage}
 currency={currency} setCurrency={handleCurrencyChange}
 customBackground={customBackground} setCustomBackground={setCustomBackground}
 profilePicture={profilePicture} setProfilePicture={setProfilePicture}
 familyMembers={familyMembers} setFamilyMembers={setFamilyMembers}
 t={t}
 />;
 case 'upgrade':
 return <UpgradeScreen onNavigate={setActiveScreen} onUpgrade={(plan) => { setUserPlan(plan); setActiveScreen('settings'); }} currency={currency} exchangeRates={exchangeRates} t={t} />;
 default:
 return <DashboardScreen subscriptions={subscriptions} onNavigate={setActiveScreen} onSelectSub={() => {}} currency={currency} t={t} />;
 }
 };

 if (showSplash) {
 return (
 <div className={`flex items-center justify-center h-full w-full bg-neutral-100`}>
 <div className={`w-full max-w-md h-full sm:border sm:rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col items-center justify-center bg-white sm:border-neutral-200`}>
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="flex flex-col items-center gap-4"
 >
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
 className="w-24 h-24 rounded-full overflow-hidden shadow-xl"
 >
 <img
 src="/subpilot.png"
 alt="SubPilot Logo"
 className="w-full h-full object-cover"
 />
 </motion.div>
 <motion.h1 
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.3, duration: 0.5 }}
 className="text-3xl font-bold text-neutral-900 tracking-tight"
 >
 SubPilot
 </motion.h1>
 </motion.div>
 </div>
 </div>
 );
 }

 return (
 <div 
 className={`flex items-center justify-center h-full w-full bg-neutral-100`}
 style={customBackground && userPlan === 'Premium' ? {
 backgroundImage: `url(${customBackground})`,
 backgroundSize: 'cover',
 backgroundPosition: 'center'
 } : {}}
 >
 <div className={`w-full max-w-md h-full sm:border sm:rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col bg-white sm:border-neutral-200 ${customBackground && userPlan === 'Premium' ? 'bg-opacity-90 backdrop-blur-md' : ''}`}>
 {renderScreen()}
 
 {/* Bottom Navigation */}
        {(activeScreen === 'dashboard' || activeScreen === 'settings' || activeScreen === 'analytics') && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 rounded-full backdrop-blur-xl border flex items-center justify-around px-6 bg-neutral-900/95 border-neutral-800 shadow-2xl z-50">
            <button onClick={() => setActiveScreen('dashboard')} className={`flex flex-col items-center gap-1 ${activeScreen === 'dashboard' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
              <Home size={22} />
            </button>
            <button onClick={() => {
              if (userPlan === 'Free' && subscriptions.length >= 3) {
                setActiveScreen('upgrade');
              } else {
                setActiveScreen('add');
              }
            }} className="w-12 h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Plus size={24} />
            </button>
            <button onClick={() => {
              if (userPlan === 'Free') {
                setActiveScreen('upgrade');
              } else {
                setActiveScreen('analytics');
              }
            }} className={`flex flex-col items-center gap-1 ${activeScreen === 'analytics' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
              <PieChart size={22} />
            </button>
            <button onClick={() => setActiveScreen('settings')} className={`flex flex-col items-center gap-1 ${activeScreen === 'settings' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
              <Settings size={22} />
            </button>
          </div>
        )}
 </div>
 </div>
 );
}

function DashboardScreen({ subscriptions, onNavigate, onSelectSub, currency, t }: { subscriptions: Subscription[], onNavigate: (s: string) => void, onSelectSub: (s: Subscription) => void, currency: string, t: (k: string) => string }) {
 const totalMonthly = subscriptions.reduce((acc, sub) => {
 return acc + (sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12);
 }, 0);

 const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;

 const today = new Date();
 today.setHours(0, 0, 0, 0);

 const upcomingDate = new Date(today);
 upcomingDate.setDate(today.getDate() + 7);

 let dueCount = 0;
 let upcomingCount = 0;

 subscriptions.forEach(sub => {
 const paymentDate = new Date(sub.nextPaymentDate);
 paymentDate.setHours(0, 0, 0, 0);

 if (paymentDate <= today) {
 dueCount++;
 } else if (paymentDate <= upcomingDate) {
 upcomingCount++;
 }
 });

 return (
 <div className="p-6 pt-14 h-full overflow-y-auto no-scrollbar pb-32">
 <div className="flex justify-between items-center mb-8">
 <div className="flex items-center gap-3">
 <div>
 <h1 className="text-2xl font-bold text-neutral-900">{t('mySubscriptions')}</h1>
 <p className="text-neutral-500 text-sm">{subscriptions.length} {t('active')}</p>
 </div>
 </div>
 <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
 <Bell size={20} />
 </button>
 </div>

 <div className="bg-neutral-900 rounded-3xl p-6 mb-8 text-white shadow-lg shadow-neutral-900/20">
 <p className="text-neutral-400 text-xs font-semibold mb-1 uppercase tracking-widest">{t('totalMonthlySpend')}</p>
        <h2 className="text-5xl font-mono font-light mb-4 tracking-tight">{currencySymbol}{totalMonthly.toFixed(2)}</h2>
 <div className="flex flex-col gap-2">
 {dueCount > 0 && (
 <div className="flex items-center gap-2 text-sm bg-red-500/80 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
 <AlertCircle size={14} />
 <span>{dueCount} payment{dueCount !== 1 ? 's' : ''} due today or overdue</span>
 </div>
 )}
 {upcomingCount > 0 && (
 <div className="flex items-center gap-2 text-sm bg-[#09090b]/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
 <AlertCircle size={14} />
 <span>{upcomingCount} payment{upcomingCount !== 1 ? 's' : ''} upcoming this week</span>
 </div>
 )}
 {dueCount === 0 && upcomingCount === 0 && (
 <div className="flex items-center gap-2 text-sm bg-[#09090b]/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
 <CheckCircle2 size={14} />
 <span>No payments due this week</span>
 </div>
 )}
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('upcomingPayments')}</h3>
 {subscriptions.length === 0 ? (
 <div className="text-center py-10 text-neutral-500">
 {t('noSubscriptions')}
 </div>
 ) : (
 subscriptions.sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()).map((sub) => (
 <div 
 key={sub.id}
 onClick={() => onSelectSub(sub)}
 className="bg-white border border-neutral-200 rounded-3xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-sm"
 >
 <div className="flex items-center gap-4">
 <ServiceLogo logo={sub.logo} name={sub.name} className="w-12 h-12 rounded-2xl bg-neutral-100 text-xl font-bold text-neutral-900" />
 <div>
 <h4 className="font-bold text-neutral-900">{sub.name}</h4>
 <p className="text-xs text-neutral-500">{t('due')} {new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="font-bold text-neutral-900">{currencySymbol}{sub.cost.toFixed(2)}</p>
 <p className="text-xs text-neutral-500">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
}

function AddSubscriptionScreen({ onAdd, onNavigate, currency, userPlan, familyMembers, t }: { onAdd: (s: Omit<Subscription, 'id'>) => void, onNavigate: (s: string) => void, currency: string, userPlan: string, familyMembers: {id: string, name: string}[], t: (k: string) => string }) {
 const [search, setSearch] = useState('');
 const [selectedService, setSelectedService] = useState<any>(null);
 const [cost, setCost] = useState('');
 const [nextPaymentDate, setNextPaymentDate] = useState('');
 const [familyMemberId, setFamilyMemberId] = useState<string>('');

 const filtered = PREDEFINED_SERVICES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
 const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;

 const handleAdd = () => {
 if (!selectedService || !cost || !nextPaymentDate) return;
 onAdd({
 name: selectedService.name,
 cost: parseFloat(cost),
 currency: currencySymbol,
 billingCycle: 'monthly',
 nextPaymentDate,
 logo: selectedService.logo,
 category: selectedService.category,
 cancelUrl: selectedService.cancelUrl,
 instructions: selectedService.instructions,
 familyMemberId: familyMemberId || undefined
 });
 };

 if (selectedService) {
 return (
 <div className="p-6 pt-14 h-full flex flex-col">
 <div className="flex items-center gap-4 mb-8">
 <button onClick={() => setSelectedService(null)} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <h1 className="text-xl font-bold text-neutral-900">Add {selectedService.name}</h1>
 </div>

 <div className="space-y-6 flex-1">
 <div>
 <label className="block text-sm font-medium text-neutral-500 mb-2">Monthly Cost ({currencySymbol})</label>
 <input 
 type="number" 
 value={cost} 
 onChange={(e) => setCost(e.target.value)}
 placeholder={selectedService.defaultCost.toString()}
 className="w-full bg-neutral-100 border border-neutral-200 rounded-2xl p-4 text-neutral-900 focus:outline-none focus:border-neutral-900"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-neutral-500 mb-2">Next Payment Date</label>
 <input 
 type="date" 
 value={nextPaymentDate}
 onChange={(e) => setNextPaymentDate(e.target.value)}
 className="w-full bg-neutral-100 border border-neutral-200 rounded-2xl p-4 text-neutral-900 focus:outline-none focus:border-neutral-900"
 />
 </div>
 {userPlan === 'Premium' && familyMembers.length > 0 && (
 <div>
 <label className="block text-sm font-medium text-neutral-500 mb-2">Assign to Family Member</label>
 <select 
 value={familyMemberId}
 onChange={(e) => setFamilyMemberId(e.target.value)}
 className="w-full bg-neutral-100 border border-neutral-200 rounded-2xl p-4 text-neutral-900 focus:outline-none focus:border-neutral-900 appearance-none"
 >
 <option value="">None (Me)</option>
 {familyMembers.map(member => (
 <option key={member.id} value={member.id}>{member.name}</option>
 ))}
 </select>
 </div>
 )}
 </div>

 <button 
 onClick={handleAdd}
 disabled={!cost || !nextPaymentDate}
 className="w-full py-4 rounded-2xl bg-neutral-900 text-white font-bold disabled:opacity-50 mt-auto"
 >
 {t('addSubscription')}
 </button>
 </div>
 );
 }

 return (
 <div className="p-6 pt-14 h-full flex flex-col">
 <div className="flex items-center gap-4 mb-8">
 <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <div className="flex items-center gap-3">
 <h1 className="text-xl font-bold text-neutral-900">{t('addSubscription')}</h1>
 </div>
 </div>

 <div className="relative mb-6">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
 <input 
 type="text" 
 placeholder={t('searchService')}
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full bg-neutral-100 border border-neutral-200 rounded-3xl py-4 pl-12 pr-4 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900"
 />
 </div>

 <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
 {filtered.map((service, idx) => (
 <div 
 key={idx} 
 onClick={() => {
 setSelectedService(service);
 setCost(service.defaultCost.toString());
 }}
 className="bg-white border border-neutral-200 rounded-3xl p-4 flex items-center gap-4 cursor-pointer :bg-white/10 hover:bg-neutral-50 transition-colors shadow-sm"
 >
 <ServiceLogo logo={service.logo} name={service.name} className="w-12 h-12 rounded-2xl bg-neutral-100 text-xl font-bold text-neutral-900" />
 <div>
 <h4 className="font-bold text-neutral-900">{service.name}</h4>
 <p className="text-xs text-neutral-500">{service.category}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

function SubscriptionDetailsScreen({ sub, onNavigate, onRemove, currency, familyMembers, t }: { sub: Subscription | null, onNavigate: (s: string) => void, onRemove: (id: string) => void, currency: string, familyMembers: {id: string, name: string}[], t: (k: string) => string }) {
 if (!sub) return null;

 const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;
 const assignedMember = sub.familyMemberId ? familyMembers.find(m => m.id === sub.familyMemberId) : null;

 return (
 <div className="p-6 pt-14 h-full flex flex-col">
 <div className="flex items-center justify-between mb-8">
 <button onClick={() => onNavigate('dashboard')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <button onClick={() => onRemove(sub.id)} className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
 <Trash2 size={20} />
 </button>
 </div>

 <div className="flex flex-col items-center mb-8">
 <ServiceLogo logo={sub.logo} name={sub.name} className="w-24 h-24 rounded-3xl bg-neutral-100 text-4xl font-bold text-neutral-900 mb-4 shadow-xl" />
 <h1 className="text-3xl font-bold text-neutral-900 mb-1">{sub.name}</h1>
 <p className="text-neutral-500">{sub.category}</p>
 </div>

 <div className="bg-white border border-neutral-200 rounded-3xl p-6 mb-8 shadow-sm">
 <div className="flex justify-between items-center mb-6">
 <span className="text-neutral-500">{t('planCost')}</span>
 <span className="text-xl font-bold text-neutral-900">{currencySymbol}{sub.cost.toFixed(2)}<span className="text-sm text-neutral-500 font-normal">/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></span>
 </div>
 <div className="flex justify-between items-center mb-6">
 <span className="text-neutral-500">{t('nextPayment')}</span>
 <span className="text-neutral-900 font-medium">{new Date(sub.nextPaymentDate).toLocaleDateString()}</span>
 </div>
 {assignedMember && (
 <div className="flex justify-between items-center mb-6">
 <span className="text-neutral-500">{t('familyMembers')}</span>
 <span className="text-neutral-900 font-medium flex items-center gap-2">
 <Users size={14} className="text-neutral-900" />
 {assignedMember.name}
 </span>
 </div>
 )}
 <div className="flex justify-between items-center">
 <span className="text-neutral-500">{t('status')}</span>
 <span className="px-3 py-1 rounded-full bg-neutral-900/20 text-neutral-900 text-xs font-bold uppercase tracking-wider">{t('activeStatus')}</span>
 </div>
 </div>

 <div className="mt-auto space-y-3">
 <button 
 onClick={() => onNavigate('cancel')}
 className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20"
 >
 {t('cancelSubscription')}
 </button>
 </div>
 </div>
 );
}

function CancelScreen({ sub, onNavigate, onRemove, currency, userPlan, t }: { sub: Subscription | null, onNavigate: (s: string) => void, onRemove: (id: string) => void, currency: string, userPlan: string, t: (k: string) => string }) {
 const [isCancelling, setIsCancelling] = useState(false);
 
 if (!sub) return null;

 const handleAutomatedCancel = () => {
 setIsCancelling(true);
 setTimeout(() => {
 setIsCancelling(false);
 onRemove(sub.id);
 alert('Subscription successfully cancelled via automation!');
 }, 2000);
 };

 return (
 <div className="p-6 pt-14 h-full flex flex-col">
 <div className="flex items-center gap-4 mb-8">
 <button onClick={() => onNavigate('details')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <h1 className="text-xl font-bold text-neutral-900">{t('cancel')} {sub.name}</h1>
 </div>

 <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 mb-8 flex items-start gap-3">
 <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
 <p className="text-sm text-amber-600 leading-relaxed">
 Cancelling will stop future payments. You will still have access until the end of your current billing cycle ({new Date(sub.nextPaymentDate).toLocaleDateString()}).
 </p>
 </div>

 <div className="space-y-6">
 {userPlan === 'Premium' && (
 <div className="bg-neutral-900 rounded-3xl p-6 shadow-lg shadow-neutral-700/20 text-white">
 <h3 className="font-bold mb-2 flex items-center gap-2">
 <Settings size={18} /> {t('cancelAutomation')}
 </h3>
 <p className="text-sm text-teal-100 mb-4">
 As a Premium member, we can automatically cancel this subscription for you.
 </p>
 <button 
 onClick={handleAutomatedCancel}
 disabled={isCancelling}
 className="w-full py-3 rounded-2xl bg-white text-neutral-800 font-bold flex items-center justify-center gap-2"
 >
 {isCancelling ? 'Cancelling...' : 'Cancel For Me'}
 </button>
 </div>
 )}

 {sub.cancelUrl && (
 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
 <h3 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
 <ExternalLink size={18} className="text-blue-500" /> {t('deepLink')}
 </h3>
 <p className="text-sm text-neutral-500 mb-4">
 We found the direct cancellation page for {sub.name}. Tap below to open it in your browser.
 </p>
 <a 
 href={sub.cancelUrl} 
 target="_blank" 
 rel="noreferrer"
 className="w-full py-3 rounded-2xl bg-blue-500 text-white font-bold flex items-center justify-center gap-2"
 >
 {t('openCancelPage')}
 </a>
 </div>
 )}

 {sub.instructions && (
 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
 <h3 className="font-bold text-neutral-900 mb-2">{t('manualInstructions')}</h3>
 <p className="text-sm text-neutral-500 leading-relaxed">
 {sub.instructions}
 </p>
 </div>
 )}
 </div>

 <div className="mt-auto pt-6">
 <button 
 onClick={() => {
 onRemove(sub.id);
 alert(`${sub.name} has been removed from your tracker.`);
 }}
 className="w-full py-4 rounded-2xl bg-neutral-200 text-neutral-900 font-bold"
 >
 {t('iveCancelled')}
 </button>
 </div>
 </div>
 );
}

function SettingsScreen({ 
 userPlan, 
 onNavigate,
  language,
 setLanguage,
 currency,
 setCurrency,
 customBackground,
 setCustomBackground,
 profilePicture,
 setProfilePicture,
 familyMembers,
 setFamilyMembers,
 t
}: { 
 userPlan: string, 
 onNavigate: (s: string) => void,
  language: string,
 setLanguage: (l: string) => void,
 currency: string,
 setCurrency: (c: string) => void,
 customBackground: string,
 setCustomBackground: (bg: string) => void,
 profilePicture: string,
 setProfilePicture: (pic: string) => void,
 familyMembers: {id: string, name: string}[],
 setFamilyMembers: (members: {id: string, name: string}[]) => void,
 t: (key: string) => string
}) {
 const [modalType, setModalType] = useState<'none' | 'language' | 'currency' | 'background' | 'family' | 'profile'>('none');
 const [expandedSection, setExpandedSection] = useState<'none' | 'help' | 'about' | 'privacy' | 'legal'>('none');
 const [searchQuery, setSearchQuery] = useState('');
 const [newFamilyMember, setNewFamilyMember] = useState('');
 const [newBackgroundUrl, setNewBackgroundUrl] = useState('');
 const [newProfilePicUrl, setNewProfilePicUrl] = useState('');

 const filteredLanguages = LANGUAGES.filter(l => 
 l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 l.native.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const filteredCurrencies = CURRENCIES.filter(c => 
 c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 c.code.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
 <div className="p-6 pt-14 h-full flex flex-col pb-32 overflow-y-auto no-scrollbar relative">
 <div className="flex items-center gap-3 mb-8">
 <h1 className="text-2xl font-bold text-neutral-900">{t('settings')}</h1>
 </div>

 <div className="space-y-8">
 {/* Profile */}
 <div className="flex items-center gap-4">
 <div 
 className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-xl font-bold text-white overflow-hidden cursor-pointer relative group"
 onClick={() => { setModalType('profile'); setNewProfilePicUrl(profilePicture); }}
 >
 {profilePicture ? (
 <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
 ) : (
 <span>JD</span>
 )}
 <div className="absolute inset-0 bg-[#09090b]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <ImageIcon size={20} className="text-white" />
 </div>
 </div>
 <div>
 <h3 className="font-bold text-neutral-900 text-lg">John Doe</h3>
 <p className="text-neutral-500">john@example.com</p>
 <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900/20 text-neutral-900">
 {userPlan} Plan
 </span>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{t('preferences')}</h4>
 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
 
 {/* Theme Toggle */}
 

 {/* Language Selection */}
 <div className="flex justify-between items-center p-4 border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 :bg-white/5" onClick={() => { setModalType('language'); setSearchQuery(''); }}>
 <div className="flex items-center gap-3">
 <Globe size={18} className="text-neutral-900" />
 <span className="text-neutral-900">{t('language')}</span>
 </div>
 <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
 <span>{LANGUAGES.find(l => l.code === language)?.name || language}</span>
 <ChevronRight size={16} />
 </div>
 </div>

 {/* Currency Selection */}
 <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-50 :bg-white/5" onClick={() => { setModalType('currency'); setSearchQuery(''); }}>
 <div className="flex items-center gap-3">
 <DollarSign size={18} className="text-neutral-900" />
 <span className="text-neutral-900">{t('currency')}</span>
 </div>
 <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
 <span>{currency} ({CURRENCIES.find(c => c.code === currency)?.symbol || currency})</span>
 <ChevronRight size={16} />
 </div>
 </div>

 </div>
 </div>

 {userPlan === 'Premium' && (
 <div>
 <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
 <CheckCircle2 size={14} /> {t('premiumFeature')}
 </h4>
 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
 <div className="flex justify-between items-center p-4 border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 :bg-white/5" onClick={() => { setModalType('background'); setNewBackgroundUrl(customBackground); }}>
 <div className="flex items-center gap-3">
 <ImageIcon size={18} className="text-neutral-900" />
 <span className="text-neutral-900">{t('customBackground')}</span>
 </div>
 <ChevronRight size={16} className="text-neutral-400"/>
 </div>
 <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-50 :bg-white/5" onClick={() => { setModalType('family'); setNewFamilyMember(''); }}>
 <div className="flex items-center gap-3">
 <Users size={18} className="text-neutral-900" />
 <span className="text-neutral-900">{t('familyMembers')}</span>
 </div>
 <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
 <span>{familyMembers.length}</span>
 <ChevronRight size={16} />
 </div>
 </div>
 </div>
 </div>
 )}

 <div>
 <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{t('supportAndLegal')}</h4>
 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
 <div className="flex flex-col border-b border-neutral-200">
 <div className="flex justify-between items-center p-4 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => setExpandedSection(expandedSection === 'help' ? 'none' : 'help')}>
 <span className="text-neutral-900">{t('helpAndFaq')}</span>
 <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expandedSection === 'help' ? 'rotate-90' : ''}`}/>
 </div>
 {expandedSection === 'help' && (
 <div className="p-4 pt-0 space-y-4 text-neutral-600 text-sm leading-relaxed bg-neutral-50 ">
 <div>
 <h3 className="font-bold text-neutral-900 mb-1">How do I add a subscription?</h3>
 <p>Go to the Home screen and tap the "+" button in the bottom navigation bar. You can search for popular services or add a custom one.</p>
 </div>
 <div>
 <h3 className="font-bold text-neutral-900 mb-1">How do I cancel a subscription?</h3>
 <p>Tap on any subscription from your dashboard, then tap "Cancel Subscription". We provide deep links and instructions to help you cancel on the provider's website.</p>
 </div>
 <div>
 <h3 className="font-bold text-neutral-900 mb-1">How does currency conversion work?</h3>
 <p>You can change your preferred currency in Settings. We use real-time exchange rates to convert all your subscription costs to your chosen currency.</p>
 </div>
 <div>
 <h3 className="font-bold text-neutral-900 mb-1">What is included in the Premium plan?</h3>
 <p>Premium includes unlimited subscriptions, advanced reminders, analytics, custom backgrounds, and the ability to assign subscriptions to family members.</p>
 </div>
 </div>
 )}
 </div>
 
 <div className="flex flex-col border-b border-neutral-200">
 <div className="flex justify-between items-center p-4 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => setExpandedSection(expandedSection === 'about' ? 'none' : 'about')}>
 <span className="text-neutral-900">{t('about')}</span>
 <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expandedSection === 'about' ? 'rotate-90' : ''}`}/>
 </div>
 {expandedSection === 'about' && (
 <div className="p-4 pt-0 space-y-4 text-neutral-600 text-sm leading-relaxed bg-neutral-50 ">
 <h3 className="font-bold text-neutral-900 text-center text-lg mt-4">SubPilot</h3>
 <p className="text-center mb-4 text-xs">Version 1.0.0</p>
 <p>SubPilot is your ultimate subscription management companion. We help you track your recurring expenses, get reminded of upcoming payments, and easily cancel services you no longer need.</p>
 <p>Built with for users who want to take control of their finances.</p>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="font-medium text-neutral-900 mb-1">Contact Us</p>
                  <p>Email: <a href="mailto:subs1pilot@gmail.com" className="text-blue-600 hover:underline">subs1pilot@gmail.com</a></p>
                </div>
              </div>
 )}
 </div>

 <div className="flex flex-col border-b border-neutral-200">
 <div className="flex justify-between items-center p-4 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => setExpandedSection(expandedSection === 'privacy' ? 'none' : 'privacy')}>
 <span className="text-neutral-900">{t('privacyPolicy')}</span>
 <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expandedSection === 'privacy' ? 'rotate-90' : ''}`}/>
 </div>
 {expandedSection === 'privacy' && (
 <div className="p-4 pt-0 space-y-4 text-neutral-600 text-sm leading-relaxed bg-neutral-50 ">
 <p className="text-xs mb-2">Last updated: March 2026</p>
 <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.</p>
 <h4 className="font-bold text-neutral-900 mt-4">1. Information We Collect</h4>
 <p>We collect information you provide directly to us, such as subscription details, costs, and preferences. All data is stored locally on your device unless you sync it with an account.</p>
 <h4 className="font-bold text-neutral-900 mt-4">2. How We Use Your Information</h4>
 <p>We use the information to provide, maintain, and improve our services, including calculating your total spend and sending payment reminders.</p>
 <h4 className="font-bold text-neutral-900 mt-4">3. Data Security</h4>
 <p>We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.</p>
 </div>
 )}
 </div>

 <div className="flex flex-col">
 <div className="flex justify-between items-center p-4 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => setExpandedSection(expandedSection === 'legal' ? 'none' : 'legal')}>
 <span className="text-neutral-900">{t('legal')}</span>
 <ChevronRight size={16} className={`text-neutral-400 transition-transform ${expandedSection === 'legal' ? 'rotate-90' : ''}`}/>
 </div>
 {expandedSection === 'legal' && (
 <div className="p-4 pt-0 space-y-4 text-neutral-600 text-sm leading-relaxed bg-neutral-50 ">
 <p className="text-xs mb-2">Last updated: March 2026</p>
 <p>By using SubPilot, you agree to these Terms of Service.</p>
 <h4 className="font-bold text-neutral-900 mt-4">1. Use of Service</h4>
 <p>You must use the service in compliance with all applicable laws. You are responsible for maintaining the confidentiality of your account.</p>
 <h4 className="font-bold text-neutral-900 mt-4">2. Subscriptions and Billing</h4>
 <p>SubPilot helps you track subscriptions, but we do not process payments for third-party services. You are responsible for managing your actual subscriptions with the respective providers.</p>
 <h4 className="font-bold text-neutral-900 mt-4">3. Limitation of Liability</h4>
 <p>SubPilot is not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
 </div>
 )}
 </div>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{t('account')}</h4>
 <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
 <div className="flex justify-between items-center p-4 border-b border-neutral-200 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => onNavigate('upgrade')}>
 <span className="text-neutral-900">{t('upgradePlan')}</span>
 <ChevronRight size={16} className="text-neutral-400"/>
 </div>
 <div className="flex justify-between items-center p-4 cursor-pointer :bg-white/5 hover:bg-neutral-50" onClick={() => onNavigate('logout')}>
 <span className="text-red-500">{t('logOut')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Modal Overlay */}
 {modalType !== 'none' && (
 <div className="absolute inset-0 z-50 bg-neutral-100 flex flex-col">
 <div className="p-6 pt-14 border-b border-neutral-200 flex items-center gap-4 bg-white ">
 <button onClick={() => setModalType('none')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <h2 className="text-xl font-bold text-neutral-900">
 {modalType === 'language' ? 'Select Language' : 
 modalType === 'currency' ? 'Select Currency' : 
 modalType === 'background' ? t('customBackground') : 
 modalType === 'profile' ? t('profilePicture') : 
 t('familyMembers')}
 </h2>
 </div>
 {(modalType === 'language' || modalType === 'currency') && (
 <div className="p-4 bg-white border-b border-neutral-200">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
 <input
 type="text"
 placeholder="Search..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-neutral-100 border-none rounded-2xl py-3 pl-12 pr-4 text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none"
 autoFocus
 />
 </div>
 </div>
 )}
 <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-100 ">
 {modalType === 'profile' ? (
 <div className="space-y-4">
 <div className="flex flex-col items-center gap-4 py-4">
 {newProfilePicUrl ? (
 <img src={newProfilePicUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-neutral-900/20" />
 ) : (
 <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
 <ImageIcon size={40} />
 </div>
 )}
 <label className="cursor-pointer bg-neutral-200 hover:bg-neutral-300 :bg-white/10 text-neutral-900 px-4 py-2 rounded-lg font-medium transition-colors">
 {t('uploadImage')}
 <input 
 type="file" 
 accept="image/png, image/jpeg" 
 className="hidden" 
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onloadend = () => {
 setNewProfilePicUrl(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 }}
 />
 </label>
 </div>
 <button 
 onClick={() => { setProfilePicture(newProfilePicUrl); setModalType('none'); }}
 className="w-full py-3 rounded-2xl bg-neutral-900 text-white font-bold"
 >
 {t('save')}
 </button>
 <button 
 onClick={() => { setProfilePicture(''); setNewProfilePicUrl(''); setModalType('none'); }}
 className="w-full py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold"
 >
 {t('remove')}
 </button>
 </div>
 ) : modalType === 'background' ? (
 <div className="space-y-4">
 <input
 type="text"
 placeholder={t('enterImageUrl')}
 value={newBackgroundUrl}
 onChange={(e) => setNewBackgroundUrl(e.target.value)}
 className="w-full bg-white border border-neutral-200 rounded-2xl py-3 px-4 text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none"
 />
 <button 
 onClick={() => { setCustomBackground(newBackgroundUrl); setModalType('none'); }}
 className="w-full py-3 rounded-2xl bg-neutral-900 text-white font-bold"
 >
 {t('save')}
 </button>
 <button 
 onClick={() => { setCustomBackground(''); setModalType('none'); }}
 className="w-full py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold"
 >
 {t('remove')}
 </button>
 </div>
 ) : modalType === 'family' ? (
 <div className="space-y-4">
 <div className="flex gap-2">
 <input
 type="text"
 placeholder={t('enterName')}
 value={newFamilyMember}
 onChange={(e) => setNewFamilyMember(e.target.value)}
 className="flex-1 bg-white border border-neutral-200 rounded-2xl py-3 px-4 text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none"
 />
 <button 
 onClick={() => {
 if (newFamilyMember.trim()) {
 setFamilyMembers([...familyMembers, { id: Math.random().toString(36).substr(2, 9), name: newFamilyMember.trim() }]);
 setNewFamilyMember('');
 }
 }}
 className="px-6 rounded-2xl bg-neutral-900 text-white font-bold"
 >
 {t('addFamilyMember')}
 </button>
 </div>
 <div className="space-y-2 mt-4">
 {familyMembers.map(member => (
 <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl">
 <span className="text-neutral-900 font-medium">{member.name}</span>
 <button 
 onClick={() => setFamilyMembers(familyMembers.filter(m => m.id !== member.id))}
 className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
 >
 <Trash2 size={18} />
 </button>
 </div>
 ))}
 {familyMembers.length === 0 && (
 <p className="text-center text-neutral-500 py-4">No family members added yet.</p>
 )}
 </div>
 </div>
 ) : modalType === 'language' ? (
 filteredLanguages.map(l => (
 <div 
 key={l.code} 
 onClick={() => { setLanguage(l.code); setModalType('none'); }}
 className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${language === l.code ? 'bg-neutral-900/10 border border-neutral-900/20' : 'bg-white border border-transparent hover:border-neutral-200 :border-white/10'}`}
 >
 <div>
 <p className="font-bold text-neutral-900">{l.name}</p>
 <p className="text-sm text-neutral-500">{l.native}</p>
 </div>
 {language === l.code && <CheckCircle2 className="text-neutral-900" size={20} />}
 </div>
 ))
 ) : (
 filteredCurrencies.map(c => (
 <div 
 key={c.code} 
 onClick={() => { setCurrency(c.code); setModalType('none'); }}
 className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${currency === c.code ? 'bg-neutral-900/10 border border-neutral-900/20' : 'bg-white border border-transparent hover:border-neutral-200 :border-white/10'}`}
 >
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-900">
 {c.symbol}
 </div>
 <div>
 <p className="font-bold text-neutral-900">{c.code}</p>
 <p className="text-sm text-neutral-500">{c.name}</p>
 </div>
 </div>
 {currency === c.code && <CheckCircle2 className="text-neutral-900" size={20} />}
 </div>
 ))
 )}
 </div>
 </div>
 )}
 </div>
 );
}

function UpgradeScreen({ onNavigate, onUpgrade, currency, exchangeRates, t }: { onNavigate: (s: string) => void, onUpgrade: (plan: string) => void, currency: string, exchangeRates: Record<string, number>, t: (k: string) => string }) {
 const [loading, setLoading] = useState(false);

 const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;
 const multiplier = exchangeRates[currency] || (currency === 'ZAR' ? 18 : currency === 'EUR' ? 0.9 : currency === 'GBP' ? 0.8 : 1);
 const proPrice = Math.round(7 * multiplier);
 const premiumPrice = Math.round(15 * multiplier);

 const handleYocoPayment = (planName: string, amountInCents: number) => {
 // Easiest Way: Use Yoco Payment Links if configured
 const proLink = (import.meta as any).env.VITE_YOCO_PRO_LINK || 'https://pay.yoco.com/r/4Zrx1L';
 const premiumLink = (import.meta as any).env.VITE_YOCO_PREMIUM_LINK || 'https://pay.yoco.com/r/2Y9Pgk';

 if (planName === 'Pro' && proLink) {
 window.open(proLink, '_blank');
 return;
 }
 if (planName === 'Premium' && premiumLink) {
 window.open(premiumLink, '_blank');
 return;
 }

 // Fallback to SDK
 setLoading(true);
 
 if (!document.getElementById('yoco-sdk')) {
 const script = document.createElement('script');
 script.id = 'yoco-sdk';
 script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
 script.onload = () => initYoco(planName, amountInCents);
 document.body.appendChild(script);
 } else {
 initYoco(planName, amountInCents);
 }
 };

 const initYoco = (planName: string, amountInCents: number) => {
 // @ts-ignore
 const yoco = new window.YocoSDK({
 // @ts-ignore
 publicKey: (import.meta as any).env.VITE_YOCO_PUBLIC_KEY || 'pk_test_ed3c54a6gOol69qa7f45' // Fallback to test key if not set
 });

 yoco.showPopup({
 amountInCents: amountInCents,
 currency: currency === 'ZAR' ? 'ZAR' : 'USD', // Yoco primarily supports ZAR, but we can pass USD for testing if needed
 name: 'SubPilot',
 description: planName,
 callback: async function (result: any) {
 if (result.error) {
 setLoading(false);
 alert("Payment failed: " + result.error.message);
 } else {
 try {
 // Send the token to our backend to finalize the charge
 const res = await fetch('/api/pay/yoco', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 token: result.id,
 amountInCents: amountInCents,
 currency: currency === 'ZAR' ? 'ZAR' : 'USD'
 })
 });

 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error || 'Payment processing failed');
 }

 alert("Payment successful! Welcome to " + planName);
 onUpgrade(planName);
 } catch (err: any) {
 alert("Error finalizing payment: " + err.message);
 } finally {
 setLoading(false);
 }
 }
 }
 });
 };

 return (
 <div className="p-6 pt-14 h-full flex flex-col overflow-y-auto no-scrollbar">
 <div className="flex items-center gap-4 mb-8">
 <button onClick={() => onNavigate('settings')} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
 <ArrowLeft size={20} />
 </button>
 <h1 className="text-xl font-bold text-neutral-900">{t('upgradePlan')}</h1>
 </div>

 <div className="space-y-4 mb-auto pb-6">
 {/* Pro Plan */}
 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('proPlan')}</h3>
 <p className="text-3xl font-bold text-neutral-900 mb-4">{currencySymbol}{proPrice}<span className="text-sm text-neutral-500">/{t('mo') || 'mo'}</span></p>
 <ul className="space-y-2 mb-6 text-sm text-neutral-600">
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-900"/> {t('unlimitedSubs')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-900"/> {t('advancedReminders')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-900"/> {t('analytics')}</li>
 </ul>
 <button 
 onClick={() => handleYocoPayment('Pro', proPrice * 100)}
 className="w-full py-3 rounded-2xl bg-neutral-900 text-white font-bold"
 disabled={loading}
 >
 {loading ? t('processing') : t('payWithYoco')}
 </button>
 </div>

 {/* Premium Plan */}
 <div className="bg-neutral-100 border border-neutral-300 rounded-3xl p-6 relative overflow-hidden shadow-sm">
 <div className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">{t('popular')}</div>
 <h3 className="text-xl font-bold text-neutral-900 mb-2">{t('premiumPlan')}</h3>
 <p className="text-3xl font-bold text-neutral-700 mb-4">{currencySymbol}{premiumPrice}<span className="text-sm text-neutral-500">/{t('mo') || 'mo'}</span></p>
 <ul className="space-y-2 mb-6 text-sm text-neutral-600">
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-700"/> {t('everythingInPro')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-700"/> {t('cancelAutomation')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-700"/> {t('priorityNotifications')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-700"/> {t('familyMembers')}</li>
 <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-700"/> {t('customBackground')}</li>
 </ul>
 <button 
 onClick={() => handleYocoPayment('Premium', premiumPrice * 100)}
 className="w-full py-3 rounded-2xl bg-neutral-700 text-white font-bold"
 disabled={loading}
 >
 {loading ? t('processing') : t('payWithYoco')}
 </button>
 </div>
 </div>
 </div>
 );
}

function AnalyticsScreen({ subscriptions, onNavigate, currency, t }: { subscriptions: Subscription[], onNavigate: (s: string) => void, currency: string, t: (k: string) => string }) {
 const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || currency;
 
 const totalMonthly = subscriptions.reduce((acc, sub) => {
 return acc + (sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12);
 }, 0);

 const categoryTotals = subscriptions.reduce((acc, sub) => {
 const cost = sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12;
 acc[sub.category] = (acc[sub.category] || 0) + cost;
 return acc;
 }, {} as Record<string, number>);

 const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

 return (
 <div className="p-6 pt-14 h-full overflow-y-auto no-scrollbar pb-32">
 <div className="flex items-center gap-3 mb-8">
 <h1 className="text-2xl font-bold text-neutral-900">{t('analytics')}</h1>
 </div>

 <div className="bg-white border border-neutral-200 rounded-3xl p-6 mb-6 shadow-sm">
 <h3 className="text-sm font-medium text-neutral-500 mb-4">Spending by Category</h3>
 
 {sortedCategories.length > 0 ? (
 <div className="space-y-4">
 {sortedCategories.map(([category, amount]) => {
 const percentage = Math.round((amount / totalMonthly) * 100);
 return (
 <div key={category} className="mb-4">
 <div className="flex justify-between text-sm mb-2">
 <span className="text-neutral-900 font-medium">{category}</span>
 <span className="text-neutral-500">{currencySymbol}{amount.toFixed(2)} ({percentage}%)</span>
 </div>
 <div className="w-full bg-neutral-100 rounded-full h-2">
 <div 
 className="bg-neutral-900 h-2 rounded-full" 
 style={{ width: `${percentage}%` }}
 ></div>
 </div>
 </div>
 );
 })}
 </div>
 ) : (
 <p className="text-neutral-500 text-sm">No data available yet.</p>
 )}
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-sm font-medium text-neutral-500 mb-2">Total Yearly</h3>
 <p className="text-xl font-bold text-neutral-900">{currencySymbol}{(totalMonthly * 12).toFixed(2)}</p>
 </div>
 <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
 <h3 className="text-sm font-medium text-neutral-500 mb-2">Active Subs</h3>
 <p className="text-xl font-bold text-neutral-900">{subscriptions.length}</p>
 </div>
 </div>
 </div>
 );
}
