import React from "react";
import { UIEvent, PhotoEditorSDKUI } from "photoeditorsdk";


export class PhotoEditorSDK extends React.Component {
  componentDidMount() {
    this.initEditor();
  }
  async initEditor() {
    const editor = await PhotoEditorSDKUI.init({
      container: "#editor",
      image: "https://gateway.ipfs.io/ipfs/QmWVQ6fzDu1bFGAaGNjNy84sV4qYoDz3fAKXhip7zva9QB", // Image url or Image path relative to assets folder
      // Please replace this with your license: https://img.ly/dashboard
    //   license: '',
        engine: {
            crossOrigin: 'anonymous',
            downscaleOptions: {
            maxMegaPixels: {
                desktop: 10,
                mobile: 5,
            },
            maxDimensions: {
                height: 500,
                width: 500,
            },
            }
        }
    });
    console.log("PhotoEditorSDK for Web is ready!");
    editor.on(UIEvent.EXPORT, (imageSrc) => {
      console.log("Exported ", imageSrc);
    });
  }


  render() {
    return (
      <div
        id="editor"
        style={{width: "100vw", height: "100vh" }}
      />
    );
  }
}

