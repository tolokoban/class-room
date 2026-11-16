const FR = {
  titleNew: "Nouvelle production écrite",
  titleEdit: "Modifier « $1 »",
  name: "Nom",
  duration: "Durée de l'exercice (minutes)",
  expiration: "Suppression des fichiers (heures après la fin)",
  description: "Consignes (Markdown)",
  edit: "Éditer",
  view: "Aperçu",
  placeholder: "Décrivez ce que les stagiaires doivent produire...",
  files: "Fichiers attendus",
  filesHint:
    "Le nom d'un fichier attendu fait partie du nom des fichiers téléchargés : « pseudo.nom.xxxxxx.ext ».",
  addFile: "Ajouter un fichier attendu",
  save: "Enregistrer",
  delete: "Supprimer",
  saved: "La production écrite « $1 » a été enregistrée.",
  deleteConfirm:
    "Supprimer définitivement « $1 » ? Elle sera retirée de toutes les classes et tous les fichiers déposés par les stagiaires seront supprimés.",
  deleted: "La production écrite « $1 » a été supprimée.",
  filesChangedConfirm:
    "Vous avez retiré ou renommé des fichiers attendus. Les $1 fichier(s) déjà déposé(s) par les stagiaires pour ces fichiers seront définitivement supprimés. Continuer ?",
  errorName: "Veuillez saisir un nom.",
  errorNoFile: "Il faut au moins un fichier attendu.",
  errorFileName:
    'Nom de fichier attendu invalide : « $1 ». Il ne doit pas commencer par un point ni contenir / \\ : * ? " < > |',
  errorFileDuplicate: "Deux fichiers attendus ont le même nom : « $1 ».",
} satisfies Record<string, string>;

export default FR;
