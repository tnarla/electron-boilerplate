import "./app.css";
import { ipcRenderer } from "electron";
import React from "react";
import ReactDOM from "react-dom";
import AgoraRTC, { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { APP_ID, RtcTokenBuilder } from "./tokens";

const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

client.on("user-published", async (user, mediaType) => {
  // We don't support video:
  if (mediaType !== "audio") {
    return;
  }

  await client.subscribe(user, mediaType);
  const audioTrack = user.audioTrack;
  audioTrack?.play();
  console.log("\n\n\n\n\n\n\n PLAYING \n\n\n\n\n\n", audioTrack);
});

let localTrack: IMicrophoneAudioTrack;

async function test() {
  const userID = String(Date.now());
  await client.setClientRole("host");
  console.log("JOINING WITH NEW TOKEN");
  await client.join(
    APP_ID,
    "CHANNEL",
    RtcTokenBuilder.buildToken("CHANNEL", userID),
    userID
  );

  localTrack = await AgoraRTC.createMicrophoneAudioTrack();
  localTrack.setVolume(0);

  await client.publish(localTrack);
}

test();

ipcRenderer.on("trayMouseDown", () => {
  // localTrack?.setEnabled(true);
  localTrack.setVolume(100);
});

ipcRenderer.on("trayMouseUp", () => {
  localTrack.setVolume(0);
  // localTrack?.setEnabled(false);
});

function App() {
  return <div>Hello world!</div>;
}

ReactDOM.render(<App />, document.getElementById("app")!);
