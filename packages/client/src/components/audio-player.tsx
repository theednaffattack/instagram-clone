import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FastForward30 } from "./fast-forward-thirty";
// import Layout from "./layout.unauthorized";
import { Rewind30 } from "./rewind-thirty";
import {
  audioPlayer,
  controlAndIndicatorsWrap,
  forwardBackward,
  main,
  play,
  playControls,
  playPause,
  progressBar,
  timeFormatting,
} from "../styles/audio-player";

type AudioStates = "isPaused" | "isPlaying" | "isStopped";

export function AudioPlayer(): JSX.Element {
  // references
  // ref for audio element
  const animationRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  // state
  const [audioState, setAudioState] = useState<AudioStates>("isPaused");
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // effects
  useEffect(() => {
    const seconds = Math.floor(audioRef?.current?.duration);
    progressBarRef.current.max = `${seconds}`;
    setDuration(seconds);
  }, [audioRef?.current?.readyState, audioRef?.current?.onloadedmetadata]);

  // functions

  function calculateMinsFromSecs(secs: number): string {
    const prelimMinutes = Math.floor(secs / 60);
    const prelimSeconds = Math.floor(secs % 60);
    const minutes =
      prelimMinutes < 10 ? `0${prelimMinutes}` : `${prelimMinutes}`;
    const seconds =
      prelimSeconds < 10 ? `0${prelimSeconds}` : `${prelimSeconds}`;

    return `${minutes}:${seconds}`;
  }

  const changePlayerCurrentTime = () => {
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${(Number(progressBarRef.current.value) / duration) * 100}%`
    );

    setCurrentTime(Number(progressBarRef.current.value));
  };

  const changeRange = () => {
    // set the current time of the audiofile to the pogress bar value.
    audioRef.current.currentTime = Number(progressBarRef.current.value);
    changePlayerCurrentTime();
  };

  const whilePlaying = () => {
    progressBarRef.current.value = audioRef.current.currentTime.toString();
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  function togglePlayPause(): void {
    setAudioState((prevState) => {
      if (prevState !== "isPlaying") {
        audioRef.current.play();
        console.log("CHECK DURATION", {
          audioRef: audioRef.current,
          duration: audioRef.current.duration,
        });

        animationRef.current = requestAnimationFrame(whilePlaying);
        return "isPlaying";
      } else {
        audioRef.current.pause();
        cancelAnimationFrame(animationRef.current);

        return "isPaused";
      }
    });
  }

  // rewind 30 seconds
  function backThirty(): void {
    if (Number(progressBarRef.current.value) < 30) {
      // If less than 30 seconds have elapsed,
      // reset to zero.
      progressBarRef.current.value = "0";

      changeRange();
    } else {
      // mutate progress bar value
      progressBarRef.current.value = `${
        Number(progressBarRef.current.value) - 30
      }`;

      // adjust all the values connected to time
      // (the audio element, time elapsed, slider thumb)
      changeRange();
    }
  }

  // advance 30 seconds
  function forwardThirty(): void {
    // mutate progress bar value
    progressBarRef.current.value = `${
      Number(progressBarRef.current.value) + 30
    }`;

    // adjust all the values connected to time
    // (the audio element, time elapsed, slider thumb)
    changeRange();
  }

  return (
    <>
      <main className={main} id="main">
        <section id="player-section" className={audioPlayer}>
          <audio
            onLoadedMetadata={() => {
              // adapted hack from: https://www.thecodehubs.com/infinity-audio-video-duration-issue-fixed-using-javascript/
              // This may need to move to useEffect
              if (audioRef.current.duration == Infinity) {
                audioRef.current.currentTime = 1e101;
                audioRef.current.ontimeupdate = function () {
                  this.ontimeupdate = () => {
                    return;
                  };
                  audioRef.current.currentTime = 0;
                  return;
                };
              }
            }}
            onDurationChange={(event) => {
              event.preventDefault();
              setDuration(audioRef.current.duration);
            }}
            ref={audioRef}
          >
            <source
              src="https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
              type="audio/mp3"
            />
            Your browser does not support the audio element.
          </audio>
          <div className={controlAndIndicatorsWrap}>
            {/* control buttons */}
            <div className={playControls}>
              <button
                className={forwardBackward}
                onClick={(evt) => {
                  evt.preventDefault();
                  backThirty();
                }}
                tabIndex={0}
              >
                <Rewind30 />
              </button>
              <button
                className={forwardBackward}
                onClick={(evt) => {
                  evt.preventDefault();
                  forwardThirty();
                }}
              >
                <FastForward30 />
              </button>

              <button
                className={playPause}
                onClick={(evt) => {
                  evt.preventDefault();
                  togglePlayPause();
                }}
              >
                {audioState === "isPlaying" ? (
                  <>
                    <FaPause />
                  </>
                ) : (
                  <>
                    <FaPlay className={play} />
                  </>
                )}
              </button>
            </div>

            {/* time and progress bar */}
            <div className={playControls}>
              {/* current time */}
              <time
                className={timeFormatting}
                dateTime="PT30M0.0S"
                tabIndex={0}
              >
                {currentTime && !isNaN(currentTime)
                  ? calculateMinsFromSecs(currentTime)
                  : "00:00"}
              </time>
              {/* progress */}
              <input
                className={progressBar}
                defaultValue="0"
                onChange={changeRange}
                ref={progressBarRef}
                tabIndex={0}
                type="range"
              />
              {/* duration */}

              <time
                className={timeFormatting}
                dateTime="PT2H30M0.0S"
                tabIndex={0}
              >
                {/* if the duration exists and is properly a number, display it */}
                {duration && duration !== Infinity && !isNaN(duration)
                  ? calculateMinsFromSecs(duration)
                  : "00:00"}
              </time>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// AudioPlayer.layout = Layout;

export default AudioPlayer;
