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

(defun ask-user (attribut)
  "Interroge interactivement l'utilisateur pour un attribut manquant.
   Tapez ? pour afficher la liste des réponses possibles."
  (let ((valeurs (possible-values attribut)))
    (loop
      (format t "~%[?] Veuillez préciser l'état pour '~(~A~)'" attribut)
      (when valeurs
        (format t " (")
        (dolist (v valeurs)
          (format t "~A / " v))
        (format t "autre, ? pour l'aide)"))
      (format t " : ")
      (force-output)
      (let ((val (string-downcase (string-trim " " (read-line)))))
        (if (string= val "?")
            (progn
              (format t "~%Réponses possibles pour '~(~A~)' :~%" attribut)
              (dolist (v valeurs)
                (format t "  - ~A~%" v))
              (format t "  (toute autre réponse signifie qu'aucun de ces cas ne s'applique)~%"))
            (progn
              (set-fact attribut val)
              (return val)))))))

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
  (format t "Veuillez sélectionner le symptôme principal observé :~%")
  (format t "  1. pas-de-cafe          (Pas de liquide / Problème de pompe)~%")
  (format t "  2. mauvaise-qualite     (Goût / Vitesse d'écoulement / Moulin)~%")
  (format t "  3. probleme-lait        (Buse vapeur / Problème de mousse)~%")
  (format t "  4. code-erreur          (Code d'erreur affiché à l'écran)~%")
  (format t "~%Entrez le code du symptôme (pas-de-cafe / mauvaise-qualite / probleme-lait / code-erreur) : ")
  (force-output)
  
  (set-fact 'symptome (read-line))

  (let ((solution (backward-chain 'solution)))
    (format t "~%========================================================~%")
    (if solution
        (format t ">>> RÉSULTAT DU DIAGNOSTIC ET PLAN D'ACTION :~%    ~A~%" solution)
        (format t ">>> IMPOSSIBLE DE DIAGNOSTIQUER AUTOMATIQUEMENT.~%    Veuillez faire appel au service technique de maintenance.~%"))
    (format t "========================================================~%")))