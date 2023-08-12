import Slider from "react-slick";
import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { callApi } from "../../utils/api";
import { useState } from "react";
import { DrinkFestival } from "./../../Type/types";

function SlideComponent() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
  };
  const [bannerList, setBannerList] = useState<DrinkFestival[]>([]);
  useEffect(() => {
    callApi("get", "api/drinkFestival/all").then(res => {
      console.log(res.data);
      setBannerList(res.data);
    });
  }, []);

  return (
    <>
      <Slider {...settings} style={{ height: "16vh", width: "84%" }}>
        {bannerList.map(banner => {
          return (
            <div>
              <a href={banner.redirectUri}>
                <img src={banner.image} alt="" style={{ maxWidth: "100%" }} />
              </a>
            </div>
          );
        })}
      </Slider>
    </>
  );
}
export default SlideComponent;
