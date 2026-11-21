/**
 * Two rewordings in modern French of each chunk of each fable, written for this activity.
 * The chunks are cut by `../segment.ts`: `chunk` must be exactly the text of the chunk,
 * the generator stops with an error otherwise (after a change of a text or of the segmentation,
 * update this file too).
 * The rewordings are embedded next to their chunk, to bridge the gap between the old
 * vocabulary of the fables and the words of the students. They are never shown:
 * when a rewording matches, its chunk is shown instead.
 *
 * After any change, run `npm run embeddings:fables` (see `../generate.mts`).
 */
import type { Author } from "../types";

export interface ChunkRewordings {
  /** The chunk, exactly as cut by `../segment.ts`. */
  chunk: string;
  /** Rewordings of `chunk` in modern French, with different words. */
  rewordings: string[];
}

/** Key of a fable in `REWORDINGS`: "author/title". */
export function rewordingsKey({ author, title }: { author: Author; title: string }): string {
  return `${author}/${title}`;
}

/** The rewordings of the chunks of each fable, by `rewordingsKey()`. */
export const REWORDINGS: Record<string, ChunkRewordings[]> = {
  "esope/La Cigale et les Fourmis": [
    {
      chunk:
        "C’était en hiver ; leur grain étant mouillé, les fourmis le faisaient sécher. Une cigale qui avait faim leur demanda de quoi manger. Les fourmis lui dirent : « Pourquoi, pendant l’été, n’amassais-tu pas, toi aussi, des provisions ? — Je n’en avais pas le temps, répondit la cigale : je chantais mélodieusement. »",
      rewordings: [
        "En hiver, les fourmis font sécher leur grain mouillé. Une cigale affamée leur demande à manger, et quand elles lui demandent pourquoi elle n'a pas fait de réserves en été, elle répond qu'elle passait son temps à chanter.",
        "Un insecte qui a faim demande de la nourriture à des travailleuses qui ont des réserves. Il avoue qu'il n'a pas travaillé pendant l'été parce qu'il préférait chanter.",
      ],
    },
    {
      chunk:
        "Les fourmis lui dirent : « Pourquoi, pendant l’été, n’amassais-tu pas, toi aussi, des provisions ? — Je n’en avais pas le temps, répondit la cigale : je chantais mélodieusement. » Les fourmis lui rirent au nez : « Eh bien ! dirent-elles, si tu chantais en été, danse en hiver. »",
      rewordings: [
        "Les fourmis demandent à la cigale pourquoi elle n'a pas fait de provisions pendant l'été, et elle répond qu'elle chantait. Les fourmis se moquent d'elle : si tu as chanté en été, alors danse en hiver.",
        "Celle qui n'a rien préparé explique qu'elle s'amusait au lieu de travailler. Les travailleuses rient d'elle et refusent de l'aider.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’en toute affaire il faut se garder de la négligence, si l’on veut éviter le chagrin et le danger.",
      rewordings: [
        "La morale : dans tout ce qu'on fait, il faut éviter d'être négligent si l'on ne veut pas avoir des ennuis et du malheur.",
        "La leçon est qu'il ne faut pas être paresseux ni insouciant, sinon on finit dans la misère et le danger.",
      ],
    },
  ],
  "lafontaine/La Cigale et la Fourmi": [
    {
      chunk:
        "La cigale, ayant chanté\nTout l’été,\nSe trouva fort dépourvue\nQuand la bise fut venue :",
      rewordings: [
        "La cigale a chanté pendant tout l'été et, quand le vent froid de l'hiver arrive, elle se retrouve sans aucune nourriture.",
        "L'insecte s'est amusé toute la belle saison et, quand le froid arrive, il n'a plus rien.",
      ],
    },
    {
      chunk:
        "Quand la bise fut venue :\nPas un seul petit morceau\nDe mouche ou de vermisseau.\nElle alla crier famine",
      rewordings: [
        "Quand l'hiver arrive, la cigale n'a plus la moindre mouche ni le moindre ver à manger. Elle part se plaindre de sa faim.",
        "Avec le froid, l'insecte n'a plus rien à se mettre sous la dent et il a très faim.",
      ],
    },
    {
      chunk:
        "Elle alla crier famine\nChez la fourmi, sa voisine,\nLa priant de lui prêter\nQuelque grain pour subsister",
      rewordings: [
        "La cigale va chez sa voisine la fourmi pour lui dire qu'elle meurt de faim. Elle lui demande de lui prêter un peu de grain pour survivre.",
        "L'affamée va voir sa voisine qui a des réserves et lui demande de lui prêter de la nourriture.",
      ],
    },
    {
      chunk:
        "Quelque grain pour subsister\nJusqu’à la saison nouvelle.\nJe vous paierai, lui dit-elle,\nAvant l’oût, foi d’animal,",
      rewordings: [
        "La cigale demande du grain pour tenir jusqu'au printemps. Elle promet à la fourmi de la rembourser avant la fin de l'été, parole d'animal.",
        "Elle veut emprunter de quoi manger jusqu'à la belle saison et jure qu'elle rendra ce qu'on lui prête.",
      ],
    },
    {
      chunk:
        "Avant l’oût, foi d’animal,\nIntérêt et principal.\nLa fourmi n’est pas prêteuse :\nC’est là son moindre défaut.",
      rewordings: [
        "La cigale promet de rendre le grain avec les intérêts. Mais la fourmi n'aime pas prêter, c'est son plus petit défaut.",
        "L'emprunteuse promet de rembourser avec un bonus, mais la voisine n'aime pas du tout prêter ce qu'elle a.",
      ],
    },
    {
      chunk:
        "C’est là son moindre défaut.\nQue faisiez-vous au temps chaud ?\nDit-elle à cette emprunteuse. —\nNuit et jour à tout venant",
      rewordings: [
        "La fourmi, qui n'aime pas prêter, demande à la cigale ce qu'elle faisait pendant l'été. La cigale commence à répondre que, jour et nuit, pour tout le monde...",
        "La voisine travailleuse demande à l'affamée à quoi elle a passé la belle saison.",
      ],
    },
    {
      chunk:
        "Nuit et jour à tout venant\nJe chantais, ne vous déplaise. —\nVous chantiez, j’en suis fort aise !\nEh bien ! dansez maintenant.",
      rewordings: [
        "La cigale répond qu'elle chantait jour et nuit pour tout le monde. La fourmi lui répond avec moquerie : tu chantais, très bien, alors maintenant danse.",
        "L'insecte avoue qu'il passait son temps à chanter. La travailleuse se moque de lui et refuse de l'aider : qu'il danse maintenant.",
      ],
    },
  ],
  "esope/Le Corbeau et le Renard": [
    {
      chunk:
        "Un corbeau, ayant volé un morceau de viande, s’était perché sur un arbre. Un renard l’aperçut, et, voulant se rendre maître de la viande, se posta devant lui et loua ses proportions élégantes et sa beauté, ajoutant que nul n’était mieux fait que lui pour être le roi des oiseaux, et qu’il le serait devenu sûrement, s’il avait de la voix. Le corbeau, voulant lui montrer que la voix non plus ne lui manquait pas, lâcha la viande et poussa de grands cris.",
      rewordings: [
        "Un corbeau qui a volé de la viande se pose sur un arbre. Un renard veut la viande et le complimente sur sa beauté, en disant qu'il serait le roi des oiseaux s'il avait une belle voix ; le corbeau crie pour prouver qu'il a de la voix et lâche la viande.",
        "Un animal rusé fait des compliments à un oiseau qui tient un repas. L'oiseau, flatté, veut montrer qu'il sait chanter et laisse tomber sa nourriture.",
      ],
    },
    {
      chunk:
        "Le corbeau, voulant lui montrer que la voix non plus ne lui manquait pas, lâcha la viande et poussa de grands cris. Le renard se précipita et, saisissant le morceau, dit : « Ô corbeau, si tu avais aussi du jugement, il ne te manquerait rien pour devenir le roi des oiseaux. »",
      rewordings: [
        "Le corbeau lâche la viande en criant pour montrer sa voix. Le renard attrape le morceau et se moque de lui : s'il avait aussi de l'intelligence, il pourrait être le roi des oiseaux.",
        "L'oiseau vaniteux laisse tomber son repas, et le flatteur le prend en lui disant qu'il manque de jugeote.",
      ],
    },
    {
      chunk: "Cette fable est une leçon pour les sots.",
      rewordings: [
        "La morale : cette histoire est une leçon pour les gens bêtes.",
        "La leçon est faite pour les naïfs qui se font avoir par manque de réflexion.",
      ],
    },
  ],
  "lafontaine/Le Corbeau et le Renard": [
    {
      chunk:
        "Maître corbeau, sur un arbre perché,\nTenait en son bec un fromage.\nMaître renard, par l’odeur alléché,\nLui tint à peu près ce langage :",
      rewordings: [
        "Le corbeau est perché sur un arbre avec un fromage dans le bec. Le renard, attiré par l'odeur du fromage, s'approche et commence à lui parler.",
        "Un oiseau dans un arbre tient de la nourriture dans son bec, et un animal rusé, qui a senti l'odeur, vient lui parler.",
      ],
    },
    {
      chunk:
        "Lui tint à peu près ce langage :\nHé ! bonjour, monsieur du corbeau.\nQue vous êtes joli ! que vous me semblez beau !\nSans mentir, si votre ramage",
      rewordings: [
        "Le renard dit bonjour au corbeau et lui fait des compliments : il le trouve joli et très beau, et il commence à parler de sa voix.",
        "L'animal rusé flatte l'oiseau en lui disant qu'il est magnifique.",
      ],
    },
    {
      chunk:
        "Sans mentir, si votre ramage\nSe rapporte à votre plumage,\nVous êtes le phénix des hôtes de ces bois.\nÀ ces mots le corbeau ne se sent pas de joie ;",
      rewordings: [
        "Le renard dit au corbeau que si son chant est aussi beau que ses plumes, il est le plus merveilleux des habitants de la forêt. Le corbeau est fou de joie en entendant ces compliments.",
        "Le flatteur prétend que l'oiseau est le meilleur de tous s'il chante aussi bien qu'il est beau, et l'oiseau est ravi.",
      ],
    },
    {
      chunk:
        "À ces mots le corbeau ne se sent pas de joie ;\nEt, pour montrer sa belle voix,\nIl ouvre un large bec, laisse tomber sa proie.\nLe renard s’en saisit, et dit : Mon bon monsieur,",
      rewordings: [
        "Le corbeau, tout content, veut montrer sa belle voix : il ouvre grand son bec et laisse tomber le fromage. Le renard l'attrape et commence à lui parler.",
        "L'oiseau, trop fier de sa voix, ouvre le bec et laisse tomber sa nourriture, et le flatteur la prend.",
      ],
    },
    {
      chunk:
        "Le renard s’en saisit, et dit : Mon bon monsieur,\nApprenez que tout flatteur\nVit aux dépens de celui qui l’écoute :\nCette leçon vaut bien un fromage, sans doute.",
      rewordings: [
        "Le renard explique au corbeau que tout flatteur vit grâce à celui qui croit ses compliments. Cette leçon vaut bien un fromage.",
        "Le rusé dit à l'oiseau que ceux qui font des compliments profitent de ceux qui les écoutent, et que la leçon valait bien le repas perdu.",
      ],
    },
    {
      chunk:
        "Cette leçon vaut bien un fromage, sans doute.\nLe corbeau, honteux et confus,\nJura, mais un peu tard, qu’on ne l’y prendrait plus.",
      rewordings: [
        "Le corbeau, honteux et gêné, jure, mais trop tard, qu'on ne le trompera plus.",
        "L'oiseau qui s'est fait avoir a honte et promet de ne plus jamais se laisser piéger.",
      ],
    },
  ],
  "esope/Le Loup et l’Agneau": [
    {
      chunk:
        "Un loup, voyant un agneau qui buvait à une rivière, voulut alléguer un prétexte spécieux pour le dévorer. C’est pourquoi, bien qu’il fût lui-même en amont, il l’accusa de troubler l’eau et de l’empêcher de boire. L’agneau répondit qu’il ne buvait que du bout des lèvres, et que d’ailleurs, étant à l’aval, il ne pouvait troubler l’eau à l’amont.",
      rewordings: [
        "Un loup voit un agneau qui boit à la rivière et cherche une fausse raison pour le manger. Il l'accuse de salir l'eau, alors que le loup est en amont ; l'agneau répond qu'il boit à peine et qu'étant plus bas, il ne peut pas salir l'eau du loup.",
        "Un prédateur invente une excuse pour attaquer un petit animal qui boit : il prétend qu'il salit son eau. Le petit explique que c'est impossible car il est plus bas dans le courant.",
      ],
    },
    {
      chunk:
        "L’agneau répondit qu’il ne buvait que du bout des lèvres, et que d’ailleurs, étant à l’aval, il ne pouvait troubler l’eau à l’amont. Le loup, ayant manqué son effet, reprit : « Mais l’an passé tu as insulté mon père. — Je n’étais pas même né à cette époque, » répondit l’agneau. Alors le loup reprit : « Quelle que soit ta facilité à te justifier, je ne t’en mangerai pas moins. »",
      rewordings: [
        "L'agneau prouve qu'il ne peut pas salir l'eau. Le loup l'accuse alors d'avoir insulté son père l'année dernière, mais l'agneau répond qu'il n'était pas né ; le loup dit qu'il le mangera quand même, peu importe ses bonnes excuses.",
        "Le petit se défend avec de bons arguments, mais le méchant change d'accusation puis avoue qu'il va le dévorer de toute façon.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’auprès des gens décidés à faire le mal la plus juste défense reste sans effet.",
      rewordings: [
        "La morale : face aux gens décidés à faire le mal, même la défense la plus juste ne sert à rien.",
        "La leçon est qu'avoir raison ne protège pas contre quelqu'un qui veut nous faire du mal.",
      ],
    },
  ],
  "lafontaine/Le Loup et l’Agneau": [
    {
      chunk:
        "La raison du plus fort est toujours la meilleure :\nNous l’allons montrer tout à l’heure.\nUn agneau se désaltérait\nDans le courant d’une onde pure.",
      rewordings: [
        "Le poète annonce la morale : celui qui est le plus fort a toujours raison, et il va le montrer. Un agneau boit dans un ruisseau d'eau pure.",
        "La loi du plus fort gagne toujours, explique l'auteur, avant de raconter l'histoire d'un petit animal qui boit dans l'eau claire.",
      ],
    },
    {
      chunk:
        "Dans le courant d’une onde pure.\nUn loup survint à jeun, qui cherchait aventure,\nEt que la faim en ces lieux attirait.\nQui te rend si hardi de troubler mon breuvage ?",
      rewordings: [
        "Pendant que l'agneau boit dans le ruisseau, un loup affamé arrive en cherchant une proie. Il demande à l'agneau comment il ose salir son eau.",
        "Un prédateur qui a faim arrive près du petit animal et l'accuse de salir sa boisson.",
      ],
    },
    {
      chunk:
        "Qui te rend si hardi de troubler mon breuvage ?\nDit cet animal plein de rage :\nTu seras châtié de ta témérité.\nSire, répond l’agneau, que Votre Majesté",
      rewordings: [
        "Le loup, furieux, accuse l'agneau de salir son eau et le menace de le punir. L'agneau lui répond très poliment en l'appelant Votre Majesté.",
        "Le méchant en colère menace le petit, qui répond avec respect.",
      ],
    },
    {
      chunk:
        "Sire, répond l’agneau, que Votre Majesté\nNe se mette pas en colère ;\nMais plutôt qu’elle considère\nQue je me vas désaltérant",
      rewordings: [
        "L'agneau demande poliment au loup de ne pas se fâcher et de bien réfléchir au fait qu'il est en train de boire.",
        "Le petit animal supplie le plus fort de se calmer et de regarder où il boit.",
      ],
    },
    {
      chunk:
        "Que je me vas désaltérant\nDans le courant,\nPlus de vingt pas au-dessous d’elle ;\nEt que, par conséquent, en aucune façon",
      rewordings: [
        "L'agneau explique qu'il boit dans le courant, plus de vingt pas en dessous du loup, et donc que...",
        "Le petit fait remarquer qu'il est bien plus bas dans le ruisseau que le prédateur.",
      ],
    },
    {
      chunk:
        "Et que, par conséquent, en aucune façon\nJe ne puis troubler sa boisson.\nTu la troubles ! reprit cette bête cruelle ;\nEt je sais que de moi tu médis l’an passé.",
      rewordings: [
        "L'agneau conclut qu'il ne peut absolument pas salir l'eau du loup. Le loup cruel insiste qu'il la salit, et l'accuse aussi d'avoir dit du mal de lui l'année dernière.",
        "Le petit prouve que l'accusation est fausse, mais le méchant refuse de l'entendre et invente une nouvelle accusation.",
      ],
    },
    {
      chunk:
        "Et je sais que de moi tu médis l’an passé.\nComment l’aurais-je fait, si je n’étais pas né ?\nReprit l’agneau : je tette encor ma mère. —\nSi ce n’est toi, c’est donc ton frère. —",
      rewordings: [
        "L'agneau répond qu'il ne pouvait pas, puisqu'il n'était pas encore né et qu'il tète encore sa mère. Le loup dit alors que c'était donc son frère.",
        "Le petit montre qu'il est trop jeune pour être coupable, alors le méchant accuse un membre de sa famille.",
      ],
    },
    {
      chunk:
        "Si ce n’est toi, c’est donc ton frère. —\nJe n’en ai point. — C’est donc quelqu’un des tiens ;\nCar vous ne m’épargnez guère,\nVous, vos bergers et vos chiens.",
      rewordings: [
        "L'agneau dit qu'il n'a pas de frère. Le loup accuse alors un de ses proches, et tous les moutons, les bergers et les chiens, de toujours l'attaquer.",
        "Le méchant change encore d'excuse et accuse toute la famille et les protecteurs du petit.",
      ],
    },
    {
      chunk:
        "Vous, vos bergers et vos chiens.\nOn me l’a dit : il faut que je me venge.\nLà-dessus, au fond des forêts\nLe loup l’emporte, et puis le mange,",
      rewordings: [
        "Le loup dit qu'on lui a raconté tout cela et qu'il doit se venger. Alors il emporte l'agneau au fond de la forêt et le mange.",
        "Le prédateur prétend vouloir se venger, entraîne le petit dans les bois et le dévore.",
      ],
    },
    {
      chunk: "Le loup l’emporte, et puis le mange,\nSans autre forme de procès.",
      rewordings: [
        "Le loup mange l'agneau sans aucun jugement ni procès.",
        "Le plus fort dévore l'innocent sans lui laisser la moindre chance de se défendre.",
      ],
    },
  ],
  "esope/La Tortue et le Lièvre": [
    {
      chunk:
        "La tortue et le lièvre disputaient qui était le plus vite. En conséquence ils fixèrent un jour et un endroit et se séparèrent. Or le lièvre, confiant dans sa vitesse naturelle, ne se pressa pas de partir ; il se coucha au bord de la route et s’endormit ; mais la tortue, qui avait conscience de sa lenteur, ne cessa de courir, et, prenant ainsi l’avance sur le lièvre endormi, elle arriva au but et gagna le prix.",
      rewordings: [
        "La tortue et le lièvre se disputent pour savoir qui est le plus rapide, et ils organisent une course. Le lièvre, sûr de sa vitesse, prend son temps et s'endort au bord de la route, tandis que la tortue, qui se sait lente, avance sans s'arrêter, le dépasse et gagne.",
        "Un animal lent et un animal rapide font une course. Le rapide, trop confiant, fait une sieste, et le lent qui ne s'arrête jamais gagne.",
      ],
    },
    {
      chunk:
        "Cette fable montre que souvent le travail l’emporte sur les dons naturels, si on les néglige.",
      rewordings: [
        "La morale : souvent, le travail est plus fort que les talents naturels quand on ne les utilise pas sérieusement.",
        "La leçon est que l'effort et la persévérance battent le talent de celui qui est paresseux.",
      ],
    },
  ],
  "lafontaine/Le Lièvre et la Tortue": [
    {
      chunk:
        "Rien ne sert de courir ; il faut partir à point :\nLe lièvre et la tortue en sont un témoignage.\nGageons, dit celle-ci, que vous n’atteindrez point\nSitôt que moi ce but. Sitôt ! êtes-vous sage ?",
      rewordings: [
        "Le poète donne la morale : il ne sert à rien de courir vite, il faut partir au bon moment, comme le montrent le lièvre et la tortue. La tortue parie avec le lièvre qu'il n'arrivera pas au but avant elle, et le lièvre est étonné.",
        "La leçon est annoncée : partir à temps compte plus que la vitesse. Un animal lent lance un défi de course à un animal rapide.",
      ],
    },
    {
      chunk:
        "Sitôt que moi ce but. Sitôt ! êtes-vous sage ?\nRepartit l’animal léger :\nMa commère, il vous faut purger\nAvec quatre grains d’ellébore.",
      rewordings: [
        "Le lièvre, étonné par le pari de la tortue, lui demande si elle est folle. Il se moque d'elle et dit qu'elle a besoin d'un remède contre la folie.",
        "L'animal rapide se moque du lent et le traite de fou d'oser le défier.",
      ],
    },
    {
      chunk:
        "Avec quatre grains d’ellébore.\n— Sage ou non, je parie encore.\nAinsi fut fait ; et de tous deux\nOn mit près du but les enjeux.",
      rewordings: [
        "La tortue répond qu'elle maintient son pari, folle ou pas. Le pari est fait et on dépose les mises près de la ligne d'arrivée.",
        "L'animal lent insiste pour faire la course, et les deux concurrents mettent un enjeu en jeu.",
      ],
    },
    {
      chunk:
        "On mit près du but les enjeux.\nSavoir quoi, ce n’est pas l’affaire,\nNi de quel juge l’on convint.\nNotre lièvre n’avait que quatre pas à faire ;",
      rewordings: [
        "Le poète dit que peu importe ce qu'on a parié ni qui est l'arbitre. Le lièvre n'a que quelques bonds à faire pour gagner.",
        "L'enjeu et le juge ne comptent pas ; l'animal rapide n'a presque rien à faire pour arriver.",
      ],
    },
    {
      chunk:
        "Notre lièvre n’avait que quatre pas à faire ;\nJ’entends de ceux qu’il fait lorsque, près d’être atteint,\nIl s’éloigne des chiens, les renvoie aux calendes,\nEt leur fait arpenter les landes.",
      rewordings: [
        "Le lièvre n'a que quatre bonds à faire, comme ceux qu'il fait quand il échappe aux chiens de chasse et les laisse loin derrière lui.",
        "L'animal rapide est si vif qu'il sème facilement les chiens qui le poursuivent.",
      ],
    },
    {
      chunk:
        "Et leur fait arpenter les landes.\nAyant, dis-je, du temps de reste pour brouter,\nPour dormir, et pour écouter\nD’où vient le vent, il laisse la tortue",
      rewordings: [
        "Le lièvre, qui a beaucoup de temps devant lui, mange de l'herbe, dort et regarde d'où vient le vent. Il laisse la tortue partir.",
        "Trop sûr de lui, l'animal rapide perd son temps à manger et à se reposer pendant que l'autre part.",
      ],
    },
    {
      chunk:
        "D’où vient le vent, il laisse la tortue\nAller son train de sénateur.\nElle part, elle s’évertue ;\nElle se hâte avec lenteur.",
      rewordings: [
        "Le lièvre laisse la tortue avancer à son rythme lent et tranquille. Elle part, fait de gros efforts et se dépêche lentement.",
        "L'animal lent avance doucement mais sans s'arrêter, en faisant de son mieux.",
      ],
    },
    {
      chunk:
        "Elle se hâte avec lenteur.\nLui cependant méprise une telle victoire,\nTient la gageure à peu de gloire,\nCroit qu’il y va de son honneur",
      rewordings: [
        "Pendant que la tortue avance lentement, le lièvre trouve qu'une victoire si facile n'a pas de valeur et pense que c'est une question d'honneur.",
        "L'animal rapide méprise la course et trouve que gagner contre un si lent ne vaut rien.",
      ],
    },
    {
      chunk:
        "Croit qu’il y va de son honneur\nDe partir tard. Il broute, il se repose ;\nIl s’amuse à toute autre chose\nQu’à la gageure. À la fin, quand il vit",
      rewordings: [
        "Le lièvre croit que c'est une question d'honneur de partir tard. Il mange, se repose et s'amuse à tout sauf à la course, jusqu'au moment où il voit...",
        "Par orgueil, l'animal rapide fait tout sauf courir : il mange, se repose et s'amuse.",
      ],
    },
    {
      chunk:
        "Qu’à la gageure. À la fin, quand il vit\nQue l’autre touchait presque au bout de la carrière,\nIl partit comme un trait ; mais les élans qu’il fit\nFurent vains : la tortue arriva la première.",
      rewordings: [
        "Le lièvre voit que la tortue est presque arrivée, alors il part à toute vitesse comme une flèche. Mais c'est trop tard : la tortue arrive la première.",
        "Quand il se décide enfin à courir, l'animal rapide ne peut plus rattraper le lent, qui gagne la course.",
      ],
    },
    {
      chunk:
        "Furent vains : la tortue arriva la première.\nEh bien ! lui cria-t-elle, avais-je pas raison ?\nDe quoi vous sert votre vitesse ?\nMoi l’emporter ! et que serait-ce",
      rewordings: [
        "La tortue gagne et crie au lièvre qu'elle avait raison. Elle lui demande à quoi lui a servi sa vitesse, et se vante d'avoir gagné.",
        "L'animal lent se moque du rapide : sa vitesse ne lui a servi à rien puisqu'il a perdu.",
      ],
    },
    {
      chunk: "Moi l’emporter ! et que serait-ce\nSi vous portiez une maison ?",
      rewordings: [
        "La tortue ajoute en se moquant : qu'est-ce que ce serait si le lièvre devait porter une maison sur son dos comme elle ?",
        "Le gagnant lent rappelle qu'il a gagné malgré sa carapace lourde, ce qui rend la défaite du rapide encore plus humiliante.",
      ],
    },
  ],
  "esope/Le Lion et le Rat reconnaissant": [
    {
      chunk:
        "Un lion dormait ; un rat s’en vint trottiner sur son corps. Le lion, se réveillant, le saisit, et il allait le manger, quand le rat le pria de le relâcher, promettant, s’il lui laissait la vie, de le payer de retour. Le lion se mit à rire et le laissa aller.",
      rewordings: [
        "Un rat court sur le corps d'un lion qui dort. Le lion se réveille, l'attrape et veut le manger, mais le rat le supplie de le relâcher en promettant de lui rendre service un jour ; le lion rit et le laisse partir.",
        "Un petit animal réveille un grand fauve, qui l'attrape. Le petit demande grâce en promettant de l'aider plus tard, et le fort, amusé, le libère.",
      ],
    },
    {
      chunk:
        "Le lion se mit à rire et le laissa aller. Or il arriva que peu de temps après il dut son salut à la reconnaissance du rat. Des chasseurs en effet le prirent et l’attachèrent à un arbre avec une corde.",
      rewordings: [
        "Le lion laisse partir le rat en riant. Peu de temps après, le lion est sauvé grâce à la reconnaissance du rat : des chasseurs l'avaient capturé et attaché à un arbre avec une corde.",
        "Le fort libère le petit, mais plus tard, c'est lui qui est piégé et ligoté par des chasseurs.",
      ],
    },
    {
      chunk:
        "Des chasseurs en effet le prirent et l’attachèrent à un arbre avec une corde. Alors le rat l’entendant gémir accourut, rongea la corde et le délivra. « Naguère, dit-il, tu t’es moqué de moi, parce que tu n’attendais pas de retour de ma part ; sache maintenant que chez les rats aussi on trouve de la reconnaissance. »",
      rewordings: [
        "Le lion est attaché à un arbre par des chasseurs. Le rat l'entend gémir, accourt, ronge la corde et le libère, en lui disant que même les rats savent être reconnaissants.",
        "Le petit animal vient sauver le fort prisonnier en coupant la corde avec ses dents, pour montrer que les petits aussi savent remercier.",
      ],
    },
    {
      chunk:
        "Cette fable montre que dans les changements de fortune les gens les plus puissants ont besoin des faibles.",
      rewordings: [
        "La morale : quand la chance tourne, même les gens les plus puissants ont besoin des plus faibles.",
        "La leçon est que les forts peuvent un jour dépendre de l'aide des petits.",
      ],
    },
  ],
  "lafontaine/Le Lion et le Rat": [
    {
      chunk:
        "Il faut, autant qu’on peut, obliger tout le monde :\nOn a souvent besoin d’un plus petit que soi.\nDe cette vérité deux fables feront foi ;\nTant la chose en preuves abonde.",
      rewordings: [
        "Le poète dit qu'il faut aider tout le monde autant qu'on peut, car on a souvent besoin d'un plus petit que soi. Deux fables vont le prouver, tant les exemples sont nombreux.",
        "La leçon annoncée : rends service à chacun, car même les petits peuvent un jour t'aider.",
      ],
    },
    {
      chunk:
        "Tant la chose en preuves abonde.\nEntre les pattes d’un lion\nUn rat sortit de terre assez à l’étourdie.\nLe roi des animaux, en cette occasion,",
      rewordings: [
        "Les exemples sont nombreux. Un rat sort de terre sans faire attention et se retrouve entre les pattes d'un lion.",
        "Un petit animal étourdi se retrouve par erreur entre les griffes d'un grand fauve.",
      ],
    },
    {
      chunk:
        "Le roi des animaux, en cette occasion,\nMontra ce qu’il était, et lui donna la vie.\nCe bienfait ne fut pas perdu.\nQuelqu’un aurait-il jamais cru",
      rewordings: [
        "Le lion, roi des animaux, montre sa générosité et laisse la vie sauve au rat. Cette bonne action ne sera pas perdue.",
        "Le fort épargne le petit, et cette gentillesse sera récompensée plus tard.",
      ],
    },
    {
      chunk:
        "Quelqu’un aurait-il jamais cru\nQu’un lion d’un rat eût affaire ?\nCependant il advint qu’au sortir des forêts\nCe lion fut pris dans des rets,",
      rewordings: [
        "Personne n'aurait cru qu'un lion puisse avoir besoin d'un rat. Pourtant, en sortant de la forêt, le lion se fait prendre dans un filet.",
        "On ne penserait jamais qu'un puissant ait besoin d'un petit, mais le fauve tombe dans un piège de chasseurs.",
      ],
    },
    {
      chunk:
        "Ce lion fut pris dans des rets,\nDont ses rugissements ne le purent défaire.\nSire rat accourut, et fit tant par ses dents\nQu’une maille rongée emporta tout l’ouvrage.",
      rewordings: [
        "Le lion pris dans le filet rugit sans réussir à se libérer. Le rat arrive et ronge tellement avec ses dents qu'une maille coupée défait tout le filet.",
        "Malgré sa force, le fauve reste prisonnier ; c'est le petit animal qui le sauve en grignotant les cordes.",
      ],
    },
    {
      chunk:
        "Qu’une maille rongée emporta tout l’ouvrage.\nPatience et longueur de temps\nFont plus que force ni que rage.",
      rewordings: [
        "Le rat a libéré le lion en rongeant une maille. La morale : la patience et le temps réussissent mieux que la force et la colère.",
        "La leçon est que la persévérance est plus efficace que la force brute.",
      ],
    },
  ],
  "esope/Le Renard et les Raisins": [
    {
      chunk:
        "Un renard affamé, voyant des grappes de raisin pendre à une treille, voulut les attraper ; mais ne pouvant y parvenir, il s’éloigna en se disant à lui-même : « C’est du verjus. »",
      rewordings: [
        "Un renard qui a faim voit des grappes de raisin accrochées à une vigne et essaie de les attraper. Comme il n'y arrive pas, il part en se disant que ces raisins sont trop acides.",
        "Un animal affamé ne réussit pas à attraper des fruits trop hauts et prétend qu'ils ne sont pas mûrs pour se consoler.",
      ],
    },
    {
      chunk:
        "Pareillement certains hommes, ne pouvant mener à bien leurs affaires, à cause de leur incapacité, en accusent les circonstances.",
      rewordings: [
        "La morale : de la même façon, certaines personnes qui échouent par manque de capacité accusent les circonstances.",
        "La leçon est que beaucoup de gens rejettent la faute de leur échec sur les autres ou sur la situation.",
      ],
    },
  ],
  "lafontaine/Le Renard et les Raisins": [
    {
      chunk:
        "Certain renard gascon, d’autres disent normand,\nMourant presque de faim, vit au haut d’une treille\nDes raisins, mûrs apparemment,\nEt couverts d’une peau vermeille.",
      rewordings: [
        "Un renard, qui vient peut-être de Gascogne ou de Normandie, meurt presque de faim. Il voit en haut d'une vigne des raisins qui semblent mûrs, à la peau bien rouge.",
        "Un animal affamé remarque des fruits délicieux suspendus en hauteur.",
      ],
    },
    {
      chunk:
        "Et couverts d’une peau vermeille.\nLe galant en eût fait volontiers un repas ;\nMais comme il n’y pouvait atteindre :\nIls sont trop verts, dit-il, et bons pour des goujats.",
      rewordings: [
        "Les raisins ont une belle peau rouge, et le renard aimerait bien en faire son repas. Mais comme il ne peut pas les atteindre, il dit qu'ils sont trop verts et bons seulement pour les gens grossiers.",
        "L'animal voudrait manger les fruits mais ils sont trop hauts, alors il prétend qu'ils ne valent rien.",
      ],
    },
    {
      chunk:
        "Ils sont trop verts, dit-il, et bons pour des goujats.\nFit-il pas mieux que de se plaindre ?",
      rewordings: [
        "Le renard dit que les raisins sont trop verts et bons pour des rustres. Le poète demande : n'est-ce pas mieux que de se plaindre ?",
        "Plutôt que de se lamenter de son échec, l'animal fait semblant de mépriser ce qu'il ne peut pas avoir.",
      ],
    },
  ],
  "esope/Le Roseau et l’Olivier": [
    {
      chunk:
        "Le roseau et l’olivier disputaient de leur endurance, de leur force, de leur fermeté. L’olivier reprochait au roseau son impuissance et sa facilité à céder à tous les vents. Le roseau garda le silence et ne répondit mot.",
      rewordings: [
        "Le roseau et l'olivier se disputent pour savoir lequel est le plus fort et le plus résistant. L'olivier se moque du roseau, qu'il trouve faible car il plie à chaque coup de vent ; le roseau ne répond pas.",
        "Un arbre fier se moque d'une plante fragile qui se courbe dès qu'il y a du vent, et la plante reste silencieuse.",
      ],
    },
    {
      chunk:
        "Le roseau garda le silence et ne répondit mot. Or le vent ne tarda pas à souffler avec violence. Le roseau, secoué et courbé par les vents, s’en tira facilement ; mais l’olivier, résistant aux vents, fut cassé par leur violence.",
      rewordings: [
        "Le roseau se tait. Bientôt, un vent violent souffle : le roseau, secoué et plié, s'en sort facilement, mais l'olivier, qui résiste au vent, est cassé.",
        "Pendant la tempête, la plante souple se courbe et survit, mais l'arbre rigide se brise.",
      ],
    },
    {
      chunk:
        "Cette fable montre que ceux qui cèdent aux circonstances et à la force ont l’avantage sur ceux qui rivalisent avec de plus puissants.",
      rewordings: [
        "La morale : ceux qui s'adaptent aux circonstances et cèdent à la force s'en sortent mieux que ceux qui veulent lutter contre plus puissant qu'eux.",
        "La leçon est qu'il vaut mieux plier que de se battre contre plus fort que soi.",
      ],
    },
  ],
  "lafontaine/Le Chêne et le Roseau": [
    {
      chunk:
        "Le chêne un jour dit au roseau :\nVous avez bien sujet d’accuser la nature ;\nUn roitelet pour vous est un pesant fardeau :\nLe moindre vent qui d’aventure",
      rewordings: [
        "Un jour, le chêne dit au roseau qu'il a bien raison de se plaindre de la nature, car même un tout petit oiseau est trop lourd pour lui, et le moindre vent...",
        "Un grand arbre se moque gentiment d'une petite plante si fragile qu'un minuscule oiseau la fait plier.",
      ],
    },
    {
      chunk:
        "Le moindre vent qui d’aventure\nFait rider la face de l’eau,\nVous oblige à baisser la tête ;\nCependant que mon front, au Caucase pareil,",
      rewordings: [
        "Le chêne dit au roseau que le moindre vent qui ride la surface de l'eau l'oblige à baisser la tête, alors que lui, le chêne, est grand comme une montagne.",
        "Le grand arbre fait remarquer que la plante plie au plus petit souffle, alors que lui est immense.",
      ],
    },
    {
      chunk:
        "Cependant que mon front, au Caucase pareil,\nNon content d’arrêter les rayons du soleil,\nBrave l’effort de la tempête.\nTout vous est aquilon, tout me semble zéphyr.",
      rewordings: [
        "Le chêne se vante : sa cime est haute comme une montagne, arrête les rayons du soleil et résiste à la tempête. Pour le roseau tout est vent violent, pour lui tout est petite brise.",
        "Le grand arbre est très fier de sa force : les tempêtes ne lui font rien, alors que pour la plante, le moindre vent est terrible.",
      ],
    },
    {
      chunk:
        "Tout vous est aquilon, tout me semble zéphyr.\nEncor si vous naissiez à l’abri du feuillage\nDont je couvre le voisinage,\nVous n’auriez pas tant à souffrir,",
      rewordings: [
        "Le chêne dit au roseau que s'il poussait à l'abri de son feuillage, il souffrirait moins.",
        "Le grand arbre propose sa protection à la plante fragile.",
      ],
    },
    {
      chunk:
        "Vous n’auriez pas tant à souffrir,\nJe vous défendrais de l’orage :\nMais vous naissez le plus souvent\nSur les humides bords des royaumes du vent.",
      rewordings: [
        "Le chêne dit qu'il protégerait le roseau de l'orage, mais que le roseau pousse le plus souvent au bord de l'eau, là où le vent souffle fort.",
        "Le grand arbre regrette que la plante pousse dans des endroits humides exposés au vent.",
      ],
    },
    {
      chunk:
        "Sur les humides bords des royaumes du vent.\nLa nature envers vous me semble bien injuste.\nVotre compassion, lui répondit l’arbuste,\nPart d’un bon naturel ; mais quittez ce souci :",
      rewordings: [
        "Le chêne trouve la nature injuste envers le roseau. Le roseau lui répond que sa pitié vient d'un bon cœur, mais qu'il n'a pas à s'inquiéter.",
        "Le grand arbre plaint la plante, qui le remercie poliment mais lui dit de ne pas s'en faire.",
      ],
    },
    {
      chunk:
        "Part d’un bon naturel ; mais quittez ce souci :\nLes vents me sont moins qu’à vous redoutables ;\nJe plie et ne romps pas. Vous avez jusqu’ici\nContre leurs coups épouvantables",
      rewordings: [
        "Le roseau explique que les vents sont moins dangereux pour lui que pour le chêne : il plie mais ne casse pas. Jusqu'ici, le chêne a résisté aux coups du vent...",
        "La plante souple explique qu'elle se courbe sans jamais se briser, contrairement au grand arbre rigide.",
      ],
    },
    {
      chunk:
        "Contre leurs coups épouvantables\nRésisté sans courber le dos ;\nMais attendons la fin. Comme il disait ces mots,\nDu bout de l’horizon accourt avec furie",
      rewordings: [
        "Le roseau dit que le chêne a résisté au vent sans se courber, mais qu'il faut attendre la fin. Pendant qu'il parle, une tempête furieuse arrive de l'horizon.",
        "La plante prévient l'arbre que l'histoire n'est pas finie, et une violente tempête arrive.",
      ],
    },
    {
      chunk:
        "Du bout de l’horizon accourt avec furie\nLe plus terrible des enfants\nQue le Nord eût portés jusque-là dans ses flancs.\nL’arbre tient bon ; le roseau plie.",
      rewordings: [
        "Une tempête terrible, la plus violente jamais venue du nord, arrive. Le chêne tient bon et le roseau se plie.",
        "Le vent du nord souffle très fort : le grand arbre résiste, la petite plante se courbe.",
      ],
    },
    {
      chunk:
        "L’arbre tient bon ; le roseau plie.\nLe vent redouble ses efforts,\nEt fait si bien qu’il déracine\nCelui de qui la tête au ciel était voisine,",
      rewordings: [
        "Le chêne résiste et le roseau plie. Le vent souffle de plus en plus fort et finit par déraciner le chêne, dont la tête touchait le ciel.",
        "La tempête redouble et arrache le grand arbre orgueilleux, pendant que la plante souple survit.",
      ],
    },
    {
      chunk:
        "Celui de qui la tête au ciel était voisine,\nEt dont les pieds touchaient à l’empire des morts.",
      rewordings: [
        "Le chêne déraciné était celui dont la cime touchait le ciel et dont les racines descendaient jusqu'au monde des morts.",
        "Le géant qui semblait si puissant, immense du sommet jusqu'aux racines, est tombé.",
      ],
    },
  ],
  "esope/Le Rat des champs et le Rat de ville": [
    {
      chunk:
        "Un rat des champs avait pour ami un rat de maison. Le rat de maison invité par son ami s’empressa d’aller dîner à la campagne. Mais comme il n’avait à manger que de l’herbe et du blé, il dit : « Sais-tu bien, mon ami, que tu mènes une vie de fourmi ?",
      rewordings: [
        "Un rat des champs a pour ami un rat de maison, et il l'invite à dîner à la campagne. Le rat de maison, qui n'a que de l'herbe et du blé à manger, lui dit qu'il mène une vie pauvre comme une fourmi.",
        "Un animal de la campagne invite son ami de la ville, qui trouve le repas trop simple et se moque de sa vie modeste.",
      ],
    },
    {
      chunk:
        "Mais comme il n’avait à manger que de l’herbe et du blé, il dit : « Sais-tu bien, mon ami, que tu mènes une vie de fourmi ? Moi, au contraire, j’ai des biens en abondance. Viens avec moi, je les mets tous à ta disposition. »",
      rewordings: [
        "Le rat de maison trouve que le rat des champs mène une vie pauvre. Il lui dit que lui a beaucoup de richesses et l'invite à venir chez lui pour en profiter.",
        "Le citadin se vante d'avoir plein de bonnes choses et propose à son ami campagnard de les partager.",
      ],
    },
    {
      chunk:
        "Viens avec moi, je les mets tous à ta disposition. » Ils partirent aussitôt tous les deux. Le rat de maison fit voir à son camarade des légumes et du blé, et avec cela des figues, un fromage, du miel, des fruits.",
      rewordings: [
        "Le rat de maison invite le rat des champs chez lui, et ils partent tout de suite. En ville, il lui montre des légumes, du blé, des figues, du fromage, du miel et des fruits.",
        "Les deux amis vont en ville, et le citadin montre à l'autre une grande quantité de nourriture délicieuse.",
      ],
    },
    {
      chunk:
        "Le rat de maison fit voir à son camarade des légumes et du blé, et avec cela des figues, un fromage, du miel, des fruits. Et celui-ci émerveillé le bénissait de tout son cœur, et maudissait sa propre fortune. Comme ils s’apprêtaient à commencer le festin, soudain un homme ouvrit la porte.",
      rewordings: [
        "Devant toute cette nourriture, le rat des champs est émerveillé, remercie son ami et regrette sa propre vie. Mais au moment de commencer le festin, un homme ouvre la porte.",
        "Le campagnard est jaloux de ce luxe, mais un humain arrive juste avant le repas.",
      ],
    },
    {
      chunk:
        "Comme ils s’apprêtaient à commencer le festin, soudain un homme ouvrit la porte. Effrayés du bruit, nos rats se précipitèrent peureusement dans les fentes. Puis comme ils revenaient pour prendre des figues sèches, une autre personne vint chercher quelque chose à l’intérieur de la chambre.",
      rewordings: [
        "Un homme ouvre la porte au début du festin, et les rats, effrayés par le bruit, se cachent dans les fentes. Quand ils reviennent prendre des figues, une autre personne entre dans la pièce.",
        "Des humains dérangent sans cesse les deux amis, qui doivent fuir et se cacher pendant le repas.",
      ],
    },
    {
      chunk:
        "Puis comme ils revenaient pour prendre des figues sèches, une autre personne vint chercher quelque chose à l’intérieur de la chambre. À sa vue, ils se précipitèrent encore une fois dans un trou pour s’y cacher. Et alors le rat des champs, oubliant la faim, soupira et dit à l’autre : « Adieu, mon ami, tu manges à satiété et tu t’en donnes à cœur joie, mais au prix du danger et de mille craintes.",
      rewordings: [
        "Une autre personne entre, et les rats se cachent encore dans un trou. Le rat des champs, qui n'a plus faim, soupire et dit adieu à son ami : il mange beaucoup, mais avec danger et peur.",
        "Après avoir dû se cacher encore une fois, le campagnard décide de partir : ce luxe ne vaut pas toute cette peur.",
      ],
    },
    {
      chunk:
        "Et alors le rat des champs, oubliant la faim, soupira et dit à l’autre : « Adieu, mon ami, tu manges à satiété et tu t’en donnes à cœur joie, mais au prix du danger et de mille craintes. Moi, pauvret, je vais vivre en grignotant de l’orge et du blé, mais sans craindre ni suspecter personne. »",
      rewordings: [
        "Le rat des champs dit à son ami qu'il mange bien mais toujours avec peur. Lui préfère rentrer grignoter de l'orge et du blé, sans avoir peur de personne.",
        "Le campagnard choisit sa vie simple et pauvre, mais tranquille et sans danger.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’il vaut mieux mener une existence simple et paisible que de nager dans les délices en souffrant de la peur.",
      rewordings: [
        "La morale : il vaut mieux avoir une vie simple et calme que vivre dans le luxe en ayant peur.",
        "La leçon est que la tranquillité vaut plus que la richesse quand celle-ci s'accompagne de danger.",
      ],
    },
  ],
  "lafontaine/Le Rat de ville et le Rat des champs": [
    {
      chunk:
        "Autrefois le rat de ville\nInvita le rat des champs,\nD’une façon fort civile,\nÀ des reliefs d’ortolans.",
      rewordings: [
        "Autrefois, le rat de ville invite très poliment le rat des champs à manger les restes d'un repas de luxe, avec des petits oiseaux rôtis.",
        "Un animal de la ville invite gentiment son ami de la campagne à partager un repas raffiné.",
      ],
    },
    {
      chunk:
        "À des reliefs d’ortolans.\nSur un tapis de Turquie\nLe couvert se trouva mis.\nJe laisse à penser la vie",
      rewordings: [
        "Les rats vont manger des restes de petits oiseaux rôtis. La table est mise sur un beau tapis de Turquie, et on peut imaginer la belle vie qu'ils mènent.",
        "Le repas est servi sur un tapis luxueux, dans un décor de riche.",
      ],
    },
    {
      chunk:
        "Je laisse à penser la vie\nQue firent ces deux amis.\nLe régal fut fort honnête ;\nRien ne manquait au festin :",
      rewordings: [
        "On imagine la belle vie que mènent les deux rats. Le repas est excellent et rien ne manque au festin.",
        "Les deux amis se régalent d'un grand repas où il y a de tout.",
      ],
    },
    {
      chunk:
        "Rien ne manquait au festin :\nMais quelqu’un troubla la fête\nPendant qu’ils étaient en train.\nÀ la porte de la salle",
      rewordings: [
        "Rien ne manque au festin, mais quelqu'un vient déranger la fête pendant que les rats mangent, à la porte de la salle.",
        "Pendant que les amis mangent, quelqu'un vient interrompre le repas.",
      ],
    },
    {
      chunk:
        "À la porte de la salle\nIls entendirent du bruit :\nLe rat de ville détale ;\nSon camarade le suit.",
      rewordings: [
        "Les rats entendent du bruit à la porte de la salle : le rat de ville s'enfuit et le rat des champs le suit.",
        "Un bruit fait peur aux deux amis, qui s'enfuient en courant.",
      ],
    },
    {
      chunk:
        "Son camarade le suit.\nLe bruit cesse, on se retire :\nRats en campagne aussitôt ;\nEt le citadin de dire :",
      rewordings: [
        "Le rat des champs suit le rat de ville dans sa fuite. Quand le bruit s'arrête, les rats reviennent, et le rat de ville prend la parole.",
        "Une fois le danger passé, les deux amis reviennent, et le citadin veut continuer le repas.",
      ],
    },
    {
      chunk:
        "Et le citadin de dire :\nAchevons tout notre rôt.\nC’est assez, dit le rustique :\nDemain vous viendrez chez moi.",
      rewordings: [
        "Le rat de ville propose de finir le repas. Le rat des champs répond que ça suffit, et l'invite chez lui le lendemain.",
        "Le citadin veut reprendre le festin, mais le campagnard refuse et l'invite plutôt chez lui.",
      ],
    },
    {
      chunk:
        "Demain vous viendrez chez moi.\nCe n’est pas que je me pique\nDe tous vos festins de roi :\nMais rien ne vient m’interrompre ;",
      rewordings: [
        "Le rat des champs invite le rat de ville chez lui pour le lendemain. Il dit qu'il ne cherche pas à avoir des festins de roi, mais que chez lui, rien ne le dérange.",
        "Le campagnard n'envie pas les repas de luxe, car chez lui personne ne vient l'interrompre.",
      ],
    },
    {
      chunk:
        "Mais rien ne vient m’interrompre ;\nJe mange tout à loisir.\nAdieu donc. Fi du plaisir\nQue la crainte peut corrompre !",
      rewordings: [
        "Le rat des champs dit que rien ne l'interrompt et qu'il mange tranquillement. Il dit adieu en concluant que le plaisir ne vaut rien quand la peur le gâche.",
        "Le campagnard préfère manger en paix et rejette le plaisir qui est gâché par la peur.",
      ],
    },
  ],
  "esope/Le Loup et le Chien": [
    {
      chunk:
        "Un loup voyant un très gros chien attaché par un collier lui demanda : « Qui t’a lié et nourri de la sorte ? — Un chasseur, » répondit le chien. « Ah ! Dieu garde de cela le loup qui m’est cher !",
      rewordings: [
        "Le loup voit un chien très gras attaché par un collier et lui demande qui l'a attaché et nourri ainsi ; le chien répond que c'est un chasseur, et le loup s'écrie qu'il ne veut pas de ça pour lui.",
        "Un animal sauvage rencontre un animal bien nourri mais attaché, qui obéit à un maître ; le sauvage refuse cette vie.",
      ],
    },
    {
      chunk: "Dieu garde de cela le loup qui m’est cher ! Autant la faim qu’un collier pesant. »",
      rewordings: [
        "Le loup dit qu'il préfère souffrir de la faim plutôt que de porter un lourd collier.",
        "L'animal sauvage choisit d'avoir faim mais de rester libre, plutôt que d'être enchaîné.",
      ],
    },
    {
      chunk: "Cette fable montre que dans le malheur on n’a même pas les plaisirs du ventre.",
      rewordings: [
        "La morale dit que quand on n'est pas libre, même la bonne nourriture n'apporte aucun plaisir.",
        "Leçon : être prisonnier gâche tout, même le plaisir de bien manger ; la liberté vaut mieux.",
      ],
    },
  ],
  "lafontaine/Le Loup et le Chien": [
    {
      chunk:
        "Un loup n’avait que les os et la peau,\nTant les chiens faisaient bonne garde.\nCe loup rencontre un dogue aussi puissant que beau,\nGras, poli, qui s’était fourvoyé par mégarde.",
      rewordings: [
        "Le loup est très maigre car les chiens gardent bien les troupeaux ; il rencontre un gros chien fort, beau et bien gras, qui s'est égaré.",
        "Un animal sauvage affamé, qui n'a que la peau sur les os, croise un animal domestique puissant et bien nourri.",
      ],
    },
    {
      chunk:
        "Gras, poli, qui s’était fourvoyé par mégarde.\nL’attaquer, le mettre en quartiers,\nSire loup l’eût fait volontiers :\nMais il fallait livrer bataille ;",
      rewordings: [
        "Le chien gras s'est perdu ; le loup aurait bien voulu l'attaquer et le dévorer, mais il aurait fallu se battre.",
        "L'animal sauvage a envie de manger le gros chien, mais il hésite car il faudrait combattre.",
      ],
    },
    {
      chunk:
        "Mais il fallait livrer bataille ;\nEt le mâtin était de taille\nÀ se défendre hardiment.\nLe loup donc l’aborde humblement,",
      rewordings: [
        "Le chien est assez fort pour se défendre courageusement, alors le loup s'approche de lui poliment.",
        "Comme le chien est trop costaud, le loup affamé préfère lui parler gentiment plutôt que l'attaquer.",
      ],
    },
    {
      chunk:
        "Le loup donc l’aborde humblement,\nEntre en propos, et lui fait compliment\nSur son embonpoint, qu’il admire.\nIl ne tiendra qu’à vous, beau sire,",
      rewordings: [
        "Le loup salue le chien humblement et le complimente sur sa belle graisse ; le chien commence à lui répondre que cela ne dépend que de lui.",
        "L'animal maigre admire l'embonpoint du chien et le flatte ; le chien veut lui expliquer comment devenir aussi gras.",
      ],
    },
    {
      chunk:
        "Il ne tiendra qu’à vous, beau sire,\nD’être aussi gras que moi, lui repartit le chien.\nQuittez les bois, vous ferez bien :\nVos pareils y sont misérables,",
      rewordings: [
        "Le chien répond au loup qu'il peut devenir aussi gras que lui s'il quitte la forêt, où les loups vivent misérablement.",
        "L'animal domestique conseille au sauvage d'abandonner les bois, car la vie sauvage y est dure et pauvre.",
      ],
    },
    {
      chunk:
        "Vos pareils y sont misérables,\nCancres, hères et pauvres diables,\nDont la condition est de mourir de faim.\nCar, quoi ! rien d’assuré ! point de franche lippée !",
      rewordings: [
        "Le chien dit que les loups des bois sont des pauvres malheureux qui meurent de faim, sans jamais être sûrs d'avoir un bon repas.",
        "Selon le chien, la vie libre dans la nature, c'est la misère et la faim, sans aucune nourriture garantie.",
      ],
    },
    {
      chunk:
        "Car, quoi ! rien d’assuré ! point de franche lippée !\nTout à la pointe de l’épée !\nSuivez-moi, vous aurez un bien meilleur destin.\nLe loup reprit : Que me faudra-t-il faire ?",
      rewordings: [
        "Le chien ajoute que dans les bois il faut tout gagner en se battant, et propose au loup de le suivre pour une meilleure vie ; le loup demande ce qu'il devra faire.",
        "L'animal domestique invite le sauvage à venir vivre comme lui pour un meilleur sort ; le sauvage demande quel travail il devra faire.",
      ],
    },
    {
      chunk:
        "Le loup reprit : Que me faudra-t-il faire ?\nPresque rien, dit le chien : donner la chasse aux gens\nPortants bâtons, et mendiants ;\nFlatter ceux du logis, à son maître complaire ;",
      rewordings: [
        "Le chien répond qu'il faut presque rien : chasser les mendiants et les gens armés de bâtons, faire plaisir aux gens de la maison et obéir au maître.",
        "Le travail du chien de garde : chasser les intrus, être gentil avec la famille et obéir au propriétaire.",
      ],
    },
    {
      chunk:
        "Flatter ceux du logis, à son maître complaire ;\nMoyennant quoi votre salaire\nSera force reliefs de toutes les façons,\nOs de poulets, os de pigeons ;",
      rewordings: [
        "Le chien explique qu'en échange de son obéissance au maître, il reçoit beaucoup de restes de repas, des os de poulet et de pigeon.",
        "Pour prix de sa soumission, l'animal domestique est payé en nourriture : des restes et des os.",
      ],
    },
    {
      chunk:
        "Os de poulets, os de pigeons ;\nSans parler de mainte caresse.\nLe loup déjà se forge une félicité\nQui le fait pleurer de tendresse.",
      rewordings: [
        "En plus des os de poulet et de pigeon, le chien reçoit des caresses ; le loup s'imagine déjà heureux et en pleure d'émotion.",
        "Le loup affamé rêve de cette vie confortable avec à manger et de l'affection, et il en est tout ému.",
      ],
    },
    {
      chunk:
        "Qui le fait pleurer de tendresse.\nChemin faisant il vit le cou du chien pelé.\nQu’est-ce là ? lui dit-il. — Rien. — Quoi ! rien ! — Peu de chose. —\nMais encor ? — Le collier dont je suis attaché",
      rewordings: [
        "En marchant, le loup voit que le cou du chien est pelé et lui demande ce que c'est ; le chien répond d'abord que ce n'est rien, puis parle du collier qui l'attache.",
        "L'animal sauvage remarque une marque sur le cou du chien et insiste ; le chien finit par avouer qu'il porte une attache.",
      ],
    },
    {
      chunk:
        "Mais encor ? — Le collier dont je suis attaché\nDe ce que vous voyez est peut-être la cause.\nAttaché ! dit le loup : vous ne courez donc pas\nOù vous voulez ? — Pas toujours ; mais qu’importe ?",
      rewordings: [
        "Le chien avoue que c'est le collier qui l'attache qui a abîmé son cou ; le loup comprend qu'il ne peut pas courir où il veut, et le chien répond pas toujours, mais que ça n'a pas d'importance.",
        "Le loup découvre que le chien est attaché et n'est pas libre d'aller où il veut ; le chien trouve que ce n'est pas grave.",
      ],
    },
    {
      chunk:
        "Où vous voulez ? — Pas toujours ; mais qu’importe ?\nIl importe si bien, que de tous vos repas\nJe ne veux en aucune sorte,\nEt ne voudrais pas même à ce prix d’un trésor.",
      rewordings: [
        "Le loup répond que c'est très important : il ne veut d'aucun de ces repas, ni même d'un trésor, si le prix est de perdre sa liberté.",
        "L'animal sauvage refuse toute la nourriture offerte, car rien ne vaut d'être enchaîné ; il préfère la liberté.",
      ],
    },
    {
      chunk:
        "Et ne voudrais pas même à ce prix d’un trésor.\nCela dit, maître loup s’enfuit, et court encor.",
      rewordings: [
        "Le loup refuse même un trésor en échange de sa liberté, puis il s'enfuit et court encore.",
        "Après avoir dit non, le loup libre s'en va en courant et ne revient jamais.",
      ],
    },
  ],
  "esope/Le Loup et le Héron": [
    {
      chunk:
        "Un loup, ayant avalé un os, allait partout cherchant qui le débarrasserait de son mal. Il rencontra un héron, et lui demanda moyennant salaire d’enlever l’os. Alors le héron descendit sa tête dans le gosier du loup, retira l’os, puis réclama le salaire convenu.",
      rewordings: [
        "Le loup a avalé un os et cherche quelqu'un pour le soulager ; il demande au héron de retirer l'os contre un salaire, et le héron plonge sa tête dans la gorge du loup, retire l'os et réclame son paiement.",
        "Un prédateur avec un os coincé dans la gorge promet une récompense à un oiseau au long bec, qui le soigne puis demande à être payé.",
      ],
    },
    {
      chunk:
        "Alors le héron descendit sa tête dans le gosier du loup, retira l’os, puis réclama le salaire convenu. « Hé ! l’ami, répondit le loup, ne te suffit-il pas d’avoir retiré ta tête saine et sauve de la gueule du loup, et te faut-il encore un salaire ? »",
      rewordings: [
        "Après que le héron a retiré l'os et demandé son salaire, le loup lui répond qu'il devrait être content d'avoir sorti sa tête vivante de sa gueule, sans réclamer en plus un paiement.",
        "Le méchant refuse de payer celui qui l'a sauvé : il dit que rester en vie est déjà une récompense suffisante.",
      ],
    },
    {
      chunk:
        "Cette fable montre que le plus grand service qu’on puisse attendre de la reconnaissance des méchants, c’est qu’à l’ingratitude ils n’ajoutent pas l’injustice.",
      rewordings: [
        "La morale dit que le mieux qu'on puisse attendre des méchants, c'est qu'en plus d'être ingrats ils ne nous fassent pas de tort.",
        "Leçon : rendre service à un méchant ne rapporte rien ; on a déjà de la chance s'il ne nous attaque pas.",
      ],
    },
  ],
  "lafontaine/Le Loup et la Cigogne": [
    {
      chunk:
        "Les loups mangent gloutonnement.\nUn loup donc étant de frairie\nSe pressa, dit-on, tellement\nQu’il en pensa perdre la vie :",
      rewordings: [
        "Les loups mangent avec gourmandise ; un loup, pendant un festin, mange si vite qu'il manque de mourir.",
        "Un prédateur glouton avale son repas trop vite et se met en danger.",
      ],
    },
    {
      chunk:
        "Qu’il en pensa perdre la vie :\nUn os lui demeura bien avant au gosier.\nDe bonheur pour ce loup, qui ne pouvait crier,\nPrès de là passe une cigogne.",
      rewordings: [
        "Le loup a failli mourir car un os est resté coincé au fond de sa gorge et il ne peut plus crier ; heureusement une cigogne passe tout près.",
        "Un carnivore s'étouffe avec un os et ne peut appeler au secours, quand un grand oiseau arrive par chance.",
      ],
    },
    {
      chunk:
        "Près de là passe une cigogne.\nIl lui fait signe ; elle accourt.\nVoilà l’opératrice aussitôt en besogne.\nElle retira l’os ; puis, pour un si bon tour,",
      rewordings: [
        "Le loup fait signe à la cigogne qui accourt ; elle opère tout de suite, retire l'os, et attend une récompense pour ce service.",
        "L'oiseau au long cou soigne l'animal étouffé en enlevant l'os de sa gorge.",
      ],
    },
    {
      chunk:
        "Elle retira l’os ; puis, pour un si bon tour,\nElle demanda son salaire.\nVotre salaire ! dit le loup :\nVous riez, ma bonne commère !",
      rewordings: [
        "Après avoir retiré l'os, la cigogne demande son salaire ; le loup lui répond en se moquant et lui dit qu'elle plaisante.",
        "L'oiseau réclame son paiement pour l'avoir soigné, mais le prédateur refuse en riant.",
      ],
    },
    {
      chunk:
        "Vous riez, ma bonne commère !\nQuoi ! ce n’est pas encor beaucoup\nD’avoir de mon gosier retiré votre cou !\nAllez, vous êtes une ingrate :",
      rewordings: [
        "Le loup dit à la cigogne qu'elle a déjà de la chance d'avoir retiré son cou de sa gorge sans être mangée, et la traite d'ingrate.",
        "Le méchant renverse les rôles : il prétend que c'est l'oiseau qui lui doit de la reconnaissance pour être encore en vie.",
      ],
    },
    {
      chunk: "Allez, vous êtes une ingrate :\nNe tombez jamais sous ma patte.",
      rewordings: [
        "Le loup traite la cigogne d'ingrate et la menace : qu'elle ne tombe jamais sous sa patte.",
        "Au lieu de payer, le prédateur menace celui qui l'a sauvé.",
      ],
    },
  ],
  "esope/La Poule aux œufs d’or": [
    {
      chunk:
        "Un homme avait une belle poule qui pondait des œufs d’or. Croyant qu’elle avait dans le ventre une masse d’or, il la tua et la trouva semblable aux autres poules. Il avait espéré trouver la richesse d’un seul coup, et il s’était privé même du petit profit qu’il tenait.",
      rewordings: [
        "Un homme possède une poule qui pond des œufs en or ; pensant qu'elle a de l'or plein le ventre, il la tue, mais elle est comme les autres poules, et il perd le petit gain qu'il avait.",
        "Par avidité, un propriétaire tue l'animal qui l'enrichissait pour avoir tout le trésor d'un coup, et se retrouve sans rien.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’il faut se contenter de ce qu’on a, et éviter la cupidité insatiable.",
      rewordings: [
        "La morale dit qu'il faut se contenter de ce qu'on a et éviter d'être avide sans limite.",
        "Leçon : ne pas être trop gourmand d'argent, savoir être satisfait de ce qu'on possède.",
      ],
    },
  ],
  "lafontaine/La Poule aux œufs d’or": [
    {
      chunk:
        "L’avarice perd tout en voulant tout gagner.\nJe ne veux, pour le témoigner,\nQue celui dont la poule, à ce que dit la fable,\nPondait tous les jours un œuf d’or.",
      rewordings: [
        "Le poète annonce que l'avarice fait tout perdre à force de vouloir tout gagner, et il prend l'exemple d'un homme dont la poule pondait un œuf d'or chaque jour.",
        "Leçon de départ : l'avidité fait tout perdre ; exemple d'un homme qui possède un animal qui lui donne de l'or chaque jour.",
      ],
    },
    {
      chunk:
        "Pondait tous les jours un œuf d’or.\nIl crut que, dans son corps, elle avait un trésor ;\nIl la tua, l’ouvrit, et la trouva semblable\nÀ celle dont les œufs ne lui rapportaient rien,",
      rewordings: [
        "La poule pond un œuf d'or chaque jour ; l'homme croit qu'elle a un trésor dans le corps, il la tue, l'ouvre et découvre qu'elle est comme une poule ordinaire.",
        "Pensant trouver de la richesse à l'intérieur, le propriétaire tue son animal précieux, mais il n'y a rien de spécial dedans.",
      ],
    },
    {
      chunk:
        "À celle dont les œufs ne lui rapportaient rien,\nS’étant lui-même ôté le plus beau de son bien.\nBelle leçon pour les gens chiches !\nPendant ces derniers temps combien en a-t-on vus",
      rewordings: [
        "En tuant la poule, l'homme s'est privé lui-même de son plus grand bien ; le poète dit que c'est une bonne leçon pour les avares, et en a vu beaucoup d'autres.",
        "L'avide a détruit sa propre source de richesse ; c'est un avertissement pour les gens trop attachés à l'argent.",
      ],
    },
    {
      chunk:
        "Pendant ces derniers temps combien en a-t-on vus\nQui du soir au matin sont pauvres devenus\nPour vouloir trop tôt être riches !",
      rewordings: [
        "Le poète remarque que récemment beaucoup de gens sont devenus pauvres du jour au lendemain parce qu'ils voulaient être riches trop vite.",
        "Leçon : ceux qui veulent s'enrichir rapidement finissent souvent ruinés.",
      ],
    },
  ],
  "esope/Le Laboureur et ses Enfants": [
    {
      chunk:
        "Un laboureur, sur le point de terminer sa vie, voulut que ses enfants acquissent de l’expérience en agriculture. Il les fit venir et leur dit : « Mes enfants, je vais quitter ce monde ; mais vous, cherchez ce que j’ai caché dans ma vigne, et vous trouverez tout. » Les enfants s’imaginant qu’il y avait enfoui un trésor en quelque coin, bêchèrent profondément tout le sol de la vigne après la mort du père.",
      rewordings: [
        "Un paysan mourant veut que ses enfants apprennent l'agriculture ; il leur dit de chercher ce qu'il a caché dans sa vigne, et après sa mort, les enfants, croyant à un trésor, creusent profondément toute la vigne.",
        "Un vieil agriculteur, avant de mourir, fait croire à ses fils qu'une richesse est enterrée dans son champ ; ils retournent toute la terre pour la chercher.",
      ],
    },
    {
      chunk:
        "Les enfants s’imaginant qu’il y avait enfoui un trésor en quelque coin, bêchèrent profondément tout le sol de la vigne après la mort du père. De trésor, ils n’en trouvèrent point ; mais la vigne bien remuée donna son fruit au centuple.",
      rewordings: [
        "Les enfants bêchent toute la vigne pour trouver le trésor ; ils ne trouvent aucun trésor, mais la vigne bien travaillée donne une récolte cent fois plus grande.",
        "Les fils creusent partout sans trouver d'argent, mais grâce à leur travail la terre produit énormément.",
      ],
    },
    {
      chunk: "Cette fable montre que le travail est pour les hommes un trésor.",
      rewordings: [
        "La morale dit que le travail est un trésor pour les hommes.",
        "Leçon : c'est l'effort et le travail qui rendent riche.",
      ],
    },
  ],
  "lafontaine/Le Laboureur et ses enfants": [
    {
      chunk:
        "Travaillez, prenez de la peine :\nC’est le fonds qui manque le moins.\nUn riche laboureur, sentant sa mort prochaine,\nFit venir ses enfants, leur parla sans témoins.",
      rewordings: [
        "Le poète conseille de travailler et de faire des efforts, car c'est la richesse la plus sûre ; un riche laboureur qui sent sa mort venir réunit ses enfants en secret.",
        "Leçon : l'effort ne manque jamais ; un vieux fermier mourant appelle ses fils pour leur parler.",
      ],
    },
    {
      chunk:
        "Fit venir ses enfants, leur parla sans témoins.\nGardez-vous, leur dit-il, de vendre l’héritage\nQue nous ont laissé nos parents :\nUn trésor est caché dedans.",
      rewordings: [
        "Le laboureur réunit ses enfants en secret et leur dit de ne jamais vendre la terre héritée de leurs ancêtres, car un trésor y est caché.",
        "Le père mourant fait promettre à ses fils de garder le champ familial, en leur disant qu'une richesse y est enterrée.",
      ],
    },
    {
      chunk:
        "Un trésor est caché dedans.\nJe ne sais pas l’endroit ; mais un peu de courage\nVous le fera trouver : vous en viendrez à bout.\nRemuez votre champ dès qu’on aura fait l’oût :",
      rewordings: [
        "Le père dit qu'un trésor est caché dans le champ, qu'il ne sait pas où, mais qu'avec du courage ils le trouveront ; il leur dit de remuer la terre après la moisson.",
        "Le vieux fermier pousse ses fils à chercher le trésor avec courage en travaillant leur champ après la récolte.",
      ],
    },
    {
      chunk:
        "Remuez votre champ dès qu’on aura fait l’oût :\nCreusez, fouillez, bêchez ; ne laissez nulle place\nOù la main ne passe et repasse.\nLe père mort, les fils vous retournent le champ,",
      rewordings: [
        "Le père leur dit de creuser, de fouiller, de bêcher partout sans oublier un seul endroit ; après sa mort, les fils retournent tout le champ.",
        "Les fils suivent le conseil de leur père et creusent toute la terre, sans laisser un coin.",
      ],
    },
    {
      chunk:
        "Le père mort, les fils vous retournent le champ,\nDe çà, de là, partout ; si bien qu’au bout de l’an\nIl en rapporta davantage.\nD’argent, point de caché. Mais le père fut sage",
      rewordings: [
        "Les fils retournent le champ partout, et au bout d'un an il rapporte beaucoup plus ; il n'y avait pas d'argent caché, mais le père était sage.",
        "Après tout ce travail, la récolte est bien meilleure ; il n'y avait aucun trésor, mais le père avait été malin.",
      ],
    },
    {
      chunk:
        "D’argent, point de caché. Mais le père fut sage\nDe leur montrer, avant sa mort,\nQue le travail est un trésor.",
      rewordings: [
        "Il n'y avait pas d'argent caché, mais le père a été sage de montrer à ses enfants, avant de mourir, que le travail est un trésor.",
        "Leçon : la ruse du père a appris à ses fils que la vraie richesse, c'est le travail.",
      ],
    },
  ],
  "esope/Le Vieillard et la Mort": [
    {
      chunk:
        "Un jour un vieillard ayant coupé du bois, le chargea sur son dos. Il avait un long trajet à faire. Fatigué par la marche, il déposa son fardeau et il appela la Mort.",
      rewordings: [
        "Un vieillard coupe du bois et le porte sur son dos pendant un long chemin ; fatigué, il pose sa charge et appelle la Mort.",
        "Un vieil homme épuisé par un lourd fardeau demande à mourir.",
      ],
    },
    {
      chunk:
        "Fatigué par la marche, il déposa son fardeau et il appela la Mort. La Mort parut et lui demanda pour quel motif il l’appelait. Le vieillard répondit : « C’est pour que tu me soulèves mon fardeau… »",
      rewordings: [
        "Le vieillard fatigué appelle la Mort ; elle apparaît et lui demande pourquoi, et il répond que c'est pour qu'elle l'aide à soulever sa charge.",
        "Quand la mort arrive vraiment, le vieil homme change d'avis et lui demande seulement de l'aider à porter son bois.",
      ],
    },
    {
      chunk:
        "Cette fable montre que tous les hommes sont attachés à l’existence, même s’ils ont une vie misérable.",
      rewordings: [
        "La morale dit que tous les hommes tiennent à la vie, même quand leur vie est malheureuse.",
        "Leçon : même dans la misère, on ne veut pas mourir.",
      ],
    },
  ],
  "lafontaine/La Mort et le Bûcheron": [
    {
      chunk:
        "Un pauvre bucheron, tout couvert de ramée,\nSous le faix du fagot aussi bien que des ans,\nGémissant et courbé, marchait à pas pesants,\nEt tâchait de gagner sa chaumine enfumée.",
      rewordings: [
        "Un pauvre bûcheron, couvert de branches, marche lentement, courbé et gémissant sous le poids de son fagot et de son âge, pour rentrer dans sa petite maison enfumée.",
        "Un vieux travailleur pauvre porte une lourde charge de bois et rentre péniblement chez lui.",
      ],
    },
    {
      chunk:
        "Et tâchait de gagner sa chaumine enfumée.\nEnfin, n’en pouvant plus d’effort et de douleur,\nIl met bas son fagot, il songe à son malheur.\nQuel plaisir a-t-il eu depuis qu’il est au monde ?",
      rewordings: [
        "Le bûcheron essaie de rentrer chez lui ; épuisé et souffrant, il pose son fagot et pense à son malheur, en se demandant quel plaisir il a eu dans sa vie.",
        "Le pauvre homme n'en peut plus, dépose son fardeau et réfléchit à sa vie de misère.",
      ],
    },
    {
      chunk:
        "Quel plaisir a-t-il eu depuis qu’il est au monde ?\nEn est-il un plus pauvre en la machine ronde ?\nPoint de pain quelquefois, et jamais de repos :\nSa femme, ses enfants, les soldats, les impôts,",
      rewordings: [
        "Le bûcheron se demande s'il y a plus pauvre que lui sur Terre : parfois pas de pain, jamais de repos, et sa femme, ses enfants, les soldats et les impôts.",
        "Le travailleur trouve sa vie terrible : la faim, la fatigue, la famille à nourrir et les impôts.",
      ],
    },
    {
      chunk:
        "Sa femme, ses enfants, les soldats, les impôts,\nLe créancier, et la corvée,\nLui font d’un malheureux la peinture achevée.\nIl appelle la Mort. Elle vient sans tarder,",
      rewordings: [
        "Sa femme, ses enfants, les soldats, les impôts, ses dettes et le travail obligatoire font de lui un vrai malheureux ; il appelle la Mort, qui arrive tout de suite.",
        "Accablé de soucis et de dettes, l'homme pauvre demande à mourir, et la mort apparaît aussitôt.",
      ],
    },
    {
      chunk:
        "Il appelle la Mort. Elle vient sans tarder,\nLui demande ce qu’il faut faire.\nC’est, dit-il, afin de m’aider\nÀ recharger ce bois ; tu ne tarderas guère.",
      rewordings: [
        "La Mort arrive et demande au bûcheron ce qu'il veut ; il répond que c'est seulement pour l'aider à recharger son bois sur son dos.",
        "Face à la mort, le travailleur change d'avis et lui demande juste de l'aider à porter sa charge.",
      ],
    },
    {
      chunk:
        "À recharger ce bois ; tu ne tarderas guère.\nLe trépas vient tout guérir ;\nMais ne bougeons d’où nous sommes :\nPlutôt souffrir que mourir,",
      rewordings: [
        "Le bûcheron demande à la Mort de l'aider à recharger son bois ; le poète dit que la mort guérit tout, mais qu'on préfère ne pas bouger et souffrir plutôt que mourir.",
        "Leçon : même si la mort met fin aux peines, les gens préfèrent rester en vie et souffrir.",
      ],
    },
    {
      chunk: "Plutôt souffrir que mourir,\nC’est la devise des hommes.",
      rewordings: [
        "La morale dit que souffrir plutôt que mourir, c'est la règle des hommes.",
        "Leçon : tout le monde préfère une vie difficile à la mort.",
      ],
    },
  ],
  "esope/Le Renard et le Bouc": [
    {
      chunk:
        "Un renard étant tombé dans un puits se vit forcé d’y rester. Or un bouc pressé par la soif étant venu au même puits, aperçut le renard et lui demanda si l’eau était bonne. Le renard, faisant contre mauvaise fortune bon cœur, fit un grand éloge de l’eau, affirmant qu’elle était excellente, et il l’engagea à descendre.",
      rewordings: [
        "Le renard est tombé dans un puits et ne peut pas sortir ; un bouc assoiffé arrive et demande si l'eau est bonne, et le renard, cachant sa situation, lui dit qu'elle est excellente et l'invite à descendre.",
        "Un animal malin piégé au fond d'un trou ment à un animal assoiffé pour l'attirer en bas avec lui.",
      ],
    },
    {
      chunk:
        "Le renard, faisant contre mauvaise fortune bon cœur, fit un grand éloge de l’eau, affirmant qu’elle était excellente, et il l’engagea à descendre. Le bouc descendit à l’étourdie, n’écoutant que son désir. Quand il eut étanché sa soif, il se consulta avec le renard sur le moyen de remonter.",
      rewordings: [
        "Le renard vante l'eau et pousse le bouc à descendre ; le bouc descend sans réfléchir, boit, puis demande au renard comment remonter.",
        "L'animal naïf saute sans réfléchir, ne pensant qu'à boire, et se demande ensuite comment sortir.",
      ],
    },
    {
      chunk:
        "Quand il eut étanché sa soif, il se consulta avec le renard sur le moyen de remonter. Le renard prit la parole et dit : « J’ai un moyen, pour peu que tu désires notre salut commun. Veuille bien appuyer tes pieds de devant contre le mur et dresser tes cornes en l’air ; je remonterai par là, après quoi je te reguinderai, toi aussi ».",
      rewordings: [
        "Après avoir bu, le bouc demande comment sortir ; le renard propose que le bouc pose ses pattes avant contre le mur et lève ses cornes, pour que le renard monte d'abord et le tire ensuite.",
        "Le rusé propose un plan : il grimpera sur le dos de son compagnon, puis promet de l'aider à remonter.",
      ],
    },
    {
      chunk:
        "Veuille bien appuyer tes pieds de devant contre le mur et dresser tes cornes en l’air ; je remonterai par là, après quoi je te reguinderai, toi aussi ». Le bouc se prêta avec complaisance à sa proposition, et le renard, grimpant lestement le long des jambes, des épaules et des cornes de son compagnon, se trouva à l’orifice du puits, et aussitôt s’éloigna. Comme le bouc lui reprochait de violer leurs conventions, le renard se retourna et dit : « Hé ! camarade, si tu avais autant d’idées que de poils au menton, tu ne serais pas descendu avant d’avoir examiné le moyen de remonter. »",
      rewordings: [
        "Le bouc accepte, le renard grimpe sur ses pattes, son dos et ses cornes, sort du puits et part ; quand le bouc proteste, le renard lui dit que s'il avait autant d'idées que de poils de barbe, il aurait pensé à la sortie avant de descendre.",
        "Le trompeur se sert de son ami pour s'échapper puis l'abandonne en se moquant de sa bêtise.",
      ],
    },
    {
      chunk:
        "C’est ainsi que les hommes sensés ne doivent entreprendre aucune action, avant d’en avoir examiné la fin.",
      rewordings: [
        "La morale dit que les gens sensés ne doivent rien commencer avant d'avoir pensé à la fin.",
        "Leçon : il faut réfléchir aux conséquences avant d'agir.",
      ],
    },
  ],
  "lafontaine/Le Renard et le Bouc": [
    {
      chunk:
        "Capitaine renard allait de compagnie\nAvec son ami bouc des plus haut encornés :\nCelui-ci ne voyait pas plus loin que son nez ;\nL’autre était passé maître en fait de tromperie.",
      rewordings: [
        "Le renard voyage avec son ami le bouc aux grandes cornes ; le bouc est naïf et ne voit pas loin, alors que le renard est un maître de la tromperie.",
        "Deux compagnons : un animal rusé et menteur et un animal naïf qui ne réfléchit pas.",
      ],
    },
    {
      chunk:
        "L’autre était passé maître en fait de tromperie.\nLa soif les obligea de descendre en un puits ;\nLà chacun d’eux se désaltère.\nAprès qu’abondamment tous deux en eurent pris,",
      rewordings: [
        "Le renard est un expert en tromperie ; poussés par la soif, le renard et le bouc descendent dans un puits et boivent tous les deux beaucoup.",
        "L'animal malin et l'animal naïf descendent dans un trou plein d'eau pour boire.",
      ],
    },
    {
      chunk:
        "Après qu’abondamment tous deux en eurent pris,\nLe renard dit au bouc : Que ferons-nous, compère ?\nCe n’est pas tout de boire, il faut sortir d’ici.\nLève tes pieds en haut, et tes cornes aussi ;",
      rewordings: [
        "Après avoir bien bu, le renard dit au bouc qu'il faut maintenant sortir, et lui demande de lever ses pattes et ses cornes.",
        "Une fois rassasiés, le rusé fait remarquer qu'il faut sortir et commence à expliquer son plan au naïf.",
      ],
    },
    {
      chunk:
        "Lève tes pieds en haut, et tes cornes aussi ;\nMets-les contre le mur : le long de ton échine\nJe grimperai premièrement ;\nPuis sur tes cornes m’élevant,",
      rewordings: [
        "Le renard dit au bouc de lever ses pattes et ses cornes contre le mur, pour qu'il grimpe d'abord le long de son dos puis sur ses cornes.",
        "Le malin demande à son compagnon de servir d'échelle pour grimper sur lui.",
      ],
    },
    {
      chunk:
        "Puis sur tes cornes m’élevant,\nÀ l’aide de cette machine,\nDe ce lieu-ci je sortirai,\nAprès quoi je t’en tirerai.",
      rewordings: [
        "Le renard explique qu'en montant sur les cornes du bouc il sortira du puits, et qu'ensuite il le tirera dehors.",
        "Le rusé promet d'aider son ami à sortir une fois qu'il sera lui-même dehors.",
      ],
    },
    {
      chunk:
        "Après quoi je t’en tirerai.\nPar ma barbe, dit l’autre, il est bon ; et je loue\nLes gens bien sensés comme toi.\nJe n’aurais jamais, quant à moi,",
      rewordings: [
        "Le renard promet de tirer le bouc après ; le bouc trouve l'idée bonne et félicite le renard d'être si intelligent.",
        "Le naïf accepte le plan et admire la ruse de son compagnon sans se méfier.",
      ],
    },
    {
      chunk:
        "Je n’aurais jamais, quant à moi,\nTrouvé ce secret, je l’avoue.\nLe renard sort du puits, laisse son compagnon,\nEt vous lui fait un beau sermon",
      rewordings: [
        "Le bouc avoue qu'il n'aurait jamais trouvé cette idée ; le renard sort du puits, abandonne son compagnon et lui fait un discours.",
        "Une fois dehors, le malin laisse son ami au fond et commence à lui faire la leçon.",
      ],
    },
    {
      chunk:
        "Et vous lui fait un beau sermon\nPour l’exhorter à patience.\nSi le ciel t’eût, dit-il, donné par excellence\nAutant de jugement que de barbe au menton,",
      rewordings: [
        "Le renard dit au bouc d'être patient et lui reproche : si le ciel lui avait donné autant d'intelligence que de barbe au menton...",
        "Le trompeur se moque du naïf en disant qu'il a plus de barbe que de cervelle.",
      ],
    },
    {
      chunk:
        "Autant de jugement que de barbe au menton,\nTu n’aurais pas, à la légère,\nDescendu dans ce puits. Or, adieu ; j’en suis hors :\nTâche de t’en tirer et fais tous les efforts ;",
      rewordings: [
        "Le renard dit au bouc que s'il était intelligent, il ne serait pas descendu dans le puits sans réfléchir ; il lui dit adieu car lui-même est sorti, et lui conseille de se débrouiller.",
        "Le rusé reproche au naïf d'avoir agi à la légère et le laisse se débrouiller seul.",
      ],
    },
    {
      chunk:
        "Tâche de t’en tirer et fais tous les efforts ;\nCar, pour moi, j’ai certaine affaire\nQui ne me permet pas d’arrêter en chemin.\nEn toute chose il faut considérer la fin.",
      rewordings: [
        "Le renard dit au bouc de faire tous les efforts pour sortir, car lui a une affaire qui l'empêche de rester ; la morale est qu'en toute chose il faut penser à la fin.",
        "Le trompeur s'en va avec une excuse ; leçon : il faut toujours penser à la suite avant d'agir.",
      ],
    },
  ],
  "esope/Le Chien, le Coq et le Renard": [
    {
      chunk:
        "Un chien et un coq ayant fait société allaient par chemins. Le soir venu, le coq monta sur un arbre pour y dormir, et le chien se coucha au pied de l’arbre qui était creux. Or le coq ayant, suivant son habitude, chanté avant le jour, un renard l’entendit, accourut et, s’arrêtant en bas de l’arbre, le pria de descendre vers lui ; car il désirait embrasser une bête qui avait une si belle voix.",
      rewordings: [
        "Un chien et un coq voyagent ensemble ; la nuit, le coq dort dans un arbre et le chien au pied de l'arbre creux ; au matin, le coq chante, un renard l'entend et lui demande de descendre pour embrasser l'animal qui a une si belle voix.",
        "Un oiseau et un chien amis dorment près d'un arbre ; un prédateur entend l'oiseau chanter et le flatte pour le faire descendre.",
      ],
    },
    {
      chunk:
        "Or le coq ayant, suivant son habitude, chanté avant le jour, un renard l’entendit, accourut et, s’arrêtant en bas de l’arbre, le pria de descendre vers lui ; car il désirait embrasser une bête qui avait une si belle voix. Le coq lui dit d’éveiller d’abord le portier qui dormait au pied de l’arbre : il descendrait, quand celui-ci aurait ouvert. Alors, comme le renard cherchait à parler au portier, le chien bondit brusquement et le mit en pièces.",
      rewordings: [
        "Le renard flatte le coq pour qu'il descende ; le coq lui dit de réveiller d'abord le portier qui dort en bas, et quand le renard s'approche, le chien saute sur lui et le tue.",
        "L'oiseau malin envoie le flatteur vers le gardien endormi, qui est un chien, et celui-ci dévore le rusé.",
      ],
    },
    {
      chunk:
        "Cette fable montre que les gens sensés, quand leurs ennemis les attaquent, leur donnent le change en les adressant à de plus forts.",
      rewordings: [
        "La morale dit que les gens intelligents, quand leurs ennemis les attaquent, les trompent en les envoyant vers plus fort qu'eux.",
        "Leçon : face à un ennemi, il est malin de le diriger vers quelqu'un de plus fort.",
      ],
    },
  ],
  "lafontaine/Le Coq et le Renard": [
    {
      chunk:
        "Sur la branche d’un arbre était en sentinelle\nUn vieux coq adroit et matois.\nFrère, dit un renard, adoucissant sa voix,\nNous ne sommes plus en querelle :",
      rewordings: [
        "Un vieux coq malin monte la garde sur une branche ; un renard lui parle d'une voix douce, l'appelle frère et lui dit qu'ils ne sont plus ennemis.",
        "Un prédateur rusé essaie d'amadouer un vieil oiseau méfiant en lui disant qu'ils sont maintenant amis.",
      ],
    },
    {
      chunk:
        "Nous ne sommes plus en querelle :\nPaix générale cette fois.\nJe viens te l’annoncer ; descends, que je t’embrasse ;\nNe me retarde point, de grâce ;",
      rewordings: [
        "Le renard annonce au coq que c'est la paix générale, et lui demande de descendre vite pour qu'il l'embrasse, sans le retarder.",
        "Le menteur annonce une fausse paix et presse l'oiseau de descendre pour un câlin.",
      ],
    },
    {
      chunk:
        "Ne me retarde point, de grâce ;\nJe dois faire aujourd’hui vingt postes sans manquer.\nLes tiens et toi pouvez vaquer,\nSans nulle crainte, à vos affaires ;",
      rewordings: [
        "Le renard dit qu'il est pressé car il a beaucoup de chemin à faire, et que les coqs pourront maintenant vivre sans crainte.",
        "Le prédateur prétend être pressé et promet à l'oiseau qu'il n'a plus rien à craindre.",
      ],
    },
    {
      chunk:
        "Sans nulle crainte, à vos affaires ;\nNous vous y servirons en frères.\nFaites-en les feux dès ce soir,\nEt cependant viens recevoir",
      rewordings: [
        "Le renard dit que les renards traiteront les coqs comme des frères, qu'il faut faire des feux de joie le soir même, et invite le coq à descendre.",
        "Le rusé promet une amitié fraternelle et des fêtes, et insiste pour que l'oiseau descende.",
      ],
    },
    {
      chunk:
        "Et cependant viens recevoir\nLe baiser d’amour fraternelle.\nAmi, reprit le coq, je ne pouvais jamais\nApprendre une plus douce et meilleure nouvelle",
      rewordings: [
        "Le renard invite le coq à descendre pour recevoir un baiser d'amitié ; le coq répond qu'il n'aurait pas pu recevoir de meilleure nouvelle.",
        "L'oiseau fait semblant de croire le menteur et se dit ravi de cette nouvelle.",
      ],
    },
    {
      chunk:
        "Apprendre une plus douce et meilleure nouvelle\nQue celle\nDe cette paix ;\nEt ce m’est une double joie",
      rewordings: [
        "Le coq dit qu'il n'y a pas de plus douce nouvelle que cette paix, et que c'est une double joie pour lui.",
        "L'oiseau malin joue la comédie et se dit très heureux de la paix annoncée.",
      ],
    },
    {
      chunk:
        "Et ce m’est une double joie\nDe la tenir de toi. Je vois deux lévriers,\nQui, je m’assure, sont courriers\nQue pour ce sujet on envoie :",
      rewordings: [
        "Le coq dit qu'il est content d'apprendre la nouvelle par le renard, et qu'il voit deux lévriers qui sont sûrement des messagers envoyés pour cela.",
        "L'oiseau rusé prétend voir arriver deux chiens de chasse venus annoncer la paix.",
      ],
    },
    {
      chunk:
        "Que pour ce sujet on envoie :\nIls vont vite, et seront dans un moment à nous.\nJe descends : nous pourrons nous entre-baiser tous.\nAdieu, dit le renard, ma traite est longue à faire :",
      rewordings: [
        "Le coq dit que les lévriers courent vite et seront bientôt là, qu'il descend et qu'ils pourront tous s'embrasser ; le renard dit adieu car il a un long chemin à faire.",
        "En entendant parler des chiens, le prédateur prend peur et trouve une excuse pour partir.",
      ],
    },
    {
      chunk:
        "Adieu, dit le renard, ma traite est longue à faire :\nNous nous réjouirons du succès de l’affaire\nUne autre fois. Le galant aussitôt\nTire ses grègues, gagne au haut,",
      rewordings: [
        "Le renard s'excuse en disant qu'ils fêteront la paix une autre fois, puis il s'enfuit en courant.",
        "Le menteur démasqué se sauve à toute vitesse.",
      ],
    },
    {
      chunk:
        "Tire ses grègues, gagne au haut,\nMal content de son stratagème.\nEt notre vieux coq en soi-même\nSe mit à rire de sa peur ;",
      rewordings: [
        "Le renard s'enfuit vite, mécontent que sa ruse ait échoué, et le vieux coq rit de sa peur.",
        "Le trompeur part furieux et l'oiseau se moque de lui.",
      ],
    },
    {
      chunk: "Se mit à rire de sa peur ;\nCar c’est double plaisir de tromper le trompeur.",
      rewordings: [
        "Le coq rit de la peur du renard, car c'est un double plaisir de tromper celui qui voulait tromper.",
        "Leçon : c'est encore plus agréable de piéger celui qui voulait nous piéger.",
      ],
    },
  ],
  "esope/La Fourmi et la Colombe": [
    {
      chunk:
        "Une fourmi pressée par la soif était descendue dans une source et, entraînée par le courant, elle était en train de se noyer. Une colombe, l’ayant aperçue, détacha un rameau d’un arbre et le jeta dans la source ; la fourmi monta dessus et fut sauvée. Sur ces entrefaites un oiseleur s’avança avec ses gluaux ajustés pour prendre la colombe.",
      rewordings: [
        "Une fourmi assoiffée descend boire dans une source et se noie, emportée par le courant ; une colombe lui jette une branche et la fourmi est sauvée ; ensuite un chasseur d'oiseaux arrive pour prendre la colombe.",
        "Un oiseau sauve un insecte de la noyade en lui lançant une branche ; puis un chasseur menace l'oiseau.",
      ],
    },
    {
      chunk:
        "Sur ces entrefaites un oiseleur s’avança avec ses gluaux ajustés pour prendre la colombe. La fourmi s’en étant aperçue, mordit le pied de l’oiseleur, qui, sous le coup de la douleur, jeta ses gluaux et fit aussitôt envoler la colombe.",
      rewordings: [
        "Un chasseur d'oiseaux s'approche avec ses pièges pour attraper la colombe ; la fourmi le voit et lui mord le pied, il lâche ses pièges de douleur et la colombe s'envole.",
        "Le petit insecte pique le chasseur, qui sursaute, et l'oiseau a le temps de s'échapper.",
      ],
    },
    {
      chunk: "Cette fable montre qu’il faut payer de retour ses bienfaiteurs.",
      rewordings: [
        "La morale dit qu'il faut rendre la pareille à ceux qui nous ont fait du bien.",
        "Leçon : il faut aider à son tour ceux qui nous ont aidés.",
      ],
    },
  ],
  "lafontaine/La Colombe et la Fourmi": [
    {
      chunk:
        "L’autre exemple est tiré d’animaux plus petits.\nLe long d’un clair ruisseau buvait une colombe,\nQuand sur l’eau se penchant une fourmis y tombe ;\nEt dans cet océan on eût vu la fourmis",
      rewordings: [
        "Le poète annonce un autre exemple avec des animaux plus petits ; une colombe boit au bord d'un ruisseau quand une fourmi y tombe, et pour la fourmi le ruisseau est comme un océan.",
        "Nouvel exemple avec de petits animaux : un oiseau boit au bord de l'eau quand un minuscule insecte tombe dedans.",
      ],
    },
    {
      chunk:
        "Et dans cet océan on eût vu la fourmis\nS’efforcer, mais en vain, de regagner la rive.\nLa colombe aussitôt usa de charité :\nUn brin d’herbe dans l’eau par elle étant jeté,",
      rewordings: [
        "La fourmi essaie en vain de rejoindre le bord ; la colombe, par bonté, lui jette un brin d'herbe dans l'eau.",
        "L'insecte se noie et l'oiseau, généreux, lui lance une herbe pour l'aider.",
      ],
    },
    {
      chunk:
        "Un brin d’herbe dans l’eau par elle étant jeté,\nCe fut un promontoire où la fourmis arrive.\nElle se sauve. Et là-dessus\nPasse un certain croquant qui marchait les pieds nus :",
      rewordings: [
        "Grâce au brin d'herbe jeté par la colombe, la fourmi atteint la terre et est sauvée ; alors passe un paysan pieds nus.",
        "L'insecte est sauvé de la noyade ; ensuite un homme de la campagne arrive.",
      ],
    },
    {
      chunk:
        "Passe un certain croquant qui marchait les pieds nus :\nCe croquant, par hasard, avait une arbalète.\nDès qu’il voit l’oiseau de Vénus,\nIl le croit en son pot, et déjà lui fait fête.",
      rewordings: [
        "Un paysan pieds nus passe avec une arbalète ; dès qu'il voit la colombe, il imagine déjà la cuisiner et s'en réjouit.",
        "Un chasseur armé repère l'oiseau et pense déjà à le manger.",
      ],
    },
    {
      chunk:
        "Il le croit en son pot, et déjà lui fait fête.\nTandis qu’à le tuer mon villageois s’apprête,\nLa fourmi le pique au talon.\nLe vilain retourne la tête :",
      rewordings: [
        "Le paysan se prépare à tirer sur la colombe, mais la fourmi le pique au talon, et il tourne la tête.",
        "Au moment où le chasseur va tirer, le petit insecte le pique au pied pour sauver l'oiseau.",
      ],
    },
    {
      chunk:
        "Le vilain retourne la tête :\nLa colombe l’entend, part, et tire de long.\nLe souper du croquant avec elle s’envole :\nPoint de pigeon pour une obole.",
      rewordings: [
        "Le paysan se retourne, la colombe l'entend et s'envole loin ; son repas s'envole avec elle, il n'aura pas de pigeon.",
        "L'oiseau s'enfuit grâce à l'insecte et le chasseur perd son dîner.",
      ],
    },
  ],
  "esope/Le Cousin et le Lion": [
    {
      chunk:
        "Un cousin s’approcha d’un lion et lui dit : « Je n’ai pas peur de toi, et tu n’es pas plus puissant que moi. Si tu prétends le contraire, montre de quoi tu es capable. Est-ce d’égratigner avec tes griffes et de mordre avec tes dents ?",
      rewordings: [
        "Le moustique s'approche du lion et lui dit qu'il n'a pas peur de lui et qu'il n'est pas plus fort. Il lui demande de montrer ce qu'il sait faire, à part griffer et mordre.",
        "Un petit insecte provoque un gros animal sauvage et se moque de sa force.",
      ],
    },
    {
      chunk:
        "Est-ce d’égratigner avec tes griffes et de mordre avec tes dents ? Une femme même qui se bat avec son mari en fait autant. Moi, je suis beaucoup plus fort que toi ; si tu veux, je te provoque même au combat. »",
      rewordings: [
        "Le moustique dit au lion que griffer et mordre, même une femme qui se dispute avec son mari le fait. Il affirme être bien plus fort que le lion et le défie en combat.",
        "Le petit insecte se vante d'être plus fort que la grosse bête et lui lance un défi.",
      ],
    },
    {
      chunk:
        "Moi, je suis beaucoup plus fort que toi ; si tu veux, je te provoque même au combat. » Et, sonnant de la trompe, le cousin fondit sur lui, mordant le museau dépourvu de poil autour des narines. Quant au lion, il se déchirait de ses propres griffes, jusqu’à ce qu’il renonça au combat.",
      rewordings: [
        "Le moustique fonce sur le lion en bourdonnant et le pique au museau, là où il n'y a pas de poils. Le lion se blesse avec ses propres griffes et abandonne le combat.",
        "L'insecte attaque le visage du grand animal, qui se fait mal tout seul en voulant le chasser et finit par renoncer.",
      ],
    },
    {
      chunk:
        "Quant au lion, il se déchirait de ses propres griffes, jusqu’à ce qu’il renonça au combat. Le cousin, ayant vaincu le lion, sonna de la trompe, entonna un chant de victoire, et prit son essor. Mais il s’empêtra dans une toile d’araignée, et, se sentant dévorer, il gémissait, lui qui faisait la guerre aux plus puissants, de périr par le fait d’un vil animal, une araignée.",
      rewordings: [
        "Après sa victoire sur le lion, le moustique chante son triomphe et s'envole, mais il se prend dans une toile d'araignée. Il se plaint d'être mangé par une simple araignée, lui qui avait vaincu les plus puissants.",
        "Le petit vainqueur, trop fier, tombe dans un piège et se fait dévorer par une bestiole insignifiante.",
      ],
    },
  ],
  "lafontaine/Le Lion et le Moucheron": [
    {
      chunk:
        "Va-t’en, chétif insecte, excrément de la terre !\nC’est en ces mots que le lion\nParlait un jour au moucheron.\nL’autre lui déclara la guerre :",
      rewordings: [
        "Le lion insulte le moucheron en le traitant d'insecte minable et de déchet de la terre. Le moucheron lui déclare alors la guerre.",
        "Un grand animal méprise un petit insecte, qui décide de se battre contre lui.",
      ],
    },
    {
      chunk:
        "L’autre lui déclara la guerre :\nPenses-tu, lui dit-il, que ton titre de roi\nMe fasse peur ni me soucie ?\nUn bœuf est plus puissant que toi ;",
      rewordings: [
        "Le moucheron demande au lion s'il croit que son titre de roi lui fait peur. Il lui dit qu'un bœuf est plus fort que lui.",
        "Le petit insecte n'a pas peur du roi des animaux et le rabaisse.",
      ],
    },
    {
      chunk:
        "Un bœuf est plus puissant que toi ;\nJe le mène à ma fantaisie.\nÀ peine il achevait ces mots\nQue lui-même il sonna la charge,",
      rewordings: [
        "Le moucheron dit qu'il fait ce qu'il veut d'un bœuf. Puis il lance lui-même l'attaque.",
        "L'insecte se vante de contrôler les gros animaux et commence le combat.",
      ],
    },
    {
      chunk:
        "Que lui-même il sonna la charge,\nFut le trompette et le héros.\nDans l’abord il se met au large ;\nPuis prend son temps, fond sur le cou",
      rewordings: [
        "Le moucheron sonne lui-même l'attaque comme un soldat et un héros. Il prend de l'élan puis fonce sur le cou du lion.",
        "Le petit insecte joue à la fois le trompette et le guerrier, puis se jette sur la grosse bête.",
      ],
    },
    {
      chunk:
        "Puis prend son temps, fond sur le cou\nDu lion, qu’il rend presque fou.\nLe quadrupède écume, et son œil étincelle ;\nIl rugit. On se cache, on tremble à l’environ ;",
      rewordings: [
        "Le moucheron pique le cou du lion et le rend presque fou. Le lion écume, ses yeux brillent de rage, il rugit et tout le monde autour se cache en tremblant.",
        "La grosse bête devient folle de colère et fait peur à tous les animaux des alentours.",
      ],
    },
    {
      chunk:
        "Il rugit. On se cache, on tremble à l’environ ;\nEt cette alarme universelle\nEst l’ouvrage d’un moucheron.\nUn avorton de mouche en cent lieux le harcelle ;",
      rewordings: [
        "Tout le monde tremble à cause des rugissements du lion, et cette panique est causée par un simple moucheron qui le harcèle partout.",
        "Un minuscule insecte sème la terreur en énervant le grand animal.",
      ],
    },
    {
      chunk:
        "Un avorton de mouche en cent lieux le harcelle ;\nTantôt pique l’échine, et tantôt le museau,\nTantôt entre au fond du naseau.\nLa rage alors se trouve à son faîte montée.",
      rewordings: [
        "Le moucheron pique le lion au dos, au museau et jusqu'au fond du nez. La colère du lion est à son comble.",
        "L'insecte attaque la bête de partout et la rend furieuse.",
      ],
    },
    {
      chunk:
        "La rage alors se trouve à son faîte montée.\nL’invisible ennemi triomphe, et rit de voir\nQu’il n’est griffe ni dent en la bête irritée\nQui de la mettre en sang ne fasse son devoir.",
      rewordings: [
        "Le lion est au sommet de sa rage. Le moucheron invisible se moque de voir que le lion se met en sang avec ses propres griffes et ses dents.",
        "Le petit ennemi rit pendant que l'animal énervé se blesse tout seul.",
      ],
    },
    {
      chunk:
        "Qui de la mettre en sang ne fasse son devoir.\nLe malheureux lion se déchire lui-même,\nFait résonner sa queue à l’entour de ses flancs,\nBat l’air, qui n’en peut mais ; et sa fureur extrême",
      rewordings: [
        "Le lion se déchire lui-même, se fouette les flancs avec sa queue et frappe dans le vide, emporté par sa fureur.",
        "La grosse bête se fait mal toute seule en essayant d'attraper un ennemi qu'elle ne voit pas.",
      ],
    },
    {
      chunk:
        "Bat l’air, qui n’en peut mais ; et sa fureur extrême\nLe fatigue, l’abat : le voilà sur les dents.\nL’insecte, du combat, se retire avec gloire :\nComme il sonna la charge, il sonne la victoire,",
      rewordings: [
        "La fureur épuise le lion, qui s'effondre. Le moucheron quitte le combat couvert de gloire et sonne sa victoire.",
        "Le grand animal est vaincu par la fatigue et le petit insecte célèbre son triomphe.",
      ],
    },
    {
      chunk:
        "Comme il sonna la charge, il sonne la victoire,\nVa partout l’annoncer, et rencontre en chemin\nL’embuscade d’une araignée ;\nIl y rencontre aussi sa fin.",
      rewordings: [
        "Le moucheron va partout annoncer sa victoire, mais il tombe dans le piège d'une araignée et il y meurt.",
        "Le vainqueur, trop occupé à se vanter, se fait attraper et tuer par une araignée.",
      ],
    },
    {
      chunk:
        "Il y rencontre aussi sa fin.\nQuelle chose par là nous peut être enseignée ?\nJ’en vois deux, dont l’une est qu’entre nos ennemis\nLes plus à craindre sont souvent les plus petits ;",
      rewordings: [
        "Le moucheron meurt. La fable donne deux leçons, la première est que parmi nos ennemis, les plus dangereux sont souvent les plus petits.",
        "Il ne faut pas mépriser un adversaire minuscule, car il peut être le plus redoutable.",
      ],
    },
    {
      chunk:
        "Les plus à craindre sont souvent les plus petits ;\nL’autre qu’aux grands périls tel a pu se soustraire,\nQui périt pour la moindre affaire.",
      rewordings: [
        "Les plus petits ennemis sont souvent les plus à craindre. Et celui qui a échappé à de grands dangers peut mourir à cause d'une toute petite chose.",
        "Morale : méfie-toi des petits, et après avoir survécu au pire, tu peux tomber pour un détail.",
      ],
    },
  ],
  "esope/Les Grenouilles qui demandent un roi": [
    {
      chunk:
        "Les grenouilles, fâchées de l’anarchie où elles vivaient, envoyèrent des députés à Zeus, pour le prier de leur donner un roi. Zeus, voyant leur simplicité, lança un morceau de bois dans le marais. Tout d’abord les grenouilles effrayées par le bruit se plongèrent dans les profondeurs du marais ; puis, comme le bois ne bougeait pas, elles remontèrent et en vinrent à un tel mépris pour le roi qu’elles sautaient sur son dos et s’y accroupissaient.",
      rewordings: [
        "Les grenouilles, lassées de vivre sans chef, demandent un roi à Zeus. Il jette un morceau de bois dans le marais ; d'abord effrayées, elles voient qu'il ne bouge pas et finissent par sauter dessus avec mépris.",
        "Des animaux du marais veulent un chef, reçoivent un bout de bois immobile et s'en moquent.",
      ],
    },
    {
      chunk:
        "Tout d’abord les grenouilles effrayées par le bruit se plongèrent dans les profondeurs du marais ; puis, comme le bois ne bougeait pas, elles remontèrent et en vinrent à un tel mépris pour le roi qu’elles sautaient sur son dos et s’y accroupissaient. Mortifiées d’avoir un tel roi, elles se tendirent une seconde fois près de Zeus, et lui demandèrent de leur changer le monarque ; car le premier était trop nonchalant. Zeus impatienté leur envoya une hydre qui les prit et les dévora.",
      rewordings: [
        "Les grenouilles se moquent du roi en bois et demandent à Zeus un autre roi, car celui-ci est trop mou. Zeus, agacé, leur envoie un serpent d'eau qui les attrape et les mange.",
        "Pas contentes de leur chef qui ne fait rien, elles en réclament un nouveau, et le dieu leur envoie un prédateur qui les dévore.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’il vaut mieux être commandé par des hommes nonchalants, mais sans méchanceté que par des brouillons et des méchants.",
      rewordings: [
        "Cette fable montre qu'il vaut mieux être dirigé par des gens paresseux mais pas méchants que par des agités méchants.",
        "Morale : mieux vaut un chef qui ne fait pas grand-chose qu'un chef cruel.",
      ],
    },
  ],
  "lafontaine/Les Grenouilles qui demandent un Roi": [
    {
      chunk:
        "Les grenouilles se lassant\nDe l’état démocratique\nPar leurs clameurs firent tant\nQue Jupin les soumit au pouvoir monarchique.",
      rewordings: [
        "Les grenouilles en ont assez de leur démocratie et crient tellement que Jupiter leur donne un roi.",
        "Des animaux du marais veulent absolument un chef et le dieu finit par accepter.",
      ],
    },
    {
      chunk:
        "Que Jupin les soumit au pouvoir monarchique.\nIl leur tomba du ciel un roi tout pacifique :\nCe roi fit toutefois un tel bruit en tombant,\nQue la gent marécageuse,",
      rewordings: [
        "Jupiter leur envoie du ciel un roi très calme, mais qui fait beaucoup de bruit en tombant, au point que les grenouilles prennent peur.",
        "Le chef envoyé par le dieu tombe dans un grand fracas qui effraie le peuple du marais.",
      ],
    },
    {
      chunk:
        "Que la gent marécageuse,\nGent fort sotte et fort peureuse,\nS’alla cacher sous les eaux,\nDans les joncs, dans les roseaux,",
      rewordings: [
        "Les grenouilles, peuple bête et peureux, vont se cacher sous l'eau, dans les joncs et les roseaux.",
        "Les petits animaux du marais, très craintifs, se cachent partout.",
      ],
    },
    {
      chunk:
        "Dans les joncs, dans les roseaux,\nDans les trous du marécage,\nSans oser de longtemps regarder au visage\nCelui qu’elles croyaient être un géant nouveau.",
      rewordings: [
        "Cachées dans les trous du marais, les grenouilles n'osent pas regarder pendant longtemps celui qu'elles prennent pour un nouveau géant.",
        "Effrayées, elles restent cachées en pensant que leur nouveau chef est un monstre.",
      ],
    },
    {
      chunk:
        "Celui qu’elles croyaient être un géant nouveau.\nOr c’était un soliveau,\nDe qui la gravité fit peur à la première\nQui, de le voir, s’aventurant,",
      rewordings: [
        "En fait, le roi n'est qu'une poutre. Une première grenouille, malgré sa peur, s'aventure à aller le voir.",
        "Le chef n'est qu'un morceau de bois, et une grenouille courageuse va le regarder de près.",
      ],
    },
    {
      chunk:
        "Qui, de le voir, s’aventurant,\nOsa bien quitter sa tanière.\nElle approcha, mais en tremblant.\nUne autre la suivit, une autre en fit autant :",
      rewordings: [
        "La grenouille ose sortir de sa cachette et approche en tremblant. Une autre la suit, puis une autre encore.",
        "Les animaux sortent un par un et s'approchent du chef sans trop oser.",
      ],
    },
    {
      chunk:
        "Une autre la suivit, une autre en fit autant :\nIl en vint une fourmilière ;\nEt leur troupe à la fin se rendit familière\nJusqu’à sauter sur l’épaule du roi.",
      rewordings: [
        "Les grenouilles arrivent en foule et deviennent si familières qu'elles sautent sur l'épaule du roi.",
        "Une fois rassurées, elles perdent tout respect et grimpent sur leur chef.",
      ],
    },
    {
      chunk:
        "Jusqu’à sauter sur l’épaule du roi.\nLe bon sire le souffre, et se tient toujours coi.\nJupin en a bientôt la cervelle rompue :\nDonnez-nous, dit ce peuple, un roi qui se remue !",
      rewordings: [
        "La poutre se laisse faire sans rien dire. Les grenouilles cassent la tête de Jupiter en réclamant un roi qui bouge.",
        "Le chef immobile ne réagit pas, alors le peuple exige du dieu un dirigeant plus actif.",
      ],
    },
    {
      chunk:
        "Donnez-nous, dit ce peuple, un roi qui se remue !\nLe monarque des dieux leur envoie une grue,\nQui les croque, qui les tue,\nQui les gobe à son plaisir",
      rewordings: [
        "Jupiter leur envoie une grue qui les croque, les tue et les avale comme elle veut.",
        "Le dieu leur donne un nouveau chef, un grand oiseau qui les mange.",
      ],
    },
    {
      chunk:
        "Qui les gobe à son plaisir\nEt grenouilles de se plaindre,\nEt Jupin de leur dire : Eh quoi ! votre désir\nÀ ses lois croit-il nous astreindre ?",
      rewordings: [
        "La grue mange les grenouilles, qui se plaignent. Jupiter leur répond qu'elles ne peuvent pas lui imposer leurs caprices.",
        "Le peuple se lamente et le dieu refuse d'obéir à leurs envies.",
      ],
    },
    {
      chunk:
        "À ses lois croit-il nous astreindre ?\nVous avez dû premièrement\nGarder votre gouvernement ;\nMais ne l’ayant pas fait, il vous devait suffire",
      rewordings: [
        "Jupiter leur dit qu'elles auraient d'abord dû garder leur ancien gouvernement.",
        "Le dieu leur reproche d'avoir abandonné leur liberté.",
      ],
    },
    {
      chunk:
        "Mais ne l’ayant pas fait, il vous devait suffire\nQue votre premier roi fût débonnaire et doux.\nDe celui-ci contentez-vous,\nDe peur d’en rencontrer un pire.",
      rewordings: [
        "Jupiter ajoute qu'elles auraient dû être contentes d'avoir un premier roi gentil et doux, et qu'elles doivent maintenant accepter celui-ci de peur d'en avoir un pire.",
        "Morale : contente-toi d'un chef gentil, sinon tu risques d'avoir bien pire.",
      ],
    },
  ],
  "esope/L’Âne revêtu de la peau du lion et le Renard": [
    {
      chunk:
        "Un âne, ayant revêtu une peau de lion, faisait le tour du pays, effrayant les animaux. Il aperçut un renard et voulut l’effrayer aussi. Mais le renard, qui avait justement entendu sa voix auparavant, lui dit : « N’en doute pas, tu m’aurais fait peur à moi aussi, si je ne t’avais pas entendu braire. »",
      rewordings: [
        "Un âne porte une peau de lion et fait peur à tous les animaux. Il veut effrayer un renard, mais celui-ci a entendu sa voix et lui dit qu'il aurait eu peur s'il ne l'avait pas entendu braire.",
        "Un animal déguisé en fauve effraie tout le monde, sauf un malin qui le reconnaît à son cri.",
      ],
    },
    {
      chunk:
        "C’est ainsi que des gens sans éducation, qui, par leurs dehors fastueux, paraissent être quelque chose, se trahissent par leur démangeaison de parler.",
      rewordings: [
        "Ainsi, les gens ignorants qui ont l'air importants grâce à leur apparence se trahissent parce qu'ils parlent trop.",
        "Morale : un bel extérieur ne cache pas la bêtise quand on se met à parler.",
      ],
    },
  ],
  "lafontaine/L’Âne vêtu de la peau du Lion": [
    {
      chunk:
        "De la peau du lion l’âne s’étant vêtu\nÉtait craint par tout à la ronde ;\nEt bien qu’animal sans vertu,\nIl faisait trembler tout le monde.",
      rewordings: [
        "L'âne s'habille avec la peau du lion et tout le monde le craint. Bien qu'il n'ait aucune qualité, il fait trembler tout le monde.",
        "Un animal sans valeur se déguise en fauve et terrorise les autres.",
      ],
    },
    {
      chunk:
        "Il faisait trembler tout le monde.\nUn petit bout d’oreille échappé par malheur\nDécouvrit la fourbe et l’erreur :\nMartin fit alors son office.",
      rewordings: [
        "Mais un petit bout d'oreille dépasse et révèle la tromperie. Le meunier Martin fait alors son travail.",
        "Un détail trahit le déguisement et le maître de l'animal intervient.",
      ],
    },
    {
      chunk:
        "Martin fit alors son office.\nCeux qui ne savaient pas la ruse et la malice\nS’étonnaient de voir que Martin\nChassât les lions au moulin.",
      rewordings: [
        "Martin frappe l'âne. Ceux qui ne connaissent pas la ruse s'étonnent de voir le meunier chasser un lion vers le moulin.",
        "Le maître chasse l'animal déguisé à coups de bâton, et les gens sont surpris de le voir chasser un faux fauve.",
      ],
    },
    {
      chunk:
        "Chassât les lions au moulin.\nForce gens font du bruit en France\nPar qui cet apologue est rendu familier.\nUn équipage cavalier",
      rewordings: [
        "Le meunier ramène le lion au moulin. Beaucoup de gens font du bruit en France et rendent cette fable très actuelle.",
        "L'auteur remarque que beaucoup de gens autour de lui ressemblent à cet animal déguisé.",
      ],
    },
    {
      chunk: "Un équipage cavalier\nFait les trois quarts de leur vaillance.",
      rewordings: [
        "Un bel équipage de cavalier fait les trois quarts de leur courage.",
        "Morale : le courage de beaucoup de gens n'est qu'une question d'apparence et de belle tenue.",
      ],
    },
  ],
  "esope/Le Bûcheron et Hermès": [
    {
      chunk:
        "Un homme qui coupait du bois au bord d’une rivière avait perdu sa cognée. Aussi, ne sachant que faire, il s’était assis sur la berge et pleurait. Hermès, ayant appris la cause de sa tristesse, le prit en pitié ; il plongea dans la rivière, en rapporta une cognée d’or et lui demanda si c’était celle qu’il avait perdue.",
      rewordings: [
        "Un bûcheron a perdu sa hache dans une rivière et pleure sur la rive. Hermès a pitié de lui, plonge et rapporte une hache en or en lui demandant si c'est la sienne.",
        "Un travailleur triste a perdu son outil, et un dieu lui en propose un en or.",
      ],
    },
    {
      chunk:
        "Hermès, ayant appris la cause de sa tristesse, le prit en pitié ; il plongea dans la rivière, en rapporta une cognée d’or et lui demanda si c’était celle qu’il avait perdue. L’homme lui ayant répondu que ce n’était pas celle-là, il plongea de nouveau et en rapporta une d’argent. L’homme ayant déclaré que celle-là non plus n’était pas la sienne, il plongea une troisième fois et lui rapporta sa propre cognée.",
      rewordings: [
        "Le bûcheron dit que la hache en or n'est pas la sienne. Hermès plonge de nouveau et rapporte une hache en argent, que l'homme refuse aussi, puis il rapporte la vraie hache.",
        "L'homme honnête refuse les outils précieux, et le dieu finit par lui rendre le sien.",
      ],
    },
    {
      chunk:
        "L’homme ayant déclaré que celle-là non plus n’était pas la sienne, il plongea une troisième fois et lui rapporta sa propre cognée. L’homme affirma que c’était bien celle-là qu’il avait perdue. Alors Hermès, charmé de sa probité, les lui donna toutes les trois.",
      rewordings: [
        "Le bûcheron reconnaît sa propre hache. Hermès, touché par son honnêteté, lui donne les trois haches.",
        "Comme l'homme a dit la vérité, le dieu lui offre tous les outils en récompense.",
      ],
    },
    {
      chunk:
        "Alors Hermès, charmé de sa probité, les lui donna toutes les trois. Revenu près de ses camarades il leur conta son aventure. L’un d’eux se mit en tête d’en obtenir autant.",
      rewordings: [
        "Hermès donne les trois haches au bûcheron, qui raconte son histoire à ses amis. L'un d'eux veut obtenir la même chose.",
        "Un voisin envieux entend l'histoire et veut lui aussi devenir riche.",
      ],
    },
    {
      chunk:
        "L’un d’eux se mit en tête d’en obtenir autant. Il se rendit au bord de la rivière et lança à dessein sa hache dans le courant, puis s’assit en pleurant. Alors Hermès lui apparut à lui aussi, et apprenant le sujet de ses pleurs, il plongea et lui rapporta aussi une cognée d’or, et lui demanda si c’était celle qu’il avait perdue.",
      rewordings: [
        "Le camarade jette exprès sa hache dans la rivière et s'assoit en pleurant. Hermès apparaît et lui présente une hache en or en lui demandant si c'est la sienne.",
        "Le jaloux fait semblant d'avoir perdu son outil, et le dieu lui tend un objet en or.",
      ],
    },
    {
      chunk:
        "Alors Hermès lui apparut à lui aussi, et apprenant le sujet de ses pleurs, il plongea et lui rapporta aussi une cognée d’or, et lui demanda si c’était celle qu’il avait perdue. Et lui, tout joyeux, s’écria : « Oui, c’est bien elle. » Mais le dieu, ayant horreur de tant d’effronterie, non seulement garda la hache d’or, mais il ne lui rendit même pas la sienne.",
      rewordings: [
        "Le menteur s'écrie que c'est bien sa hache en or. Hermès, dégoûté par son culot, garde la hache en or et ne lui rend même pas la sienne.",
        "L'homme avide ment, et le dieu le punit en ne lui laissant rien du tout.",
      ],
    },
    {
      chunk:
        "Cette fable montre que, autant la divinité est favorable aux honnêtes gens, autant elle est hostile aux malhonnêtes.",
      rewordings: [
        "La fable montre que les dieux aident les honnêtes gens et punissent les malhonnêtes.",
        "Morale : l'honnêteté est récompensée, le mensonge est puni.",
      ],
    },
  ],
  "lafontaine/Le Bûcheron et Mercure": [
    {
      chunk:
        "Votre goût a servi de règle à mon ouvrage :\nJ’ai tenté les moyens d’acquérir son suffrage.\nVous voulez qu’on évite un soin trop curieux,\nEt des vains ornements l’effort ambitieux ;",
      rewordings: [
        "La Fontaine dit au destinataire que ses goûts ont guidé son œuvre. Il veut éviter les détails trop recherchés et les décorations inutiles.",
        "L'auteur explique qu'il écrit simplement pour plaire à la personne à qui il dédie le livre.",
      ],
    },
    {
      chunk:
        "Et des vains ornements l’effort ambitieux ;\nJe le veux comme vous : cet effort ne peut plaire.\nUn auteur gâte tout quand il veut trop bien faire.\nNon qu’il faille bannir certains traits délicats :",
      rewordings: [
        "L'auteur est d'accord pour dire que les ornements trop ambitieux déplaisent. Un écrivain gâche tout quand il en fait trop, mais il ne faut pas supprimer toute finesse.",
        "Le poète réfléchit à son style : trop en faire abîme un texte.",
      ],
    },
    {
      chunk:
        "Non qu’il faille bannir certains traits délicats :\nVous les aimez, ces traits ; et je ne les hais pas.\nQuant au principal but qu’Ésope se propose,\nJ’y tombe au moins mal que je puis.",
      rewordings: [
        "La Fontaine dit que le destinataire aime les traits délicats, et lui aussi. Il essaie de suivre au mieux le but d'Ésope.",
        "L'auteur parle de son goût pour la finesse et de son modèle Ésope.",
      ],
    },
    {
      chunk:
        "J’y tombe au moins mal que je puis.\nEnfin si dans ces vers je ne plais et n’instruis,\nIl ne tient pas à moi ; c’est toujours quelque chose.\nComme la force est un point",
      rewordings: [
        "L'auteur dit que s'il ne réussit pas à plaire et à instruire avec ses vers, ce n'est pas faute d'essayer. Il annonce qu'il ne se vante pas d'être fort.",
        "Le poète explique qu'il veut amuser et enseigner en même temps.",
      ],
    },
    {
      chunk:
        "Comme la force est un point\nDont je ne me pique point,\nJe tâche d’y tourner le vice en ridicule,\nNe pouvant l’attaquer avec des bras d’Hercule.",
      rewordings: [
        "Comme il n'est pas fort, La Fontaine essaie de rendre le vice ridicule, puisqu'il ne peut pas le combattre avec la force d'Hercule.",
        "L'auteur se moque des défauts humains au lieu de les attaquer de front.",
      ],
    },
    {
      chunk:
        "Ne pouvant l’attaquer avec des bras d’Hercule.\nC’est là tout mon talent ; je ne sais s’il suffit.\nTantôt je peins en un récit\nLa sotte vanité jointe avecque l’envie,",
      rewordings: [
        "La Fontaine dit que c'est tout son talent. Il peint parfois dans ses récits la vanité stupide et la jalousie.",
        "Le poète raconte qu'il décrit l'orgueil et l'envie des gens.",
      ],
    },
    {
      chunk:
        "La sotte vanité jointe avecque l’envie,\nDeux pivots sur qui roule aujourd’hui notre vie :\nTel est ce chétif animal\nQui voulut en grosseur au bœuf se rendre égal.",
      rewordings: [
        "La vanité et la jalousie gouvernent notre vie, comme la petite grenouille qui voulait devenir aussi grosse que le bœuf.",
        "L'auteur cite l'exemple d'un petit animal qui veut paraître aussi gros qu'un grand.",
      ],
    },
    {
      chunk:
        "Qui voulut en grosseur au bœuf se rendre égal.\nJ’oppose quelquefois par une double image\nLe vice à la vertu, la sottise au bon sens,\nLes agneaux aux loups ravissants,",
      rewordings: [
        "La Fontaine oppose parfois le vice et la vertu, la bêtise et le bon sens, les agneaux et les loups.",
        "Le poète met face à face le bien et le mal, les faibles et les cruels.",
      ],
    },
    {
      chunk:
        "Les agneaux aux loups ravissants,\nLa mouche à la fourmi ; faisant de cet ouvrage\nUne ample comédie à cent actes divers,\nEt dont la scène est l’univers.",
      rewordings: [
        "Il oppose aussi la mouche et la fourmi, et fait de son œuvre une grande comédie avec cent actes, dont la scène est le monde entier.",
        "L'auteur présente ses fables comme une immense pièce de théâtre sur le monde.",
      ],
    },
    {
      chunk:
        "Et dont la scène est l’univers.\nHommes, dieux, animaux, tout y fait quelque rôle.\nJupiter comme un autre. Introduisons celui\nQui porte de sa part aux belles la parole :",
      rewordings: [
        "Dans ce théâtre, hommes, dieux et animaux jouent tous un rôle, même Jupiter. Il annonce le messager des dieux.",
        "Tous les personnages possibles ont leur place, et l'auteur introduit un dieu messager.",
      ],
    },
    {
      chunk:
        "Qui porte de sa part aux belles la parole :\nCe n’est pas de cela qu’il s’agit aujourd’hui.\nUn bûcheron perdit son gagne-pain,\nC’est sa cognée ; et la cherchant en vain,",
      rewordings: [
        "La Fontaine précise que le messager ne vient pas pour une histoire d'amour. Un bûcheron perd sa hache, qui le fait vivre, et la cherche en vain.",
        "L'histoire commence : un pauvre travailleur perd l'outil qui lui permet de gagner sa vie.",
      ],
    },
    {
      chunk:
        "C’est sa cognée ; et la cherchant en vain,\nCe fut pitié là-dessus de l’entendre.\nIl n’avait pas des outils à revendre :\nSur celui-ci roulait tout son avoir.",
      rewordings: [
        "Le bûcheron cherche sa hache sans la trouver et fait pitié à entendre. Il n'a pas d'autres outils, et toute sa fortune reposait sur celui-là.",
        "L'homme pauvre est désespéré car il a perdu son seul outil.",
      ],
    },
    {
      chunk:
        "Sur celui-ci roulait tout son avoir.\nNe sachant donc où mettre son espoir,\nSa face était de pleurs toute baignée :\nÔ ma cognée ! ô ma pauvre cognée !",
      rewordings: [
        "Toute sa richesse dépendait de sa hache. Ne sachant plus quoi espérer, il pleure et crie : ô ma pauvre hache !",
        "Le travailleur en larmes se lamente sur son outil perdu.",
      ],
    },
    {
      chunk:
        "Ô ma cognée ! ô ma pauvre cognée !\nS’écriait-il : Jupiter, rends-la-moi ;\nJe tiendrai l’être encore un coup de toi.\nSa plainte fut de l’Olympe entendue.",
      rewordings: [
        "Le bûcheron supplie Jupiter de lui rendre sa hache, promettant de lui devoir la vie une seconde fois. Sa plainte est entendue dans l'Olympe.",
        "L'homme prie le dieu de lui rendre son outil, et le ciel l'entend.",
      ],
    },
    {
      chunk:
        "Sa plainte fut de l’Olympe entendue.\nMercure vient. Elle n’est pas perdue,\nLui dit ce dieu ; la connaîtras-tu bien ?\nJe crois l’avoir près d’ici rencontrée.",
      rewordings: [
        "Mercure arrive et dit au bûcheron que sa hache n'est pas perdue et lui demande s'il la reconnaîtra, car il croit l'avoir vue près d'ici.",
        "Le dieu messager vient aider l'homme à retrouver son outil.",
      ],
    },
    {
      chunk:
        "Je crois l’avoir près d’ici rencontrée.\nLors une d’or à l’homme étant montrée,\nIl répondit : Je n’y demande rien.\nUne d’argent succède à la première ;",
      rewordings: [
        "Mercure lui montre une hache en or, mais le bûcheron dit qu'il n'en veut pas. Puis vient une hache en argent.",
        "Le dieu lui propose un outil précieux, et l'homme honnête le refuse.",
      ],
    },
    {
      chunk:
        "Une d’argent succède à la première ;\nIl la refuse. Enfin une de bois.\nVoilà, dit-il, la mienne cette fois :\nJe suis content si j’ai cette dernière.",
      rewordings: [
        "Le bûcheron refuse la hache en argent. Enfin vient une hache en bois, et il dit que c'est la sienne et qu'elle lui suffit.",
        "L'homme refuse aussi l'argent et ne réclame que son outil simple.",
      ],
    },
    {
      chunk:
        "Je suis content si j’ai cette dernière.\nTu les auras, dit le dieu, toutes trois :\nTa bonne foi sera récompensée.\nEn ce cas-là je les prendrai, dit-il.",
      rewordings: [
        "Le bûcheron dit qu'il sera content avec sa hache. Mercure lui donne les trois pour récompenser son honnêteté, et il accepte.",
        "Le dieu récompense la sincérité de l'homme en lui offrant tous les outils.",
      ],
    },
    {
      chunk:
        "En ce cas-là je les prendrai, dit-il.\nL’histoire en est aussitôt dispersée ;\nEt boquillons de perdre leur outil,\nEt de crier pour se le faire rendre.",
      rewordings: [
        "Le bûcheron accepte les trois haches. L'histoire se répand, et les autres bûcherons perdent exprès leur outil et crient pour qu'on le leur rende.",
        "Les autres travailleurs apprennent l'histoire et font semblant d'avoir perdu leur outil.",
      ],
    },
    {
      chunk:
        "Et de crier pour se le faire rendre.\nLe roi des dieux ne sait auquel entendre.\nSon fils Mercure aux criards vient encor ;\nÀ chacun d’eux il en montre une d’or.",
      rewordings: [
        "Les bûcherons crient pour qu'on leur rende leur hache, au point que Jupiter ne sait plus qui écouter. Mercure vient et montre à chacun une hache en or.",
        "Tous ces menteurs réclament, et le dieu leur montre à chacun un outil en or.",
      ],
    },
    {
      chunk:
        "À chacun d’eux il en montre une d’or.\nChacun eût cru passer pour une bête\nDe ne pas dire aussitôt : La voilà !\nMercure, au lieu de donner celle-là,",
      rewordings: [
        "Chacun aurait eu honte de ne pas dire tout de suite que c'était la sienne. Mais Mercure, au lieu de leur donner la hache en or,",
        "Tous les menteurs prétendent que l'objet en or leur appartient.",
      ],
    },
    {
      chunk:
        "Mercure, au lieu de donner celle-là,\nLeur en décharge un grand coup sur la tête.\nNe point mentir, être content du sien,\nC’est le plus sûr : cependant on s’occupe",
      rewordings: [
        "Mercure leur donne un grand coup de hache sur la tête. Ne pas mentir et se contenter de ce qu'on a, c'est le plus sûr.",
        "Les menteurs sont punis, et la morale dit qu'il vaut mieux être honnête et content de son sort.",
      ],
    },
    {
      chunk:
        "C’est le plus sûr : cependant on s’occupe\nÀ dire faux pour attraper du bien.\nQue sert cela ? Jupiter n’est pas dupe.",
      rewordings: [
        "C'est le plus sûr, et pourtant on ment souvent pour obtenir des richesses. Mais cela ne sert à rien, car Jupiter n'est pas dupe.",
        "Morale : mentir pour s'enrichir est inutile, les dieux ne se laissent pas tromper.",
      ],
    },
  ],
  "esope/Le Lion amoureux et le Laboureur": [
    {
      chunk:
        "Un lion s’étant épris de la fille d’un laboureur, la demanda en mariage ; mais lui, ne pouvant ni se résoudre à donner sa fille à une bête féroce, ni la lui refuser à cause de la crainte qu’il en avait, imagina l’expédient que voici. Comme le lion ne cessait de le presser, il lui dit qu’il le jugeait digne d’être l’époux de sa fille, mais qu’il ne pouvait la lui donner qu’à une condition, c’est qu’il s’arracherait les dents et se rognerait les griffes ; car c’était cela qui faisait peur à la jeune fille. Il se résigna facilement, parce qu’il aimait, à ce double sacrifice.",
      rewordings: [
        "Un lion amoureux demande en mariage la fille d'un paysan. Le père, qui a peur, lui dit qu'il acceptera s'il s'arrache les dents et se coupe les griffes, ce que le lion accepte par amour.",
        "Un fauve amoureux veut épouser une jeune fille, et le père rusé lui demande de se désarmer.",
      ],
    },
    {
      chunk:
        "Il se résigna facilement, parce qu’il aimait, à ce double sacrifice. Dès lors le laboureur n’eut plus que mépris pour lui, et, lorsqu’il se présenta, il le mit à la porte à coups de bâton.",
      rewordings: [
        "Le lion accepte de perdre ses dents et ses griffes. Ensuite le paysan le méprise et le chasse à coups de bâton.",
        "Une fois sans défense, l'animal n'impressionne plus personne et se fait chasser.",
      ],
    },
    {
      chunk:
        "Cette fable montre que ceux qui se fient aisément aux autres, une fois qu’ils se sont dépouillés de leurs propres avantages, sont facilement vaincus par ceux qui les redoutaient auparavant.",
      rewordings: [
        "Cette fable montre que ceux qui font confiance trop vite et abandonnent leurs avantages sont facilement battus par ceux qui les craignaient.",
        "Morale : ne renonce jamais à tes forces, sinon tes ennemis en profitent.",
      ],
    },
  ],
  "lafontaine/Le Lion amoureux": [
    {
      chunk:
        "Sévigné, de qui les attraits\nServent aux Grâces de modèle,\nEt qui naquîtes toute belle,\nÀ votre indifférence près,",
      rewordings: [
        "La Fontaine s'adresse à Madame de Sévigné, dont la beauté sert de modèle aux Grâces, née toute belle à part son indifférence.",
        "L'auteur fait des compliments à une femme à qui il dédie la fable.",
      ],
    },
    {
      chunk:
        "À votre indifférence près,\nPourriez-vous être favorable\nAux jeux innocents d’une fable,\nEt voir, sans vous épouvanter,",
      rewordings: [
        "Il lui demande si, malgré son indifférence, elle accepterait les jeux innocents d'une fable.",
        "Le poète demande à la dame de bien vouloir lire son histoire.",
      ],
    },
    {
      chunk:
        "Et voir, sans vous épouvanter,\nUn lion qu’Amour sut dompter ?\nAmour est un étrange maître !\nHeureux qui peut ne le connaître",
      rewordings: [
        "Il lui demande de voir sans peur un lion dompté par l'amour. L'amour est un maître étrange.",
        "L'auteur annonce une histoire où l'amour soumet un animal puissant.",
      ],
    },
    {
      chunk:
        "Heureux qui peut ne le connaître\nQue par récit, lui ni ses coups !\nQuand on en parle devant vous,\nSi la vérité vous offense,",
      rewordings: [
        "Heureux celui qui ne connaît l'amour et ses coups que par des récits. Il dit à la dame que si la vérité la gêne,",
        "Le poète dit qu'il vaut mieux ne pas tomber amoureux soi-même.",
      ],
    },
    {
      chunk:
        "Si la vérité vous offense,\nLa fable au moins se peut souffrir :\nCelle-ci prend bien l’assurance\nDe venir à vos pieds s’offrir,",
      rewordings: [
        "si la vérité la gêne, elle peut au moins supporter une fable, qui vient se présenter à ses pieds.",
        "L'auteur offre humblement sa fable à la dame.",
      ],
    },
    {
      chunk:
        "De venir à vos pieds s’offrir,\nPar zèle et par reconnaissance.\nDu temps que les bêtes parlaient,\nLes lions entre autres voulaient",
      rewordings: [
        "La fable s'offre à elle par dévouement et reconnaissance. Au temps où les animaux parlaient, les lions voulaient",
        "Le poète termine sa dédicace et commence l'histoire au temps où les bêtes parlaient.",
      ],
    },
    {
      chunk:
        "Les lions entre autres voulaient\nÊtre admis dans notre alliance.\nPourquoi non ? puisque leur engeance\nValait la nôtre en ce temps-là,",
      rewordings: [
        "Les lions voulaient s'allier aux humains par mariage. Pourquoi pas, puisque leur race valait la nôtre à cette époque.",
        "Les fauves voulaient se marier avec les humains, et l'auteur trouve cela normal.",
      ],
    },
    {
      chunk:
        "Valait la nôtre en ce temps-là,\nAyant courage, intelligence,\nEt belle hure outre cela.\nVoici comment il en alla :",
      rewordings: [
        "Les lions avaient du courage, de l'intelligence et une belle tête. Voici comment l'histoire s'est passée.",
        "Les grands animaux étaient courageux et beaux, et le récit commence.",
      ],
    },
    {
      chunk:
        "Voici comment il en alla :\nUn lion de haut parentage,\nEn passant par un certain pré,\nRencontra bergère à son gré :",
      rewordings: [
        "Un lion de grande famille, en passant dans un pré, rencontre une bergère qui lui plaît.",
        "Un fauve noble tombe amoureux d'une jeune fille.",
      ],
    },
    {
      chunk:
        "Rencontra bergère à son gré :\nIl la demande en mariage.\nLe père aurait fort souhaité\nQuelque gendre un peu moins terrible.",
      rewordings: [
        "Le lion demande la bergère en mariage. Le père aurait préféré un gendre moins terrifiant.",
        "L'animal veut épouser la jeune fille, et son père a peur de lui.",
      ],
    },
    {
      chunk:
        "Quelque gendre un peu moins terrible.\nLa donner lui semblait bien dur :\nLa refuser n’était pas sûr ;\nMême un refus eût fait, possible,",
      rewordings: [
        "Le père trouve dur de donner sa fille, mais dangereux de refuser, car un refus pourrait mener",
        "Le père est coincé : il ne veut pas accepter mais n'ose pas refuser.",
      ],
    },
    {
      chunk:
        "Même un refus eût fait, possible,\nQu’on eût vu quelque beau matin\nUn mariage clandestin :\nCar, outre qu’en toute manière",
      rewordings: [
        "un refus pourrait mener un beau matin à un mariage en cachette, car en plus",
        "Le père craint que les amoureux se marient en secret.",
      ],
    },
    {
      chunk:
        "Car, outre qu’en toute manière\nLa belle était pour les gens fiers,\nFille se coiffe volontiers\nD’amoureux à longue crinière.",
      rewordings: [
        "la jeune fille aime les gens fiers, et les filles se passionnent volontiers pour un amoureux à longue crinière.",
        "La jeune fille est attirée par cet amoureux impressionnant.",
      ],
    },
    {
      chunk:
        "D’amoureux à longue crinière.\nLe père donc ouvertement\nN’osant renvoyer notre amant,\nLui dit : Ma fille est délicate ;",
      rewordings: [
        "Le père, n'osant pas renvoyer le lion, lui dit que sa fille est délicate.",
        "Le père trouve une ruse pour ne pas refuser directement.",
      ],
    },
    {
      chunk:
        "Lui dit : Ma fille est délicate ;\nVos griffes la pourront blesser\nQuand vous voudrez la caresser.\nPermettez donc qu’à chaque patte",
      rewordings: [
        "Le père dit au lion que ses griffes pourraient blesser sa fille quand il la caressera, et lui demande de les faire couper.",
        "Le père rusé demande au fauve de se débarrasser de ses griffes pour ne pas faire mal à la fille.",
      ],
    },
    {
      chunk:
        "Permettez donc qu’à chaque patte\nOn vous les rogne ; et pour les dents,\nQu’on vous les lime en même temps :\nVos baisers en seront moins rudes,",
      rewordings: [
        "Il propose qu'on lui coupe les griffes et qu'on lui lime les dents en même temps, pour que ses baisers soient plus doux.",
        "Le père demande au fauve de renoncer à ses armes naturelles.",
      ],
    },
    {
      chunk:
        "Vos baisers en seront moins rudes,\nEt pour vous plus délicieux ;\nCar ma fille y répondra mieux,\nÉtant sans ces inquiétudes.",
      rewordings: [
        "Ses baisers seront plus agréables, car la fille y répondra mieux sans avoir peur.",
        "Le père fait croire au fauve que la jeune fille l'aimera davantage.",
      ],
    },
    {
      chunk:
        "Étant sans ces inquiétudes.\nLe lion consent à cela,\nTant son âme était aveuglée !\nSans dents ni griffes le voilà,",
      rewordings: [
        "Le lion accepte, tant l'amour l'aveugle. Le voilà sans dents ni griffes.",
        "L'animal amoureux se laisse désarmer sans réfléchir.",
      ],
    },
    {
      chunk:
        "Sans dents ni griffes le voilà,\nComme place démantelée.\nOn lâcha sur lui quelques chiens :\nIl fit fort peu de résistance.",
      rewordings: [
        "Sans dents ni griffes, le lion est comme une forteresse démolie. On lâche des chiens sur lui, et il ne peut presque pas se défendre.",
        "Une fois sans armes, le fauve est attaqué et ne peut pas résister.",
      ],
    },
    {
      chunk:
        "Il fit fort peu de résistance.\nAmour ! Amour ! quand tu nous tiens,\nOn peut bien dire : Adieu prudence !",
      rewordings: [
        "Le lion ne résiste presque pas. Quand l'amour nous tient, on peut dire adieu à la prudence.",
        "Morale : l'amour rend imprudent et fait perdre ses défenses.",
      ],
    },
  ],
  "esope/Le Cheval et l’Âne": [
    {
      chunk:
        "Un homme avait un cheval et un âne. Un jour qu’ils étaient en route, l’âne, pendant le trajet, dit au cheval : « Prends une partie de ma charge, si tu tiens à ma vie. » Le cheval fit la sourde oreille, et l’âne tomba, épuisé de fatigue, et mourut.",
      rewordings: [
        "Un homme voyage avec un cheval et un âne. L'âne demande au cheval de porter une partie de sa charge pour lui sauver la vie, mais le cheval fait semblant de ne pas entendre, et l'âne meurt d'épuisement.",
        "Un animal surchargé demande de l'aide à son compagnon, qui l'ignore, et il meurt de fatigue.",
      ],
    },
    {
      chunk:
        "Le cheval fit la sourde oreille, et l’âne tomba, épuisé de fatigue, et mourut. Alors le maître chargea tout sur le cheval, même la peau de l’âne. Et le cheval dit en soupirant : « Ah ! je n’ai pas de chance ; que m’est-il arrivé là, hélas !",
      rewordings: [
        "L'âne meurt de fatigue. Le maître met alors tout sur le cheval, même la peau de l'âne, et le cheval se plaint de sa malchance.",
        "Après la mort de l'autre, l'égoïste doit porter tout le poids et se lamente.",
      ],
    },
    {
      chunk:
        "Et le cheval dit en soupirant : « Ah ! je n’ai pas de chance ; que m’est-il arrivé là, hélas ! Pour n’avoir pas voulu me charger d’un léger fardeau, voilà que je porte tout, avec la peau en plus. »",
      rewordings: [
        "Le cheval regrette : pour ne pas avoir voulu porter un petit poids, il porte maintenant tout, avec la peau de l'âne en plus.",
        "L'animal égoïste comprend que son refus d'aider lui a coûté beaucoup plus cher.",
      ],
    },
    {
      chunk:
        "Cette fable montre que, si les grands font cause commune avec les petits, les uns et les autres assureront ainsi leur vie.",
      rewordings: [
        "Cette fable montre que si les puissants s'unissent aux faibles, ils sauvent tous leur vie.",
        "Morale : en s'entraidant, forts et faibles s'en sortent tous.",
      ],
    },
  ],
  "lafontaine/Le Cheval et l’Âne": [
    {
      chunk:
        "En ce monde il se faut l’un l’autre secourir :\nSi ton voisin vient à mourir,\nC’est sur toi que le fardeau tombe.\nUn âne accompagnait un cheval peu courtois,",
      rewordings: [
        "Dans ce monde il faut s'aider les uns les autres, car si ton voisin meurt, c'est toi qui portes sa charge. Un âne voyage avec un cheval impoli.",
        "Morale annoncée : l'entraide est nécessaire. Puis deux animaux voyagent ensemble.",
      ],
    },
    {
      chunk:
        "Un âne accompagnait un cheval peu courtois,\nCelui-ci ne portant que son simple harnois,\nEt le pauvre baudet si chargé qu’il succombe.\nIl pria le cheval de l’aider quelque peu ;",
      rewordings: [
        "Le cheval impoli ne porte que son harnais, alors que l'âne est si chargé qu'il s'effondre. Il demande au cheval de l'aider un peu.",
        "L'un ne porte rien, l'autre est écrasé sous le poids et demande de l'aide.",
      ],
    },
    {
      chunk:
        "Il pria le cheval de l’aider quelque peu ;\nAutrement il mourrait devant qu’être à la ville.\nLa prière, dit-il, n’en est pas incivile :\nMoitié de ce fardeau ne vous sera que jeu.",
      rewordings: [
        "L'âne dit au cheval qu'il mourra avant d'arriver en ville s'il ne l'aide pas. Il ajoute que la moitié de sa charge ne serait qu'un jeu pour lui.",
        "L'animal épuisé supplie poliment son compagnon de partager le poids.",
      ],
    },
    {
      chunk:
        "Moitié de ce fardeau ne vous sera que jeu.\nLe cheval refusa, fit une pétarade ;\nTant qu’il vit sous le faix mourir son camarade,\nEt reconnut qu’il avait tort.",
      rewordings: [
        "Le cheval refuse en ruant, jusqu'à ce qu'il voie son camarade mourir sous la charge, et il comprend alors qu'il a eu tort.",
        "L'égoïste refuse d'aider, l'autre meurt, et il regrette trop tard.",
      ],
    },
    {
      chunk:
        "Et reconnut qu’il avait tort.\nDu baudet en cette aventure\nOn lui fit porter la voiture,\nEt la peau par-dessus encor.",
      rewordings: [
        "Le cheval reconnaît son erreur. On lui fait porter tout le chargement de l'âne, et la peau de l'âne en plus.",
        "L'égoïste est puni : il doit porter tout le poids et même la dépouille de son compagnon.",
      ],
    },
  ],
  "esope/Le Chien qui porte de la viande": [
    {
      chunk:
        "Un chien tenant un morceau de viande traversait une rivière. Ayant aperçu son ombre dans l’eau, il crut que c’était un autre chien qui tenait un morceau de viande plus gros. Aussi, lâchant le sien, il s’élança pour enlever celui de son compère.",
      rewordings: [
        "Un chien traverse une rivière avec un morceau de viande. Il voit son reflet dans l'eau, croit que c'est un autre chien avec un plus gros morceau, lâche le sien et saute pour le prendre.",
        "Un animal gourmand voit son reflet et lâche sa nourriture pour attraper celle de l'autre.",
      ],
    },
    {
      chunk:
        "Aussi, lâchant le sien, il s’élança pour enlever celui de son compère. Mais le résultat fut qu’il n’eut ni l’un ni l’autre, l’un se trouvant hors de ses prises, puisqu’il n’existait même pas, et l’autre ayant été entraîné par le courant.",
      rewordings: [
        "Le chien lâche sa viande pour attaquer l'autre. Il n'a plus rien : le second morceau n'existait pas et le sien est emporté par le courant.",
        "L'animal avide perd tout, le vrai repas comme l'illusion.",
      ],
    },
    {
      chunk: "Cette fable s’applique au convoiteux.",
      rewordings: [
        "Cette fable concerne les gens avides qui veulent toujours plus.",
        "Morale : celui qui envie ce que les autres ont finit par tout perdre.",
      ],
    },
  ],
  "lafontaine/Le Chien qui lâche sa proie pour l’ombre": [
    {
      chunk:
        "Chacun se trompe ici-bas :\nOn voit courir après l’ombre\nTant de fous qu’on n’en sait pas,\nLa plupart du temps, le nombre.",
      rewordings: [
        "Tout le monde se trompe dans la vie : il y a tellement de fous qui courent après des illusions qu'on ne peut pas les compter.",
        "Réflexion : beaucoup de gens poursuivent des choses qui n'existent pas.",
      ],
    },
    {
      chunk:
        "La plupart du temps, le nombre.\nAu chien dont parle Ésope il faut les renvoyer,\nCe chien voyant sa proie en l’eau représentée\nLa quitta pour l’image, et pensa se noyer :",
      rewordings: [
        "Il faut renvoyer ces fous à l'histoire du chien d'Ésope, qui voit sa proie reflétée dans l'eau et la lâche pour le reflet, au point de presque se noyer.",
        "Un animal abandonne sa vraie nourriture pour une image et manque de se noyer.",
      ],
    },
    {
      chunk:
        "La quitta pour l’image, et pensa se noyer :\nLa rivière devint tout d’un coup agitée ;\nÀ toute peine il regagna les bords,\nEt n’eut ni l’ombre ni le corps.",
      rewordings: [
        "Le chien lâche sa proie pour le reflet. La rivière devient agitée, il a beaucoup de mal à revenir au bord et n'a plus ni le reflet ni la proie.",
        "L'animal se débat dans l'eau et perd tout, la vraie chose comme l'illusion.",
      ],
    },
  ],
  "esope/Borée et le Soleil": [
    {
      chunk:
        "Borée et le Soleil contestaient de leur force. Ils décidèrent d’attribuer la palme à celui d’entre eux qui dépouillerait un voyageur de ses vêtements. Borée commença ; il souffla avec violence.",
      rewordings: [
        "Le vent du nord et le Soleil se disputent pour savoir qui est le plus fort. Ils décident que le gagnant sera celui qui fera enlever ses vêtements à un voyageur. Le vent commence et souffle violemment.",
        "Le vent et le soleil font un concours pour déshabiller un passant, et le vent attaque en premier.",
      ],
    },
    {
      chunk:
        "Borée commença ; il souffla avec violence. Comme l’homme serrait sur lui son vêtement, il l’assaillit avec plus de force. Mais l’homme incommodé encore davantage par le froid, prit un vêtement de plus, si bien que, rebuté, Borée le livra au Soleil.",
      rewordings: [
        "Le vent souffle fort, mais l'homme serre son manteau. Le vent souffle encore plus, l'homme a plus froid et met un vêtement de plus, alors le vent abandonne et laisse sa place au Soleil.",
        "Plus le vent force, plus l'homme se couvre, et le vent finit par renoncer.",
      ],
    },
    {
      chunk:
        "Mais l’homme incommodé encore davantage par le froid, prit un vêtement de plus, si bien que, rebuté, Borée le livra au Soleil. Celui-ci tout d’abord luisit modérément ; puis, l’homme ayant ôté son vêtement supplémentaire, le Soleil darda des rayons plus ardents, jusqu’à ce que l’homme, ne pouvant plus résister à la chaleur, ôta ses habits et s’en alla prendre un bain dans la rivière voisine.",
      rewordings: [
        "Le Soleil brille d'abord doucement, l'homme enlève son vêtement en trop ; puis il chauffe plus fort, et l'homme, accablé de chaleur, se déshabille et va se baigner dans la rivière.",
        "Le soleil réchauffe peu à peu et l'homme finit par tout enlever de lui-même.",
      ],
    },
    {
      chunk: "Cette fable montre que souvent la persuasion est plus efficace que la violence.",
      rewordings: [
        "Cette fable montre que la persuasion marche souvent mieux que la violence.",
        "Morale : convaincre en douceur vaut mieux que forcer.",
      ],
    },
  ],
  "lafontaine/Phébus et Borée": [
    {
      chunk:
        "Borée et le Soleil virent un voyageur\nQui s’était muni par bonheur\nContre le mauvais temps. On entrait dans l’automne,\nQuand la précaution aux voyageurs est bonne :",
      rewordings: [
        "Le vent du nord et le Soleil voient un voyageur qui s'est bien protégé contre le mauvais temps. C'est l'automne, saison où il vaut mieux être prudent.",
        "Le vent et le soleil observent un passant bien équipé contre la pluie.",
      ],
    },
    {
      chunk:
        "Quand la précaution aux voyageurs est bonne :\nIl pleut, le soleil luit ; et l’écharpe d’Iris\nRend ceux qui sortent avertis\nQu’en ces mois le manteau leur est fort nécessaire :",
      rewordings: [
        "En automne, il pleut, puis le soleil brille, et l'arc-en-ciel prévient qu'un manteau est indispensable.",
        "Description de la météo changeante d'automne qui oblige à porter un manteau.",
      ],
    },
    {
      chunk:
        "Qu’en ces mois le manteau leur est fort nécessaire :\nLes Latins les nommaient douteux, pour cette affaire.\nNotre homme s’était donc à la pluie attendu :\nBon manteau bien doublé, bonne étoffe bien forte.",
      rewordings: [
        "Les Latins appelaient ces mois douteux. Le voyageur s'attendait à la pluie et portait un bon manteau doublé en tissu solide.",
        "L'homme a prévu le mauvais temps avec un vêtement bien épais.",
      ],
    },
    {
      chunk:
        "Bon manteau bien doublé, bonne étoffe bien forte.\nCelui-ci, dit le Vent, prétend avoir pourvu\nÀ tous les accidents ; mais il n’a pas prévu\nQue je saurai souffler de sorte",
      rewordings: [
        "Le vent dit que ce voyageur croit avoir tout prévu, mais qu'il ne sait pas que le vent peut souffler si fort",
        "Le vent se vante de pouvoir vaincre les précautions du voyageur.",
      ],
    },
    {
      chunk:
        "Que je saurai souffler de sorte\nQu’il n’est bouton qui tienne : il faudra, si je veux,\nQue le manteau s’en aille au diable.\nL’ébattement pourrait nous en être agréable :",
      rewordings: [
        "que pas un bouton ne tiendra et que le manteau s'envolera. Il trouve que ce serait un amusement agréable.",
        "Le vent prétend qu'il peut arracher le manteau en soufflant.",
      ],
    },
    {
      chunk:
        "L’ébattement pourrait nous en être agréable :\nVous plaît-il de l’avoir ? Eh bien ! gageons nous deux,\nDit Phébus, sans tant de paroles,\nÀ qui plus tôt aura dégarni les épaules",
      rewordings: [
        "Le Soleil propose de parier, sans plus discuter, sur celui qui découvrira en premier les épaules du voyageur.",
        "Le soleil lance un défi au vent : faire enlever le manteau à l'homme.",
      ],
    },
    {
      chunk:
        "À qui plus tôt aura dégarni les épaules\nDu cavalier que nous voyons.\nCommencez : je vous laisse obscurcir mes rayons.\nIl n’en fallut pas plus. Notre souffleur à gage",
      rewordings: [
        "Le Soleil laisse le vent commencer et cacher ses rayons. Le vent ne se fait pas prier.",
        "Le vent attaque en premier pendant que le soleil se cache.",
      ],
    },
    {
      chunk:
        "Il n’en fallut pas plus. Notre souffleur à gage\nSe gorge de vapeurs, s’enfle comme un ballon,\nFait un vacarme de démon,\nSiffle, souffle, tempête, et brise en son passage",
      rewordings: [
        "Le vent se gonfle comme un ballon, fait un bruit d'enfer, siffle, souffle et brise tout sur son passage.",
        "Le vent déclenche une violente tempête.",
      ],
    },
    {
      chunk:
        "Siffle, souffle, tempête, et brise en son passage\nMaint toit qui n’en peut mais, fait périr maint bateau :\nLe tout au sujet d’un manteau.\nLe cavalier eut soin d’empêcher que l’orage",
      rewordings: [
        "La tempête casse des toits et fait couler des bateaux, tout ça pour un manteau. Le voyageur empêche le vent d'entrer dans son manteau.",
        "La tempête fait des dégâts énormes, mais l'homme protège son vêtement.",
      ],
    },
    {
      chunk:
        "Le cavalier eut soin d’empêcher que l’orage\nNe se pût engouffrer dedans.\nCela le préserva. Le vent perdit son temps ;\nPlus il se tourmentait, plus l’autre tenait ferme :",
      rewordings: [
        "Le voyageur est protégé. Le vent perd son temps : plus il s'acharne, plus l'homme tient bon.",
        "Plus le vent force, plus l'homme résiste.",
      ],
    },
    {
      chunk:
        "Plus il se tourmentait, plus l’autre tenait ferme :\nIl eut beau faire agir le collet et les plis.\nSitôt qu’il fut au bout du terme\nQu’à la gageure on avait mis,",
      rewordings: [
        "Le vent a beau agiter le col et les plis du manteau, il n'y arrive pas. Le temps prévu pour le pari est écoulé.",
        "Le vent échoue malgré tous ses efforts, et son tour se termine.",
      ],
    },
    {
      chunk:
        "Qu’à la gageure on avait mis,\nLe Soleil dissipe la nue,\nRécrée et puis pénètre enfin le cavalier,\nSous son balandras fait qu’il sue,",
      rewordings: [
        "Le Soleil écarte les nuages, réchauffe le voyageur puis le pénètre de chaleur et le fait transpirer sous son manteau.",
        "Le soleil chauffe doucement l'homme jusqu'à ce qu'il ait trop chaud.",
      ],
    },
    {
      chunk:
        "Sous son balandras fait qu’il sue,\nLe contraint de s’en dépouiller :\nEncor n’usa-t-il pas de toute sa puissance.\nPlus fait douceur que violence.",
      rewordings: [
        "Le voyageur transpire et est obligé d'enlever son manteau, alors que le Soleil n'a même pas utilisé toute sa force. La douceur fait plus que la violence.",
        "Morale : la gentillesse réussit là où la force échoue.",
      ],
    },
  ],
  "esope/Les Pots": [
    {
      chunk:
        "Un pot de terre et un pot de cuivre étaient emportés par le courant d’une rivière. Le pot de terre dit au pot de cuivre : « Nage loin de moi, pas à mes côtés ; car si tu me touches, je vole en éclats, même si je m’approche de toi sans le vouloir. »",
      rewordings: [
        "Le pot de terre et le pot de cuivre sont emportés par la rivière. Le pot de terre demande au pot de cuivre de nager loin de lui, car un seul contact, même involontaire, le briserait.",
        "Deux pots flottent dans le courant. Le plus fragile supplie le plus dur de garder ses distances, sinon il sera cassé en mille morceaux.",
      ],
    },
    {
      chunk: "La vie n’est pas sûre pour le pauvre qui a pour voisin un prince rapace.",
      rewordings: [
        "La morale : un pauvre n'est jamais en sécurité quand il vit à côté d'un chef puissant et avide.",
        "Leçon : quand on est faible, avoir un voisin puissant et cupide est toujours dangereux.",
      ],
    },
  ],
  "lafontaine/Le Pot de terre et le Pot de fer": [
    {
      chunk:
        "Le pot de fer proposa\nAu pot de terre un voyage.\nCelui-ci s’en excusa,\nDisant qu’il ferait que sage",
      rewordings: [
        "Le pot de fer propose au pot de terre de voyager avec lui. Le pot de terre refuse poliment en disant qu'il serait plus sage pour lui de rester chez lui.",
        "Un pot solide invite un pot fragile à partir en voyage, mais le fragile préfère dire non par prudence.",
      ],
    },
    {
      chunk:
        "Disant qu’il ferait que sage\nDe garder le coin du feu :\nCar il lui fallait si peu,\nSi peu que la moindre chose",
      rewordings: [
        "Le pot de terre explique qu'il vaut mieux pour lui rester au coin du feu, car il est si fragile que la moindre chose peut l'abîmer.",
        "Le pot fragile préfère rester tranquille à la maison, parce qu'un tout petit choc suffirait à le casser.",
      ],
    },
    {
      chunk:
        "Si peu que la moindre chose\nDe son débris serait cause :\nIl n’en reviendrait morceau.\nPour vous, dit-il, dont la peau",
      rewordings: [
        "Le pot de terre dit que le moindre choc le briserait et qu'il n'en resterait aucun morceau. Puis il s'adresse au pot de fer, dont la peau est différente.",
        "Le pot fragile explique qu'un rien le mettrait en miettes, et il commence à comparer sa fragilité à la solidité de l'autre.",
      ],
    },
    {
      chunk:
        "Pour vous, dit-il, dont la peau\nEst plus dure que la mienne,\nJe ne vois rien qui vous tienne.\nNous vous mettrons à couvert,",
      rewordings: [
        "Le pot de terre dit au pot de fer qu'avec sa peau plus dure, rien ne peut l'arrêter. Le pot de fer répond qu'il va le protéger.",
        "Le fragile reconnaît que le solide ne risque rien. Le solide promet alors de le mettre à l'abri.",
      ],
    },
    {
      chunk:
        "Nous vous mettrons à couvert,\nRepartit le pot de fer :\nSi quelque matière dure\nVous menace d’aventure,",
      rewordings: [
        "Le pot de fer répond au pot de terre qu'il le mettra à l'abri : si un objet dur le menace pendant le voyage, il interviendra.",
        "Le pot en métal promet de défendre le pot fragile contre tous les chocs qu'ils pourraient rencontrer.",
      ],
    },
    {
      chunk:
        "Vous menace d’aventure,\nEntre deux je passerai,\nEt du coup vous sauverai.\nCette offre le persuade.",
      rewordings: [
        "Le pot de fer promet de se placer entre le danger et le pot de terre pour le sauver. Cette promesse convainc le pot de terre de partir.",
        "Le pot solide jure qu'il servira de bouclier. Rassuré par cette promesse, le fragile accepte le voyage.",
      ],
    },
    {
      chunk:
        "Cette offre le persuade.\nPot de fer son camarade\nSe met droit à ses côtés.\nMes gens s’en vont à trois pieds",
      rewordings: [
        "Le pot de terre, convaincu, part en voyage, et le pot de fer marche juste à côté de lui. Les deux pots avancent sur leurs trois pieds.",
        "Le fragile se laisse persuader, et son compagnon solide se colle à lui pour marcher ensemble.",
      ],
    },
    {
      chunk:
        "Mes gens s’en vont à trois pieds\nClopin clopant comme ils peuvent,\nL’un contre l’autre jetés\nAu moindre hoquet qu’ils treuvent.",
      rewordings: [
        "Les deux pots marchent en boitant sur leurs trois pieds, et au moindre obstacle ils sont projetés l'un contre l'autre.",
        "Les deux compagnons avancent maladroitement et se cognent l'un contre l'autre à chaque secousse du chemin.",
      ],
    },
    {
      chunk:
        "Au moindre hoquet qu’ils treuvent.\nLe pot de terre en souffre ; il n’eut pas fait cent pas\nQue par son compagnon il fut mis en éclats,\nSans qu’il eût lieu de se plaindre.",
      rewordings: [
        "Le pot de terre souffre de ces chocs : avant d'avoir fait cent pas, il est mis en morceaux par le pot de fer, son propre compagnon, et il ne peut même pas se plaindre.",
        "Très vite, le pot fragile est cassé par celui qui devait le protéger, à force de se cogner contre lui.",
      ],
    },
    {
      chunk:
        "Sans qu’il eût lieu de se plaindre.\nNe nous associons qu’avecque nos égaux ;\nOu bien il nous faudra craindre\nLe destin d’un de ces pots.",
      rewordings: [
        "La morale : il ne faut s'associer qu'avec des gens de même force que nous, sinon on risque de finir brisé comme le pot de terre.",
        "Leçon : restons avec nos égaux, car être l'ami d'un plus fort peut nous détruire.",
      ],
    },
  ],
  "esope/Le Pêcheur et le Picarel": [
    {
      chunk:
        "Un pêcheur, ayant laissé couler son filet dans la mer, en retira un picarel. Comme il était petit, le picarel supplia le pêcheur de ne point le prendre pour le moment, mais de le relâcher en considération de sa petitesse. « Mais quand j’aurai grandi, continua-t-il, et que je serai un gros poisson, tu pourras me reprendre ; aussi bien je te ferai plus de profit. — Hé mais ! répartit le pêcheur, je serais un sot de lâcher le butin que j’ai dans la main, pour compter sur le butin à venir, si grand qu’il soit. »",
      rewordings: [
        "Un pêcheur sort de la mer un picarel, un petit poisson, qui le supplie de le relâcher à cause de sa petite taille et de le reprendre quand il sera gros. Le pêcheur répond qu'il serait bête de lâcher ce qu'il a en main pour un butin futur, même plus grand.",
        "Un petit poisson capturé promet au pêcheur d'être plus rentable plus tard s'il le laisse partir. Mais l'homme préfère garder ce qu'il tient plutôt que de compter sur une promesse.",
      ],
    },
    {
      chunk:
        "Cette fable montre que ce serait folie de lâcher, sans espoir d’un profit plus grand, le profit qu’on a dans la main, sous prétexte qu’il est petit.",
      rewordings: [
        "La morale : ce serait de la folie de lâcher un petit profit qu'on a déjà en main, sous prétexte qu'il est petit, sans être sûr d'en obtenir un plus grand.",
        "Leçon : mieux vaut garder un petit gain sûr que de le perdre en espérant mieux.",
      ],
    },
  ],
  "lafontaine/Le petit Poisson et le Pêcheur": [
    {
      chunk:
        "Petit poisson deviendra grand,\nPourvu que Dieu lui prête vie ;\nMais le lâcher en attendant,\nJe tiens pour moi que c’est folie,",
      rewordings: [
        "Le poète dit qu'un petit poisson deviendra grand s'il reste en vie, mais qu'à son avis ce serait de la folie de le relâcher en attendant.",
        "Un jeune poisson peut grandir, mais le laisser partir pour plus tard, ce n'est pas raisonnable selon l'auteur.",
      ],
    },
    {
      chunk:
        "Je tiens pour moi que c’est folie,\nCar de le rattraper il n’est pas trop certain.\nUn carpeau qui n’était encore que fretin,\nFut pris par un pêcheur au bord d’une rivière.",
      rewordings: [
        "Le poète pense que relâcher le petit poisson est fou, car on n'est pas sûr de le rattraper. Il raconte qu'un tout jeune carpeau est pris par un pêcheur au bord d'une rivière.",
        "On ne sait jamais si on retrouvera ce qu'on a laissé filer. L'histoire commence : un pêcheur attrape un minuscule poisson.",
      ],
    },
    {
      chunk:
        "Fut pris par un pêcheur au bord d’une rivière.\nTout fait nombre, dit l’homme, en voyant son butin ;\nVoilà commencement de chère et de festin :\nMettons-le en notre gibecière.",
      rewordings: [
        "Le pêcheur, en voyant le petit poisson qu'il vient de prendre, se dit que tout compte et que c'est le début d'un bon repas. Il décide de le mettre dans son sac.",
        "L'homme est content de sa prise, même petite : pour lui, chaque poisson aide à faire un festin, alors il le garde.",
      ],
    },
    {
      chunk:
        "Mettons-le en notre gibecière.\nLe pauvre carpillon lui dit en sa manière :\nQue ferez-vous de moi ? je ne saurais fournir\nAu plus qu’une demi-bouchée.",
      rewordings: [
        "Le pêcheur veut mettre le poisson dans son sac. Le petit carpillon lui demande ce qu'il compte faire de lui, puisqu'il ne ferait qu'une demi-bouchée.",
        "Le petit poisson essaie de négocier : il dit qu'il est beaucoup trop petit pour faire un vrai repas.",
      ],
    },
    {
      chunk:
        "Au plus qu’une demi-bouchée.\nLaissez-moi carpe devenir :\nJe serai par vous repêchée ;\nQuelque gros partisan m’achètera bien cher :",
      rewordings: [
        "Le petit poisson supplie le pêcheur de le laisser devenir une grosse carpe : il pourra le repêcher plus tard, et un riche le lui achètera très cher.",
        "Le poisson promet d'être plus rentable quand il sera grand, si le pêcheur accepte de le relâcher maintenant.",
      ],
    },
    {
      chunk:
        "Quelque gros partisan m’achètera bien cher :\nAu lieu qu’il vous en faut chercher\nPeut-être encor cent de ma taille\nPour faire un plat : quel plat ! croyez-moi, rien qui vaille.",
      rewordings: [
        "Le poisson ajoute qu'un riche l'achètera cher plus tard, alors que maintenant il faudrait cent poissons de sa taille pour faire un plat sans valeur.",
        "Le petit poisson insiste : aujourd'hui il ne vaut rien, mais plus tard il rapportera gros.",
      ],
    },
    {
      chunk:
        "Pour faire un plat : quel plat ! croyez-moi, rien qui vaille.\nRien qui vaille ! eh bien ! soit, repartit le pêcheur ;\nPoisson, mon bel ami, qui faites le prêcheur,\nVous irez dans la poêle ; et, vous avez beau dire,",
      rewordings: [
        "Le petit poisson répète qu'il ne ferait qu'un plat sans valeur. Le pêcheur répond : soit, mais le poisson qui fait la morale ira quand même dans la poêle.",
        "L'homme se moque du discours du poisson et décide de le cuisiner malgré ses arguments.",
      ],
    },
    {
      chunk:
        "Vous irez dans la poêle ; et, vous avez beau dire,\nDès ce soir on vous fera frire.\nUn Tiens, vaut, ce dit-on, mieux que deux Tu l’auras :\nL’un est sûr, l’autre ne l’est pas.",
      rewordings: [
        "Le pêcheur annonce que le poisson sera frit le soir même. La morale : un « tiens » vaut mieux que deux « tu l'auras », car l'un est sûr et l'autre ne l'est pas.",
        "Le petit poisson finit cuit. Leçon : ce qu'on a en main vaut mieux qu'une promesse incertaine.",
      ],
    },
  ],
  "esope/La Vipère et la Lime": [
    {
      chunk:
        "Une vipère, s’étant glissée dans l’atelier d’un forgeron, demanda aux outils de lui faire une aumône. Après l’avoir reçue des autres, elle vint à la lime et la pria de lui donner quelque chose. « Tu es bonne, répliqua la lime, de croire que tu obtiendras quelque chose de moi : j’ai l’habitude, non pas de donner, mais de prendre de chacun. »",
      rewordings: [
        "Une vipère entre dans l'atelier d'un forgeron et demande l'aumône aux outils. Les autres lui donnent quelque chose, mais la lime lui répond qu'elle est naïve, car elle a l'habitude de prendre à tout le monde, pas de donner.",
        "Un serpent mendie auprès des outils d'un atelier. L'un d'eux, la lime, se moque de lui : elle ne fait que prendre, jamais donner.",
      ],
    },
    {
      chunk:
        "Cette fable fait voir que c’est sottise de s’attendre à tirer quelque profit des avares.",
      rewordings: [
        "La morale : c'est une bêtise d'espérer tirer un profit des avares.",
        "Leçon : n'attends rien des gens radins, ils ne donnent jamais rien.",
      ],
    },
  ],
  "lafontaine/Le Serpent et la Lime": [
    {
      chunk:
        "On conte qu’un serpent, voisin d’un horloger,\n(C’était pour l’horloger un mauvais voisinage),\nEntra dans sa boutique, et, cherchant à manger,\nN’y rencontra pour tout potage",
      rewordings: [
        "On raconte qu'un serpent, voisin gênant d'un horloger, entre dans sa boutique pour chercher à manger, mais il ne trouve rien à se mettre sous la dent.",
        "Un serpent affamé se glisse chez un artisan pour trouver de la nourriture, mais la boutique est presque vide.",
      ],
    },
    {
      chunk:
        "N’y rencontra pour tout potage\nQu’une lime d’acier qu’il se mit à ronger.\nCette lime lui dit, sans se mettre en colère :\nPauvre ignorant, eh ! que prétends-tu faire ?",
      rewordings: [
        "Le serpent ne trouve qu'une lime d'acier et se met à la ronger. La lime lui dit calmement qu'il est bien ignorant et lui demande ce qu'il espère faire.",
        "Le serpent mord un outil en métal, et l'outil lui demande tranquillement à quoi il pense.",
      ],
    },
    {
      chunk:
        "Pauvre ignorant, eh ! que prétends-tu faire ?\nTu te prends à plus dur que toi,\nPetit serpent à tête folle :\nPlutôt que d’emporter de moi",
      rewordings: [
        "La lime dit au serpent qu'il est ignorant : il s'attaque à quelque chose de plus dur que lui, ce petit serpent écervelé.",
        "L'outil traite le serpent d'idiot, car il essaie de mordre plus solide que lui.",
      ],
    },
    {
      chunk:
        "Plutôt que d’emporter de moi\nSeulement le quart d’une obole,\nTu te romprais toutes les dents.\nJe ne crains que celles du temps.",
      rewordings: [
        "La lime dit au serpent qu'il se casserait toutes les dents avant de lui enlever le moindre morceau, et qu'elle ne craint que l'usure du temps.",
        "Le serpent s'abîmerait les crocs sans rien obtenir : seul le temps peut abîmer la lime.",
      ],
    },
    {
      chunk:
        "Je ne crains que celles du temps.\nCeci s’adresse à vous, esprits du dernier ordre,\nQui, n’étant bons à rien, cherchez surtout à mordre.\nVous vous tourmentez vainement.",
      rewordings: [
        "Le poète s'adresse aux esprits médiocres qui, incapables de rien faire de bien, cherchent surtout à critiquer méchamment : ils se fatiguent pour rien.",
        "Message aux critiques jaloux qui ne savent que dire du mal : leurs attaques ne servent à rien.",
      ],
    },
    {
      chunk:
        "Vous vous tourmentez vainement.\nCroyez-vous que vos dents impriment leurs outrages\nSur tant de beaux ouvrages ?\nIls sont pour vous d’airain, d’acier, de diamant.",
      rewordings: [
        "Les critiques se tourmentent pour rien : leurs morsures ne peuvent pas abîmer les belles œuvres, qui sont pour eux aussi dures que le bronze, l'acier ou le diamant.",
        "Les jaloux peuvent critiquer tant qu'ils veulent, les beaux travaux résistent comme du métal ou du diamant.",
      ],
    },
  ],
  "esope/Le Renard écourté": [
    {
      chunk:
        "Un renard, ayant eu la queue coupée par un piège, en était si honteux qu’il jugeait sa vie impossible ; aussi résolut-il d’engager les autres renards à s’écourter de même, afin de cacher dans la mutilation commune son infirmité personnelle. En conséquence il les assembla tous et les engagea à se couper la queue, disant que c’était non seulement un enlaidissement, mais encore un poids inutile que cet appendice. Mais un des renards prenant la parole dit : « Hé ! camarade, si ce n’était pas ton intérêt, tu ne nous aurais pas donné ce conseil. »",
      rewordings: [
        "Un renard qui a perdu sa queue dans un piège a tellement honte qu'il veut que les autres renards se la coupent aussi, pour cacher son défaut. Il les réunit et dit que la queue est laide et inutile, mais un renard lui répond qu'il ne donne ce conseil que par intérêt.",
        "Un animal mutilé essaie de convaincre ses copains de faire comme lui pour ne plus être ridicule, mais l'un d'eux voit clair dans sa manœuvre.",
      ],
    },
    {
      chunk:
        "Cette fable convient à ceux qui donnent des conseils à leur prochain, non par bienveillance, mais par intérêt personnel.",
      rewordings: [
        "La morale vise ceux qui donnent des conseils aux autres non par gentillesse, mais pour leur propre intérêt.",
        "Leçon : méfie-toi des conseils de ceux qui en tirent profit.",
      ],
    },
  ],
  "lafontaine/Le Renard ayant la queue coupée": [
    {
      chunk:
        "Un vieux renard, mais des plus fins,\nGrand croqueur de poulets, grand preneur de lapins,\nSentant son renard d’une lieue,\nFut enfin au piège attrapé.",
      rewordings: [
        "Un vieux renard très rusé, grand mangeur de poulets et chasseur de lapins, finit pourtant par se faire prendre dans un piège.",
        "Un vieil animal malin, habitué à voler des volailles, se fait un jour attraper.",
      ],
    },
    {
      chunk:
        "Fut enfin au piège attrapé.\nPar grand hasard en étant échappé,\nNon pas franc, car pour gage il y laissa sa queue ;\nS’étant, dis-je, sauvé sans queue, et tout honteux,",
      rewordings: [
        "Le renard réussit à s'échapper du piège, mais il doit y laisser sa queue. Il se sauve sans queue et plein de honte.",
        "L'animal se libère, mais il perd un morceau de son corps et se sent humilié.",
      ],
    },
    {
      chunk:
        "S’étant, dis-je, sauvé sans queue, et tout honteux,\nPour avoir des pareils (comme il était habile),\nUn jour que les renards tenaient conseil entre eux :\nQue faisons-nous, dit-il, de ce poids inutile,",
      rewordings: [
        "Le renard sans queue, honteux, veut que les autres lui ressemblent. Lors d'une réunion des renards, il leur demande à quoi sert ce poids inutile.",
        "Pour ne pas être le seul différent, le renard mutilé profite d'une assemblée pour critiquer la queue des autres.",
      ],
    },
    {
      chunk:
        "Que faisons-nous, dit-il, de ce poids inutile,\nEt qui va balayant tous les sentiers fangeux ?\nQue nous sert cette queue ? il faut qu’on se la coupe\nS’y l’on me croit, chacun s’y résoudra.",
      rewordings: [
        "Le renard dit que la queue est un poids inutile qui traîne dans la boue, et que tout le monde devrait se la couper.",
        "Il essaie de convaincre ses semblables que leur queue ne sert à rien et qu'il faut s'en débarrasser.",
      ],
    },
    {
      chunk:
        "S’y l’on me croit, chacun s’y résoudra.\nVotre avis est fort bon, dit quelqu’un de la troupe :\nMais tournez-vous, de grâce ; et l’on vous répondra.\nÀ ces mots il se fit une telle huée",
      rewordings: [
        "Le renard affirme que chacun l'écoutera. Un autre renard répond que l'idée est bonne, mais lui demande de se retourner d'abord, ce qui provoque des huées.",
        "Un renard malin lui demande de montrer son derrière : tout le monde comprend alors pourquoi il donne ce conseil.",
      ],
    },
    {
      chunk:
        "À ces mots il se fit une telle huée\nQue le pauvre écourté ne put être entendu.\nPrétendre ôter la queue eût été temps perdu :\nLa mode en fut continuée.",
      rewordings: [
        "Les moqueries sont si fortes que le renard sans queue ne peut plus se faire entendre. Les renards gardent leur queue, et la mode continue.",
        "Tout le monde se moque de lui, et personne ne suit son conseil intéressé.",
      ],
    },
  ],
  "esope/Le Laboureur et le Serpent gelé": [
    {
      chunk:
        "Un laboureur trouva dans la saison d’hiver un serpent raidi par le froid. Il en eut pitié, le ramassa et le mit dans son sein. Réchauffé, le serpent reprit son naturel, frappa et tua son bienfaiteur, qui, se sentant mourir, s’écria : « Je l’ai bien mérité, ayant eu pitié d’un méchant. »",
      rewordings: [
        "Un laboureur trouve en hiver un serpent paralysé par le froid. Par pitié, il le met contre sa poitrine. Une fois réchauffé, le serpent le mord et le tue, et l'homme reconnaît avant de mourir qu'il a eu tort d'avoir pitié d'un méchant.",
        "Un homme sauve un animal dangereux du froid, mais l'animal le remercie en le tuant.",
      ],
    },
    {
      chunk:
        "Cette fable montre que la perversité ne change pas, quelque bonté qu’on lui témoigne.",
      rewordings: [
        "La morale : la méchanceté ne change pas, quelle que soit la gentillesse qu'on lui montre.",
        "Leçon : on a beau être bon avec les méchants, ils restent méchants.",
      ],
    },
  ],
  "lafontaine/Le Villageois et le Serpent": [
    {
      chunk:
        "Ésope conte qu’un manant,\nCharitable autant que peu sage,\nUn jour d’hiver se promenant\nÀ l’entour de son héritage,",
      rewordings: [
        "Le poète raconte, d'après Ésope, qu'un paysan généreux mais peu prudent se promène un jour d'hiver autour de ses terres.",
        "Un homme gentil mais naïf fait une promenade dans ses champs en hiver.",
      ],
    },
    {
      chunk:
        "À l’entour de son héritage,\nAperçut un serpent sur la neige étendu,\nTransi, gelé, perclus, immobile rendu,\nN’ayant pas à vivre un quart d’heure.",
      rewordings: [
        "En se promenant autour de ses terres, le paysan voit un serpent allongé sur la neige, gelé et immobile, qui n'a plus qu'un quart d'heure à vivre.",
        "L'homme découvre dans la neige un animal glacé, presque mort.",
      ],
    },
    {
      chunk:
        "N’ayant pas à vivre un quart d’heure.\nLe villageois le prend, l’emporte en sa demeure ;\nEt sans considérer quel sera le loyer\nD’une action de ce mérite,",
      rewordings: [
        "Le serpent est sur le point de mourir. Le villageois le prend et l'emporte chez lui, sans réfléchir à ce que cette bonne action va lui rapporter.",
        "L'homme ramène l'animal mourant à la maison sans se demander comment il sera remercié.",
      ],
    },
    {
      chunk:
        "D’une action de ce mérite,\nIl l’étend le long du foyer,\nLe réchauffe, le ressuscite.\nL’animal engourdi sent à peine le chaud,",
      rewordings: [
        "Le villageois allonge le serpent près du feu, le réchauffe et lui redonne vie. À peine le serpent sent-il la chaleur que...",
        "L'homme réchauffe l'animal devant la cheminée et le sauve.",
      ],
    },
    {
      chunk:
        "L’animal engourdi sent à peine le chaud,\nQue l’âme lui revient avecque la colère.\nIl lève un peu la tête, et puis siffle aussitôt ;\nPuis fait un long repli, puis tâche à faire un saut",
      rewordings: [
        "Dès que le serpent se réchauffe, il retrouve la vie et la colère. Il lève la tête, siffle, se replie et essaie de sauter.",
        "L'animal, à peine guéri, redevient agressif et se prépare à attaquer.",
      ],
    },
    {
      chunk:
        "Puis fait un long repli, puis tâche à faire un saut\nContre son bienfaiteur, son sauveur, et son père.\nIngrat, dit le manant, voilà donc mon salaire !\nTu mourras ! À ces mots, plein d’un juste courroux,",
      rewordings: [
        "Le serpent essaie de sauter sur le villageois qui l'a sauvé. Le paysan le traite d'ingrat, dit que c'est donc ainsi qu'on le remercie, et annonce qu'il va le tuer.",
        "L'animal attaque son sauveur. L'homme, furieux de tant d'ingratitude, décide de le punir.",
      ],
    },
    {
      chunk:
        "Tu mourras ! À ces mots, plein d’un juste courroux,\nIl vous prend sa cognée, il vous tranche la bête ;\nIl fait trois serpents de deux coups,\nUn tronçon, la queue et la tête.",
      rewordings: [
        "Le villageois en colère prend sa hache et coupe le serpent en trois morceaux : un tronçon, la queue et la tête.",
        "L'homme tue l'animal ingrat en le découpant avec sa hache.",
      ],
    },
    {
      chunk:
        "Un tronçon, la queue et la tête.\nL’insecte, sautillant, cherche à se réunir ;\nMais il ne put y parvenir.\nIl est bon d’être charitable :",
      rewordings: [
        "Les morceaux du serpent essaient de se recoller, sans y arriver. Le poète commence la morale : il est bon d'être charitable.",
        "L'animal découpé ne peut pas se reconstituer. Leçon : c'est bien d'aider les autres.",
      ],
    },
    {
      chunk:
        "Il est bon d’être charitable :\nMais envers qui ? c’est là le point.\nQuant aux ingrats, il n’en est point\nQui ne meure enfin misérable.",
      rewordings: [
        "La morale : il est bon d'être charitable, mais il faut savoir envers qui. Les ingrats finissent toujours par mourir misérables.",
        "Leçon : aide les autres, mais pas ceux qui ne savent pas dire merci, car ils finissent mal.",
      ],
    },
  ],
  "esope/Le Cerf à la source et le Lion": [
    {
      chunk:
        "Un cerf pressé par la soif arriva près d’une source. Après avoir bu, il aperçut son ombre dans l’eau. Il se sentit fier de ses cornes, en voyant leur grandeur et leur diversité ; mais il était mécontent de ses jambes, parce qu’elles étaient grêles et faibles.",
      rewordings: [
        "Un cerf assoiffé boit à une source et voit son reflet dans l'eau. Il est fier de ses grands bois, mais mécontent de ses jambes trop fines et faibles.",
        "Un animal se regarde dans l'eau : il adore ses cornes et déteste ses pattes maigres.",
      ],
    },
    {
      chunk:
        "Il se sentit fier de ses cornes, en voyant leur grandeur et leur diversité ; mais il était mécontent de ses jambes, parce qu’elles étaient grêles et faibles. Il était encore plongé dans ces pensées, quand un lion apparut qui le poursuivit. Il prit la fuite, et le devança d’une longue distance ; car la force des cerfs est dans leurs jambes, celle des lions dans leur cœur.",
      rewordings: [
        "Le cerf admire ses bois et méprise ses jambes. Un lion surgit et le poursuit ; le cerf s'enfuit et prend beaucoup d'avance, car sa force est dans ses jambes.",
        "Pendant qu'il se juge, un prédateur l'attaque. Grâce à ses pattes rapides, l'animal le distance.",
      ],
    },
    {
      chunk:
        "Il prit la fuite, et le devança d’une longue distance ; car la force des cerfs est dans leurs jambes, celle des lions dans leur cœur. Tant que la plaine fut nue, il maintint l’avance qui le sauvait ; mais étant parvenu à un endroit boisé, il arriva que ses cornes se prirent aux branches et que, ne pouvant plus courir, il fut pris par le lion. Sur le point de mourir, il se dit en lui-même : « Malheureux que je suis !",
      rewordings: [
        "Le cerf garde son avance tant que la plaine est dégagée, mais dans le bois ses cornes se prennent dans les branches et le lion l'attrape. Il se lamente avant de mourir.",
        "L'animal fuit bien en terrain libre, mais dans la forêt ses bois le bloquent et il est capturé.",
      ],
    },
    {
      chunk:
        "Sur le point de mourir, il se dit en lui-même : « Malheureux que je suis ! Ce sont mes pieds, qui devaient me trahir, qui me sauvaient ; et ce sont mes cornes, en qui j’avais toute confiance, qui me perdent. »",
      rewordings: [
        "Avant de mourir, le cerf comprend que ses pieds, qu'il croyait mauvais, le sauvaient, et que ses cornes, dont il était si fier, l'ont perdu.",
        "L'animal réalise trop tard que ce qu'il méprisait le sauvait et que ce qu'il admirait l'a tué.",
      ],
    },
    {
      chunk:
        "C’est ainsi que souvent dans le danger les amis que nous suspectons nous sauvent, et ceux sur qui nous comptons fermement nous trahissent.",
      rewordings: [
        "La morale : souvent, dans le danger, les amis dont on se méfie nous sauvent, et ceux en qui on a confiance nous trahissent.",
        "Leçon : on se trompe souvent sur ceux qui nous aident vraiment et ceux qui nous trahissent.",
      ],
    },
  ],
  "lafontaine/Le Cerf se voyant dans l’eau": [
    {
      chunk:
        "Dans le cristal d’une fontaine\nUn cerf se mirant autrefois\nLouait la beauté de son bois,\nEt ne pouvait qu’avecque peine",
      rewordings: [
        "Un cerf se regarde autrefois dans l'eau claire d'une fontaine. Il admire la beauté de ses bois, mais il a du mal à supporter...",
        "Un animal se contemple dans l'eau et trouve ses cornes très belles.",
      ],
    },
    {
      chunk:
        "Et ne pouvait qu’avecque peine\nSouffrir ses jambes de fuseaux,\nDont il voyait l’objet se perdre dans les eaux.\nQuelle proportion de mes pieds à ma tête !",
      rewordings: [
        "Le cerf supporte mal ses jambes fines comme des fuseaux, qu'il voit se refléter dans l'eau. Il se plaint du manque d'harmonie entre ses pieds et sa tête.",
        "L'animal trouve ses pattes trop maigres par rapport à sa tête magnifique.",
      ],
    },
    {
      chunk:
        "Quelle proportion de mes pieds à ma tête !\nDisait-il en voyant leur ombre avec douleur :\nDes taillis les plus hauts mon front atteint le faîte ;\nMes pieds ne me font point d’honneur.",
      rewordings: [
        "Le cerf se plaint en regardant son reflet : son front touche le haut des buissons, mais ses pieds ne lui font pas honneur.",
        "L'animal est fier de ses grands bois et a honte de ses pattes.",
      ],
    },
    {
      chunk:
        "Mes pieds ne me font point d’honneur.\nTout en parlant de la sorte,\nUn limier le fait partir.\nIl tâche à se garantir ;",
      rewordings: [
        "Le cerf dit que ses pieds ne lui font pas honneur. Pendant qu'il parle, un chien de chasse le fait fuir, et il essaie de se sauver.",
        "Soudain un chien le poursuit, et l'animal doit s'enfuir.",
      ],
    },
    {
      chunk:
        "Il tâche à se garantir ;\nDans les forêts il s’emporte :\nSon bois, dommageable ornement,\nL’arrêtant à chaque moment,",
      rewordings: [
        "Le cerf essaie de se protéger et s'élance dans la forêt, mais ses bois, ornement dangereux, l'arrêtent à chaque instant.",
        "L'animal fuit à travers les arbres, mais ses cornes se coincent sans arrêt.",
      ],
    },
    {
      chunk:
        "L’arrêtant à chaque moment,\nNuit à l’office que lui rendent\nSes pieds de qui ses jours dépendent.\nIl se dédit alors, et maudit les présents",
      rewordings: [
        "Ses bois l'arrêtent et gênent ses pieds, dont sa vie dépend. Le cerf change alors d'avis et maudit les bois que le ciel lui donne.",
        "Ses cornes empêchent ses pattes de le sauver, et l'animal regrette d'avoir été si fier d'elles.",
      ],
    },
    {
      chunk:
        "Il se dédit alors, et maudit les présents\nQue le ciel lui fait tous les ans.\nNous faisons cas du beau, nous méprisons l’utile ;\nEt le beau souvent nous détruit.",
      rewordings: [
        "Le cerf maudit les bois qui repoussent chaque année. La morale : nous aimons ce qui est beau, nous méprisons ce qui est utile, et la beauté souvent nous détruit.",
        "Leçon : on préfère le beau à l'utile, mais ce qui est beau peut nous perdre.",
      ],
    },
    {
      chunk:
        "Et le beau souvent nous détruit.\nCe cerf blâme ses pieds qui le rendent agile ;\nIl estime un bois qui lui nuit.",
      rewordings: [
        "La morale : la beauté nous détruit souvent. Le cerf critique ses pieds qui le rendent rapide et admire des bois qui lui font du mal.",
        "Leçon : l'animal méprise ce qui le sauve et admire ce qui le met en danger.",
      ],
    },
  ],
  "esope/Le Berger et la Mer": [
    {
      chunk:
        "Un berger qui paissait un troupeau sur le bord de la mer, en voyant le calme des flots, se mit en tête de naviguer pour faire du commerce. En conséquence il vendit ses moutons, acheta des dattes et mit à la voile. Mais une violente tempête survint, et, le vaisseau risquant de sombrer, il jeta à la mer toute sa cargaison, et se sauva à grand’peine avec son vaisseau vide.",
      rewordings: [
        "Un berger, voyant la mer calme, décide de faire du commerce en bateau. Il vend ses moutons, achète des dattes et part, mais une tempête le force à jeter toute sa cargaison à la mer pour sauver le bateau.",
        "Un gardien de troupeau se lance dans les affaires en mer, mais il perd toute sa marchandise dans une tempête.",
      ],
    },
    {
      chunk:
        "Mais une violente tempête survint, et, le vaisseau risquant de sombrer, il jeta à la mer toute sa cargaison, et se sauva à grand’peine avec son vaisseau vide. Assez longtemps après, un homme vint à passer. Comme il admirait le calme de la mer, qui était en effet tranquille à ce moment, notre berger, prenant la parole, lui dit : « Ah ! mon brave, elle a encore envie de dattes, à ce qu’il paraît : c’est pour cela qu’elle se montre tranquille. »",
      rewordings: [
        "Après la tempête où il a tout perdu, le berger entend un passant admirer la mer calme. Il lui répond que la mer est tranquille parce qu'elle a encore envie de ses dattes.",
        "Ruiné, l'homme ne se laisse plus tromper par une mer tranquille et dit qu'elle cherche seulement à le dépouiller encore.",
      ],
    },
    {
      chunk: "Cette fable montre que les accidents sont des leçons pour les hommes.",
      rewordings: [
        "La morale : les malheurs servent de leçons aux hommes.",
        "Leçon : on apprend de ses mauvaises expériences.",
      ],
    },
  ],
  "lafontaine/Le Berger et la Mer": [
    {
      chunk:
        "Du rapport d’un troupeau, dont il vivait sans soins,\nSe contenta longtemps un voisin d’Amphitrite.\nSi sa fortune était petite,\nElle était sûre tout au moins.",
      rewordings: [
        "Un berger qui vit près de la mer se contente longtemps de ce que lui rapporte son troupeau. Sa fortune est petite, mais au moins elle est sûre.",
        "Un homme gagne peu avec ses moutons, mais il vit tranquille avec un revenu certain.",
      ],
    },
    {
      chunk:
        "Elle était sûre tout au moins.\nÀ la fin, les trésors déchargés sur la plage\nLe tentèrent si bien qu’il vendit son troupeau,\nTrafiqua de l’argent, le mit entier sur l’eau",
      rewordings: [
        "La fortune du berger est sûre. Mais les richesses débarquées sur la plage le tentent : il vend son troupeau et met tout son argent dans le commerce maritime.",
        "Attiré par l'argent du commerce, l'homme vend ses bêtes pour investir sur la mer.",
      ],
    },
    {
      chunk:
        "Trafiqua de l’argent, le mit entier sur l’eau\nCet argent périt par naufrage.\nSon maître fut réduit à garder les brebis,\nNon plus berger en chef comme il était jadis,",
      rewordings: [
        "Le berger investit tout son argent sur la mer, et il le perd dans un naufrage. Il est obligé de redevenir simple gardien de moutons, et non plus propriétaire.",
        "Il perd tout dans un naufrage et doit travailler pour les autres.",
      ],
    },
    {
      chunk:
        "Non plus berger en chef comme il était jadis,\nQuand ses propres moutons paissaient sur le rivage ;\nCelui qui s’était vu Coridon ou Tircis,\nFut Pierrot, et rien davantage.",
      rewordings: [
        "Le berger n'est plus le maître comme autrefois, quand ses propres moutons broutaient au bord de la mer. Lui qui se voyait en berger de poème devient un simple Pierrot.",
        "Ruiné, il n'est plus qu'un pauvre employé sans importance.",
      ],
    },
    {
      chunk:
        "Fut Pierrot, et rien davantage.\nAu bout de quelque temps il fit quelques profits,\nRacheta des bêtes à laine ;\nEt comme un jour les vents, retenant leur haleine,",
      rewordings: [
        "Le berger, devenu simple Pierrot, gagne peu à peu un peu d'argent et rachète des moutons. Un jour, le vent se calme.",
        "Avec le temps, il se refait un petit troupeau, puis la mer redevient tranquille.",
      ],
    },
    {
      chunk:
        "Et comme un jour les vents, retenant leur haleine,\nLaissaient paisiblement aborder les vaisseaux :\nVous voulez de l’argent, ô mesdames les Eaux !\nDit-il ; adressez-vous, je vous prie, à quelque autre :",
      rewordings: [
        "Les vents se calment et les bateaux arrivent paisiblement. Le berger dit alors à la mer : vous voulez de l'argent, mesdames les Eaux, adressez-vous à quelqu'un d'autre.",
        "Devant la mer tranquille, l'homme refuse de se laisser tenter une deuxième fois.",
      ],
    },
    {
      chunk:
        "Dit-il ; adressez-vous, je vous prie, à quelque autre :\nMa foi ! vous n’aurez pas le nôtre.\nCeci n’est pas un conte à plaisir inventé.\nJe me sers de la vérité",
      rewordings: [
        "Le berger dit à la mer qu'elle n'aura pas son argent. Le poète ajoute que cette histoire n'est pas inventée pour le plaisir, mais qu'il se sert de la vérité.",
        "L'homme refuse de risquer à nouveau son argent, et l'auteur précise que l'histoire est réaliste.",
      ],
    },
    {
      chunk:
        "Je me sers de la vérité\nPour montrer, par expérience,\nQu’un sou, quand il est assuré,\nVaut mieux que cinq en espérance ;",
      rewordings: [
        "Le poète veut montrer, par l'expérience, qu'un sou qu'on est sûr d'avoir vaut mieux que cinq qu'on espère.",
        "Leçon : un petit gain certain vaut mieux qu'un gros gain espéré.",
      ],
    },
    {
      chunk:
        "Vaut mieux que cinq en espérance ;\nQu’il se faut contenter de sa condition ;\nQu’aux conseils de la mer et de l’ambition\nNous devons fermer les oreilles.",
      rewordings: [
        "La morale : un sou sûr vaut mieux que cinq espérés ; il faut se contenter de sa situation et ne pas écouter les tentations de la mer et de l'ambition.",
        "Leçon : sois satisfait de ce que tu as et ne te laisse pas emporter par l'envie de devenir riche.",
      ],
    },
    {
      chunk:
        "Nous devons fermer les oreilles.\nPour un qui s’en louera, dix mille s’en plaindront.\nLa mer promet monts et merveilles :\nFiez-vous-y ; les vents et les voleurs viendront.",
      rewordings: [
        "Il faut fermer ses oreilles à l'ambition : pour une personne qui réussit, dix mille le regrettent. La mer promet des merveilles, mais elle apporte tempêtes et voleurs.",
        "Leçon : les promesses de richesse sont trompeuses, et la plupart de ceux qui y croient finissent perdants.",
      ],
    },
  ],
  "esope/L’Aigle et l’Escarbot": [
    {
      chunk:
        "Une aigle poursuivait un lièvre. Ce lièvre, se voyant dénué de tout secours, recourut au seul être que le hasard offrit à ses yeux ; c’était un escarbot ; il le supplia de le sauver. L’escarbot le rassura, et, voyant approcher l’aigle, il la conjura de ne pas lui ravir son suppliant.",
      rewordings: [
        "Un aigle poursuit un lièvre. Sans aide, le lièvre supplie un escarbot, un scarabée, de le sauver. L'escarbot le rassure et demande à l'aigle de ne pas prendre son protégé.",
        "Un lapin sauvage chassé par un oiseau de proie demande l'aide d'un petit insecte, qui essaie de le défendre.",
      ],
    },
    {
      chunk:
        "L’escarbot le rassura, et, voyant approcher l’aigle, il la conjura de ne pas lui ravir son suppliant. Mais l’aigle, dédaignant sa petitesse, dévora le lièvre sous les yeux de l’escarbot. Dès lors l’escarbot, plein de rancune, ne cessa d’observer les endroits où l’aigle faisait son nid, et, quand elle couvait, il s’élevait en l’air, faisait rouler les œufs et les cassait, tant qu’enfin pourchassée de partout, elle eut recours à Zeus (car c’est à Zeus que cet oiseau est consacré), et elle le pria de lui procurer un asile sûr pour y faire ses petits.",
      rewordings: [
        "L'aigle méprise le petit escarbot et dévore le lièvre devant lui. Plein de rancune, l'escarbot casse les œufs de l'aigle à chaque fois qu'elle couve, jusqu'à ce qu'elle demande à Zeus un endroit sûr.",
        "L'oiseau ignore l'insecte et mange le lièvre. L'insecte se venge en détruisant ses œufs, et l'oiseau va chercher de l'aide auprès du roi des dieux.",
      ],
    },
    {
      chunk:
        "Dès lors l’escarbot, plein de rancune, ne cessa d’observer les endroits où l’aigle faisait son nid, et, quand elle couvait, il s’élevait en l’air, faisait rouler les œufs et les cassait, tant qu’enfin pourchassée de partout, elle eut recours à Zeus (car c’est à Zeus que cet oiseau est consacré), et elle le pria de lui procurer un asile sûr pour y faire ses petits. Zeus lui permit de pondre dans son giron, mais l’escarbot avait vu la ruse : il fit une boulette de crotte, prit son essor, et, quand il fut au-dessus du giron de Zeus, il l’y laissa tomber. Zeus se leva pour secouer la crotte, et jeta les œufs à terre sans y penser.",
      rewordings: [
        "L'escarbot continue de casser les œufs de l'aigle, qui pond alors sur les genoux de Zeus. L'escarbot laisse tomber une boulette de crotte sur Zeus, qui se lève pour la secouer et fait tomber les œufs.",
        "Le scarabée trouve une ruse : il fait se lever le dieu avec une crotte, et les œufs de l'oiseau tombent et se cassent.",
      ],
    },
    {
      chunk:
        "Zeus se leva pour secouer la crotte, et jeta les œufs à terre sans y penser. Depuis ce temps-là, dit-on, pendant la saison où paraissent les escarbots, les aigles ne nichent plus.",
      rewordings: [
        "Zeus, en secouant la crotte, fait tomber les œufs sans le vouloir. Depuis, dit-on, les aigles ne font plus de nid à la saison des escarbots.",
        "Les œufs sont cassés, et depuis, l'oiseau évite de pondre quand les scarabées sont là.",
      ],
    },
    {
      chunk:
        "Cette fable apprend à ne mépriser personne ; il faut se dire qu’il n’y a pas d’être si faible qui ne soit capable un jour de venger un affront.",
      rewordings: [
        "La morale : il ne faut mépriser personne, car aucun être n'est assez faible pour ne pas pouvoir un jour se venger d'un affront.",
        "Leçon : même le plus petit peut se venger, alors ne méprise personne.",
      ],
    },
  ],
  "lafontaine/L’Aigle et l’Escarbot": [
    {
      chunk:
        "L’aigle donnait la chasse à maître Jean lapin,\nQui droit à son terrier s’enfuyait au plus vite.\nLe trou de l’escarbot se rencontre en chemin.\nJe laisse à penser si ce gîte",
      rewordings: [
        "L'aigle chasse Jean lapin, qui court vers son terrier. Sur son chemin, il trouve le trou de l'escarbot et se demande si cet abri sera sûr.",
        "Un lapin poursuivi par un oiseau de proie cherche refuge chez un petit insecte.",
      ],
    },
    {
      chunk:
        "Je laisse à penser si ce gîte\nÉtait sûr : mais où mieux ? Jean lapin s’y blottit.\nL’aigle fondant sur lui nonobstant cet asile,\nL’escarbot intercède et dit :",
      rewordings: [
        "L'abri n'est pas très sûr, mais Jean lapin s'y cache quand même. L'aigle fond sur lui malgré tout, et l'escarbot intervient pour le défendre.",
        "Le lapin se cache chez l'insecte, mais l'oiseau attaque quand même, et l'insecte essaie de le protéger.",
      ],
    },
    {
      chunk:
        "L’escarbot intercède et dit :\nPrincesse des oiseaux, il vous est fort facile\nD’enlever malgré moi ce pauvre malheureux :\nMais ne me faites pas cet affront, je vous prie ;",
      rewordings: [
        "L'escarbot dit à l'aigle, la reine des oiseaux, qu'elle peut facilement enlever le pauvre lapin, mais il la supplie de ne pas lui faire cet affront.",
        "Le petit insecte reconnaît que l'oiseau est plus fort, mais il lui demande de respecter son protégé.",
      ],
    },
    {
      chunk:
        "Mais ne me faites pas cet affront, je vous prie ;\nEt puisque Jean lapin vous demande la vie,\nDonnez-la-lui, de grâce, ou l’ôtez à tous deux :\nC’est mon voisin, c’est mon compère.",
      rewordings: [
        "L'escarbot supplie l'aigle de laisser la vie au lapin, ou de les tuer tous les deux, car Jean lapin est son voisin et son ami.",
        "L'insecte demande pitié pour son ami le lapin.",
      ],
    },
    {
      chunk:
        "C’est mon voisin, c’est mon compère.\nL’oiseau de Jupiter, sans répondre un seul mot,\nChoque de l’aile l’escarbot,\nL’étourdit, l’oblige à se taire,",
      rewordings: [
        "Sans répondre, l'aigle frappe l'escarbot de son aile, l'étourdit et le force à se taire.",
        "L'oiseau ne l'écoute même pas et repousse violemment le petit insecte.",
      ],
    },
    {
      chunk:
        "L’étourdit, l’oblige à se taire,\nEnlève Jean lapin. L’escarbot indigné,\nVole au nid de l’oiseau, fracasse, en son absence,\nSes œufs, ses tendres œufs, sa plus douce espérance :",
      rewordings: [
        "L'aigle emporte Jean lapin. L'escarbot, furieux, vole jusqu'au nid de l'aigle en son absence et casse tous ses œufs.",
        "L'oiseau emporte le lapin. Pour se venger, l'insecte détruit les œufs de l'oiseau.",
      ],
    },
    {
      chunk:
        "Ses œufs, ses tendres œufs, sa plus douce espérance :\nPas un seul ne fut épargné.\nL’aigle étant de retour, et voyant ce manège,\nRemplit le ciel de cris ; et, pour comble de rage,",
      rewordings: [
        "Aucun œuf n'est épargné. De retour, l'aigle découvre le désastre et remplit le ciel de ses cris de rage.",
        "L'oiseau trouve son nid détruit et hurle de colère.",
      ],
    },
    {
      chunk:
        "Remplit le ciel de cris ; et, pour comble de rage,\nNe sait sur qui venger le tort qu’elle a souffert.\nElle gémit en vain ; sa plainte au vent se perd.\nIl fallut pour cet an vivre en mère affligée.",
      rewordings: [
        "L'aigle ne sait pas sur qui se venger. Elle gémit pour rien et doit passer l'année en mère malheureuse.",
        "L'oiseau souffre sans savoir qui est le coupable et pleure ses petits perdus.",
      ],
    },
    {
      chunk:
        "Il fallut pour cet an vivre en mère affligée.\nL’an suivant, elle mit son nid en lieu plus haut.\nL’escarbot prend son temps, fait faire aux œufs le saut :\nLa mort de Jean lapin derechef est vengée.",
      rewordings: [
        "L'année suivante, l'aigle place son nid plus haut, mais l'escarbot fait encore tomber les œufs : la mort de Jean lapin est vengée une seconde fois.",
        "L'oiseau cache mieux son nid, mais l'insecte détruit encore ses œufs.",
      ],
    },
    {
      chunk:
        "La mort de Jean lapin derechef est vengée.\nCe second deuil fut tel, que l’écho de ces bois\nN’en dormit de plus de six mois.\nL’oiseau qui porte Ganymède",
      rewordings: [
        "Le chagrin de l'aigle est si grand que l'écho des bois résonne pendant six mois. L'aigle, l'oiseau qui porte Ganymède, va alors demander de l'aide.",
        "Les cris de l'oiseau durent longtemps, puis il décide de chercher du secours.",
      ],
    },
    {
      chunk:
        "L’oiseau qui porte Ganymède\nDu monarque des dieux enfin implore l’aide,\nDépose en son giron ses œufs, et croit qu’en paix\nIls seront dans ce lieu ; que, pour ses intérêts,",
      rewordings: [
        "L'aigle demande l'aide de Jupiter, le roi des dieux, et dépose ses œufs sur ses genoux en pensant qu'ils y seront en sécurité.",
        "L'oiseau confie ses œufs au chef des dieux pour qu'ils soient protégés.",
      ],
    },
    {
      chunk:
        "Ils seront dans ce lieu ; que, pour ses intérêts,\nJupiter se verra contraint de les défendre :\nHardi qui les irait là prendre.\nAussi ne les y prit-on pas.",
      rewordings: [
        "L'aigle croit que Jupiter devra défendre ses œufs et que personne n'osera venir les prendre là. Et en effet, personne ne les prend.",
        "L'oiseau pense ses œufs à l'abri chez le dieu, et personne n'ose les voler.",
      ],
    },
    {
      chunk:
        "Aussi ne les y prit-on pas.\nLeur ennemi changea de note,\nSur la robe du dieu fit tomber une crotte :\nLe dieu la secouant jeta les œufs à bas.",
      rewordings: [
        "L'escarbot change de méthode : il laisse tomber une crotte sur la robe de Jupiter, qui la secoue et fait tomber les œufs.",
        "Le petit insecte trouve une ruse : il salit le dieu, qui fait tomber les œufs en se nettoyant.",
      ],
    },
    {
      chunk:
        "Le dieu la secouant jeta les œufs à bas.\nQuand l’aigle sut l’inadvertance,\nElle menaça Jupiter\nD’abandonner sa cour, d’aller vivre au désert,",
      rewordings: [
        "Jupiter fait tomber les œufs. Quand l'aigle apprend cette maladresse, elle menace Jupiter de quitter sa cour pour aller vivre dans le désert.",
        "L'oiseau est furieux contre le dieu et menace de partir.",
      ],
    },
    {
      chunk:
        "D’abandonner sa cour, d’aller vivre au désert,\nDe quitter toute dépendance,\nAvec mainte autre extravagance.\nLe pauvre Jupiter se tut :",
      rewordings: [
        "L'aigle menace de quitter la cour de Jupiter et de ne plus obéir à personne, avec bien d'autres folies. Jupiter reste silencieux.",
        "L'oiseau fait une grosse colère, et le chef des dieux ne sait pas quoi répondre.",
      ],
    },
    {
      chunk:
        "Le pauvre Jupiter se tut :\nDevant son tribunal l’escarbot comparut,\nFit sa plainte, et conta l’affaire.\nOn fit entendre à l’aigle, enfin, qu’elle avait tort.",
      rewordings: [
        "Jupiter se tait. L'escarbot est appelé devant son tribunal, se plaint et raconte l'histoire. On fait comprendre à l'aigle qu'elle avait tort.",
        "L'insecte explique son affaire au dieu, et on reconnaît que l'oiseau était en tort.",
      ],
    },
    {
      chunk:
        "On fit entendre à l’aigle, enfin, qu’elle avait tort.\nMais, les deux ennemis ne voulant point d’accord,\nLe monarque des dieux s’avisa, pour bien faire,\nDe transporter le temps où l’aigle fait l’amour,",
      rewordings: [
        "On dit à l'aigle qu'elle avait tort, mais les deux ennemis refusent de se réconcilier. Jupiter décide alors de changer la saison où l'aigle fait ses petits.",
        "Comme l'oiseau et l'insecte ne veulent pas faire la paix, le dieu trouve une solution.",
      ],
    },
    {
      chunk:
        "De transporter le temps où l’aigle fait l’amour,\nEn une autre saison, quand la race escarbote\nEst en quartier d’hiver, et, comme la marmotte,\nSe cache et ne voit point le jour.",
      rewordings: [
        "Jupiter déplace la saison des amours des aigles à l'hiver, quand les escarbots se cachent et dorment comme la marmotte.",
        "Le dieu fait pondre l'oiseau quand les insectes hibernent, pour que ses œufs soient en sécurité.",
      ],
    },
  ],
  "esope/Le Renard et le Masque": [
    {
      chunk:
        "Un renard s’étant glissé dans la maison d’un acteur, fouilla successivement toutes ses hardes, et trouva, entre autres objets, une tête de masque artistement travaillée. Il la prit dans ses pattes et dit : « Oh ! quelle tête ! mais elle n’a pas de cervelle. »",
      rewordings: [
        "Le renard entre chez un acteur, fouille ses vêtements et trouve un masque très bien fabriqué. Il le tient et dit qu'il est beau mais n'a pas de cerveau.",
        "Un animal malin découvre un faux visage magnifique dans la maison d'un comédien et remarque qu'il est vide à l'intérieur.",
      ],
    },
    {
      chunk: "Cette fable convient aux hommes magnifiques de corps, mais pauvres de jugement.",
      rewordings: [
        "Cette histoire parle des gens qui ont un très beau corps mais peu d'intelligence.",
        "La morale : on peut être magnifique à l'extérieur et ne pas avoir beaucoup de bon sens.",
      ],
    },
  ],
  "lafontaine/Le Renard et le Buste": [
    {
      chunk:
        "Les grands, pour la plupart, sont masques de théâtre ;\nLeur apparence impose au vulgaire idolâtre.\nL’âne n’en sait juger que par ce qu’il en voit :\nLe renard, au contraire, à fond les examine,",
      rewordings: [
        "La plupart des gens puissants sont comme des masques de théâtre : leur apparence impressionne les gens naïfs. L'âne ne juge que ce qu'il voit, mais le renard examine en profondeur.",
        "Les puissants impressionnent par leur allure. Le naïf se fie à ce qu'il voit, alors que le malin regarde ce qu'il y a derrière.",
      ],
    },
    {
      chunk:
        "Le renard, au contraire, à fond les examine,\nLes tourne de tous sens ; et, quand il s’aperçoit\nQue leur fait n’est que bonne mine,\nIl leur applique un mot qu’un buste de héros",
      rewordings: [
        "Le renard examine les puissants sous tous les angles, et quand il voit qu'ils n'ont que de l'apparence, il leur applique une phrase inspirée par une statue de héros.",
        "L'animal rusé observe bien les gens importants et, s'il découvre qu'ils ne sont que du paraître, il se moque d'eux avec une remarque bien trouvée.",
      ],
    },
    {
      chunk:
        "Il leur applique un mot qu’un buste de héros\nLui fit dire fort à propos.\nC’était un buste creux, et plus grand que nature.\nLe renard, en louant l’effort de la sculpture :",
      rewordings: [
        "Le renard a fait cette remarque devant une statue de héros, creuse et plus grande que nature, en admirant le travail du sculpteur.",
        "Face à une immense statue vide à l'intérieur, l'animal félicite d'abord l'artiste pour son travail.",
      ],
    },
    {
      chunk:
        "Le renard, en louant l’effort de la sculpture :\n« Belle tête, dit-il ; mais de cervelle point. »\nCombien de grands seigneurs sont bustes en ce point !",
      rewordings: [
        "Le renard dit : « Belle tête, mais pas de cerveau. » Beaucoup de grands seigneurs sont comme cette statue.",
        "La belle statue n'a rien dans la tête, et c'est pareil pour beaucoup de gens puissants : beaux de l'extérieur, vides à l'intérieur.",
      ],
    },
  ],
  "esope/La Chauve-souris et les Belettes": [
    {
      chunk:
        "Une chauve-souris, étant tombée à terre, fut prise par une belette. Se voyant sur le point d’être tuée, elle demanda la vie. La belette lui dit qu’elle ne pouvait la relâcher ; car elle était de son naturel ennemie de tous les oiseaux.",
      rewordings: [
        "Une chauve-souris tombe par terre et une belette l'attrape. Elle supplie qu'on la laisse vivre, mais la belette refuse car elle déteste tous les oiseaux.",
        "Un petit animal volant est capturé par un prédateur qui ne veut pas le lâcher parce qu'il est l'ennemi des oiseaux.",
      ],
    },
    {
      chunk:
        "La belette lui dit qu’elle ne pouvait la relâcher ; car elle était de son naturel ennemie de tous les oiseaux. La chauve-souris répliqua qu’elle-même n’était pas un oiseau, mais une souris, et elle s’en tira par ce moyen. Dans la suite, étant tombée une seconde fois, elle fut prise par une autre belette, et la pria de ne point la manger.",
      rewordings: [
        "La chauve-souris répond à la belette qu'elle n'est pas un oiseau mais une souris, et elle est libérée. Plus tard, elle tombe encore et une autre belette l'attrape ; elle la supplie de ne pas la manger.",
        "En mentant sur son identité, l'animal volant s'échappe une première fois, puis il se fait de nouveau capturer par un autre chasseur.",
      ],
    },
    {
      chunk:
        "Dans la suite, étant tombée une seconde fois, elle fut prise par une autre belette, et la pria de ne point la manger. Celle-ci ayant répondu qu’elle détestait toutes les souris, la chauve-souris affirma qu’elle-même n’était pas une souris, mais une chauve-souris, et elle fut relâchée encore cette fois. Il arriva ainsi qu’à deux reprises, en changeant de nom, elle se sauva de la mort.",
      rewordings: [
        "La deuxième belette dit qu'elle déteste les souris, alors la chauve-souris affirme qu'elle n'en est pas une, et elle est relâchée. En changeant de nom deux fois, elle a échappé à la mort.",
        "Cette fois, l'animal dit le contraire de ce qu'il avait dit avant, et ça marche encore : il se sauve deux fois en se faisant passer pour autre chose.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’il ne faut pas s’en tenir toujours aux mêmes moyens, mais songer qu’en s’accommodant aux circonstances, on échappe souvent au danger.",
      rewordings: [
        "La morale : il ne faut pas toujours utiliser les mêmes moyens ; en s'adaptant aux circonstances, on échappe souvent au danger.",
        "La leçon : savoir changer d'attitude selon la situation permet de se tirer d'affaire.",
      ],
    },
  ],
  "lafontaine/La Chauve-souris et les deux Belettes": [
    {
      chunk:
        "Une chauve-souris donna tête baissée\nDans un nid de belette ; et, sitôt qu’elle y fut,\nL’autre, envers la souris de longtemps courroucée,\nPour la dévorer accourut.",
      rewordings: [
        "Une chauve-souris tombe par maladresse dans le nid d'une belette, qui déteste les souris depuis longtemps et accourt pour la manger.",
        "Un petit animal volant arrive chez un prédateur qui en veut aux souris et qui se précipite pour le dévorer.",
      ],
    },
    {
      chunk:
        "Pour la dévorer accourut.\nQuoi ! vous osez, dit-elle, à mes yeux vous produire\nAprès que votre race a tâché de me nuire !\nN’êtes-vous pas souris ? Parlez sans fiction.",
      rewordings: [
        "La belette accuse la chauve-souris d'oser se montrer alors que les souris lui ont fait du mal, et lui demande de dire franchement si elle est une souris.",
        "Le prédateur, furieux, reproche à l'animal d'appartenir à une famille ennemie et exige la vérité.",
      ],
    },
    {
      chunk:
        "N’êtes-vous pas souris ? Parlez sans fiction.\nOui, vous l’êtes ; ou bien je ne suis pas belette.\nPardonnez-moi, dit la pauvrette,\nCe n’est pas ma profession.",
      rewordings: [
        "La belette affirme que la chauve-souris est bien une souris. La pauvre chauve-souris s'excuse et répond que ce n'est pas du tout ce qu'elle est.",
        "Le chasseur est sûr de son accusation, mais le petit animal effrayé nie être une souris.",
      ],
    },
    {
      chunk:
        "Ce n’est pas ma profession.\nMoi, souris, des méchants vous ont dit ces nouvelles.\nGrâce à l’auteur de l’univers,\nJe suis oiseau ; voyez mes ailes :",
      rewordings: [
        "La chauve-souris dit que ce sont des méchants qui ont raconté qu'elle était une souris : grâce à Dieu, elle est un oiseau, et elle montre ses ailes.",
        "Pour se sauver, l'animal prétend être un oiseau et montre ses ailes comme preuve.",
      ],
    },
    {
      chunk:
        "Je suis oiseau ; voyez mes ailes :\nVive la gent qui fend les airs !\nSa raison plut, et sembla bonne.\nElle fait si bien qu’on lui donne",
      rewordings: [
        "La chauve-souris crie « Vive les oiseaux ! ». Son explication plaît à la belette, qui la trouve convaincante.",
        "Le mensonge marche : le prédateur croit l'animal quand il se fait passer pour un oiseau.",
      ],
    },
    {
      chunk:
        "Elle fait si bien qu’on lui donne\nLiberté de se retirer.\nDeux jours après, notre étourdie\nAveuglément se va fourrer",
      rewordings: [
        "La belette laisse partir la chauve-souris. Deux jours plus tard, l'étourdie se jette encore sans réfléchir dans un endroit dangereux.",
        "L'animal est libéré, mais peu après, il se refait prendre par imprudence.",
      ],
    },
    {
      chunk:
        "Aveuglément se va fourrer\nChez une autre belette aux oiseaux ennemie.\nLa voilà derechef en danger de sa vie.\nLa dame du logis avec son long museau",
      rewordings: [
        "La chauve-souris entre chez une autre belette, ennemie des oiseaux, et sa vie est de nouveau en danger. La belette s'approche avec son long museau.",
        "Cette fois, l'animal tombe chez un prédateur qui déteste les oiseaux et qui veut le manger.",
      ],
    },
    {
      chunk:
        "La dame du logis avec son long museau\nS’en allait la croquer en qualité d’oiseau,\nQuand elle protesta qu’on lui faisait outrage :\nMoi, pour telle passer ! Vous n’y regardez pas.",
      rewordings: [
        "La belette va croquer la chauve-souris parce qu'elle la prend pour un oiseau, mais la chauve-souris proteste qu'on l'insulte et qu'on la regarde mal.",
        "Le prédateur veut la manger comme oiseau, mais l'animal fait semblant d'être vexé d'être pris pour un oiseau.",
      ],
    },
    {
      chunk:
        "Moi, pour telle passer ! Vous n’y regardez pas.\nQui fait l’oiseau ? c’est le plumage.\nJe suis souris ; vive les rats !\nJupiter confonde les chats !",
      rewordings: [
        "La chauve-souris dit que ce sont les plumes qui font l'oiseau, qu'elle est une souris, et crie « Vive les rats ! À bas les chats ! ».",
        "Cette fois l'animal prétend être une souris, puisqu'il n'a pas de plumes, et se range du côté des rongeurs.",
      ],
    },
    {
      chunk:
        "Jupiter confonde les chats !\nPar cette adroite repartie\nElle sauva deux fois sa vie.\nPlusieurs se sont trouvés qui, d’écharpes changeants,",
      rewordings: [
        "Par cette réponse habile, la chauve-souris sauve sa vie deux fois. Beaucoup de gens, comme elle, changent de camp.",
        "En disant à chaque ennemi ce qu'il voulait entendre, l'animal s'échappe deux fois, comme ceux qui changent d'opinion selon leur intérêt.",
      ],
    },
    {
      chunk:
        "Plusieurs se sont trouvés qui, d’écharpes changeants,\nAux dangers, ainsi qu’elle, ont souvent fait la figue.\nLe sage dit, selon les gens :\nVive le roi ! vive la ligue !",
      rewordings: [
        "Beaucoup de gens qui changent de camp ont ainsi échappé au danger. Le malin dit, selon la personne en face : « Vive le roi ! » ou « Vive la ligue ! ».",
        "La morale : celui qui s'adapte et soutient le camp de celui qui l'écoute échappe aux ennuis.",
      ],
    },
  ],
  "esope/L’Aigle frappé d’une flèche": [
    {
      chunk:
        "Un aigle s’était perché au faîte d’un rocher à l’affût des lièvres. Un homme le frappa d’une flèche, et le trait s’enfonça dans sa chair, et la coche avec ses plumes se trouva devant ses yeux. À cette vue, il s’écria : « C’est pour moi un surcroît de chagrin de mourir par mes propres plumes. »",
      rewordings: [
        "Un aigle guette des lièvres en haut d'un rocher. Un homme le blesse avec une flèche, et l'aigle voit devant ses yeux les plumes de la flèche. Il s'écrie que c'est encore plus triste de mourir à cause de ses propres plumes.",
        "Un oiseau chasseur est touché par la flèche d'un humain. En remarquant que l'arme est faite avec des plumes, il se désole d'être tué par ce qui vient de lui.",
      ],
    },
    {
      chunk:
        "L’aiguillon de la douleur est plus poignant, quand nous sommes battus par nos propres armes.",
      rewordings: [
        "La morale : la douleur est plus forte quand nous sommes battus par nos propres armes.",
        "La leçon : c'est encore plus dur d'être vaincu par ce qui nous appartient ou par ce qu'on a fourni soi-même.",
      ],
    },
  ],
  "lafontaine/L’Oiseau blessé d’une flèche": [
    {
      chunk:
        "Mortellement atteint d’une flèche empennée,\nUn oiseau déplorait sa triste destinée,\nEt disait, en souffrant un surcroît de douleur :\nFaut-il contribuer à son propre malheur !",
      rewordings: [
        "Un oiseau mortellement blessé par une flèche à plumes se plaint de son sort. Il souffre encore plus en se disant qu'il a contribué à son propre malheur.",
        "Un oiseau touché par une flèche décorée de plumes est triste de voir que ce qui le tue vient en partie de lui.",
      ],
    },
    {
      chunk:
        "Faut-il contribuer à son propre malheur !\nCruels humains ! vous tirez de nos ailes\nDe quoi faire voler ces machines mortelles !\nMais ne vous moquez point, engeance sans pitié ;",
      rewordings: [
        "L'oiseau reproche aux humains cruels de prendre les plumes des ailes des oiseaux pour faire voler leurs flèches. Il leur dit de ne pas se moquer, eux qui sont sans pitié.",
        "L'oiseau accuse les hommes d'utiliser des plumes d'oiseaux pour fabriquer leurs armes mortelles.",
      ],
    },
    {
      chunk:
        "Mais ne vous moquez point, engeance sans pitié ;\nSouvent il vous arrive un sort comme le nôtre.\nDes enfants de Japet toujours une moitié\nFournira des armes à l’autre.",
      rewordings: [
        "L'oiseau prévient les humains qu'il leur arrive souvent la même chose : une moitié des hommes fournit toujours des armes à l'autre moitié.",
        "La morale : les humains aussi donnent des armes à leurs propres ennemis et se font du mal entre eux.",
      ],
    },
  ],
  "esope/Les Lièvres et les Grenouilles": [
    {
      chunk:
        "Les lièvres s’étant un jour assemblés se désolaient entre eux d’avoir une vie si précaire et pleine de crainte : n’étaient-ils pas en effet la proie des hommes, des chiens, des aigles et de bien d’autres animaux ? Il valait donc mieux périr une bonne fois que de vivre dans la terreur. Cette résolution prise, ils s’élancent en même temps vers l’étang, pour s’y jeter et s’y noyer.",
      rewordings: [
        "Les lièvres se réunissent et se plaignent d'avoir une vie fragile et pleine de peur, car les hommes, les chiens et les aigles les chassent. Ils décident qu'il vaut mieux mourir et courent vers l'étang pour s'y noyer.",
        "Des animaux peureux, toujours chassés par des prédateurs, en ont assez et veulent se suicider en se jetant dans l'eau.",
      ],
    },
    {
      chunk:
        "Cette résolution prise, ils s’élancent en même temps vers l’étang, pour s’y jeter et s’y noyer. Mais les grenouilles, accroupies autour de l’étang, n’eurent pas plus tôt perçu le bruit de leur course qu’elles sautèrent dans l’eau. Alors un des lièvres, qui paraissait être plus fin que les autres, dit : « Arrêtez, camarades ; ne vous faites pas de mal ; car, vous venez de le voir, il y a des animaux plus peureux encore que nous. »",
      rewordings: [
        "Les lièvres courent vers l'étang, mais les grenouilles, en les entendant, sautent dans l'eau. Un lièvre plus malin dit aux autres d'arrêter, car il existe des animaux encore plus peureux qu'eux.",
        "En voyant d'autres petites bêtes fuir de peur à leur arrivée, les animaux craintifs comprennent qu'ils ne sont pas les plus peureux et renoncent à mourir.",
      ],
    },
    {
      chunk:
        "Cette fable montre que les malheureux se consolent en voyant des gens plus malheureux qu’eux.",
      rewordings: [
        "La morale : les malheureux se consolent en voyant des gens plus malheureux qu'eux.",
        "La leçon : on se sent mieux quand on découvre que d'autres sont dans une situation pire que la nôtre.",
      ],
    },
  ],
  "lafontaine/Le Lièvre et les Grenouilles": [
    {
      chunk:
        "Un lièvre en son gîte songeait,\n(Car que faire en un gîte, à moins que l’on ne songe ?)\nDans un profond ennui ce lièvre se plongeait :\nCet animal est triste, et la crainte le ronge.",
      rewordings: [
        "Un lièvre réfléchit dans son terrier, car il n'a rien d'autre à faire. Il s'ennuie profondément : cet animal est triste et rongé par la peur.",
        "Un animal craintif rumine seul dans son abri, déprimé et toujours inquiet.",
      ],
    },
    {
      chunk:
        "Cet animal est triste, et la crainte le ronge.\nLes gens de naturel peureux\nSont, disait-il, bien malheureux !\nIls ne sauraient manger morceau qui leur profite :",
      rewordings: [
        "Le lièvre, triste et rongé par la peur, dit que les gens peureux sont très malheureux et ne peuvent même pas profiter de leur nourriture.",
        "L'animal se plaint : quand on a peur de tout, on ne profite de rien, même pas de ses repas.",
      ],
    },
    {
      chunk:
        "Ils ne sauraient manger morceau qui leur profite :\nJamais un plaisir pur ; toujours assauts divers.\nVoilà comme je vis : cette crainte maudite\nM’empêche de dormir sinon les yeux ouverts.",
      rewordings: [
        "Le lièvre dit qu'il n'a jamais de vrai plaisir et qu'il est toujours attaqué. Sa peur l'empêche de dormir autrement que les yeux ouverts.",
        "L'animal peureux explique que l'angoisse lui gâche la vie et l'empêche de dormir tranquillement.",
      ],
    },
    {
      chunk:
        "M’empêche de dormir sinon les yeux ouverts.\nCorrigez-vous, dira quelque sage cervelle.\nEh ! la peur se corrige-t-elle ?\nJe crois même qu’en bonne foi",
      rewordings: [
        "Le lièvre imagine qu'un sage lui dira de se corriger, mais il se demande si on peut guérir de la peur.",
        "L'animal pense qu'on ne peut pas arrêter d'avoir peur, même si on nous conseille de changer.",
      ],
    },
    {
      chunk:
        "Je crois même qu’en bonne foi\nLes hommes ont peur comme moi.\nAinsi raisonnait notre lièvre,\nEt cependant faisait le guet.",
      rewordings: [
        "Le lièvre pense que même les hommes ont peur comme lui. Tout en réfléchissant ainsi, il reste aux aguets.",
        "L'animal se dit que les humains aussi sont peureux, et il continue de surveiller les alentours.",
      ],
    },
    {
      chunk:
        "Et cependant faisait le guet.\nIl était douteux, inquiet :\nUn souffle, une ombre, un rien, tout lui donnait la fièvre.\nLe mélancolique animal,",
      rewordings: [
        "Le lièvre surveille, plein de doute et d'inquiétude : un souffle, une ombre, un rien le fait trembler.",
        "Le moindre petit bruit ou la moindre ombre suffit à affoler l'animal craintif.",
      ],
    },
    {
      chunk:
        "Le mélancolique animal,\nEn rêvant à cette matière,\nEntend un léger bruit : ce lui fut un signal\nPour s’enfuir devers sa tanière.",
      rewordings: [
        "Le lièvre triste, en pensant à tout cela, entend un léger bruit et s'enfuit aussitôt vers son terrier.",
        "Un petit bruit suffit : l'animal peureux part en courant se cacher.",
      ],
    },
    {
      chunk:
        "Pour s’enfuir devers sa tanière.\nIl s’en alla passer sur le bord d’un étang.\nGrenouilles aussitôt de sauter dans les ondes ;\nGrenouilles de rentrer en leurs grottes profondes.",
      rewordings: [
        "En fuyant, le lièvre passe au bord d'un étang. Aussitôt, les grenouilles sautent dans l'eau et se cachent au fond.",
        "Quand l'animal passe près de l'eau, d'autres petites bêtes plongent pour se cacher, effrayées par lui.",
      ],
    },
    {
      chunk:
        "Grenouilles de rentrer en leurs grottes profondes.\nOh ! dit-il, j’en fais faire autant\nQu’on m’en fait faire ! Ma présence\nEffraie aussi les gens ! je mets l’alarme au camp !",
      rewordings: [
        "Les grenouilles se cachent, et le lièvre s'étonne : il fait aux autres ce qu'on lui fait, sa présence fait peur et donne l'alerte.",
        "L'animal découvre qu'il fait peur aux autres, comme les autres lui font peur.",
      ],
    },
    {
      chunk:
        "Effraie aussi les gens ! je mets l’alarme au camp !\nEt d’où me vient cette vaillance ?\nComment ! des animaux qui tremblent devant moi !\nJe suis donc un foudre de guerre !",
      rewordings: [
        "Le lièvre se demande d'où lui vient ce courage : des animaux tremblent devant lui, il se prend pour un grand guerrier.",
        "Fier que des bêtes aient peur de lui, le peureux se sent soudain puissant.",
      ],
    },
    {
      chunk:
        "Je suis donc un foudre de guerre !\nIl n’est, je le vois bien, si poltron sur la terre,\nQui ne puisse trouver un plus poltron que soi.",
      rewordings: [
        "Le lièvre se croit un grand guerrier et comprend qu'il n'existe personne d'assez peureux pour ne pas trouver plus peureux que lui.",
        "La morale : il y a toujours quelqu'un de plus peureux que soi.",
      ],
    },
  ],
  "esope/L’Avare": [
    {
      chunk:
        "Un avare convertit en or toute sa fortune, en fit un lingot et l’enfouit en un certain endroit, où il enfouit du même coup son cœur et son esprit. Tous les jours il venait voir son trésor. Or un ouvrier l’observa, devina ce qu’il en était, et, déterrant le lingot, l’emporta.",
      rewordings: [
        "Un avare transforme toute sa fortune en un bloc d'or qu'il enterre, et il y met aussi tout son cœur. Il vient le voir chaque jour, mais un ouvrier l'observe, devine le secret, déterre l'or et le vole.",
        "Un homme radin cache son trésor sous terre et le surveille tous les jours, jusqu'à ce qu'un travailleur le découvre et le lui prenne.",
      ],
    },
    {
      chunk:
        "Or un ouvrier l’observa, devina ce qu’il en était, et, déterrant le lingot, l’emporta. Quelque temps après, l’avare vint aussi, et, trouvant la place vide, il se mit à gémir et à s’arracher les cheveux. Un quidam l’ayant vu se lamenter ainsi, et s’étant informé du motif, lui dit : « Ne te désespère pas ainsi, l’ami ; car, tout en ayant de l’or, tu n’en avais pas.",
      rewordings: [
        "Un ouvrier vole l'or de l'avare. Plus tard, l'avare trouve le trou vide, pleure et s'arrache les cheveux. Un passant lui demande pourquoi et lui dit de ne pas désespérer, car même avec cet or, il ne l'avait pas vraiment.",
        "Le radin découvre que son trésor a disparu et se désespère ; quelqu'un lui dit qu'il n'a rien perdu puisqu'il ne s'en servait pas.",
      ],
    },
    {
      chunk:
        "Un quidam l’ayant vu se lamenter ainsi, et s’étant informé du motif, lui dit : « Ne te désespère pas ainsi, l’ami ; car, tout en ayant de l’or, tu n’en avais pas. Prends donc une pierre, mets-la à la place de l’or, et figure-toi que c’est ton or ; il remplira pour toi le même office ; car à ce que je vois, même au temps où l’or était là, tu ne faisais pas usage de ton bien. »",
      rewordings: [
        "Le passant conseille à l'avare de mettre une pierre à la place de l'or et d'imaginer que c'est son or : elle lui servira autant, car il n'utilisait jamais sa richesse.",
        "On conseille au radin d'enterrer un caillou, puisque son argent caché ne lui servait à rien.",
      ],
    },
    {
      chunk: "Cette fable montre que la possession n’est rien, si la jouissance ne s’y joint.",
      rewordings: [
        "La morale : posséder n'est rien si on ne profite pas de ce qu'on a.",
        "La leçon : avoir des richesses ne sert à rien si on ne les utilise pas.",
      ],
    },
  ],
  "lafontaine/L’Avare qui a perdu son trésor": [
    {
      chunk:
        "L’usage seulement fait la possession.\nJe demande à ces gens de qui la passion\nEst d’entasser toujours, mettre somme sur somme,\nQuel avantage ils ont que n’ait pas un autre homme.",
      rewordings: [
        "Seul l'usage qu'on fait des choses nous les fait vraiment posséder. Le poète demande à ceux qui accumulent toujours de l'argent quel avantage ils ont de plus que les autres.",
        "Avoir de l'argent ne sert que si on l'utilise : à quoi bon entasser des richesses ?",
      ],
    },
    {
      chunk:
        "Quel avantage ils ont que n’ait pas un autre homme.\nDiogène là-bas est aussi riche qu’eux,\nEt l’avare ici-haut comme lui vit en gueux.\nL’homme au trésor caché, qu’Ésope nous propose,",
      rewordings: [
        "Les avares n'ont pas plus que les autres hommes : le philosophe Diogène, très pauvre, est aussi riche qu'eux, car l'avare vit comme un mendiant. L'homme au trésor caché d'Ésope va servir d'exemple.",
        "Un riche qui ne dépense rien vit comme un pauvre ; une histoire d'Ésope va le montrer.",
      ],
    },
    {
      chunk:
        "L’homme au trésor caché, qu’Ésope nous propose,\nServira d’exemple à la chose.\nCe malheureux attendait\nPour jouir de son bien une seconde vie ;",
      rewordings: [
        "L'histoire de l'homme au trésor caché va servir d'exemple. Ce malheureux attendait une autre vie pour profiter de son argent.",
        "Voici l'exemple d'un homme qui ne profitait jamais de sa fortune, comme s'il attendait une autre vie.",
      ],
    },
    {
      chunk:
        "Pour jouir de son bien une seconde vie ;\nNe possédait pas l’or, mais l’or le possédait.\nIl avait dans la terre une somme enfouie,\nSon cœur avec, n’ayant autre déduit",
      rewordings: [
        "L'avare ne possédait pas l'or, c'est l'or qui le possédait. Il avait enterré une somme d'argent, et son cœur avec.",
        "L'homme était esclave de son argent ; il l'avait caché sous terre et y était très attaché.",
      ],
    },
    {
      chunk:
        "Son cœur avec, n’ayant autre déduit\nQue d’y ruminer jour et nuit,\nEt rendre sa chevance à lui-même sacrée.\nQu’il allât ou qu’il vînt, qu’il but ou qu’il mangeât,",
      rewordings: [
        "Son seul plaisir était de penser jour et nuit à son trésor enterré, qu'il considérait comme sacré.",
        "Le radin ne pensait qu'à son magot caché et n'y touchait pas, comme si c'était sacré.",
      ],
    },
    {
      chunk:
        "Qu’il allât ou qu’il vînt, qu’il but ou qu’il mangeât,\nOn l’eût pris de bien court, à moins qu’il ne songeât\nÀ l’endroit où gisait cette somme enterrée.\nIl y fit tant de tours qu’un fossoyeur le vit,",
      rewordings: [
        "Où qu'il aille, qu'il boive ou qu'il mange, l'avare pensait toujours à l'endroit où l'argent était enterré. Il y alla si souvent qu'un fossoyeur le remarqua.",
        "Obsédé par son trésor, l'homme y retourne sans cesse, si bien que quelqu'un finit par le repérer.",
      ],
    },
    {
      chunk:
        "Il y fit tant de tours qu’un fossoyeur le vit,\nSe douta du dépôt, l’enleva sans rien dire.\nNotre avare un beau jour ne trouva que le nid.\nVoilà mon homme aux pleurs ; il gémit, il soupire,",
      rewordings: [
        "Le fossoyeur devine qu'il y a un trésor et le vole sans rien dire. Un jour, l'avare ne trouve plus que le trou vide et se met à pleurer et à gémir.",
        "Un voleur prend l'argent caché ; le radin découvre la cachette vide et se désespère.",
      ],
    },
    {
      chunk:
        "Voilà mon homme aux pleurs ; il gémit, il soupire,\nIl se tourmente, il se déchire.\nUn passant lui demande à quel sujet ses cris. —\nC’est mon trésor que l’on m’a pris. —",
      rewordings: [
        "L'avare pleure, gémit et se tourmente. Un passant lui demande pourquoi il crie, et il répond qu'on lui a volé son trésor.",
        "Le radin se lamente et explique à un inconnu qu'on lui a pris son argent.",
      ],
    },
    {
      chunk:
        "C’est mon trésor que l’on m’a pris. —\nVotre trésor ! où pris ? — Tout joignant cette pierre. —\nEh ! sommes-nous en temps de guerre\nPour l’apporter si loin ? N’eussiez-vous pas mieux fait",
      rewordings: [
        "Le passant demande où le trésor a été pris ; l'avare répond : près de cette pierre. Le passant s'étonne qu'il l'ait apporté si loin, comme en temps de guerre.",
        "L'inconnu trouve bizarre d'avoir caché l'argent si loin, alors qu'il n'y avait aucun danger.",
      ],
    },
    {
      chunk:
        "Pour l’apporter si loin ? N’eussiez-vous pas mieux fait\nDe le laisser chez vous en votre cabinet\nQue de le changer de demeure ?\nVous auriez pu sans peine y puiser à toute heure. —",
      rewordings: [
        "Le passant dit qu'il aurait mieux valu garder l'argent chez lui, dans son bureau, pour pouvoir en prendre facilement à tout moment.",
        "L'inconnu conseille de garder son argent à la maison pour pouvoir s'en servir quand on veut.",
      ],
    },
    {
      chunk:
        "Vous auriez pu sans peine y puiser à toute heure. —\nÀ toute heure, bons dieux ! ne tient-il qu’à cela ?\nL’argent vient-il comme il s’en va ?\nJe n’y touchais jamais. — Dites-moi donc, de grâce,",
      rewordings: [
        "L'avare s'indigne : prendre de l'argent à tout moment ? L'argent ne revient pas aussi facilement qu'il part. Il avoue qu'il n'y touchait jamais.",
        "Le radin refuse l'idée de dépenser et reconnaît qu'il n'utilisait jamais son trésor.",
      ],
    },
    {
      chunk:
        "Je n’y touchais jamais. — Dites-moi donc, de grâce,\nReprit l’autre, pourquoi vous vous affligez tant :\nPuisque vous ne touchiez jamais à cet argent,\nMettez une pierre à la place ;",
      rewordings: [
        "Le passant lui demande alors pourquoi il est si triste, puisqu'il ne touchait jamais à cet argent : il n'a qu'à mettre une pierre à la place.",
        "Puisque l'argent ne lui servait à rien, on lui conseille de le remplacer par un caillou.",
      ],
    },
    {
      chunk: "Mettez une pierre à la place ;\nElle vous vaudra tout autant.",
      rewordings: [
        "Une pierre mise à la place du trésor lui servira tout autant.",
        "Un caillou vaut autant qu'un trésor qu'on n'utilise jamais.",
      ],
    },
  ],
  "esope/Les Enfants désunis du Laboureur": [
    {
      chunk:
        "Les enfants d’un laboureur vivaient en désaccord. Il avait beau les exhorter : ses paroles étaient impuissantes à les faire changer de sentiments ; aussi résolut-il de leur donner une leçon en action. Il leur dit de lui apporter un fagot de baguettes.",
      rewordings: [
        "Les enfants d'un paysan se disputent tout le temps. Leur père leur fait la morale sans succès, alors il décide de leur donner une leçon pratique et leur demande d'apporter un paquet de bâtons.",
        "Un père dont les enfants ne s'entendent pas veut leur montrer quelque chose avec un tas de bâtons.",
      ],
    },
    {
      chunk:
        "Il leur dit de lui apporter un fagot de baguettes. Quand ils eurent exécuté son ordre, tout d’abord il leur donna les baguettes en faisceau et leur dit de les casser. Mais en dépit de tous leurs efforts, ils n’y réussirent point.",
      rewordings: [
        "Le père donne aux enfants le paquet de bâtons attachés et leur demande de le casser. Malgré tous leurs efforts, ils n'y arrivent pas.",
        "Les frères essaient de briser un fagot de bâtons liés ensemble, mais c'est impossible.",
      ],
    },
    {
      chunk:
        "Mais en dépit de tous leurs efforts, ils n’y réussirent point. Alors il délia le faisceau et leur donna les baguettes une à une ; ils les cassèrent facilement. « Eh bien ! dit le père, vous aussi, mes enfants, si vous restez unis, vous serez invincibles à vos ennemis ; mais si vous êtes divisés, vous serez faciles à vaincre. »",
      rewordings: [
        "Le père détache les bâtons et les donne un par un : les enfants les cassent facilement. Il leur explique que s'ils restent unis, ils seront invincibles, mais que s'ils sont divisés, on les battra facilement.",
        "Séparés, les bâtons se cassent tout seuls ; le père en conclut que ses enfants seront forts ensemble et faibles s'ils se séparent.",
      ],
    },
    {
      chunk:
        "Cette fable montre qu’autant la concorde est supérieure en force, autant la discorde est facile à vaincre.",
      rewordings: [
        "La morale : l'entente rend fort, et la dispute rend facile à vaincre.",
        "La leçon : unis on est forts, divisés on est faibles.",
      ],
    },
  ],
  "lafontaine/Le Vieillard et ses Enfants": [
    {
      chunk:
        "Toute puissance est faible, à moins que d’être unie :\nÉcoutez là-dessus l’esclave de Phrygie,\nSi j’ajoute du mien à son invention,\nC’est pour peindre nos mœurs, et non point par envie ;",
      rewordings: [
        "Toute force est faible si elle n'est pas unie. Le poète annonce une fable d'Ésope, l'esclave de Phrygie, et dit qu'il y ajoute des choses pour décrire nos mœurs, pas par jalousie.",
        "Introduction : l'union fait la force, et l'auteur va raconter à sa façon une histoire d'Ésope.",
      ],
    },
    {
      chunk:
        "C’est pour peindre nos mœurs, et non point par envie ;\nJe suis trop au-dessous de cette ambition.\nPhèdre enchérit souvent par un motif de gloire ;\nPour moi, de tels pensers me seraient mal séants.",
      rewordings: [
        "Le poète dit qu'il n'a pas l'ambition de surpasser Ésope. Phèdre, un autre auteur, en rajoute souvent pour la gloire, mais lui trouverait cela déplacé.",
        "L'auteur explique modestement qu'il ne cherche pas à briller comme d'autres écrivains.",
      ],
    },
    {
      chunk:
        "Pour moi, de tels pensers me seraient mal séants.\nMais venons à la fable, ou plutôt à l’histoire\nDe celui qui tâcha d’unir tous ses enfants.\nUn vieillard près d’aller où la mort l’appelait :",
      rewordings: [
        "Le poète commence l'histoire d'un homme qui a essayé d'unir ses enfants : un vieillard sur le point de mourir.",
        "Début de l'histoire : un vieux père mourant veut que ses enfants restent ensemble.",
      ],
    },
    {
      chunk:
        "Un vieillard près d’aller où la mort l’appelait :\nMes chers enfants, dit-il (à ses fils il parlait),\nVoyez si vous romprez ces dards liés ensemble ;\nJe vous expliquerai le nœud qui les assemble.",
      rewordings: [
        "Le vieillard mourant demande à ses fils s'ils peuvent casser des flèches attachées ensemble, et promet de leur expliquer ensuite ce qui les lie.",
        "Le père propose à ses fils un défi : briser un paquet de flèches liées.",
      ],
    },
    {
      chunk:
        "Je vous expliquerai le nœud qui les assemble.\nL’aîné les ayant pris, et fait tous ses efforts,\nLes rendit, en disant : Je le donne aux plus forts.\nUn second lui succède, et se met en posture,",
      rewordings: [
        "Le fils aîné prend les flèches, fait tous ses efforts, puis abandonne en disant de laisser ça aux plus forts. Le deuxième fils essaie à son tour.",
        "Le grand frère n'arrive pas à casser le paquet, puis le second frère tente sa chance.",
      ],
    },
    {
      chunk:
        "Un second lui succède, et se met en posture,\nMais en vain. Un cadet tente aussi l’aventure.\nTous perdirent leur temps ; le faisceau résista :\nDe ces dards joints ensemble un seul ne s’éclata.",
      rewordings: [
        "Le deuxième fils échoue, puis le plus jeune essaie aussi. Tous perdent leur temps : le paquet résiste et aucune flèche ne se casse.",
        "Aucun des frères ne réussit à briser les flèches attachées ensemble.",
      ],
    },
    {
      chunk:
        "De ces dards joints ensemble un seul ne s’éclata.\nFaibles gens, dit le père, il faut que je vous montre\nCe que ma force peut en semblable rencontre.\nOn crut qu’il se moquait ; on sourit, mais à tort :",
      rewordings: [
        "Pas une flèche ne se casse. Le père dit à ses fils, qu'il trouve faibles, qu'il va leur montrer ce qu'il peut faire. Les fils croient qu'il plaisante et sourient, mais ils ont tort.",
        "Le vieux père annonce qu'il va réussir là où ses fils ont échoué, et ils ne le croient pas.",
      ],
    },
    {
      chunk:
        "On crut qu’il se moquait ; on sourit, mais à tort :\nIl sépare les dards, et les rompt sans effort.\nVous voyez, reprit-il, l’effet de la concorde :\nSoyez joints, mes enfants, que l’amour vous accorde.",
      rewordings: [
        "Le père sépare les flèches et les casse une par une sans effort. Il explique que c'est la force de l'entente et demande à ses enfants de rester unis par l'amour.",
        "Séparées, les flèches se cassent facilement : le père en tire la leçon que ses fils doivent rester ensemble.",
      ],
    },
    {
      chunk:
        "Soyez joints, mes enfants, que l’amour vous accorde.\nTant que dura son mal, il n’eut autre discours.\nEnfin se sentant près de terminer ses jours,\nMes chers enfants, dit-il, je vais où sont nos pères ;",
      rewordings: [
        "Le père demande à ses fils de rester unis et ne parle que de cela pendant sa maladie. Sentant la mort venir, il leur dit qu'il va rejoindre ses ancêtres.",
        "Jusqu'à sa mort, le père répète à ses enfants de rester solidaires.",
      ],
    },
    {
      chunk:
        "Mes chers enfants, dit-il, je vais où sont nos pères ;\nAdieu : promettez-moi de vivre comme frères ;\nQue j’obtienne de vous cette grâce en mourant.\nChacun de ses trois fils l’en assure en pleurant.",
      rewordings: [
        "Le père mourant fait ses adieux et demande à ses fils de promettre de vivre comme des frères. Ses trois fils le lui promettent en pleurant.",
        "Avant de mourir, le père fait promettre à ses enfants de rester unis, et ils acceptent en larmes.",
      ],
    },
    {
      chunk:
        "Chacun de ses trois fils l’en assure en pleurant.\nIl prend à tous les mains ; il meurt. Et les trois frères\nTrouvent un bien fort grand, mais fort mêlé d’affaires.\nUn créancier saisit, un voisin fait procès :",
      rewordings: [
        "Le père meurt en tenant les mains de ses trois fils. Les frères héritent d'une grande fortune, mais pleine de problèmes : un créancier saisit des biens, un voisin leur fait un procès.",
        "Après la mort du père, les frères reçoivent un gros héritage compliqué, avec des dettes et des procès.",
      ],
    },
    {
      chunk:
        "Un créancier saisit, un voisin fait procès :\nD’abord notre trio s’en tire avec succès.\nLeur amitié fut courte autant qu’elle était rare\nLe sang les avait joints ; l’intérêt les sépare :",
      rewordings: [
        "Au début, les trois frères se débrouillent bien face aux créanciers et aux voisins. Mais leur amitié dure peu : ils étaient unis par le sang, l'intérêt les sépare.",
        "Les frères s'en sortent d'abord ensemble, puis l'argent finit par les diviser.",
      ],
    },
    {
      chunk:
        "Le sang les avait joints ; l’intérêt les sépare :\nL’ambition, l’envie, avec les consultants,\nDans la succession entrent en même temps.\nOn en vient au partage, on conteste, on chicane :",
      rewordings: [
        "L'intérêt sépare les frères : l'ambition, la jalousie et les conseillers se mêlent de l'héritage. Au moment du partage, ils se disputent et chicanent.",
        "La jalousie et l'avidité entrent dans la famille, et les frères se disputent le partage.",
      ],
    },
    {
      chunk:
        "On en vient au partage, on conteste, on chicane :\nLe juge sur cent points tour à tour les condamne ;\nCréanciers et voisins reviennent aussitôt,\nCeux-là sur une erreur, ceux-ci sur un défaut.",
      rewordings: [
        "Les frères se disputent le partage. Le juge leur donne tort sur beaucoup de points, et les créanciers et les voisins reviennent les attaquer.",
        "Pendant que les frères se querellent, ils perdent leurs procès et leurs ennemis en profitent.",
      ],
    },
    {
      chunk:
        "Ceux-là sur une erreur, ceux-ci sur un défaut.\nLes frères désunis sont tous d’avis contraire :\nL’un veut s’accommoder, l’autre n’en veut rien faire.\nTous perdirent leur bien, et voulurent trop tard",
      rewordings: [
        "Les créanciers et les voisins profitent des erreurs des frères. Les frères divisés ne sont jamais d'accord : l'un veut négocier, l'autre refuse. Ils perdent tous leurs biens.",
        "Désunis, les frères ne s'entendent sur rien et finissent ruinés.",
      ],
    },
    {
      chunk:
        "Tous perdirent leur bien, et voulurent trop tard\nProfiter de ces dards unis et pris à part.",
      rewordings: [
        "Les frères ont tout perdu et regrettent trop tard de ne pas avoir suivi la leçon des flèches unies et séparées.",
        "La morale arrive trop tard : divisés, ils sont devenus faibles, alors qu'unis ils auraient été forts.",
      ],
    },
  ],
  "esope/L’Homme et le Satyre": [
    {
      chunk:
        "Jadis un homme avait fait, dit-on, un pacte d’amitié avec un satyre. L’hiver étant venu et avec lui le froid, l’homme portait ses mains à sa bouche et soufflait dessus. Le satyre lui demanda pourquoi il en usait ainsi.",
      rewordings: [
        "Un homme devient ami avec un satyre. En hiver, il a froid, alors il met ses mains devant sa bouche et souffle dessus. Le satyre lui demande pourquoi.",
        "Un humain et une créature mi-homme mi-bouc sont amis ; l'humain souffle sur ses doigts gelés, et son ami s'en étonne.",
      ],
    },
    {
      chunk:
        "Le satyre lui demanda pourquoi il en usait ainsi. Il répondit qu’il se chauffait les mains à cause du froid. Après, on leur servit à manger.",
      rewordings: [
        "L'homme explique au satyre qu'il réchauffe ses mains à cause du froid. Ensuite, on leur sert à manger.",
        "L'humain répond qu'il souffle pour se réchauffer, puis ils passent à table.",
      ],
    },
    {
      chunk:
        "Après, on leur servit à manger. Comme le mets était très chaud, l’homme le prenant par petits morceaux, les approchait de sa bouche et soufflait dessus. Le satyre lui demanda de nouveau pourquoi il agissait ainsi.",
      rewordings: [
        "On leur sert à manger. Le plat est très chaud, alors l'homme souffle sur chaque petit morceau avant de le manger. Le satyre lui demande encore pourquoi.",
        "Pendant le repas, l'humain souffle sur sa nourriture brûlante, et son ami l'interroge de nouveau.",
      ],
    },
    {
      chunk:
        "Le satyre lui demanda de nouveau pourquoi il agissait ainsi. Il répondit qu’il refroidissait son manger, parce qu’il était trop chaud. « Eh bien ! camarade, dit le satyre, je renonce à ton amitié, parce que tu souffles de la même bouche le chaud et le froid. »",
      rewordings: [
        "L'homme répond qu'il refroidit sa nourriture trop chaude. Le satyre lui dit alors qu'il ne veut plus être son ami, car il souffle le chaud et le froid avec la même bouche.",
        "La créature rompt l'amitié : elle ne fait pas confiance à quelqu'un dont la bouche fait une chose et son contraire.",
      ],
    },
    {
      chunk:
        "Concluons que nous aussi nous devons fuir l’amitié de ceux dont le caractère est ambigu.",
      rewordings: [
        "La morale : nous devons fuir l'amitié des gens qui ont un caractère double.",
        "La leçon : il faut se méfier des personnes hypocrites qui disent une chose puis l'inverse.",
      ],
    },
  ],
  "lafontaine/Le Satyre et le Passant": [
    {
      chunk:
        "Au fond d’un antre sauvage\nUn satyre et ses enfants\nAllaient manger leur potage,\nEt prendre l’écuelle aux dents.",
      rewordings: [
        "Au fond d'une grotte sauvage, un satyre et ses enfants vont manger leur soupe directement dans le bol.",
        "Une créature des bois et sa famille s'installent dans leur caverne pour le repas.",
      ],
    },
    {
      chunk:
        "Et prendre l’écuelle aux dents.\nOn les eût vus sur la mousse,\nLui, sa femme, et maint petit :\nIls n’avaient tapis ni housse,",
      rewordings: [
        "Le satyre, sa femme et ses nombreux petits mangent sur la mousse ; ils n'ont ni tapis ni nappe.",
        "La famille de la créature vit simplement et mange par terre, sans aucun confort.",
      ],
    },
    {
      chunk:
        "Ils n’avaient tapis ni housse,\nMais tous fort bon appétit.\nPour se sauver de la pluie\nEntre un passant morfondu.",
      rewordings: [
        "La famille du satyre n'a pas de confort mais beaucoup d'appétit. Un passant gelé entre dans la grotte pour s'abriter de la pluie.",
        "Pendant le repas, un voyageur mouillé et frigorifié vient se réfugier chez eux.",
      ],
    },
    {
      chunk:
        "Entre un passant morfondu.\nAu brouet on le convie :\nIl n’était pas attendu.\nSon hôte n’eut pas la peine",
      rewordings: [
        "On invite le passant à partager la soupe, même s'il n'était pas attendu. Le satyre n'a pas besoin d'insister.",
        "La famille accueille l'inconnu et lui propose de manger avec elle, ce qu'il accepte tout de suite.",
      ],
    },
    {
      chunk:
        "Son hôte n’eut pas la peine\nDe le semondre deux fois.\nD’abord avec son haleine\nIl se réchauffe les doigts :",
      rewordings: [
        "Le passant accepte vite l'invitation. D'abord, il souffle sur ses doigts pour les réchauffer.",
        "Le voyageur commence par souffler sur ses mains gelées.",
      ],
    },
    {
      chunk:
        "Il se réchauffe les doigts :\nPuis sur le mets qu’on lui donne,\nDélicat, il souffle aussi.\nLe satyre s’en étonne :",
      rewordings: [
        "Puis le passant souffle aussi sur la soupe qu'on lui sert. Le satyre est étonné.",
        "Ensuite l'invité souffle sur son plat, ce qui surprend son hôte.",
      ],
    },
    {
      chunk:
        "Le satyre s’en étonne :\n— Notre hôte, à quoi bon ceci ?\n— L’un refroidit mon potage :\nL’autre réchauffe ma main.",
      rewordings: [
        "Le satyre demande au passant à quoi cela sert. Le passant répond qu'un souffle refroidit sa soupe et l'autre réchauffe ses mains.",
        "L'hôte veut comprendre, et l'invité explique qu'il souffle pour refroidir la nourriture et pour réchauffer ses doigts.",
      ],
    },
    {
      chunk:
        "L’autre réchauffe ma main.\n— Vous pouvez, dit le sauvage,\nReprendre votre chemin.\nNe plaise aux dieux que je couche",
      rewordings: [
        "Le satyre dit au passant qu'il peut reprendre sa route : il ne veut surtout pas dormir sous le même toit que lui.",
        "La créature chasse le voyageur et refuse de l'héberger.",
      ],
    },
    {
      chunk:
        "Ne plaise aux dieux que je couche\nAvec vous sous même toit !\nArrière ceux dont la bouche\nSouffle le chaud et le froid !",
      rewordings: [
        "Le satyre refuse de dormir sous le même toit que le passant et chasse ceux dont la bouche souffle le chaud et le froid.",
        "La morale : il faut éloigner de soi les gens qui disent une chose et son contraire.",
      ],
    },
  ],
  "esope/Le Bouvier et Héraclès": [
    {
      chunk:
        "Un bouvier menait un chariot vers un village. Le chariot étant tombé dans un ravin profond, au lieu d’aider à l’en sortir, le bouvier restait là sans rien faire, invoquant parmi tous les dieux le seul Héraclès, qu’il honorait particulièrement. Héraclès lui apparut et lui dit : « Mets la main aux roues, aiguillonne tes bœufs et n’invoque les dieux qu’en faisant toi-même un effort ; autrement tu les invoqueras en vain. »",
      rewordings: [
        "Le chariot d'un bouvier tombe dans un ravin. Le bouvier ne fait rien et prie seulement Héraclès. Le dieu apparaît et lui dit de pousser les roues et de piquer ses bœufs, car prier les dieux sans faire d'effort ne sert à rien.",
        "Un paysan coincé avec sa charrette attend qu'un dieu le sauve ; le dieu lui répond qu'il doit d'abord se débrouiller lui-même, et qu'alors seulement on l'aidera.",
      ],
    },
  ],
  "lafontaine/Le Charretier embourbé": [
    {
      chunk:
        "Le Phaéton d’une voiture à foin\nVit son char embourbé. Le pauvre homme était loin\nDe tout humain secours : c’était à la campagne,\nPrès d’un certain canton de la basse Bretagne,",
      rewordings: [
        "Le conducteur d'une charrette de foin voit son véhicule coincé dans la boue. Le pauvre homme est loin de toute aide, en pleine campagne, en basse Bretagne.",
        "Un homme avec sa charrette s'embourbe au milieu de nulle part, sans personne pour l'aider.",
      ],
    },
    {
      chunk:
        "Près d’un certain canton de la basse Bretagne,\nAppelé Quimper-Corentin.\nOn sait assez que le Destin\nAdresse là les gens quand il veut qu’on enrage.",
      rewordings: [
        "L'endroit s'appelle Quimper-Corentin. Le poète dit que le destin envoie les gens là quand il veut les mettre en colère.",
        "Le poète se moque d'un coin perdu de Bretagne où tout va de travers.",
      ],
    },
    {
      chunk:
        "Adresse là les gens quand il veut qu’on enrage.\nDieu nous préserve du voyage !\nPour venir au chartier embourbé dans ces lieux,\nLe voilà qui déteste et jure de son mieux,",
      rewordings: [
        "Le poète souhaite que Dieu nous évite ce voyage. Il revient au charretier embourbé, qui peste et jure de toutes ses forces.",
        "Retour à l'homme coincé dans la boue, qui s'énerve et dit des gros mots.",
      ],
    },
    {
      chunk:
        "Le voilà qui déteste et jure de son mieux,\nPestant, en sa fureur extrême,\nTantôt contre les trous, puis contre ses chevaux,\nContre son char, contre lui-même.",
      rewordings: [
        "Le charretier, furieux, jure contre les trous, contre ses chevaux, contre sa charrette et contre lui-même.",
        "L'homme en colère accuse tout le monde : la route, ses animaux, son véhicule et lui-même.",
      ],
    },
    {
      chunk:
        "Contre son char, contre lui-même.\nIl invoque à la fin le dieu dont les travaux\nSont si célèbres dans le monde :\nHercule, lui dit-il, aide-moi ; si ton dos",
      rewordings: [
        "Après avoir pesté contre tout, le charretier finit par prier Hercule, le dieu célèbre pour ses travaux, de l'aider.",
        "À la fin, l'homme demande à un héros divin très fort de venir le sortir de là.",
      ],
    },
    {
      chunk:
        "Hercule, lui dit-il, aide-moi ; si ton dos\nA porté la machine ronde,\nTon bras peut me tirer d’ici.\nSa prière étant faite, il entend dans la nue",
      rewordings: [
        "Le charretier dit à Hercule que, puisqu'il a porté le monde sur son dos, il peut bien le tirer de là. Après sa prière, il entend une voix dans les nuages.",
        "L'homme supplie le héros de le sauver grâce à sa force, et une voix venue du ciel lui répond.",
      ],
    },
    {
      chunk:
        "Sa prière étant faite, il entend dans la nue\nUne voix qui lui parle ainsi :\nHercule veut qu’on se remue ;\nPuis il aide les gens. Regarde d’où provient",
      rewordings: [
        "La voix dit qu'Hercule veut qu'on se bouge d'abord, et qu'ensuite il aide les gens. Elle lui dit de regarder ce qui le bloque.",
        "La voix divine explique qu'il faut d'abord agir soi-même avant d'être aidé, et l'invite à chercher l'obstacle.",
      ],
    },
    {
      chunk:
        "Puis il aide les gens. Regarde d’où provient\nL’achoppement qui te retient ;\nÔte d’autour de chaque roue\nCe malheureux mortier, cette maudite boue",
      rewordings: [
        "La voix dit au charretier de chercher ce qui le bloque et d'enlever la boue autour de chaque roue.",
        "On lui demande de trouver le problème et de nettoyer ses roues pleines de boue.",
      ],
    },
    {
      chunk:
        "Ce malheureux mortier, cette maudite boue\nQui jusqu’à l’essieu les enduit ;\nPrends ton pic, et me romps ce caillou qui te nuit ;\nComble-moi cette ornière. As-tu fait ? Oui, dit l’homme.",
      rewordings: [
        "La voix lui dit d'enlever la boue collée jusqu'à l'essieu, de casser avec sa pioche la pierre qui gêne et de boucher le trou. L'homme répond qu'il l'a fait.",
        "L'homme suit les conseils : il dégage les roues, casse le caillou et remplit l'ornière.",
      ],
    },
    {
      chunk:
        "Comble-moi cette ornière. As-tu fait ? Oui, dit l’homme.\nOr bien je vas t’aider, dit la voix ; prends ton fouet.\nJe l’ai pris… Qu’est-ce ci ? mon char marche à souhait !\nHercule en soit loué ! Lors la voix : Tu vois comme",
      rewordings: [
        "La voix lui dit de prendre son fouet pour qu'elle l'aide. L'homme le prend, et sa charrette avance parfaitement. Il remercie Hercule.",
        "Après avoir travaillé lui-même, l'homme fait avancer ses chevaux et le véhicule repart sans problème.",
      ],
    },
    {
      chunk:
        "Hercule en soit loué ! Lors la voix : Tu vois comme\nTes chevaux aisément se sont tirés de là.\nAide-toi, le ciel t’aidera.",
      rewordings: [
        "La voix lui fait remarquer que ses chevaux se sont sortis de là facilement. Aide-toi, et le ciel t'aidera.",
        "La morale : c'est en faisant des efforts soi-même qu'on obtient de l'aide.",
      ],
    },
  ],
  "phedre/La Grenouille et le Bœuf": [
    {
      chunk:
        "Une Grenouille vit un Bœuf dans une prairie. Jalouse d’une taille si belle, elle gonfle sa peau ridée ; puis demande à ses petits si elle n’est pas plus grosse que le Bœuf. Ils lui disent que non.",
      rewordings: [
        "Une grenouille voit un bœuf dans un pré et devient jalouse de sa grande taille. Elle gonfle sa peau et demande à ses petits si elle est maintenant plus grosse que le bœuf. Ils répondent que non.",
        "Un petit animal envieux d'un grand animal se gonfle pour devenir aussi gros que lui, puis demande à ses enfants s'il a réussi. Ils lui disent que non.",
      ],
    },
    {
      chunk:
        "Ils lui disent que non. De nouveau elle s’enfle, fait plus d’efforts, et demande encore qui est le plus gros. Ils répondent : « C’est le Bœuf. »",
      rewordings: [
        "Comme ses petits disent non, la grenouille se gonfle encore plus fort et redemande qui est le plus gros. Ils répondent que c'est toujours le bœuf.",
        "L'animal jaloux fait encore plus d'efforts pour grossir, mais on lui répond que le grand animal reste le plus gros.",
      ],
    },
    {
      chunk:
        "Ils répondent : « C’est le Bœuf. » Enfin, de dépit, elle veut se gonfler encore, mais son corps crève, et elle périt.",
      rewordings: [
        "Ses petits lui répondent que le bœuf est toujours le plus gros. Vexée, la grenouille se gonfle une dernière fois, son corps éclate et elle meurt.",
        "Furieux de ne pas y arriver, le petit animal envieux se gonfle encore, explose et en meurt.",
      ],
    },
    {
      chunk: "Le petit se perd à vouloir imiter les grands.",
      rewordings: [
        "La morale : un petit qui veut imiter les grands finit par se détruire.",
        "La leçon : à vouloir copier ceux qui sont plus puissants que soi, on court à sa perte.",
      ],
    },
  ],
  "lafontaine/La Grenouille qui veut se faire aussi grosse que le Bœuf": [
    {
      chunk:
        "Une grenouille vit un bœuf\nQui lui sembla de belle taille.\nElle, qui n’était pas grosse en tout comme un œuf,\nEnvieuse, s’étend, et s’enfle, et se travaille",
      rewordings: [
        "Une grenouille voit un bœuf et le trouve très grand. Elle, qui n'est même pas aussi grosse qu'un œuf, devient jalouse et commence à s'étirer et à se gonfler.",
        "Un tout petit animal envieux admire la taille d'un grand animal et se met à se gonfler pour lui ressembler.",
      ],
    },
    {
      chunk:
        "Envieuse, s’étend, et s’enfle, et se travaille\nPour égaler l’animal en grosseur ;\nDisant : Regardez bien, ma sœur ;\nEst-ce assez ? dites-moi ; n’y suis-je point encore ? —",
      rewordings: [
        "Jalouse, la grenouille se gonfle de toutes ses forces pour devenir aussi grosse que le bœuf. Elle demande à sa sœur de bien regarder et de lui dire si elle est enfin assez grosse.",
        "Le petit animal se gonfle pour égaler le grand et demande à quelqu'un de lui dire s'il a atteint la même taille.",
      ],
    },
    {
      chunk:
        "Est-ce assez ? dites-moi ; n’y suis-je point encore ? —\nNenni. — M’y voici donc ? — Point du tout. — M’y voilà ? —\nVous n’en approchez point. La chétive pécore\nS’enfla si bien qu’elle creva.",
      rewordings: [
        "La grenouille demande plusieurs fois si elle est assez grosse, et sa sœur répond toujours non, qu'elle en est loin. La pauvre grenouille se gonfle tellement qu'elle éclate.",
        "On répète au petit animal qu'il n'est toujours pas assez gros, alors il continue à se gonfler jusqu'à exploser et mourir.",
      ],
    },
    {
      chunk:
        "S’enfla si bien qu’elle creva.\nLe monde est plein de gens qui ne sont pas plus sages :\nTout bourgeois veut bâtir comme les grands seigneurs,\nTout petit prince a des ambassadeurs,",
      rewordings: [
        "La grenouille se gonfle tant qu'elle éclate. La morale : beaucoup de gens sont aussi bêtes qu'elle, comme le bourgeois qui veut une maison de grand seigneur ou le petit prince qui veut des ambassadeurs.",
        "Le monde est plein de gens qui veulent imiter les riches et les puissants, au-dessus de leurs moyens, et qui finissent mal comme la grenouille.",
      ],
    },
    {
      chunk: "Tout petit prince a des ambassadeurs,\nTout marquis veut avoir des pages.",
      rewordings: [
        "Chaque petit prince veut avoir des ambassadeurs, et chaque marquis veut avoir des serviteurs, comme les plus grands.",
        "Les gens peu importants veulent toujours se donner l'air d'être aussi importants que les puissants.",
      ],
    },
  ],
};
