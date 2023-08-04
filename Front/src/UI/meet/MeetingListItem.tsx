import { useNavigate } from "react-router-dom";
import { Meeting } from "../../Type/types";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetailSimple from "./MeetingDetailSimple";
import PeopleNumInfo from "./PeopleNumInfo";

type MeetingListItemProps = {
  data: Meeting[];
  isWaiting?: boolean;
};

/**
 * ListInfoItem에 데이터 넣기
 * @props data : Meeting[] 타입
 * @props isWaiting : boolean 타입, optional, 기본값은 false
 */
const MeetingListItem = ({ data, isWaiting = false }: MeetingListItemProps) => {
  //네비게이터 : 모임 상세페이지로 이동
  const navigate = useNavigate();
  const GotoMeetDetailHandler = (meetId: number) => {
    console.log(meetId, "find");
    navigate(`/meet/${meetId}`);
  };

  //태그ID를 태그 이름으로 변환
  //TODO: 공용 변수로 빼기??
  function getTagName(tagId: number) {
    const tag = [
      { tagId: 0, tagName: "전체" },
      { tagId: 1, tagName: "양주" },
      { tagId: 2, tagName: "전통주" },
      { tagId: 3, tagName: "전체" },
      { tagId: 4, tagName: "사케" },
      { tagId: 5, tagName: "와인" },
      { tagId: 6, tagName: "수제맥주" },
      { tagId: 7, tagName: "소주/맥주" },
    ];
    return tag[tagId].tagName;
  }

  return (
    <div>
      {data.map((meeting: Meeting) => {
        const meetId = meeting.meetId;
        const tagName = getTagName(meeting.tagId);
        const bgImg =
          meeting.imgSrc === "" || meeting.imgSrc == null
            ? "/src/assets/meetDefaultImg.jpg"
            : meeting.imgSrc;

        return (
          <ListInfoItem
            key={meetId}
            title={meeting.meetName}
            imgSrc={bgImg}
            tag={tagName}
            content={<MeetingDetailSimple meetData={meeting} />}
            numberInfo={
              <PeopleNumInfo
                now={meeting.nowParticipants}
                max={meeting.maxParticipants}
                color={"var(--c-black)"}
                size={11}
              />
            }
            isWaiting={isWaiting}
            outLine={false}
            routingFunc={() => GotoMeetDetailHandler(meetId)}
          ></ListInfoItem>
        );
      })}
    </div>
  );
};
export default MeetingListItem;
