import React, { useEffect, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";

const TViewer = (props: any) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  /** LIFECYCLES **/
  useEffect(() => {
    console.log("TViewer props:", props);
    console.log("TViewer markdown content:", props.markdown);
    console.log("TViewer markdown type:", typeof props.markdown);
    console.log("TViewer markdown length:", props.markdown?.length);

    if (props.markdown) {
      setEditorLoaded(true);
    } else {
      setEditorLoaded(false);
    }
  }, [props.markdown]);

  return (
    <Stack sx={{ background: "white", mt: "30px", borderRadius: "10px" }}>
      <Box component={"div"} sx={{ m: "40px" }}>
        {!props.markdown && (
          <Typography color="error">
            No content available. Markdown prop is:{" "}
            {JSON.stringify(props.markdown)}
          </Typography>
        )}

        {editorLoaded ? (
          <Viewer
            initialValue={props.markdown}
            customHTMLRenderer={{
              htmlBlock: {
                iframe(node: any) {
                  return [
                    {
                      type: "openTag",
                      tagName: "iframe",
                      outerNewLine: true,
                      attributes: node.attrs,
                    },
                    { type: "html", content: node.childrenHTML ?? "" },
                    { type: "closeTag", tagName: "iframe", outerNewLine: true },
                  ];
                },
                div(node: any) {
                  return [
                    {
                      type: "openTag",
                      tagName: "div",
                      outerNewLine: true,
                      attributes: node.attrs,
                    },
                    { type: "html", content: node.childrenHTML ?? "" },
                    { type: "closeTag", tagName: "div", outerNewLine: true },
                  ];
                },
              },
              htmlInline: {
                big(node: any, { entering }: any) {
                  return entering
                    ? {
                        type: "openTag",
                        tagName: "big",
                        attributes: node.attrs,
                      }
                    : { type: "closeTag", tagName: "big" };
                },
              },
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Stack>
  );
};

export default TViewer;
