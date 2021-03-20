import "./app.css";
import React, { useEffect, useReducer, useRef } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";
import AgoraRTC, { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { APP_ID, RtcTokenBuilder } from "./tokens";
import { PromisePipeline } from "./promisePipeline";

const MAX_CHANNEL = 10;
const userId = String(Date.now());

const pipeline = new PromisePipeline();
const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

client.on("user-published", async (user, mediatype) => {
  if (mediatype !== "audio") {
    return;
  }

  await client.subscribe(user, mediatype);
  const audioTrack = user.audioTrack;
  audioTrack?.play();
});

function App() {
  const localTrackRef = useRef<IMicrophoneAudioTrack>();

  const [channel, dispatch] = useReducer(
    (state: number, action: "INCR" | "DECR") => {
      switch (action) {
        case "INCR":
          return state === MAX_CHANNEL ? 0 : state + 1;
        case "DECR":
          return state === 0 ? MAX_CHANNEL : state - 1;
        default:
          return 0;
      }
    },
    0
  );

  useEffect(() => {
    ipcRenderer.on("trayMouseDown", () => {
      walkie();
    });

    ipcRenderer.on("trayMouseUp", () => {
      talkie();
    });
  }, []);

  useEffect(() => {
    const channelName = `channel:${channel}`;
    const cancel = pipeline.start(async () => {
      await client.setClientRole("host");
      await client.join(
        APP_ID,
        channelName,
        RtcTokenBuilder.buildToken(channelName, userId),
        userId
      );
      localTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current.setVolume(0);

      await client.publish(localTrackRef.current);
    });

    return () => {
      cancel(async () => {
        await client.leave();
      });
    };
  }, [channel]);

  function walkie() {
    localTrackRef.current?.setVolume(100);
  }

  function talkie() {
    localTrackRef.current?.setVolume(0);
  }

  return (
    <div className="bg-yellow-300 h-screen">
      <div className="flex flex-col h-full p-6">
        <div className="flex-1 flex justify-center items-center bg-gray-600 rounded-lg">
          <div className="text-4xl font-mono text-gray-200 px-6">{channel}</div>
        </div>

        <div className="flex justify-between items-center mt-6 space-x-4">
          <button
            onClick={() => dispatch("INCR")}
            className="focus:outline-none transform transition hover:scale-125"
          >
            <svg
              className="h-8 w-8 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onMouseDown={walkie}
            onMouseUp={talkie}
            className="flex-1 text-center block items-center py-3 font-bold rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-110"
          >
            TALK
          </button>
          <button
            onClick={() => dispatch("DECR")}
            className="focus:outline-none transform transition hover:scale-125"
          >
            <svg
              className="h-8 w-8 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app")!);
