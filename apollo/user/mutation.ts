import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
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
      memberWarnings
      memberBlocks
      memberCars
      memberRank
      memberArticles
      memberPoints
      memberLikes
      memberViews
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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
      memberWarnings
      memberBlocks
      memberCars
      memberRank
      memberPoints
      memberLikes
      memberViews
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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

export const LIKE_TARGET_MEMBER = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
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
      memberWarnings
      memberBlocks
      memberCars
      memberRank
      memberPoints
      memberLikes
      memberViews
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

export const CREATE_CAR = gql`
  mutation CreateCar($input: CarInput!) {
    createCar(input: $input) {
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

export const UPDATE_CAR = gql`
  mutation UpdateCar($input: CarUpdate!) {
    updateCar(input: $input) {
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

export const LIKE_TARGET_CAR = gql`
  mutation LikeTargetCar($input: String!) {
    likeTargetCar(carId: $input) {
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

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
  mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
    updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetBoardArticle($input: String!) {
    likeTargetBoardArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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

export const REMOVE_COMMENT = gql`
  mutation RemoveComment($commentId: String!) {
    removeComment(commentId: $commentId) {
      _id
      commentStatus
    }
  }
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;
