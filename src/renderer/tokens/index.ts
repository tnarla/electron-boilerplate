const AccessToken = require("./AccessToken").AccessToken;
const Priviledges = require("./AccessToken").priviledges;

export const APP_ID = "cfd819dd580f400fa855471e4ed24a11";
const appCertificate = "812a3c42547f4a1289ec5383fe036386";

const expirationTimeInSeconds = 3600;

const currentTimestamp = Math.floor(Date.now() / 1000);

const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

export class RtcTokenBuilder {
  static buildToken(channelName: string, account: string) {
    const key = new AccessToken(APP_ID, appCertificate, channelName, account);
    key.addPriviledge(Priviledges.kJoinChannel, privilegeExpiredTs);
    key.addPriviledge(Priviledges.kPublishAudioStream, privilegeExpiredTs);
    key.addPriviledge(Priviledges.kPublishVideoStream, privilegeExpiredTs);
    key.addPriviledge(Priviledges.kPublishDataStream, privilegeExpiredTs);
    return key.build();
  }
}
