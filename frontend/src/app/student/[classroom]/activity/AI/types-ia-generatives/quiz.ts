import { Quiz } from "@/types";

export const QUIZ: Quiz = {
  id: "types-ia-generative",
  title: {
    fr: "Quiz : Associer chaque IA à son type de génération",
    en: "Quiz: Match each AI to its generation type",
  },
  items: {
    q1: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **ChatGPT** ?",
        en: "What is the main type of the AI **ChatGPT**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        texte: {
          fr: "ChatGPT est avant tout un modèle de langage (LLM) conversationnel. Autre IA du même type : **Claude**.",
          en: "ChatGPT is primarily a conversational large language model (LLM). Other AI of the same type: **Claude**.",
        },
      },
    },
    q10: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Cursor** ?",
        en: "What is the main type of the AI **Cursor**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        code: {
          fr: "Cursor est un éditeur de code alimenté par l'IA pour écrire et déboguer des scripts. Autre IA du même type : **GitHub Copilot**.",
          en: "Cursor is an AI-powered code editor designed for writing and debugging scripts. Other AI of the same type: **GitHub Copilot**.",
        },
      },
    },
    q3: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **GitHub Copilot** ?",
        en: "What is the main type of the AI **GitHub Copilot**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        code: {
          fr: "GitHub Copilot est conçu pour assister les développeurs dans l'écriture de code et de scripts. Autre IA du même type : **Cursor**.",
          en: "GitHub Copilot is designed to assist developers in writing code and scripts. Other AI of the same type: **Cursor**.",
        },
      },
    },
    q11: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **ElevenLabs** ?",
        en: "What is the main type of the AI **ElevenLabs**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        audio: {
          fr: "ElevenLabs est la référence pour la synthèse vocale ultra-réaliste et le clonage de voix. Autre IA du même type : **Suno**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=th_tXR2QQ6U",
          en: "ElevenLabs is the benchmark for ultra-realistic text-to-speech and voice cloning. Other AI of the same type: **Suno**.   \nDemo video: https://www.youtube.com/watch?v=th_tXR2QQ6U",
        },
      },
    },
    q13: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Spline AI** ?",
        en: "What is the main type of the AI **Spline AI**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        trois_d: {
          fr: "Spline AI permet de concevoir et générer des objets et scènes 3D interactifs par invite textuelle. Autre IA du même type : **Meshy**.",
          en: "Spline AI lets users design and generate interactive 3D objects and scenes via text prompts. Other AI of the same type: **Meshy**.",
        },
      },
    },
    q5: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Runway (Gen-3)** ?",
        en: "What is the main type of the AI **Runway (Gen-3)**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        video: {
          fr: "Runway est une plateforme de pointe dédiée à la génération et l'édition de vidéos par IA. Autre IA du même type : **HeyGen**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=nByslCkykj8",
          en: "Runway is a cutting-edge platform dedicated to AI video generation and editing. Other AI of the same type: **HeyGen**.   \nDemo video: https://www.youtube.com/watch?v=nByslCkykj8",
        },
      },
    },
    q8: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Claude** ?",
        en: "What is the main type of the AI **Claude**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        texte: {
          fr: "Claude est un LLM conversationnel développé par Anthropic, très performant en rédaction et analyse. Autre IA du même type : **ChatGPT**.",
          en: "Claude is a conversational LLM developed by Anthropic, highly capable in writing and analysis. Other AI of the same type: **ChatGPT**.",
        },
      },
    },
    q7: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Gamma** ?",
        en: "What is the main type of the AI **Gamma**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        donnees: {
          fr: "Gamma génère automatiquement des présentations, documents et sites web structurés. Autre IA du même type : **Copilot Pro / Microsoft 365 Copilot**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=rj8S60XAlnU",
          en: "Gamma automatically generates structured presentations, documents, and web pages. Other AI of the same type: **Copilot Pro / Microsoft 365 Copilot**.   \nDemo video: https://www.youtube.com/watch?v=rj8S60XAlnU",
        },
      },
    },
    q4: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Suno** ?",
        en: "What is the main type of the AI **Suno**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        audio: {
          fr: "Suno permet de générer des chansons complètes avec paroles et instruments à partir d'une description. Autre IA du même type : **ElevenLabs**.",
          en: "Suno generates complete songs with lyrics and instruments from a prompt. Other AI of the same type: **ElevenLabs**.",
        },
      },
    },
    q14: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Copilot Pro / Microsoft 365 Copilot** ?",
        en: "What is the main type of the AI **Copilot Pro / Microsoft 365 Copilot**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        donnees: {
          fr: "Il automatise la création de données structurées, feuilles de calcul Excel et rapports professionnels. Autre IA du même type : **Gamma**.",
          en: "It automates the creation of structured data, Excel spreadsheets, and professional reports. Other AI of the same type: **Gamma**.",
        },
      },
    },
    q12: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **HeyGen** ?",
        en: "What is the main type of the AI **HeyGen**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        video: {
          fr: "HeyGen permet de générer des vidéos de présentateurs virtuels réalistes à partir d'un texte. Autre IA du même type : **Runway (Gen-3)**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=KD26lFFw8HY",
          en: "HeyGen allows users to generate realistic virtual presenter videos from text. Other AI of the same type: **Runway (Gen-3)**.   \nDemo video: https://www.youtube.com/watch?v=KD26lFFw8HY",
        },
      },
    },
    q9: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Adobe Firefly** ?",
        en: "What is the main type of the AI **Adobe Firefly**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        image: {
          fr: "Adobe Firefly est intégré à la suite Adobe pour générer des images et effets visuels. Autre IA du même type : **Midjourney**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=_sJfNfMAQHw&list=PL7Fkn3UclHZOVPpnsBlfchDWnCQh0b61I",
          en: "Adobe Firefly is integrated into the Adobe suite to generate images and visual effects. Other AI of the same type: **Midjourney**.   \nDemo video: https://www.youtube.com/watch?v=_sJfNfMAQHw&list=PL7Fkn3UclHZOVPpnsBlfchDWnCQh0b61I",
        },
      },
    },
    q6: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Meshy** ?",
        en: "What is the main type of the AI **Meshy**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        trois_d: {
          fr: "Meshy permet de créer rapidement des modèles 3D texturés à partir de textes ou d'images. Autre IA du même type : **Spline AI**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=YwnwaCpRNGE",
          en: "Meshy allows users to quickly create textured 3D models from text or images. Other AI of the same type: **Spline AI**.   \nDemo video: https://www.youtube.com/watch?v=YwnwaCpRNGE",
        },
      },
    },
    q2: {
      kind: "qcm",
      question: {
        fr: "Quel est le type principal de l'IA **Midjourney** ?",
        en: "What is the main type of the AI **Midjourney**?",
      },
      choices: {
        texte: "Texte (LLM)",
        image: "Image",
        code: "Code & Script",
        audio: "Audio & Musique",
        video: "Vidéo",
        trois_d: "3D & Synthèse de Scène",
        donnees: "Données Structurées",
      },
      answers: {
        image: {
          fr: "Midjourney est un outil spécialisé dans la génération d'images artistiques et réalistes. Autre IA du même type : **Adobe Firefly**.   \nVidéo de démonstration : https://www.youtube.com/watch?v=E9PvSeIO5NY",
          en: "Midjourney is a tool specialized in generating artistic and realistic images. Other AI of the same type: **Adobe Firefly**.   \nDemo video: https://www.youtube.com/watch?v=E9PvSeIO5NY",
        },
      },
    },
  },
};
