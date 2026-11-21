const FR = {
  confidence: "Confiance",
  passageWhole:
    "C'est le texte entier de la fable qui ressemble le plus à ta phrase (similarité : $1).",
  passageSummary:
    "C'est le résumé de la fable qui ressemble le plus à votre phrase (similarité : $1).",
  passageChunk:
    "C'est ce passage de la fable qui ressemble le plus à votre phrase (similarité : $1).",
  passageRewording:
    "C'est une reformulation de ce passage, en français moderne, qui ressemble le plus à votre phrase (similarité : $1). La reformulation a été écrite pour cette activité, mais c'est le texte original qui est affiché.",
  summaryNote: "Ce résumé n'est pas de l'auteur : il a été écrit pour cette activité.",
  wikisource: "Lire la fable en entier sur Wikisource",
  esope: "Ésope",
  phedre: "Phèdre",
  lafontaine: "La Fontaine",
} satisfies Record<string, string>;

export default FR;
