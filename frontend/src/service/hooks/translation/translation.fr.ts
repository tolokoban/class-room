const FR = {
  // Generic errors (frontend/src/service/calls/service.ts)
  all1: "Format de réponse inattendu.",

  // user/login
  all10101: "Données invalides.",
  all10102: "Identifiant inconnu ou mot de passe erroné.",

  // class/add
  all20101: "Données invalides.",
  all20102: "Ce code est déjà utilisé par une autre classe.",
  all20103: "Erreur de base de données lors de la création de la classe.",

  // activity/result-set
  all30101: "Données invalides.",
  all30102: "Cette classe n'existe pas.",
  all30103: "Ce pseudo est déjà utilisé sur un autre ordinateur.",
  all30104: "Erreur de base de données lors de l'enregistrement du résultat.",

  // activity/result-all
  all30201: "Données invalides.",
  all30202: "Cette classe n'existe pas.",
  all30203: "Vous n'êtes pas le propriétaire de cette classe.",

  // activity/clear
  all30301: "Données invalides.",
  all30302: "Cette classe n'existe pas.",
  all30303: "Vous n'êtes pas le propriétaire de cette classe.",
  all30304: "Erreur de base de données lors de la suppression des résultats.",

  // activity/current
  all30401: "Données invalides.",
  all30402: "Cette classe n'existe pas.",
} satisfies Record<string, string>;

export default FR;
