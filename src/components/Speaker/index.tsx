// Copyright 2024 DatabendLabs.
import { FC, ReactElement, useRef } from "react";
import SpeakerSvg from "@site/static/icons/speaker.svg";
import styles from "./style.module.scss";
import AudioDatabend from "@site/static/public/databend.mp3";
import { useMount } from "ahooks";

const Speaker: FC = (): ReactElement => {
  const ref = useRef<HTMLAudioElement>(undefined);
  useMount(() => {
    ref.current.pause();
  });
  return (
    <span
      className={styles.out}
      onClick={() => {
        // var utterance = new SpeechSynthesisUtterance("Databend");
        // utterance.lang = "en-US";
        // speechSynthesis.speak(utterance);
        ref.current.play();
      }}
    >
      <SpeakerSvg />
      <audio
        loop={false}
        style={{ display: "none" }}
        ref={ref}
        src={AudioDatabend}
      />
    </span>
  );
};
export default Speaker;
