import { ViewButton, ViewFloatingButton, ViewSwitch } from "@tolokoban/ui";

import { Guess } from "./_/Guess";
import { Header } from "./_/Header";
import { usePerceptron } from "./_/hooks";
import { IconEraser } from "./_/IconEraser";
import { Retina } from "./_/Retina";
import { Score } from "./_/Score";

import Styles from "./page.module.css";

export default function Page() {
  const {
    tr,
    steps,
    pretrained,
    answers,
    successes,
    attempt,
    webcam,
    setWebcam,
    refRetina,
    handleFrame,
    handleErase,
    handleRecognize,
    handleAnswer,
    handleRestart,
    handleUsePretrained,
  } = usePerceptron();
  return (
    <div className={Styles.page}>
      <Header steps={steps} onRestart={handleRestart} />
      <main>
        <div>
          <Retina ref={refRetina} live={webcam} onFrame={handleFrame} />
          <footer>
            <ViewSwitch value={webcam} onChange={setWebcam}>
              {tr.webcam}
            </ViewSwitch>
            {!webcam && <ViewFloatingButton icon={IconEraser} onClick={handleErase} />}
            <ViewButton color="primary-5" onClick={handleRecognize}>
              {tr.recognize}
            </ViewButton>
          </footer>
        </div>
        <section>
          <p>{tr.intro}</p>
          <Score answers={answers} successes={successes} />
          {attempt ? (
            <Guess guess={attempt.guess} onAnswer={handleAnswer} />
          ) : (
            <p>{webcam ? tr.hint : tr.hintDraw}</p>
          )}
          {!pretrained && (
            <footer>
              <ViewButton color="secondary-5" onClick={handleUsePretrained}>
                {tr.pretrained}
              </ViewButton>
            </footer>
          )}
        </section>
      </main>
    </div>
  );
}
