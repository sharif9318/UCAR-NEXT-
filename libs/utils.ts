import numeral from "numeral";
import { sweetMixinErrorAlert } from "./sweetAlert";

export const formatterStr = (value: number | undefined): string => {
  return numeral(value).format("0,0") != "0"
    ? numeral(value).format("0,0")
    : "";
};

export const likeTargetCarHandler = async (
  likeTargetCar: any,
  id: string,
  refetch: any,
  checkoutRefetch: any
) => {
  try {
    await likeTargetCar({
      variables: { input: id },
    });

    await refetch({ input: id });
    await checkoutRefetch({ input: id });
  } catch (err: any) {
    console.log("ERROR, likeTargetCarHandler:", err.message);
  }
};

export const likeTargetBoardArticleHandler = async (
  likeTargetBoardArticle: any,
  id: string
) => {
  try {
    await likeTargetBoardArticle({
      variables: {
        input: id,
      },
    });
  } catch (err: any) {
    console.log("ERROR, likeTargetBoardArticleHandler:", err.message);
    sweetMixinErrorAlert(err.message).then();
  }
};

export const likeTargetMemberHandler = async (
  likeTargetMember: any,
  id: string
) => {
  try {
    await likeTargetMember({
      variables: {
        input: id,
      },
    });
  } catch (err: any) {
    console.log("ERROR, likeTargetMemberHandler:", err.message);
    sweetMixinErrorAlert(err.message).then();
  }
};

export const isValidObjectId = (id?: string) =>
  /^[0-9a-fA-F]{24}$/.test(String(id ?? ""));
