import React from "react";

export type Quiz = {
  id: string;
  title: string;
  items: { [id: string]: QuizItem };
};

export type QuizItem = QuizItemQCM;

export interface QuizItemQCM {
  kind: "qcm";
  question: React.ReactNode;
  choices: { [id: string]: React.ReactNode };
  answers: { [id: string]: React.ReactNode };
}
