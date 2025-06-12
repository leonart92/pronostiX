// services/index.js - Version corrigée pour vos exports nommés
import { api } from './api';
import { authService } from './auth.service';
import { userService } from './user.service';
import { pronosticService } from './pronostic.service';
import { subscriptionService } from './subscription.service';
import { adminService } from './admin.service';
import { contactService} from "./contact.service";

// Re-exports nommés
export { api };
export { authService };
export { userService };
export { pronosticService };
export { subscriptionService };
export { adminService };
export { contactService };

// Export par défaut pour faciliter l'utilisation
export default {
    api,
    auth: authService,
    user: userService,
    pronostic: pronosticService,
    subscription: subscriptionService,
    admin: adminService,
    contact: contactService
};
