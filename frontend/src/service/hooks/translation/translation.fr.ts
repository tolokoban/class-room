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
  all20401: "Données invalides.",
  all20402: "Cette classe n'existe pas.",
  all20403: "Vous n'êtes pas le propriétaire de cette classe.",
  all20404: "Erreur de base de données lors de la suppression de la classe.",

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

  // activity/current-set
  all30501: "Données invalides.",
  all30502: "Cette classe n'existe pas.",
  all30503: "Vous n'êtes pas le propriétaire de cette classe.",
  all30504: "Erreur de base de données lors du choix de l'activité courante.",

  // room/enter
  all40101: "Données invalides.",
  all40102: "Cette classe n'existe pas.",
  all40103: "Erreur de base de données lors de l'entrée dans la classe.",

  // room/students
  all40201: "Données invalides.",
  all40202: "Cette classe n'existe pas.",
  all40203: "Vous n'êtes pas le propriétaire de cette classe.",

  // Erreurs HTTP
  all413: "Le fichier est trop volumineux pour le serveur.",

  // file/add
  all50101: "Données invalides.",
  all50102: "Cette classe n'existe pas.",
  all50103: "Vous n'êtes pas le propriétaire de cette classe.",
  all50104: "Un fichier porte déjà ce nom dans cette classe. Utilisez le remplacement.",
  all50105: "Erreur de base de données lors de l'ajout du fichier.",
  all50106: "Impossible d'enregistrer le fichier sur le serveur.",

  // file/replace
  all50201: "Données invalides.",
  all50202: "Ce fichier n'existe pas.",
  all50203: "Vous n'êtes pas le propriétaire de ce fichier.",
  all50204: "Un autre fichier porte déjà ce nom dans cette classe.",
  all50205: "Le nouveau fichier doit être du même type que celui qu'il remplace.",
  all50206: "Erreur de base de données lors du remplacement du fichier.",
  all50207: "Impossible d'enregistrer le fichier sur le serveur.",

  // file/delete
  all50301: "Données invalides.",
  all50302: "Ce fichier n'existe pas.",
  all50303: "Vous n'êtes pas le propriétaire de ce fichier.",
  all50304: "Erreur de base de données lors de la suppression du fichier.",

  // file/list
  all50401: "Données invalides.",
  all50402: "Cette classe n'existe pas.",
  all50403: "Vous n'êtes pas le propriétaire de cette classe.",
} satisfies Record<string, string>;

export default FR;
