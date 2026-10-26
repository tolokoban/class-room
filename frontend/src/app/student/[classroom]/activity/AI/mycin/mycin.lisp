;;; MYCIN pour JSCL — version patchée de mycin.lisp + mycin-r.lisp
;;; Code original : Peter Norvig, "Paradigms of Artificial Intelligence
;;; Programming" (1992), licence MIT — dépôt github.com/norvig/paip-lisp
;;;
;;; Patchs appliqués pour JSCL (Common Lisp -> JavaScript) :
;;;   1. Directives format ~* / ~2:* supprimees (prompt par defaut reecrit).
;;;   2. Iteration imbriquee ~{ ~{ ~} ~} et ~,3f supprimees (report-findings).
;;;   3. Option (:print-function ...) retiree de defstruct -> appels explicites.
;;;   4. Constructeurs BOA evites : defparm construit les slots explicitement.
;;;   5. (declare ...) supprimes (JSCL ne les supporte pas).
;;;   6. y-or-n-p remplace par read-yes/no base sur read-line.
;;;   7. assert du defrule remplace par un test error explicite.
;;;
;;; UTILISATION : ouvrir https://jscl-project.github.io/ ,
;;; coller l'integralite de ce fichier dans le REPL,
;;; attendre la fin de la compilation, puis taper :  (MYCIN)

;;; ============================================================
;;; Mini-auxfns (les deux seules fonctions d'auxfns.lisp utiles ici)
;;; ============================================================

(defun rest2 (x)
  "Le reste d'une liste après ses DEUX premiers éléments."
  (nthcdr 2 x))

(defun partition-if (pred list)
  "Renvoie 2 valeurs : les éléments de la liste qui satisfont pred, et ceux qui ne la satisfont pas."
  (let ((yes-list nil)
        (no-list nil))
    (dolist (item list)
      (if (funcall pred item)
          (push item yes-list)
          (push item no-list)))
    (values (nreverse yes-list) (nreverse no-list))))

(unless (fboundp 'warn)
  (defun warn (ctrl &rest args)
    (apply #'format t ctrl args)
    (terpri)))

;; PATCH: ldiff n'existe pas dans JSCL (utilise par le macro defrule)
(defun ldiff (list sublist)
  "Renvoie une nouvelle liste des éléments de LIST qui précèdent SUBLIST."
  (if (eq list sublist)
      nil
      (cons (first list) (ldiff (rest list) sublist))))

;; PATCH: garde defensive si copy-list manque (present dans JSCL en principe)
(unless (fboundp 'copy-list)
  (defun copy-list (list)
    (if (consp list)
        (cons (first list) (copy-list (rest list)))
        list)))

;;; ============================================================
;;; Certainty factors (facteurs de certitude)
;;; ============================================================

(defconstant true   +1.0)
(defconstant false  -1.0)
(defconstant unknown 0.0)

(defun cf-or (a b)
  "Combine les facteurs de certitude pour la formule (A ou B).
  Utilisé quand deux règles soutiennent la même conclusion."
  (cond ((and (> a 0) (> b 0))
         (+ a b (* -1 a b)))
        ((and (< a 0) (< b 0))
         (+ a b (* a b)))
        (t (/ (+ a b)
              (- 1 (min (abs a) (abs b)))))))

(defun cf-and (a b)
  "Combine les facteurs de certitude pour la formule (A et B)."
  (min a b))

(defconstant cf-cut-off 0.2
  "En dessous de cette certitude, on arrête la recherche.")

(defun true-p (cf)
  "Ce facteur de certitude est-il considéré comme vrai ?"
  (and (cf-p cf) (> cf cf-cut-off)))

(defun false-p (cf)
  "Ce facteur de certitude est-il considéré comme faux ?"
  (and (cf-p cf) (< cf (- cf-cut-off 1.0))))

(defun cf-p (x)
  "X est-il un facteur de certitude numérique valide ?"
  (and (numberp x) (<= false x true)))

;;; ============================================================
;;; Data base (memoire de travail)
;;; ============================================================

(let ((db (make-hash-table :test #'equal)))
  (defun get-db (key) (gethash key db))
  (defun put-db (key val) (setf (gethash key db) val))
  (defun clear-db () (clrhash db)))

(defun get-vals (parm inst)
  "Renvoie une liste de paires (val cf) pour ce (parm inst)."
  (get-db (list parm inst)))

(defun get-cf (parm inst val)
  "Cherche le facteur de certitude, ou renvoie unknown."
  (or (second (assoc val (get-vals parm inst)))
      unknown))

(defun update-cf (parm inst val cf)
  "Modifie le facteur de certitude de (parm inst is val)
  en combinant le cf donné avec l'ancien."
  (let ((new-cf (cf-or cf (get-cf parm inst val))))
    (put-db (list parm inst)
            (cons (list val new-cf)
                  (remove val (get-db (list parm inst))
                          :key #'first)))))

;;; ============================================================
;;; Asking the user / interaction
;;; ============================================================

(defconstant help-string
  "~&Tapez l'une des commandes suivantes :
 ?     - pour voir les réponses possibles pour ce paramètre
 rule  - pour afficher la règle courante
 why   - pour savoir pourquoi cette question est posée
 help  - pour afficher cette liste
 xxx   - (pour une valeur xxx précise) si la réponse est certaine
 (xxx .5 yyy .4) - s'il y a plusieurs réponses avec
                   des facteurs de certitude différents.")

(defun ask-vals (parm inst)
  "Demande à l'utilisateur la ou les valeurs du paramètre parm
  de inst, sauf si la question a déjà été posée. Redemande tant que
  l'utilisateur n'a pas tapé UNKNOWN (renvoie nil) ou une réponse
  valide (renvoie t)."
  (unless (get-db `(asked ,parm ,inst))
    (put-db `(asked ,parm ,inst) t)
    (loop
      (let ((ans (prompt-and-read-vals parm inst)))
        (case ans
          (help (format t help-string))
          (why  (print-why (get-db 'current-rule) parm))
          (rule (let ((r (get-db 'current-rule)))
                  (if (rule-p r) (print-rule r) (princ r))))
          ((unk unknown) (RETURN nil))
          (?    (format t "~&Le paramètre ~a doit être de type ~a"
                        parm (parm-type parm)) nil)
          (t    (if (check-reply ans parm inst)
                    (RETURN t)
                    (format t "~&Réponse invalide. Tapez ? pour voir les réponses autorisées."))))))))

(defun prompt-and-read-vals (parm inst)
  "Affiche la question pour ce paramètre (ou en fabrique une)
  et lit la réponse."
  (fresh-line)
  ;; Le prompt est appele avec deux arguments : (inst-name inst) puis parm.
  ;; PATCH: plus de ~* / ~2:* ; le prompt par defaut ecrit ci-dessous
  ;; utilise les deux arguments dans cet ordre.
  (format t (parm-prompt (get-parm parm)) (inst-name inst) parm)
  (princ " ")
  (finish-output)
  (funcall (parm-reader (get-parm parm))))

(defun inst-name (inst)
  "Le nom de cette instance."
  (or (first (first (get-vals 'name inst)))
      inst))

(defun check-reply (reply parm inst)
  "Si la réponse est valide pour ce parm, met à jour la base.
  La réponse doit être une val ou (val1 cf1 val2 cf2 ...).
  Chaque val doit être du bon type pour ce parm."
  (let ((answers (parse-reply reply)))
    (when (every #'(lambda (pair)
                     (and (typep (first pair) (parm-type parm))
                          (cf-p (second pair))))
                 answers)
      (dolist (pair answers)
        (update-cf parm inst (first pair) (second pair)))
      answers)))

(defun parse-reply (reply)
  "Convertit la réponse en une liste de paires (valeur cf)."
  (cond ((null reply) nil)
        ((atom reply) `((,reply ,true)))
        (t (cons (list (first reply) (second reply))
                 (parse-reply (rest2 reply))))))

(defun read-yes/no ()
  "PATCH: remplace (y-or-n-p format-args), que JSCL pourrait ne pas gerer.
  Lit une ligne et accepte o/oui/n/non (ainsi que y/yes/no)."
  (format t " (oui ou non) : ")
  (finish-output)
  (let ((line (string-downcase (string-trim " " (read-line)))))
    (cond ((or (string= line "o") (string= line "oui")
               (string= line "y") (string= line "yes")) t)
          ((or (string= line "n") (string= line "non")
               (string= line "no")) nil)
          (t (format t "~&Veuillez répondre par oui ou non.")
             (read-yes/no)))))

;;; ============================================================
;;; Parameters and contexts
;;; ============================================================

(defstruct parm
  name (context nil)
  ;; PATCH: prompt par defaut sans ~* (args passes dans l'ordre inst, parm)
  (prompt "~&Pour ~a, quelle est la valeur de ~a ?")
  (ask-first nil)
  (type-restriction t)
  (reader 'read))

(defmacro defparm (parm &rest args)
  "Définit un paramètre. PATCH: pas de constructeur BOA ;
  les slots sont remplis explicitement, avec les mêmes défauts."
  `(setf (get ',parm 'parm)
         (make-parm
           :name ',parm
           :context (nth 0 ',args)
           :type-restriction (or (nth 1 ',args) t)
           :prompt (or (nth 2 ',args) "~&Pour ~a, quelle est la valeur de ~a ?")
           :ask-first (nth 3 ',args)
           :reader (or (nth 4 ',args) 'read))))

(defun parm-type (parm-name)
  "Quel type est attendu pour une valeur de ce paramètre ?"
  (parm-type-restriction (get-parm parm-name)))

(defun get-parm (parm-name)
  "Cherche la structure du paramètre portant ce nom."
  (or (get parm-name 'parm)
      (setf (get parm-name 'parm) (make-parm :name parm-name))))

(deftype yes/no () '(member yes no))

(defstruct context
  "Un contexte est un sous-domaine, un type."
  name (number 0) initial-data goals)

(defmacro defcontext (name &optional initial-data goals)
  "Définit un contexte."
  `(make-context :name ',name :initial-data ',initial-data
                 :goals ',goals))

(defun new-instance (context)
  "Crée une nouvelle instance de ce contexte."
  (let ((instance (format nil "~a-~d"
                          (context-name context)
                          (incf (context-number context)))))
    (format t "~&------ ~a ------~&" instance)
    ;; Memorise toutes les instances pour le diagnostic final
    (put-db `(instances ,(context-name context))
            (cons instance (get-db `(instances ,(context-name context)))))
    (put-db (context-name context) instance)
    (put-db 'current-instance instance)))

;;; ============================================================
;;; Rules
;;; ============================================================

(defstruct rule
  ;; PATCH: option (:print-function print-rule) retiree
  number premises conclusions cf)

(let ((rules (make-hash-table)))

  (defun put-rule (rule)
    "Range la règle dans une table, indexée par chaque
    parm de la conclusion."
    (dolist (concl (rule-conclusions rule))
      (push rule (gethash (first concl) rules)))
    rule)

  (defun get-rules (parm)
    "La liste des règles qui aident à déterminer ce paramètre."
    (gethash parm rules))

  (defun clear-rules () (clrhash rules)))

(defun find-out (parm &optional (inst (get-db 'current-instance)))
  "Trouve la ou les valeurs de ce paramètre pour cette instance,
  sauf si elles sont déjà connues.
  Pour certains paramètres on pose d'abord la question ; pour les
  autres on essaie d'abord les règles."
  (or (get-db `(known ,parm ,inst))
      (put-db `(known ,parm ,inst)
              (if (parm-ask-first (get-parm parm))
                  (or (ask-vals parm inst) (use-rules parm))
                  (or (use-rules parm) (ask-vals parm inst))))))

(defun use-rules (parm)
  "Essaie toutes les règles associées à ce paramètre.
  Renvoie vrai si l'une des règles renvoie vrai."
  (some #'true-p (mapcar #'use-rule (get-rules parm))))

(defun use-rule (rule)
  "Applique une règle à la situation courante."
  (put-db 'current-rule rule)
  (unless (some #'reject-premise (rule-premises rule))
    (let ((cf (satisfy-premises (rule-premises rule) true)))
      (when (true-p cf)
        (dolist (conclusion (rule-conclusions rule))
          (conclude conclusion (* cf (rule-cf rule))))
        cf))))

(defun satisfy-premises (premises cf-so-far)
  "Une liste de prémisses est satisfaite si elles sont toutes vraies.
  Renvoie un cf combiné."
  (cond ((null premises) cf-so-far)
        ((not (true-p cf-so-far)) false)
        (t (satisfy-premises
             (rest premises)
             (cf-and cf-so-far
                     (eval-condition (first premises)))))))

(defun eval-condition (condition &optional (find-out-p t))
  "Vérifie si cette condition est vraie, en utilisant éventuellement
  FIND-OUT pour déterminer les paramètres inconnus."
  (multiple-value-bind (parm inst op val)
      (parse-condition condition)
    (when find-out-p
      (find-out parm inst))
    (loop for pair in (get-vals parm inst)
          when (funcall op (first pair) val)
          sum (second pair))))

(defun reject-premise (premise)
  "Une prémisse est rejetée si on sait déjà qu'elle est fausse,
  sans avoir besoin d'appeler find-out récursivement."
  (false-p (eval-condition premise nil)))

(defun conclude (conclusion cf)
  "Ajoute une conclusion (avec le facteur de certitude donné) à la base."
  (multiple-value-bind (parm inst op val)
      (parse-condition conclusion)
    (update-cf parm inst val cf)))

(defun is (a b) (equal a b))

(defun parse-condition (condition)
  "Une condition est de la forme (parm inst op val).
  Ainsi, pour (age patient is 21), on renvoie 4 valeurs :
  (age patient-1 is 21), où patient-1 est le patient courant."
  (values (first condition)
          (get-db (second condition))
          (third condition)
          (fourth condition)))

;;; ============================================================
;;; The Emycin shell
;;; ============================================================

(defun emycin (contexts)
  "Un moteur de système expert. Accumule les données des instances
  de chaque contexte et résout les objectifs. Puis présente les résultats."
  (clear-db)
  (get-context-data contexts))

(defun get-context-data (contexts)
  "Pour chaque contexte, crée une instance et essaie de trouver
  les données requises. Passe ensuite aux autres contextes, en
  profondeur d'abord, et demande enfin s'il existe d'autres
  instances de ce contexte."
  (unless (null contexts)
    (let* ((context (first contexts))
           (inst (new-instance context)))
      (put-db 'current-rule 'initial)
      (mapc #'find-out (context-initial-data context))
      (put-db 'current-rule 'goal)
      (mapc #'find-out (context-goals context))
      (report-findings context inst)
      (get-context-data (rest contexts))
      ;; PATCH: y-or-n-p avec arguments format remplace
      (when (progn
              (format t "~&Y a-t-il un autre ~a ?" (context-name context))
              (read-yes/no))
        (get-context-data contexts)))))

(defmacro defrule (number &body body)
  "Définit une règle avec des conditions, un facteur de certitude et
  des conclusions. Exemple : (defrule R001 if ... then .9 ...)"
  ;; PATCH: assert remplace par un test explicite
  (unless (eq (first body) 'if)
    (error "Règle ~a : une règle doit commencer par IF." number))
  (let* ((then-part (member 'then body))
         (premises (ldiff (rest body) then-part))
         (conclusions (rest2 then-part))
         (cf (second then-part)))
    (check-conditions number premises 'premise)
    (check-conditions number conclusions 'conclusion)
    (when (not (cf-p cf))
      (warn "Règle ~a : facteur de certitude invalide : ~a" number cf))
    `(put-rule
       (make-rule :number ',number :cf ,cf :premises ',premises
                  :conclusions ',conclusions))))

(defun check-conditions (rule-num conditions kind)
  "Avertit si des conditions sont invalides."
  ;; PATCH: pas de (declare (ignore inst)) — JSCL n'a pas declare
  (when (null conditions)
    (warn "Règle ~a : ~a manquante" rule-num kind))
  (dolist (condition conditions)
    (when (not (consp condition))
      (warn "Règle ~a : ~a invalide : ~a" rule-num kind condition))
    (multiple-value-bind (parm inst op val)
        (parse-condition condition)
      (when (and (eq kind 'conclusion) (not (eq op 'is)))
        (warn "Règle ~a : opérateur invalide (~a) dans la conclusion : ~a"
              rule-num op condition))
      (when (not (typep val (parm-type parm)))
        (warn "Règle ~a : valeur invalide (~a) dans ~a : ~a"
              rule-num val kind condition)))))

;;; ============================================================
;;; Explanations / reporting
;;; ============================================================

(defun report-findings (context inst)
  "Affiche les résultats pour chaque objectif de cette instance."
  ;; PATCH: reecrit sans ~{ ~{ ~} ~} ni ~,3f — uniquement ~a / ~&
  (when (context-goals context)
    (format t "~&Résultats pour ~a :" (inst-name inst))
    (dolist (goal (context-goals context))
      (let ((values (get-vals goal inst)))
        (if values
            (progn
              (format t "~& ~a :" goal)
              (dolist (pair (sort (copy-list values) #'> :key #'second))
                (format t " ~a (~a)" (first pair) (second pair))))
            (format t "~& ~a : inconnu" goal))))))

(defun print-rule (rule &optional (stream t) depth)
  (format stream "~&Règle ~a :~&  Si" (rule-number rule))
  (print-conditions (rule-premises rule) stream)
  (format stream "~&  Alors ~a (~a) que"
          (cf->english (rule-cf rule)) (rule-cf rule))
  (print-conditions (rule-conclusions rule) stream))

(defun print-conditions (conditions &optional
                         (stream t) (num 1))
  "Affiche une liste numérotée de conditions."
  ;; PATCH: num est incremente pour numeroter 1), 2), 3)...
  (dolist (condition conditions)
    (print-condition condition stream num)
    (incf num)))

(defun print-condition (condition stream number)
  "Affiche une condition unique en pseudo-anglais."
  ;; PATCH: ~{ ~a~} remplace par un dolist explicite
  (format stream "~&    ~d)" number)
  (let ((parm (first condition))
        (inst (second condition))
        (op (third condition))
        (val (fourth condition)))
    (dolist (word (case val
                    (YES `(the ,inst ,op ,parm))
                    (NO  `(the ,inst ,op not ,parm))
                    (T   `(the ,parm of the ,inst ,op ,val))))
      (format stream " ~a" word))))

(defun cf->english (cf)
  "Convertit un facteur de certitude en une phrase en français."
  (cond ((= cf  1.0) "il existe une preuve certaine")
        ((> cf   .8) "il existe une preuve fortement suggestive")
        ((> cf   .5) "il existe une preuve suggestive")
        ((> cf  0.0) "il existe une preuve faiblement suggestive")
        ((= cf  0.0) "il n'existe AUCUNE preuve dans un sens ou dans l'autre")
        ((< cf  0.0) (concatenate 'string (cf->english (- cf))
                                  " CONTRE la conclusion"))))

(defun print-why (rule parm)
  "Explique pourquoi cette règle est utilisée. Affiche ce qui est
  connu, ce que l'on cherche à trouver et ce que l'on peut conclure."
  (format t "~&[Pourquoi demande-t-on la valeur de ~a ?]" parm)
  (if (member rule '(initial goal))
      (format t "~&~a fait partie des paramètres de type ~a."
              parm rule)
      (multiple-value-bind (knowns unknowns)
          (partition-if #'(lambda (premise)
                            (true-p (eval-condition premise nil)))
                        (rule-premises rule))
        (when knowns
          (format t "~&On sait que :")
          (print-conditions knowns)
          (format t "~&Par conséquent,"))
        ;; PATCH: copy-rule + (print new-rule) remplaces par un
        ;; appel explicite a print-rule (plus de :print-function)
        (let ((new-rule (make-rule
                          :number (rule-number rule)
                          :premises (copy-list unknowns)
                          :conclusions (rule-conclusions rule)
                          :cf (rule-cf rule))))
          (print-rule new-rule)))))

;;; ============================================================
;;; Base de connaissances medicale (ex mycin-r.lisp)
;;; ============================================================

;;; Parameters for patient:
(defparm name patient t "Nom du patient : " t read-line)
(defparm sex patient (member male female) "Sexe (male ou female) :" t)
(defparm age patient number "Âge :" t)
(defparm burn patient (member no mild serious)
  "~a est-il un patient brûlé ? Si oui, légèrement (mild) ou gravement (serious) ? Sinon, no. " t)
(defparm compromised-host patient yes/no
  "~a est-il immunodéprimé (yes ou no) ? " t)

;;; Parameters for culture:
(defparm site culture (member blood)
  "De quel site provient le prélèvement de ~a ? " t)
(defparm days-old culture number
  "Il y a combien de jours cette culture (~a) a-t-elle été obtenue ? " t)

;;; Parameters for organism:
(defparm identity organism
  (member pseudomonas klebsiella enterobacteriaceae
          staphylococcus bacteroides streptococcus)
  "Entrez l'identité (le genre) de ~a : " t)
(defparm gram organism (member acid-fast pos neg)
  "La coloration de Gram de ~a : " t)
(defparm morphology organism (member rod coccus)
  "~a est-il un bacille (rod) ou un coque (coccus) ? " t)
(defparm aerobicity organism (member aerobic anaerobic))
(defparm growth-conformation organism
  (member chains pairs clumps))

(clear-rules)

(defrule 52
  if (site culture is blood)
     (gram organism is neg)
     (morphology organism is rod)
     (burn patient is serious)
  then .4
     (identity organism is pseudomonas))

(defrule 71
  if (gram organism is pos)
     (morphology organism is coccus)
     (growth-conformation organism is clumps)
  then .7
     (identity organism is staphylococcus))

(defrule 73
  if (site culture is blood)
     (gram organism is neg)
     (morphology organism is rod)
     (aerobicity organism is anaerobic)
  then .9
     (identity organism is bacteroides))

(defrule 75
  if (gram organism is neg)
     (morphology organism is rod)
     (compromised-host patient is yes)
  then .6
     (identity organism is pseudomonas))

(defrule 107
  if (gram organism is neg)
     (morphology organism is rod)
     (aerobicity organism is aerobic)
  then .8
     (identity organism is enterobacteriaceae))

(defrule 165
  if (gram organism is pos)
     (morphology organism is coccus)
     (growth-conformation organism is chains)
  then .7
     (identity organism is streptococcus))

;;; ============================================================
;;; Diagnostic final et traitement (ajout pedagogique)
;;; ============================================================

;;; Antibiotiques proposes a l'epoque de MYCIN (annees 1970).
;;; A but pedagogique uniquement : ce n'est PAS un avis medical.
(defparameter *therapies*
  '((pseudomonas        "gentamicine + carbénicilline")
    (klebsiella         "gentamicine")
    (enterobacteriaceae "gentamicine")
    (staphylococcus     "oxacilline")
    (streptococcus      "pénicilline G")
    (bacteroides        "clindamycine")))

(defun report-diagnosis ()
  "Affiche, pour chaque organisme, l'identité la plus probable
  et le traitement associé."
  (format t "~&~&============ DIAGNOSTIC ============")
  (dolist (inst (reverse (get-db '(instances organism))))
    (let ((values (sort (copy-list (get-vals 'identity inst))
                        #'> :key #'second)))
      (format t "~&~a :" inst)
      (if (null values)
          (format t "~&  Identité non déterminée : aucune règle n'a pu conclure.~&  Impossible de proposer un traitement.")
          (let* ((best (first values))
                 (therapy (second (assoc (first best) *therapies*))))
            (format t "~&  Organisme le plus probable : ~a" (first best))
            (format t "~&  (~a, facteur de certitude ~a)"
                    (cf->english (second best)) (second best))
            (dolist (other (rest values))
              (format t "~&  Autre possibilité : ~a (~a)"
                      (first other) (second other)))
            (format t "~&  Traitement suggéré : ~a"
                    (or therapy "aucun traitement connu pour cet organisme"))))))
  (format t "~&==================================")
  (format t "~&(Simulation pédagogique : ce n'est pas un avis médical.)~&"))

;;; ============================================================
;;; Point d'entree
;;; ============================================================

(defun mycin ()
  "Détermine quel organisme infecte un patient et propose un traitement."
  (emycin
    (list (defcontext patient  (name sex age)  ())
          (defcontext culture  (site days-old) ())
          (defcontext organism ()              (identity))))
  (report-diagnosis))

;;; Taper :  (MYCIN)
;;; Repondre aux questions, utiliser ? / why / rule / help si besoin.
