
import Card from "@mui/material/Card";
import "./AHS.css";

  import { Unity, useUnityContext } from "react-unity-webgl";
import Box from "@mui/material/Box";
  
  function AHS() {
    const { unityProvider } = useUnityContext({
      loaderUrl: "/AHS/Build/AHSPWeb.loader.js",
      dataUrl: "/AHS/Build/AHSPWeb.data",
      frameworkUrl: "/AHS/Build/AHSPWeb.framework.js",
      codeUrl: "/AHS/Build/AHSPWeb.wasm",
    });
  
    return <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  ><Unity  unityProvider={unityProvider}  style={{ width: 960, height: 600 }} /></Box>;
  }

export default AHS