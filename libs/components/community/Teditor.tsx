import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Stack,
  Typography,
  Select,
  TextField,
} from "@mui/material";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { T } from "../../types/common";
import "@toast-ui/editor/dist/toastui-editor.css";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { useMutation } from "@apollo/client";
import { Message } from "../../enums/common.enum";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sweetAlert";

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null);
  const token = getJwtToken();
  const router = useRouter();

  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE
  );
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articleImage, setArticleImage] = useState<string>("");

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  /** HANDLERS **/
  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target) 
          }`,
          variables: {
            file: null,
            target: "article",
          },
        })
      );
      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        })
      );
      formData.append("0", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data.data.imageUploader;
      console.log("=responseImage: ", responseImage);
      setArticleImage(responseImage);

      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
      throw err;
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value);
  };

  const articleTitleHandler = (e: T) => {
    setArticleTitle(e.target.value);
  };

  const handleRegisterButton = async () => {
    try {
      const editor = editorRef.current;
      const articleContent = editor?.getInstance().getHTML() as string;

      // Validate inputs
      if (
        !articleContent ||
        articleContent.trim() === "" ||
        articleContent === "<p><br></p>"
      ) {
        throw new Error("Please add article content");
      }

      if (!articleTitle || articleTitle.trim() === "") {
        throw new Error("Please add article title");
      }

      console.log("Creating article with:", {
        articleTitle,
        articleContent,
        articleImage,
        articleCategory,
      });

      const result = await createBoardArticle({
        variables: {
          input: {
            articleTitle: articleTitle.trim(),
            articleContent,
            articleImage: articleImage || "",
            articleCategory,
          },
        },
      });

      console.log("Article creation result:", result);

      await sweetTopSuccessAlert("Article is created successfully", 700);
      await router.push({
        pathname: "/mypage",
        query: {
          category: "myArticles",
        },
      });
    } catch (err: any) {
      console.error("Error creating article:", err);

      // Log more details about the error
      if (err.graphQLErrors) {
        console.error("GraphQL Errors:", err.graphQLErrors);
      }
      if (err.networkError) {
        console.error("Network Error:", err.networkError);
      }

      const errorMessage = err.message || Message.INSERT_ALL_INPUTS;
      sweetErrorHandling(new Error(errorMessage)).then();
    }
  };

  const doDisabledCheck = () => {
    return !articleTitle || articleTitle.trim() === "";
  };

  return (
    <Stack>
      <Stack
        direction="row"
        style={{ margin: "40px" }}
        justifyContent="space-evenly"
      >
        <Box
          component={"div"}
          className={"form_row"}
          style={{ width: "300px" }}
        >
          <Typography style={{ color: "#7f838d", margin: "10px" }} variant="h3">
            Category
          </Typography>
          <FormControl sx={{ width: "100%", background: "white" }}>
            <Select
              value={articleCategory}
              onChange={changeCategoryHandler}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={BoardArticleCategory.FREE}>
                <span>Free</span>
              </MenuItem>
              <MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
              <MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
              <MenuItem value={BoardArticleCategory.RECOMMEND}>
                Recommendation
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          component={"div"}
          style={{ width: "300px", flexDirection: "column" }}
        >
          <Typography style={{ color: "#7f838d", margin: "10px" }} variant="h3">
            Title
          </Typography>
          <TextField
            value={articleTitle}
            onChange={articleTitleHandler}
            id="filled-basic"
            label="Type Title"
            style={{ width: "300px", background: "white" }}
          />
        </Box>
      </Stack>

      <Editor
        initialValue={"Type here"}
        placeholder={"Type here"}
        previewStyle={"vertical"}
        height={"640px"}
        // @ts-ignore
        initialEditType={"WYSIWYG"}
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["image", "table", "link"],
          ["ul", "ol", "task"],
        ]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (image: any, callback: any) => {
            try {
              const uploadedImageURL = await uploadImage(image);
              callback(uploadedImageURL);
            } catch (err) {
              console.error("Failed to upload image:", err);
              callback("");
            }
            return false;
          },
        }}
        events={{
          load: function (param: any) {},
        }}
      />

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "30px", width: "250px", height: "45px" }}
          onClick={handleRegisterButton}
          disabled={doDisabledCheck()}
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
};

export default TuiEditor;
