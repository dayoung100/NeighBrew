import { Review, Drink, User } from "../../Type/types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { callApi } from "../../utils/api";
const DrinkpostReviewDetail = () => {
  const id = useParams();
  const [review, setReview] = useState<Review>();

  return (
    <>
      <h1>술 후기 디테일 페이지 입니다.</h1>
    </>
  );
};
export default DrinkpostReviewDetail;
