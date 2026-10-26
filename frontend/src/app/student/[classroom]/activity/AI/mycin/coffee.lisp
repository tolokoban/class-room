;;; ============================================================================
;;; Système Expert de Dépannage pour Machine à Café / Espresso de Bureau
;;; Style MYCIN / EMYCIN (Inférence par chaînage arrière en Common Lisp)
;;; ============================================================================

(defvar *working-memory* (make-hash-table :test 'equal))
(defvar *rules* nil)

(defstruct rule
  name
  premises     ; Liste de paires (attribut valeur)
  conclusion)  ; (attribut valeur)

;;; --- 1. Macro de Définition des Règles ---

(defmacro def-rule (name premises conclusion)
  `(push (make-rule :name ',name 
                    :premises ',premises 
                    :conclusion ',conclusion) 
         *rules*))

;;; --- 2. Base de Connaissances: Règles de la Machine à Café ---

;; Hypothèses de Haut Niveau (Symptômes Principaux)
(def-rule symptome-pas-de-cafe
  ((symptome "pas-de-cafe"))
  (sous-systeme circuit-hydraulique))

(def-rule symptome-mauvaise-qualite
  ((symptome "mauvaise-qualite"))
  (sous-systeme extraction-et-moulin))

(def-rule symptome-probleme-lait
  ((symptome "probleme-lait"))
  (sous-systeme circuit-lait))

(def-rule symptome-code-erreur
  ((symptome "code-erreur"))
  (sous-systeme diagnostics-numeriques))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 1 : CIRCUIT HYDRAULIQUE & CHAUDIÈRE (Pompes, Chauffe, Détartrage)
;; ----------------------------------------------------------------------------

(def-rule hydraulique-son-pompe-bruyante
  ((sous-systeme circuit-hydraulique) (son-pompe "bruyant-vibrant"))
  (panne-hydraulique bulle-air-ou-reservoir-vide))

(def-rule hydraulique-son-pompe-silencieuse
  ((sous-systeme circuit-hydraulique) (son-pompe "silencieux"))
  (panne-hydraulique panne-electrique-pompe))

(def-rule hydraulique-debit-restreint
  ((sous-systeme circuit-hydraulique) (son-pompe "normal") (debit-eau "restreint"))
  (panne-hydraulique tartre-ou-electrovanne-bloquee))

;; Solutions pour les Pannes Hydrauliques
(def-rule solution-bulle-air
  ((panne-hydraulique bulle-air-ou-reservoir-vide) (niveau-reservoir "plein"))
  (solution "Poche d'air dans le circuit d'aspiration. Ouvrez complètement la buse d'eau chaude pour purger, ou lancez un cycle de réamorçage manuel."))

(def-rule solution-reservoir-vide
  ((panne-hydraulique bulle-air-ou-reservoir-vide) (niveau-reservoir "vide"))
  (solution "Remplissez le réservoir d'eau principal et vérifiez que l'interrupteur à flotteur n'est pas bloqué au fond."))

(def-rule solution-tartre-severe
  ((panne-hydraulique tartre-ou-electrovanne-bloquee) (dernier-detartrage "plus-de-3-mois"))
  (solution "Entartrage sévère détecté. Lancez un cycle de détartrage intensif en deux phases avec un produit adapté. Remplace-l'électrovanne du groupe si le débit persiste."))

(def-rule solution-electrovanne
  ((panne-hydraulique tartre-ou-electrovanne-bloquee) (dernier-detartrage "recent"))
  (solution "L'électrovanne de groupe est encrassée ou grippée. Nettoyez la bobine et effectuez un contre-lavage (backflush) du groupe avec un détergent spécial espresso."))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 2 : EXTRACTION & MOULIN À CAFÉ
;; ----------------------------------------------------------------------------

(def-rule extraction-trop-rapide
  ((sous-systeme extraction-et-moulin) (ecoulement-cafe "rapide-et-fluide"))
  (panne-extraction sous-extraction))

(def-rule extraction-trop-lente
  ((sous-systeme extraction-et-moulin) (ecoulement-cafe "goutte-a-goutte-ou-bloque"))
  (panne-extraction sur-extraction))

(def-rule moulin-coince
  ((sous-systeme extraction-et-moulin) (son-moulin "couinement-aigu"))
  (panne-extraction moulin-bloque))

;; Solutions pour l'Extraction & le Moulin
(def-rule solution-sous-extraction
  ((panne-extraction sous-extraction))
  (solution "Réglez la mouture plus fine (1-2 crans), augmentez la dose de café dans la chambre, ou remplacez les grains de café éventés par une torréfaction fraîche."))

(def-rule solution-sur-extraction
  ((panne-extraction sur-extraction))
  (solution "La mouture est trop fine ou la galette de café est trop tassée/chargée. Grossissez la mouture et vérifiez la grille de douche pour éliminer tout résidu."))

(def-rule solution-moulin-bloque
  ((panne-extraction moulin-bloque))
  (solution "Un corps étranger ou un résidu de grain huileux bloque les meules coniques. Éteignez la machine, aspirez la trémie et dégagez manuellement les meules à l'aide de l'outil fourni."))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 3 : CIRCUIT DE LAIT & BUSE VAPEUR
;; ----------------------------------------------------------------------------

(def-rule lait-pas-de-vapeur
  ((sous-systeme circuit-lait) (debit-buse-vapeur "aucun"))
  (panne-lait chaudiere-vapeur-ou-obstruction))

(def-rule lait-gicle-sans-mousse
  ((sous-systeme circuit-lait) (debit-buse-vapeur "gicle-sans-mousse"))
  (panne-lait prise-air-ou-buse-sale))

;; Solutions pour le Lait
(def-rule solution-buse-sale
  ((panne-lait prise-air-ou-buse-sale) (mousseur-nettoye "non"))
  (solution "Accumulation de protéines de lait dans l'arrivée d'air. Démontez le tube à lait et l'embout de la buse, puis faites-les tremper dans un nettoyant pour circuits de lait pendant 15 minutes."))

(def-rule solution-joint-buse
  ((panne-lait prise-air-ou-buse-sale) (mousseur-nettoye "oui"))
  (solution "Le mousseur est propre, c'est donc une prise d'air parasite. Remplacez le joint torique de la buse vapeur et vérifiez que le tube à lait est bien enfoncé. Utilisez aussi un lait bien froid (4 °C) pour une mousse plus stable."))

(def-rule solution-chaudiere-vapeur
  ((panne-lait chaudiere-vapeur-ou-obstruction) (temperature-vapeur "froid"))
  (solution "Le fusible thermique de sécurité de la chaudière vapeur s'est déclenché. Contactez la maintenance pour réinitialiser le fusible thermique interne."))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 4 : CODES D'ERREUR NUMÉRIQUES (Écran)
;; ----------------------------------------------------------------------------

(def-rule solution-erreur-8
  ((sous-systeme diagnostics-numeriques) (code-ecran "E08"))
  (solution "Erreur 8 : Moteur du groupe infuseur bloqué. Éteignez la machine, ouvrez le panneau de maintenance latéral, retirez et rincez le groupe, puis réalignez manuellement les engrenages."))

(def-rule solution-erreur-5
  ((sous-systeme diagnostics-numeriques) (code-ecran "E05"))
  (solution "Erreur 5 : Problème de capteur de température NTC. La sonde de la chaudière est hors limites. Laissez refroidir la machine pendant 20 minutes ou remplacez la sonde thermique."))

(def-rule solution-erreur-bac
  ((sous-systeme diagnostics-numeriques) (code-ecran "BAC-PLEIN"))
  (solution "Les contacts du bac d'égouttage sont humides ou encrassés de résidus de café. Retirez le bac et frottez les broches métalliques à l'arrière avec un chiffon microfibre sec."))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 5 : PHÉNOMÈNES ÉTRANGES (Gremlin dans la machine)
;; ----------------------------------------------------------------------------

(def-rule symptome-comportement-etrange
  ((symptome "comportement-etrange"))
  (sous-systeme phenomenes-etranges))

;; Une fumée anormale : son odeur permet de distinguer un Gremlin qui fume
;; la pipe d'une surchauffe de la machine.
(def-rule gremlin-fume-la-pipe
  ((sous-systeme phenomenes-etranges) (manifestation "fumee-anormale") (odeur-fumee "tabac"))
  (presence-gremlin certaine))

(def-rule fumee-surchauffe
  ((sous-systeme phenomenes-etranges) (manifestation "fumee-anormale") (odeur-fumee "brule"))
  (panne-thermique surchauffe))

;; Éternuer : seul un Gremlin fait ça.

(def-rule gremlin-eternue
  ((sous-systeme phenomenes-etranges) (manifestation "eternue"))
  (presence-gremlin certaine))

;; Un reniflement peut n'être qu'un grippage mécanique : test de la lampe torche.
(def-rule gremlin-renifle-et-crie
  ((sous-systeme phenomenes-etranges) (manifestation "renifle") (reaction-lampe-torche "cri-strident"))
  (presence-gremlin certaine))

(def-rule renifle-grippage
  ((sous-systeme phenomenes-etranges) (manifestation "renifle") (reaction-lampe-torche "aucune"))
  (panne-mecanique grippage))

;; Solutions pour les Phénomènes Étranges
(def-rule solution-gremlin
  ((presence-gremlin certaine))
  (solution "Un Gremlin a élu domicile dans la machine ! Ne le mouillez surtout pas et ne le nourrissez jamais après minuit. Attirez-le hors de la machine avec un sucre et une petite cuillère, puis relogez-le dans une boîte à chaussures confortable."))

(def-rule solution-surchauffe
  ((panne-thermique surchauffe))
  (solution "DANGER : la machine surchauffe ! Débranchez-la immédiatement de la prise électrique et ne la rallumez pas. Laissez-la refroidir et contactez la maintenance avant toute nouvelle utilisation."))

(def-rule solution-grippage
  ((panne-mecanique grippage))
  (solution "Fausse alerte : pas de Gremlin, simplement un grippage de la mécanique. Lubrifiez les joints du groupe infuseur avec de la graisse alimentaire silicone."))

;; ----------------------------------------------------------------------------
;; SOUS-SYSTÈME 6 : FARCES DE BUREAU (Fou rire après le café)
;; ----------------------------------------------------------------------------

(def-rule symptome-fou-rire
  ((symptome "fou-rire"))
  (sous-systeme farces-de-bureau))

(def-rule solution-champignons
  ((sous-systeme farces-de-bureau) (champignons-dans-bac-a-lait "oui"))
  (solution "Votre collègue Peter a mis des champignons dans le compartiment à lait ! Videz et désinfectez le bac à lait, puis ayez une conversation sérieuse avec Peter (si vous arrivez à arrêter de rire)."))

(def-rule solution-bonne-humeur
  ((sous-systeme farces-de-bureau) (champignons-dans-bac-a-lait "non"))
  (solution "Aucun champignon dans le bac à lait : Peter est innocent, pour cette fois. Votre fou rire vient sans doute de votre excellente humeur naturelle. Aucune réparation nécessaire !"))

;;; --- 3. Moteur d'Inférence par Chaînage Arrière ---

(defun set-fact (attribut valeur)
  "Enregistre un fait en minuscules."
  (setf (gethash (string-downcase (symbol-name attribut)) *working-memory*) (string-downcase valeur)))

(defun get-fact (attribut)
  "Récupère un fait connu en mémoire."
  (gethash (string-downcase (symbol-name attribut)) *working-memory*))

(defun possible-values (attribut)
  "Valeurs attendues pour cet attribut dans les prémisses des règles."
  (let ((valeurs nil))
    (dolist (r (reverse *rules*))
      (dolist (premise (rule-premises r))
        (when (and (string-equal (first premise) (symbol-name attribut))
                   (not (member (second premise) valeurs :test #'string-equal)))
          (push (second premise) valeurs))))
    (reverse valeurs)))

(defun choose (question options)
  "Affiche les OPTIONS, liste de paires (valeur libellé), numérotées à partir de 1,
   et renvoie la valeur choisie. L'utilisateur tape un numéro (ou la valeur elle-même)."
  (loop
    (format t "~%[?] ~A~%" question)
    (let ((i 0))
      (dolist (o options)
        (incf i)
        (format t "  ~D. ~A~%" i (second o))))
    (format t "Votre choix (1-~D) : " (length options))
    (force-output)
    (let ((reponse (string-trim " " (read-line)))
          (i 0))
      (dolist (o options)
        (incf i)
        (when (or (string= reponse (format nil "~D" i))
                  (string-equal reponse (first o)))
          (return-from choose (first o))))
      (format t "~%Réponse invalide : tapez un numéro entre 1 et ~D.~%" (length options)))))

(defvar *questions*
  '(("manifestation"
     . "Quel comportement étrange la machine a-t-elle ?")
    ("odeur-fumee"
     . "Sentez la fumée qui sort de la machine. Quelle odeur a-t-elle ?")
    ("reaction-lampe-torche"
     . "Ouvrez la machine et éclairez l'intérieur avec une lampe torche. Que se passe-t-il ?")
    ("champignons-dans-bac-a-lait"
     . "Ouvrez le compartiment à lait. Y voyez-vous des champignons ?"))
  "Questions personnalisées pour certains attributs (sinon, question générique).")

(defun question-for (attribut)
  "Texte de la question à poser pour cet attribut."
  (let ((q (assoc (symbol-name attribut) *questions* :test #'string-equal)))
    (if q
        (cdr q)
        (format nil "Veuillez préciser l'état pour '~(~A~)' :" attribut))))

(defun ask-user (attribut)
  "Interroge interactivement l'utilisateur pour un attribut manquant.
   Les réponses proposées sont celles attendues par les règles, plus « autre »."
  (let ((val (choose (question-for attribut)
                     (append (mapcar #'(lambda (v) (list v v))
                                     (possible-values attribut))
                             '(("autre" "autre (aucun de ces cas)"))))))
    (set-fact attribut val)
    val))

(defun derivable-p (attribut)
  "Vrai si une règle conclut sur cet attribut : on ne le demande alors pas à l'utilisateur."
  (some #'(lambda (r)
            (string-equal (first (rule-conclusion r)) (symbol-name attribut)))
        *rules*))

(defun evaluate-premise (premise)
  "Résout récursivement les prémisses via la mémoire, le chaînage ou les questions."
  (let* ((attr (first premise))
         (val-attendue (second premise))
         (val-actuelle (or (get-fact attr)
                           (backward-chain attr)
                           (unless (derivable-p attr)
                             (ask-user attr)))))
    (string-equal val-actuelle val-attendue)))

(defun backward-chain (cible-attr)
  "Recherche récursivement dans les règles pour prouver la cible."
  (let ((val-connue (get-fact cible-attr)))
    (if val-connue
        val-connue
        (dolist (r *rules*)
          (when (string-equal (first (rule-conclusion r)) (symbol-name cible-attr))
            (let ((premises-valides t))
              (dolist (premise (rule-premises r))
                (unless (evaluate-premise premise)
                  (setq premises-valides nil)
                  (return)))
              
              (when premises-valides
                (let ((val-concl (second (rule-conclusion r))))
                  (set-fact cible-attr val-concl)
                  (return-from backward-chain val-concl)))))))))

;;; --- 4. Point d'Entrée Utilisateur ---

(defun diagnostiquer-machine-cafe ()
  "Programme principal de diagnostic de la machine à café en français."
  (clrhash *working-memory*)
  (format t "~%========================================================~%")
  (format t "    SYSTÈME EXPERT - MACHINE À CAFÉ & ESPRESSO COMMERCIALE ~%")
  (format t "========================================================~%")
  (set-fact 'symptome
            (choose "Veuillez sélectionner le symptôme principal observé :"
                    '(("pas-de-cafe"      "Pas de café (pas de liquide / problème de pompe)")
                      ("mauvaise-qualite" "Mauvaise qualité (goût / vitesse d'écoulement / moulin)")
                      ("probleme-lait"    "Problème de lait (buse vapeur / problème de mousse)")
                      ("code-erreur"      "Code d'erreur affiché à l'écran")
                      ("comportement-etrange" "Comportement étrange (fumée anormale / éternuements / reniflements)")
                      ("fou-rire"         "Fou rire incontrôlable après avoir bu le café"))))

  (let ((solution (backward-chain 'solution)))
    (format t "~%========================================================~%")
    (if solution
        (format t ">>> RÉSULTAT DU DIAGNOSTIC ET PLAN D'ACTION :~%    ~A~%" solution)
        (format t ">>> IMPOSSIBLE DE DIAGNOSTIQUER AUTOMATIQUEMENT.~%    Veuillez faire appel au service technique de maintenance.~%"))
    (format t "========================================================~%")))