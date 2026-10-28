import React from "react";

export type Quiz = {
  id: string;
  title: string | { [lang: string]: string };
  items: { [id: string]: QuizItem };
};

export type QuizItem = QuizItemQCM;

export interface QuizItemQCM {
  kind: "qcm";
  question: React.ReactNode | { [lang: string]: string };
  choices: { [id: string]: React.ReactNode | { [lang: string]: string } };
  /**
   * The choices that are correct answers, with an explanation of why this is correct.
   */
  answers: { [id: string]: React.ReactNode | { [lang: string]: string } };
}
