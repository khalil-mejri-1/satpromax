// Configuration pour l'URL de l'API
// Vous pouvez changer cette URL ici pour qu'elle se mette à jour dans tout le site.

// Détection automatique : Si on est en local, utiliser localhost, sinon utiliser l'URL de production.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isLocal
    ? 'http://localhost:3000'
    : 'https://Satpromax.com';

// Si vous voulez forcer une URL spécifique, décommentez la ligne ci-dessous :
// export const API_BASE_URL = 'https://votre-nouveau-domaine.com';

export const SITE_URL = 'https://Satpromax.com'; // URL du frontend (pour SEO, liens absolus, etc.)
