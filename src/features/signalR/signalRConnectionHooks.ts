import { HubConnectionBuilder } from "@microsoft/signalr";

const hubURL = "https://www.ordinarygeeks.com/hub";

export const signalRConnection = new HubConnectionBuilder()
  .withUrl(hubURL)
  .withAutomaticReconnect()
  .build();
