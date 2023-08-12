package com.ssafy.backend.service;

import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetSearchDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.dto.follow.FollowResponseDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MeetService {
    private final MeetRepository meetRepository;
    private final MeetUserRepository meetUserRepository;

    private final S3Service s3Service;
    private final UserService userService;
    private final MeetUserService meetUserService;
    private final PushService pushService;
    private final FollowService followService;
    private final TagService tagService;
    private final DrinkService drinkService;
    private final SidoService sidoService;
    private final GugunService gugunService;
    private final DrinkRepository drinkRepository;
    private final UserRepository userRepository;

    private final ChatRoomService chatRoomService;
    private final ChatRoomUserService chatRoomUserService;
    private final ChatMessageService chatMessageService;
    private final ModelMapper modelMapper;

    public Page<MeetSearchDto> findAll(Pageable pageable) {
        return getMeetSearchDtos(meetRepository.findAllByOrderByCreatedAtDesc(pageable));
    }

    public Page<MeetSearchDto> findByTagId(Long tagId, Pageable pageable) {
        return getMeetSearchDtos(meetRepository.findByTag_TagIdOrderByCreatedAtDesc(tagId, pageable));
    }

    private Page<MeetSearchDto> getMeetSearchDtos(Page<Meet> data) {
        return data.map(meet -> {

            MeetSearchDto meetSearchDto = modelMapper.map(meet, MeetSearchDto.class);
            meetSearchDto.setSido(sidoService.findById(meet.getSidoCode()).orElseThrow(() -> new IllegalArgumentException("시도 정보를 찾을 수 없습니다.")));
            meetSearchDto.setGugun(gugunService.getGugun(meet.getSidoCode(), meet.getGugunCode()));

            return meetSearchDto;
        });
    }

    public Map<String, Object> findMeetdetailByMeetId(Long meetId) throws NoSuchFieldException {
        Map<String, Object> result = new HashMap<>();
        List<User> users = new ArrayList<>();
        List<Status> statuses = new ArrayList<>();


        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(NoSuchFieldException::new);
        for (MeetUser mu : meetUsers) {
            users.add(mu.getUser());
            statuses.add(mu.getStatus());
        }

        result.put("meet", findByMeetId(meetId));
        result.put("users", users);
        result.put("statuses", statuses);
        return result;
    }

    public MeetSearchDto findByMeetId(Long meetId) {
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
        return findMeet.toSearchDto(sidoService.findById(findMeet.getSidoCode()).orElseThrow(() -> new IllegalArgumentException("올바르지 않은 정보 입니다.")),
                gugunService.getGugun(findMeet.getSidoCode(), findMeet.getGugunCode()));
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) throws NoSuchFieldException {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(NoSuchFieldException::new);

        MeetUserDto meetUserDto = MeetUserDto.builder().build();

        if (meetUsers.size() != 0) {
            meetUserDto.setMeetDto(meetUsers.get(0).getMeet().toDto());
            for (MeetUser mu : meetUsers) {
                meetUserDto.getUsers().add(mu.getUser());
                meetUserDto.getStatuses().add(mu.getStatus());
            }
        }
        return meetUserDto;
    }

    public Map<String, List<MeetSearchDto>> findByUserId(Long userId) {
        Map<String, List<MeetSearchDto>> userMeets = new HashMap<>();
        userMeets.put(Status.APPLY.name(), new ArrayList<>());
        userMeets.put(Status.GUEST.name(), new ArrayList<>());
        userMeets.put(Status.HOST.name(), new ArrayList<>());

        List<MeetUser> meetUsers = meetUserRepository.findByUser_UserIdOrderByStatus(userId).orElseThrow(() -> new IllegalArgumentException("유저ID 값이 올바르지 않습니다."));

        for (MeetUser mu : meetUsers) {
            Status status = mu.getStatus();
            if (status != Status.FINISH) {
                Sido findSido = sidoService.findById(mu.getMeet().getSidoCode()).orElseThrow(() -> new IllegalArgumentException("올바른 시도 정보가 입력되지 않았습니다."));
                Gugun findGugun = gugunService.getGugun(mu.getMeet().getSidoCode(), mu.getMeet().getGugunCode());

                userMeets.get(status.name()).add(mu.getMeet().toSearchDto(findSido, findGugun));
            }
        }
        return userMeets;
    }

    public Meet saveMeet(MeetDto meetDto, Long userId, Long drinkId, MultipartFile multipartFile) throws IOException {
        meetDto.setHostId(userId);
        log.info("모임 생성 : {} ", meetDto);

        if (multipartFile != null) {
            if (!multipartFile.isEmpty()) meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
        } else meetDto.setImgSrc("no image");

        ChatRoom createChatRoom = chatRoomService.save(ChatRoom.builder()
                .chatRoomName(meetDto.getMeetName() + "모임의 채팅방")
                .build());

        Sido findSido = sidoService.findById(meetDto.getSidoCode()).orElseThrow(() -> new IllegalArgumentException("올바른 시도 정보가 입력되지 않았습니다."));
        Gugun findGugun = gugunService.getGugun(meetDto.getSidoCode(), meetDto.getGugunCode());

        Meet meet = meetDto.toEntity();
        meet.setHost(userRepository.findByUserId(meetDto.getHostId()).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다.")));
        meet.setTag(tagService.findById(meetDto.getTagId()));
        meet.setDrink(drinkRepository.findById(drinkId).orElse(null));
        meet.setChatRoom(createChatRoom);
        meet.setNowParticipants(1);
        Meet createdMeet = meetRepository.save(meet);

        User hostUser = userRepository.findByUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다."));
        log.info("모임 잘 만들어 졌나 {}", createdMeet);

        //MeetUser 정보를 추가한다.
        meetUserService.saveMeetUser(createdMeet, hostUser, Status.HOST);

        //채팅-유저 테이블에 데이터 추가
        ChatRoomUser chatRoomUser = chatRoomUserService.save(ChatRoomUser.builder()
                .chatRoom(createChatRoom)
                .user(hostUser)
                .build());

        chatMessageService.save(ChatMessage.builder()
                .chatRoom(createChatRoom)
                .user(hostUser)
                .message("채팅방이 생성되었습니다.")
                .createdAt(LocalDateTime.now())
                .build());

        //팔로워에게 메세지를 보낸다
        List<FollowResponseDto> followers = followService.findByFollower(userId);
        log.info("방장");
        for (FollowResponseDto fw : followers) {
            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append(hostUser.getName()).append("님께서 회원님께서 모임(").append(createdMeet.getMeetName()).append(")을 생성했습니다.");
            pushService.send(hostUser, fw.getFollower(), PushType.MEETCREATED, pushMessage.toString(), "이동할 url");
        }

        return createdMeet;
    }

    public void updateMeet(MeetDto meetDto, Long userId, Long meetId, Long drinkId, MultipartFile multipartFile) throws IOException, NoSuchFieldException {
        log.info("meetId : {}인 모임 정보 업데이트 : {} ", meetId, meetDto);
        //기존 Meet를 가져온다
        String prevMeetImgSrc = meetRepository.findImgSrcByMeetId(meetId);
        log.info("기본 모임 사진 {}", prevMeetImgSrc);
        User host = userRepository.findByUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다."));


        if (multipartFile != null) {
            boolean imgExist = !Objects.equals(multipartFile.getOriginalFilename(), "");

            if (imgExist) { //업로드할 파일이 있으면 DB와 S3에 존재하는 이미지를 제거한다/
                s3Service.deleteImg(prevMeetImgSrc);
                meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
            } else meetDto.setImgSrc(prevMeetImgSrc);
        } else meetDto.setImgSrc(prevMeetImgSrc);

        //기존 데이터를 가져온 뒤 업데이트 한다.
        Meet updateMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));
        updateMeet.update(meetDto.toEntity()); //업데이트한다.
        updateMeet.setMeetId(meetId);
        updateMeet.setTag(tagService.findById(meetDto.getTagId()));
        updateMeet.setDrink(drinkRepository.findById(drinkId).orElse(null));

        Meet result = meetRepository.save(updateMeet);
        log.info("수정된 Meet 정보 : {}", result.getImgSrc());

        //모임이 수정되면 모임에 참여한 사람들에게 Push 알림을 보낸다.
        //MeetUserDto meetUser = findMeetUserByMeetId(meetId);

        List<MeetUser> meetUser = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(() -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        for (MeetUser user : meetUser) {
            if (user.getUser().getUserId().equals(meetDto.getHostId())) continue; //방장에게는 알림을 전송하지 않는다.

            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append("모임( ").append(meetDto.getMeetName()).append(")의 내용이 수정되었습니다. 확인해 주세요.");
            pushService.send(host, user.getUser(), PushType.MEETMODIFIDE, pushMessage.toString(), "https://i9b310.p.ssafy.io");
        }

    }

    @Transactional
    public void deleteMeet(Long hostId, Long meetId) throws NoSuchFieldException {
        log.info("meetId : {}인 모임 삭제", meetId);

        Meet deleteMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));
        log.info("모임장 : {}, 삭제하려는 유저 : {}", deleteMeet.getHost().getUserId(), hostId);
        //유효성 검사
        if (!deleteMeet.getHost().getUserId().equals(hostId))
            throw new IllegalArgumentException("방장이 아니면 방을 삭제할 수 없습니다.");

        //MeetUserDto meetUser = findMeetUserByMeetId(meetId);
        List<MeetUser> meetUser = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(() -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        //MeetUser 정보를 삭제한다.
        meetUserService.deleteMeetUser(deleteMeet);

        //meet 이미지를 지운다
        s3Service.deleteImg(deleteMeet.getImgSrc());

        //마지막에 모임 정보를 제거한다.
        meetRepository.findById(meetId).ifPresent(meetRepository::delete);

        //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
        for (MeetUser user : meetUser) {
            if (user.getUser().getUserId().equals(hostId)) continue; //방장에게는 알림을 전송하지 않는다.

            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append(deleteMeet.getHost().getName() + "님 께서 생성한 모임").append("(").append(deleteMeet.getMeetName()).append(")이 삭제되었습니다.");
            pushService.send(deleteMeet.getHost(), user.getUser(), PushType.MEETDELETED, pushMessage.toString(), "");
        }

    }

    public void applyMeet(Long userId, Long meetId) throws NoSuchFieldException {
        log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

        MeetUserDto meetUser = findMeetUserByMeetId(meetId);
        Meet attendMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
        Long hostId = meetUser.getMeetDto().getHostId();

        User attendUser = userRepository.findByUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다.")
        );
        User host = userRepository.findByUserId(hostId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다.")
        );

        //모임의 인원수 체크
        if (meetUser.getMeetDto().getNowParticipants() >= meetUser.getMeetDto().getMaxParticipants())
            throw new IllegalArgumentException("해당 모임에 참여 인원이 가득 찼습니다.");

        //모임에 참가 했을 경우 제외한다.
        for (User user : meetUser.getUsers()) {
            if (userId.equals(user.getUserId())) throw new IllegalArgumentException("이미 참여하신 모임 입니다.");
        }

        //참가자의 모임 상태 추가 -> 데이터를 추가해야한다.
        meetUserService.saveMeetUser(attendMeet, attendUser, Status.APPLY);

        //호스트에게 알림 제공 - meet의 hostId를 얻어와야한다.
        StringBuilder pushMessage = new StringBuilder();
        pushMessage.append(attendUser.getName() + "님께서 " + meetUser.getMeetDto().getMeetName() + "모임에 참여하고 싶어 합니다.");
        pushService.send(attendUser, host, PushType.MEETACCESS, pushMessage.toString(), "이동할 url");
    }

    @Transactional
    public void applyCancelMeet(Long userId, Long meetId) throws Exception {
        log.info("{}유저 {}모임 신청 취소 ", userId, meetId);

        Meet meet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));

        Status applyUserStatus = meetUserService.findUserStatus(userId, meetId);
        log.info("현재 {}유저의 {}모임 신청 상태 : {}", userId, meetId, applyUserStatus);

        if (applyUserStatus != Status.APPLY) throw new IllegalArgumentException("가입신청중인 유저만 모임 신청을 취소할 수 있습니다.");

        //신청 취소할 경우 참여자 수 -1로 변경
        meet.setNowParticipants(meet.getNowParticipants() - 1);
        meetRepository.save(meet);

        //모임-유저테이블에서 해당 정보 삭제
        meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
        //푸시알림 로그 삭제
        pushService.deletePushLog(PushType.MEETACCESS, userId, meet.getHost().getUserId());

    }

    @Transactional
    public void exitMeet(Long userId, Long meetId) {
        log.info("유저 {}가 모임({})에서 나간다.", userId, meetId);

        //모임에서 나간다
        Status applyUserStatus = meetUserService.findUserStatus(userId, meetId);
        if (applyUserStatus == Status.HOST)
            throw new IllegalArgumentException("죄송합니다.. 방장님은 나가실 수 없으십니다. 모임 삭제를 요청하세요.");

        //모임-유저테이블에서 해당 정보 삭제
        meetUserService.deleteExitUser(userId, meetId, Status.GUEST);

        //chat_room_user도 사라진다.
        Meet nowMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("올바르지 않은 모임 정보입니다."));

        //모임에서 나갈 경우 참여자 수 -1로 변경
        nowMeet.setNowParticipants(nowMeet.getNowParticipants() - 1);
        meetRepository.save(nowMeet);

        chatRoomService.deleteExistUser(nowMeet.getChatRoom(), userId);
    }

    public String manageMeet(Long userId, Long meetId, boolean applyResult) {
        log.info("{}유저 {}모임 신청 관리 : 결과 {}", userId, meetId, applyResult);

        Meet managementMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));

        //Host유저와 관리할유저 리스트 반환(1개의 쿼리를 사용 하기 위함) 0번 : 호스트, 1번 : 관리할 유저
        User host = managementMeet.getHost();
        User manageUser = userRepository.findByUserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다.")
        );

        if (applyResult) {//신청 결과가 true
            //모임 상태를 변경 시킨다.
            meetUserService.updateMeetStatus(userId, meetId, Status.GUEST);
            //모임 참여 인원수 1증가 시킨다.
            updateParticipants(meetId);

            //채팅방에 참여 시킨다
            chatRoomUserService.save(ChatRoomUser.builder()
                    .user(manageUser)
                    .chatRoom(managementMeet.getChatRoom())
                    .build());

            chatMessageService.save(ChatMessage.builder()
                    .chatRoom(managementMeet.getChatRoom())
                    .user(null)
                    .message(manageUser.getName() + "님이 모임에 참여하셨습니다.")
                    .createdAt(LocalDateTime.now())
                    .build());

            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append("회원님께서 모임(").append(managementMeet.getMeetName()).append(")참여 되셨습니다.\n 즐거운 시간 되세요.");
            pushService.send(host, manageUser, PushType.MEETACCESS, pushMessage.toString(), "http://i9b310.p.ssafy.");

            return userId + "유저 " + meetId + "모임 신청 승인";
        } else {//신청 결과가 false
            //모임-유저 테이블에 해당 유저 데이터 삭제
            meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
            //유저에게 push 알림 전송

            StringBuilder pushMessage = new StringBuilder();
            pushMessage.append("회원님께서 모임(").append(managementMeet.getMeetName()).append(")참여에 거절당했습니다.");
            pushService.send(host, manageUser, PushType.MEETREJECT, pushMessage.toString(), "");

            return userId + "유저 " + meetId + "모임 신청 거절";
        }
    }

    public void updateParticipants(Long meetId) {
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));
        findMeet.setNowParticipants(findMeet.getNowParticipants() + 1);

        meetRepository.save(findMeet);
    }

    public void checkMeetStatus() {
        List<Meet> meetList = meetRepository.findMeetByMeetDateBefore();
        List<Meet> updateMeetList = new ArrayList<>();
        for (Meet meet : meetList) {
            meet.setMeetStatus(MeetStatus.END);
            updateMeetList.add(meet);
        }

        if (!updateMeetList.isEmpty()) meetRepository.saveAll(updateMeetList);
    }
}
