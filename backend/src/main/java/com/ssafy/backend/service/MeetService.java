package com.ssafy.backend.service;


import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    private final ChatRoomService chatRoomService;
    private final ChatRoomUserService chatRoomUserService;
    private final ChatMessageService chatMessageService;

    public List<MeetDto> findAll() {
        List<Meet> list = meetRepository.findAll();

        List<MeetDto> dtos = new ArrayList<>();
        for (Meet meet : list) {
            dtos.add(MeetDto.builder()
                    .meetId(meet.getMeetId())
                    .meetName(meet.getMeetName())
                    .description(meet.getDescription())
                    .hostId(meet.getHostId())
                    .nowParticipants(meet.getNowParticipants())
                    .maxParticipants(meet.getMaxParticipants())
                    .meetDate(meet.getMeetDate())
                    .tagId(meet.getTag().getTagId())
                    .sido(meet.getSido())
                    .gugun(meet.getGugun())
                    .dong(meet.getDong())
                    .minAge(meet.getMinAge())
                    .maxAge(meet.getMaxAge())
                    .minLiverPoint(meet.getMinLiverPoint())
                    .drink(meet.getDrink())
                    .imgSrc(meet.getImgSrc())
                    .build());
        }
        return dtos;
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(() -> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));


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

    public Meet findByMeetId(Long meetId) {
        return meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
    }

    public Map<String, List<MeetDto>> findByUserId(Long userId) {
        Map<String, List<MeetDto>> userMeets = new HashMap<>();
        userMeets.put(Status.APPLY.name(), new ArrayList<>());
        userMeets.put(Status.GUEST.name(), new ArrayList<>());
        userMeets.put(Status.HOST.name(), new ArrayList<>());

        List<MeetUser> meetUsers = meetUserRepository.findByUser_UserIdOrderByStatus(userId).orElseThrow(() -> new IllegalArgumentException("유저ID 값이 올바르지 않습니다."));

        for (MeetUser mu : meetUsers) {
            Status status = mu.getStatus();

            if (status != Status.FINISH)
                userMeets.get(status.name()).add(mu.getMeet().toDto());
        }

        return userMeets;
    }

    public ResponseEntity<?> saveMeet(MeetDto meetDto, Long userId, Long drinkId, MultipartFile multipartFile) {
        meetDto.setHostId(userId);
        meetDto.setNowParticipants(1);
        log.info("모임 생성 : {} ", meetDto);

        try {
            if(multipartFile != null){
                boolean imgExist = !Objects.equals(multipartFile.getOriginalFilename(), "");
                if (imgExist) meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
            }

            ChatRoom createChatRoom = chatRoomService.save(ChatRoom.builder()
                    .chatRoomName(meetDto.getMeetName() + "모임의 채팅방")
                    .build());


            Meet meet = meetDto.toEntity();
            meet.setTag(tagService.findById(meetDto.getTagId()));
            meet.setDrink(drinkService.findById(drinkId));
            meet.setChatRoom(createChatRoom);
            Meet createdMeet = meetRepository.save(meet);

            User hostUser = userService.findByUserId(userId);
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
                    .user(null)
                    .message("채팅방이 생성되었습니다.")
                    .timestamp(LocalDateTime.now())
                    .build());

            //팔로워에게 메세지를 보낸다
            List<Follow> followers = followService.findByFollower(userId);
            log.info("방장");
            for (Follow fw : followers) {
                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append(hostUser.getName()).append("님께서 회원님께서 모임(").append(createdMeet.getMeetName()).append(")을 생성했습니다.");
                pushService.send(hostUser, fw.getFollower(), PushType.CREATEMEET, pushMessage.toString(), "이동할 url");
            }

            return ResponseEntity.ok(createdMeet);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("모임 생성 중 문제가 발생했습니다. \n" + e.getMessage());
        }
    }

    public ResponseEntity<?> updateMeet(MeetDto meetDto, Long userId,  Long meetId, Long drinkId, MultipartFile multipartFile) {
        log.info("meetId : {}인 모임 정보 업데이트 : {} ", meetId, meetDto);
        //기존 Meet를 가져온다
        String prevMeetImgSrc = meetRepository.findImgSrcByMeetId(meetId);
        User host = userService.findByUserId(userId);

        try{
            if(multipartFile != null){
                boolean imgExist = !Objects.equals(multipartFile.getOriginalFilename(), "");

                if (imgExist) { //업로드할 파일이 있으면 DB와 S3에 존재하는 이미지를 제거한다/
                    s3Service.deleteImg(prevMeetImgSrc);
                    meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
                } else meetDto.setImgSrc(prevMeetImgSrc);
            }else meetDto.setImgSrc(prevMeetImgSrc);


            //기존 데이터를 가져온 뒤 업데이트 한다.
            Meet updateMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));
            updateMeet.update(meetDto.toEntity()); //업데이트한다.
            updateMeet.setMeetId(meetId);
            updateMeet.setTag(tagService.findById(meetDto.getTagId()));
            updateMeet.setDrink(drinkService.findById(drinkId));

            meetRepository.save(updateMeet);

            //모임이 수정되면 모임에 참여한 사람들에게 Push 알림을 보낸다.
            MeetUserDto meetUser = findMeetUserByMeetId(meetId);

            for (User user : meetUser.getUsers()) {
                if (user.getUserId().equals(meetDto.getHostId())) continue; //방장에게는 알림을 전송하지 않는다.

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("모임( ").append(meetDto.getMeetName()).append(")의 내용이 수정되었습니다. 확인해 주세요.");
                pushService.send(host, user, PushType.MODIFIDEMEET, pushMessage.toString(), "https://i9b310.p.ssafy.io");
            }

            return ResponseEntity.ok(meetId + "모임이 수정 되었습니다.");
        }catch (IOException e){
            return ResponseEntity.badRequest().body(meetId + "모임이 수정 중 문제가 발생했습니다.");
        }
    }

    public ResponseEntity<?> deleteMeet(Long hostId, Long meetId) {
        log.info("meetId : {}인 모임 삭제", meetId);
        try{
            Meet deleteMeet = findByMeetId(meetId);
            User host = userService.findByUserId(hostId);

            //유효성 검사
            if (deleteMeet.getHostId().equals(hostId)) return ResponseEntity.badRequest().body("모임장이 아니신 경우 모임을 삭제 할 수 없습니다.");

            MeetUserDto meetUser = findMeetUserByMeetId(meetId);

            //MeetUser 정보를 삭제한다.
            meetUserService.deleteMeetUser(deleteMeet);

            //meet 이미지를 지운다
            s3Service.deleteImg(deleteMeet.getImgSrc());

            //마지막에 모임 정보를 제거한다.
            meetRepository.findById(meetId).ifPresent(meetRepository::delete);


            //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
            for (User user : meetUser.getUsers()) {
                if (user.getUserId().equals(hostId)) continue; //방장에게는 알림을 전송하지 않는다.

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append(host.getName() + "님 께서 생성한 모임").append("(").append(deleteMeet.getMeetName()).append(")이 삭제되었습니다.");
                pushService.send(host, user, PushType.DELETEMEET, pushMessage.toString(), "");
            }

            return ResponseEntity.ok(deleteMeet.getMeetName() + "모임이 삭제 되었습니다.");
        }catch(Exception e){
            return ResponseEntity.ok("모임 삭제 중 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    public ResponseEntity<?> applyMeet(Long userId, Long meetId){
        log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

        MeetUserDto meetUser = findMeetUserByMeetId(meetId);
        Long hostId = meetUser.getMeetDto().getHostId();

        User attendUser = userService.findByUserId(userId);
        User host = userService.findByUserId(hostId);

        //모임의 인원수 체크
        if (meetUser.getMeetDto().getNowParticipants() >= meetUser.getMeetDto().getMaxParticipants())
            return ResponseEntity.badRequest().body("해당 모임에 참여 인원이 가득 찼습니다.");

        //모임에 참가 했을 경우 제외한다.
        for (User user : meetUser.getUsers()) {
            if (userId.equals(user.getUserId())) return ResponseEntity.badRequest().body("이미 참여하신 모임 입니다.");
        }

        //참가자의 모임 상태 추가 -> 데이터를 추가해야한다.
        meetUserService.saveMeetUser(meetUser.getMeetDto().toEntity(), attendUser, Status.APPLY);

        //호스트에게 알림 제공 - meet의 hostId를 얻어와야한다.
        StringBuilder pushMessage = new StringBuilder();
        pushMessage.append(attendUser.getName() + "님께서 " + meetUser.getMeetDto().getMeetName() + "모임에 참여하고 싶어 합니다.");
        pushService.send(attendUser, host, PushType.MEETACCESS, pushMessage.toString(), "이동할 url");

        return ResponseEntity.ok(meetId + "모임에 신청 완료");
    }
    public ResponseEntity<?> applyCancelMeet(Long userId, Long meetId){
        log.info("{}유저 {}모임 신청 취소 ", userId, meetId);

        try{
            Meet meet = findByMeetId(meetId);
            //모임-유저테이블에서 해당 정보 삭제
            meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
            //푸시알림 로그 삭제
            pushService.deletePushLog(PushType.MEETACCESS, userId, meet.getHostId());
            return ResponseEntity.ok("모임 신청 취소가 완료됐습니다.");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("모임 신청 취소에 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    public ResponseEntity<?> exitMeet(Long userId, Long meetId) {
        log.info("유저 {}가 모임({})에서 나간다.", userId, meetId);
        //모임에서 나간다
        //chat_room_user도 사라진다.
        try{

            return ResponseEntity.ok("모임("+ meetId +")에서 정상적으로 나가졌습니다.");
        }catch(Exception e){
            return ResponseEntity.badRequest().body("모임 탈퇴 중 문제가 발생했습니다.\n" + e.getMessage());
        }
    }

    public ResponseEntity<?> manageMeet(Long userId, Long meetId, boolean applyResult){
        log.info("{}유저 {}모임 신청 관리 : 결과 {}", userId, meetId, applyResult);

        try{
            Meet manageMentMeet = findByMeetId(meetId);

            //Host유저와 관리할유저 리스트 반환(1개의 쿼리를 사용 하기 위함) 0번 : 호스트, 1번 : 관리할 유저
            List<User> users = userService.findByUserIdIn(manageMentMeet.getHostId(), userId);

            if (applyResult) {//신청 결과가 true
                //모임 상태를 변경 시킨다.
                meetUserService.updateMeetStatus(userId, meetId, Status.GUEST);
                //모임 참여 인원수 1증가 시킨다.
                updateParticipants(meetId);

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("회원님께서 모임(").append(manageMentMeet.getMeetName()).append(")참여 되셨습니다.\n 즐거운 시간 되세요.");
                pushService.send(users.get(0), users.get(1), PushType.MEETACCESS, pushMessage.toString(), "http://i9b310.p.ssafy.");

                return ResponseEntity.ok(userId + "유저 " + meetId + "모임 신청 승인");

            } else {//신청 결과가 false
                //모임-유저 테이블에 해당 유저 데이터 삭제
                meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
                //유저에게 push 알림 전송

                StringBuilder pushMessage = new StringBuilder();
                pushMessage.append("회원님께서 모임(").append(manageMentMeet.getMeetName()).append(")참여에 거절당했습니다.");
                pushService.send(users.get(0), users.get(1), PushType.MEETREJECT, pushMessage.toString(), "");

                return ResponseEntity.ok(userId + "유저 " + meetId + "모임 신청 거절");
            }
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    public void updateParticipants(Long meetId) {
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));
        findMeet.setNowParticipants(findMeet.getNowParticipants() + 1);

        meetRepository.save(findMeet);
    }

}
