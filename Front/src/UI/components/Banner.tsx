import Slider from "react-slick";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SlideComponent() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider {...settings} style={{ height: "24vh" }}>
        <div>
          <h1>첫번째 슬라이드</h1>
          <h1>첫번째 슬라이드</h1>
          <h1>첫번째 슬라이드</h1>
        </div>
        <div>
          <h1>두번째 슬라이드</h1>
          <h1>두번째 슬라이드</h1>
          <h1>두번째 슬라이드</h1>
        </div>
        <div>
          <h1>세번째 슬라이드</h1>
          <h1>세번째 슬라이드</h1>
          <h1>세번째 슬라이드</h1>
        </div>
        <div>
          <h1>네번째 슬라이드</h1>
          <h1>네번째 슬라이드</h1>
          <h1>네번째 슬라이드</h1>
        </div>
        <div>
          <h1>다섯번째 슬라이드</h1>
          <h1>다섯번째 슬라이드</h1>
          <h1>다섯번째 슬라이드</h1>
        </div>
      </Slider>
    </>
  );
}
export default SlideComponent;
