import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberCars
      memberRank
      memberArticles
      memberPoints
      memberLikes
      memberViews
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

/**************************
 *          CAR          *
 *************************/

export const UPDATE_CAR_BY_ADMIN = gql`
  mutation UpdateCarByAdmin($input: CarUpdate!) {
    updateCarByAdmin(input: $input) {
      _id
      carType
      carStatus
      carLocation
      carAddress
      carTitle
      carPrice
      carMileage
      carYear
      carSeats
      carViews
      carLikes
      carImages
      car360Images
      carVideos
      carDesc
      carTradeIn
      carLease
      memberId
      soldAt
      deletedAt
      manufacturedAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CAR_BY_ADMIN = gql`
  mutation RemoveCarByAdmin($input: String!) {
    removeCarByAdmin(carId: $input) {
      _id
      carType
      carStatus
      carLocation
      carAddress
      carTitle
      carPrice
      carMileage
      carYear
      carSeats
      carViews
      carLikes
      carImages
      car360Images
      carVideos
      carDesc
      carTradeIn
      carLease
      memberId
      soldAt
      deletedAt
      manufacturedAt
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *            CS          *
 *************************/

export const UPDATE_CS_BY_ADMIN = gql`
  mutation UpdateCsByAdmin($input: CsUpdate!) {
    updateCsByAdmin(input: $input) {
      _id
      csStatus
      csType
      csCategory
      csTitle
      csContent
      csEvent
      inquiryStatus
      memberId
      csAnswer
      answeredAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CS_BY_ADMIN = gql`
  mutation RemoveCsByAdmin($csId: String!) {
    removeCsByAdmin(csId: $csId) {
      _id
      csStatus
      csType
      csCategory
      csTitle
      csContent
      csEvent
      inquiryStatus
      memberId
      csAnswer
      answeredAt
      createdAt
      updatedAt
    }
  }
`;
