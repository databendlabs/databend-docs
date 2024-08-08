// Copyright 2024 DatabendLabs.
import { FC, ReactElement } from "react";
import SpeakerSvg from "@site/static/icons/speaker.svg";
import styles from "./style.module.scss";

const Speaker: FC = (): ReactElement => {
  return (
    <span
      className={styles.out}
      onClick={() => {
        var utterance = new SpeechSynthesisUtterance("Databend");
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
      }}
    >
      <SpeakerSvg></SpeakerSvg>
    </span>
  );
};
export default Speaker;
