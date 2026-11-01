import { ViewButton } from "@tolokoban/ui";

import { GuessTable } from "./_/GuessTable";
import { Header } from "./_/Header";
import { getVisibleSteps, useGame } from "./_/hooks";
import { NetworkSvg } from "./_/NetworkSvg";
import { Md } from "@/components/Md";

import Styles from "./page.module.css";

export default function Page() {
  const {
    tr,
    array,
    steps,
    trainings,
    refMain,
    rounds,
    handleItemClick,
    handleAddRounds,
    handleRestart,
    getVerdict,
  } = useGame();
  return (
    <div className={Styles.page}>
      <Header
        array={array}
        trainings={trainings}
        onItemClick={handleItemClick}
        onRestart={handleRestart}
      />
      <main ref={refMain}>
        <Md className={Styles.explanation} value={tr.explanation} />
        <p>{tr.intro}</p>
        {getVisibleSteps(steps).map((step, index) => (
          <section key={index}>
            <NetworkSvg weights={step.weights} previous={step.previous} run={step.run} />
            {step.run && <p className={Styles.verdict}>{getVerdict(step.run)}</p>}
            {step.rounds > 0 && <p className={Styles.verdict}>{tr.rounds$(`${step.rounds}`)}</p>}
            {step.guesses && <GuessTable array={array} guesses={step.guesses} />}
          </section>
        ))}
        <ViewButton className={Styles.addRounds} color="secondary-5" onClick={handleAddRounds}>
          {tr.addRounds$(`${rounds}`)}
        </ViewButton>
      </main>
    </div>
  );
}
