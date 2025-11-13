import React, { useState, useRef, useEffect } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import {
  Stack,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { CREATE_CS } from "../../../apollo/user/mutation";
import { CsType, CsCategory } from "../../enums/cs.enum";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";

const Inquiry = () => {
  const device = useDeviceDetect();
  const [category, setCategory] = useState<CsCategory>(CsCategory.OTHER);
  const [title, setTitle] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** APOLLO REQUESTS **/
  const [createCs, { loading }] = useMutation(CREATE_CS);

  // Import Toast UI Editor dynamically
  useEffect(() => {
    const loadEditor = async () => {
      try {
        // Import CSS
        await import("@toast-ui/editor/dist/toastui-editor.css");

        // Import Editor component
        const module = await import("@toast-ui/react-editor");
        setEditorComponent(() => module.Editor);
      } catch (error) {
        console.error("Error loading editor:", error);
      }
    };

    loadEditor();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editorLoaded || !editorRef.current) {
      await sweetErrorHandling(
        "Editor is still loading. Please wait a moment."
      );
      return;
    }

    // Get content from editor
    let content = "";
    try {
      const editorInstance = editorRef.current;

      if (typeof editorInstance.getMarkdown === "function") {
        content = editorInstance.getMarkdown();
      } else if (typeof editorInstance.getInstance === "function") {
        const instance = editorInstance.getInstance();
        if (instance && typeof instance.getMarkdown === "function") {
          content = instance.getMarkdown();
        } else {
          throw new Error("Cannot get markdown from instance");
        }
      } else {
        console.error("Editor instance:", editorInstance);
        throw new Error("Cannot find getMarkdown method");
      }
    } catch (error) {
      console.error("Error getting editor content:", error);
      await sweetErrorHandling(
        "Unable to get editor content. Please try again."
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      await sweetErrorHandling("Please fill in all required fields");
      return;
    }

    try {
      await createCs({
        variables: {
          input: {
            csType: CsType.INQUIRY,
            csCategory: category,
            csTitle: title,
            csContent: content,
          },
        },
      });

      await sweetTopSmallSuccessAlert(
        "Your inquiry has been submitted successfully!",
        1500
      );

      // Reset form
      setTitle("");
      setCategory(CsCategory.OTHER);

      // Clear editor content
      try {
        if (editorRef.current) {
          if (typeof editorRef.current.setMarkdown === "function") {
            editorRef.current.setMarkdown("");
          } else if (typeof editorRef.current.getInstance === "function") {
            const instance = editorRef.current.getInstance();
            if (instance && typeof instance.setMarkdown === "function") {
              instance.setMarkdown("");
            }
          }
        }
      } catch (error) {
        console.error("Error clearing editor:", error);
      }
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  if (device === "mobile") {
    return <div>Inquiry MOBILE</div>;
  }

  return (
    <Stack className={"inquiry-content"} spacing={3}>
      <Typography variant="h4" className={"title"}>
        Submit an Inquiry
      </Typography>

      <Alert severity="info">
        Have a question? Submit your inquiry and our team will respond as soon
        as possible.
      </Alert>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value as CsCategory)}
              label="Category"
            >
              <MenuItem value={CsCategory.CAR}>Car</MenuItem>
              <MenuItem value={CsCategory.PAYMENT}>Payment</MenuItem>
              <MenuItem value={CsCategory.BUYERS}>Buyers</MenuItem>
              <MenuItem value={CsCategory.AGENTS}>Agents</MenuItem>
              <MenuItem value={CsCategory.MEMBERSHIP}>Membership</MenuItem>
              <MenuItem value={CsCategory.COMMUNITY}>Community</MenuItem>
              <MenuItem value={CsCategory.OTHER}>Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of your inquiry"
            InputLabelProps={{ shrink: true }}
          />

          {/* Toast UI Editor for rich text content */}
          <Box
            ref={containerRef}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1,
                ml: 1,
                color: "text.secondary",
              }}
            >
              Content *
            </Typography>
            {EditorComponent ? (
              <EditorComponent
                ref={editorRef}
                initialValue=""
                placeholder="Detailed description of your inquiry"
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                onLoad={() => {
                  setTimeout(() => {
                    console.log("Editor loaded");
                    console.log("Ref current:", editorRef.current);
                    console.log(
                      "Ref keys:",
                      editorRef.current
                        ? Object.keys(editorRef.current)
                        : "null"
                    );
                    setEditorLoaded(true);
                  }, 200);
                }}
                toolbarItems={[
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task"],
                  ["table", "link"],
                  ["code", "codeblock"],
                ]}
              />
            ) : (
              <div
                style={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  backgroundColor: "#fafafa",
                }}
              >
                Loading editor...
              </div>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !editorLoaded}
            fullWidth
          >
            {loading
              ? "Submitting..."
              : !editorLoaded
              ? "Loading Editor..."
              : "Submit Inquiry"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Inquiry;
