package com.ssafy.backend.service;

import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.dto.meet.MeetDto;
import com.ssafy.backend.dto.meet.MeetSearchDto;
import com.ssafy.backend.dto.meet.MeetUserDto;
import com.ssafy.backend.entity.*;
import com.ssafy.backend.repository.*;
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
    private final FollowRepository followRepository;

    private final S3Service s3Service;
    private final MeetUserService meetUserService;
    private final PushService pushService;
    private final TagService tagService;
    private final SidoRepository sidoRepository;
    private final GugunRepository gugunRepository;
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
            meetSearchDto.setSido(sidoRepository.findById(meet.getSidoCode()).orElseThrow(() -> new IllegalArgumentException("시도 정보를 찾을 수 없습니다.")));
            meetSearchDto.setGugun(gugunRepository.findBySidoCodeAndGugunCode(meet.getSidoCode(), meet.getGugunCode()).orElseThrow(
                    () -> new IllegalArgumentException("구군 정보를 찾을 수 없습니다.")
            ));

            return meetSearchDto;
        });
    }

    public Map<String, Object> findMeetdetailByMeetId(Long meetId) {
        Map<String, Object> result = new HashMap<>();
        List<User> users = new ArrayList<>();
        List<Status> statuses = new ArrayList<>();


        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다.")
        );
        for (MeetUser meetUser : meetUsers) {
            users.add(meetUser.getUser());
            statuses.add(meetUser.getStatus());
        }

        result.put("meet", findByMeetId(meetId));
        result.put("users", users);
        result.put("statuses", statuses);
        return result;
    }

    public MeetSearchDto findByMeetId(Long meetId) {
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(
                () -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다.")
        );
        return findMeet.toSearchDto(sidoRepository.findById(findMeet.getSidoCode()).orElseThrow(
                        () -> new IllegalArgumentException("올바르지 않은 정보 입니다.")
                ),
                gugunRepository.findBySidoCodeAndGugunCode(findMeet.getSidoCode(), findMeet.getGugunCode()).orElseThrow(
                        () -> new IllegalArgumentException("올바르지 않은 정보 입니다.")
                ));
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(
                () -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다.")
        );

        MeetUserDto meetUserDto = MeetUserDto.builder().build();

        if (!meetUsers.isEmpty()) {
            meetUserDto.setMeetDto(meetUsers.get(0).getMeet().toDto());
            for (MeetUser meetUser : meetUsers) {
                meetUserDto.getUsers().add(meetUser.getUser());
                meetUserDto.getStatuses().add(meetUser.getStatus());
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

        for (MeetUser meetUser : meetUsers) {
            Status status = meetUser.getStatus();
            if (status != Status.FINISH) {
                Sido sido = sidoRepository.findById(meetUser.getMeet().getSidoCode()).orElseThrow(() -> new IllegalArgumentException("올바른 시도 정보가 입력되지 않았습니다."));
                Gugun gugun = gugunRepository.findBySidoCodeAndGugunCode(meetUser.getMeet().getSidoCode(), meetUser.getMeet().getGugunCode()).orElseThrow(
                        () -> new IllegalArgumentException("올바른 구군 정보가 입력되지 않았습니다.")
                );
                userMeets.get(status.name()).add(meetUser.getMeet().toSearchDto(sido, gugun));
            }
        }
        return userMeets;
    }

    private void validateMeetRequest(MeetDto meetDto, Long drinkId) {
        if (meetDto.getMeetName() == null) throw new IllegalArgumentException("모임 이름이 등록되지 않았습니다.");
        if (meetDto.getMeetDate() == null) throw new IllegalArgumentException("모임 날짜 정보가 누락되었습니다.");
        if (meetDto.getMeetDate().toLocalDate() == null) throw new IllegalArgumentException("모임 날짜가 입력되지 않았습니다.");
        if (meetDto.getMeetDate().toLocalTime() == null) throw new IllegalArgumentException("모임 시간이 입력되지 않았습니다.");
        if (meetDto.getMaxParticipants() == null) throw new IllegalArgumentException("모임 최대 인원 수용 정보가 입력되지 않았습니다.");
        if (meetDto.getMaxParticipants() > 8) throw new IllegalArgumentException("모임 최대 인원 수용치를 초과했습니다.");
        if (drinkId == null) throw new IllegalArgumentException("모임에 등록할 술 정보가 포함되지 않았습니다.");
        if (meetDto.getTagId() == null) throw new IllegalArgumentException("모임에 등록할 태그 정보가 포함되지 않았습니다.");
        if (meetDto.getMinAge() < 20) throw new IllegalArgumentException("모임 최소나이를 다시 입력해 주세요.");
        if (meetDto.getMinAge() >= 200) throw new IllegalArgumentException("모임 최대 나이를 다시 입력해 주세요.");
        if (meetDto.getMeetDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("모임 날짜 및 시간을 확인해 주세요.");
        }
    }

    @Transactional
    public Meet saveMeet(MeetDto meetDto, Long userId, Long drinkId, MultipartFile multipartFile) throws IOException {
        validateMeetRequest(meetDto, drinkId);
        meetDto.setHostId(userId);
        log.info("모임 생성 : {} ", meetDto);

        meetDto.setImgSrc(multipartFile != null ? !multipartFile.isEmpty() ? s3Service.upload(UploadType.MEET, multipartFile) : "no image" : "no image");

        ChatRoom createChatRoom = chatRoomService.save(ChatRoom.builder()
                .chatRoomName(meetDto.getMeetName() + "모임의 채팅방")
                .build());

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
        chatMessageService.save(ChatMessage.builder()
                .chatRoom(createChatRoom)
                .user(hostUser)
                .message("채팅방이 생성되었습니다.")
                .createdAt(LocalDateTime.now())
                .build());

        //팔로워에게 메세지를 보낸다
        List<Follow> followers = followRepository.findByFollowing_UserId(userId).orElseThrow(
                () -> new IllegalArgumentException("올바른 팔로워 정보가 입력되지 않았습니다.")
        );
        log.info("방장");
        followers.forEach(followResponseDto -> pushService.send(hostUser, followResponseDto.getFollower(), PushType.MEETCREATED, hostUser.getName() + "님께서 회원님께서 모임(" + createdMeet.getMeetName() + ")을 생성했습니다.", "이동할 url"));
        return createdMeet;
    }

    public void updateMeet(MeetDto meetDto, Long userId, Long meetId, Long drinkId, MultipartFile multipartFile) throws IOException {
        validateMeetRequest(meetDto, drinkId);

        String prevMeetImgSrc = meetRepository.findImgSrcByMeetId(meetId);
        User host = getValidatedUser(userId);

        handleImageUpdate(meetDto, multipartFile, prevMeetImgSrc);

        Meet updateMeet = prepareMeetForUpdate(meetDto, meetId, drinkId);
        log.info("수정된 Meet 정보 : {}", updateMeet.getImgSrc());

        notifyMeetParticipantsAboutUpdate(meetDto, meetId, host);
    }

    private User getValidatedUser(Long userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다."));
    }

    private void handleImageUpdate(MeetDto meetDto, MultipartFile multipartFile, String prevMeetImgSrc) throws IOException {
        if (multipartFile == null) {
            meetDto.setImgSrc(prevMeetImgSrc);
            return;
        }

        boolean uploadImgExist = !Objects.equals(multipartFile.getOriginalFilename(), "");

        if (uploadImgExist) {
            s3Service.deleteImg(prevMeetImgSrc);
            meetDto.setImgSrc(s3Service.upload(UploadType.MEET, multipartFile));
        } else if (meetDto.getImgSrc() == null) {
            meetDto.setImgSrc(prevMeetImgSrc);
        } else {
            s3Service.deleteImg(prevMeetImgSrc);
        }
    }

    private Meet prepareMeetForUpdate(MeetDto meetDto, Long meetId, Long drinkId) {
        Meet updateMeet = meetRepository.findById(meetId)
                .orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));

        updateMeet.update(meetDto.toEntity());
        updateMeet.setMeetId(meetId);
        updateMeet.setTag(tagService.findById(meetDto.getTagId()));
        updateMeet.setDrink(drinkRepository.findById(drinkId).orElse(null));

        return meetRepository.save(updateMeet);
    }

    private void notifyMeetParticipantsAboutUpdate(MeetDto meetDto, Long meetId, User host) {
        List<MeetUser> meetUser = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId)
                .orElseThrow(() -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        meetUser.stream()
                .filter(user -> !user.getUser().getUserId().equals(meetDto.getHostId()))
                .forEach(user -> pushService.send(host, user.getUser(), PushType.MEETMODIFIDE, "모임( " + meetDto.getMeetName() + ")의 내용이 수정되었습니다. 확인해 주세요.", "https://i9b310.p.ssafy.io"));
    }

    @Transactional
    public void deleteMeet(Long hostId, Long meetId) {
        Meet deleteMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));
        log.info("모임장 : {}, 삭제하려는 유저 : {}", deleteMeet.getHost().getUserId(), hostId);
        //유효성 검사
        if (!deleteMeet.getHost().getUserId().equals(hostId))
            throw new IllegalArgumentException("방장이 아니면 방을 삭제할 수 없습니다.");

        List<MeetUser> meetUser = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(() -> new IllegalArgumentException("모임 정보를 찾을 수 없습니다."));

        //MeetUser 정보를 삭제한다.
        meetUserService.deleteMeetUser(deleteMeet);

        //meet 이미지를 지운다
        s3Service.deleteImg(deleteMeet.getImgSrc());

        //마지막에 모임 정보를 제거한다.
        meetRepository.findById(meetId).ifPresent(meetRepository::delete);

        //해당 미팅에 참여한 사람들에게 Push 알림을 보낸다.
        //방장에게는 알림을 전송하지 않는다.
        meetUser.stream().filter(user -> !user.getUser().getUserId().equals(hostId)).forEach(user -> pushService.send(deleteMeet.getHost(), user.getUser(), PushType.MEETDELETED, deleteMeet.getHost().getName() + "님 께서 생성한 모임" + "(" + deleteMeet.getMeetName() + ")이 삭제되었습니다.", ""));
    }

    public void applyMeet(Long userId, Long meetId) {
        log.info("모임 신청할 정보를 출력한다. : {}, {}", userId, meetId);

        MeetUserDto meetUser = findMeetUserByMeetId(meetId);
        Meet attendMeet = getValidatedMeet(meetId);
        User attendUser = getValidatedUser(userId);
        User host = getValidatedUser(meetUser.getMeetDto().getHostId());

        checkParticipation(meetUser, userId);

        meetUserService.saveMeetUser(attendMeet, attendUser, Status.APPLY);
        sendNotificationToHost(attendUser, host, meetUser);
    }

    private Meet getValidatedMeet(Long meetId) {
        return meetRepository.findById(meetId)
                .orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
    }

    private void checkParticipation(MeetUserDto meetUser, Long userId) {
        if (meetUser.getMeetDto().getNowParticipants() >= meetUser.getMeetDto().getMaxParticipants())
            throw new IllegalArgumentException("해당 모임에 참여 인원이 가득 찼습니다.");

        for (User user : meetUser.getUsers()) {
            if (userId.equals(user.getUserId())) throw new IllegalArgumentException("이미 참여하신 모임 입니다.");
        }
    }

    private void sendNotificationToHost(User attendUser, User host, MeetUserDto meetUser) {
        pushService.send(attendUser, host, PushType.MEETACCESS,
                attendUser.getName() + "님께서 " + meetUser.getMeetDto().getMeetName() + "모임에 참여하고 싶어 합니다.",
                "이동할 url");
    }


    @Transactional
    public void applyCancelMeet(Long userId, Long meetId) {
        Meet meet = meetRepository.findById(meetId)
                .orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));

        Status applyUserStatus = meetUserService.findUserStatus(userId, meetId);
        log.info("현재 {}유저의 {}모임 신청 상태 : {}", userId, meetId, applyUserStatus);

        validateCancellation(applyUserStatus);

        decrementParticipants(meet);
        meetUserService.deleteExitUser(userId, meetId, Status.APPLY);
        pushService.deletePushLog(PushType.MEETACCESS, userId, meet.getHost().getUserId());
    }

    private void validateCancellation(Status applyUserStatus) {
        if (applyUserStatus != Status.APPLY) {
            throw new IllegalArgumentException("가입신청중인 유저만 모임 신청을 취소할 수 있습니다.");
        }
    }


    @Transactional
    public void exitMeet(Long userId, Long meetId) {
        if (meetUserService.findUserStatus(userId, meetId) == Status.HOST) {
            throw new IllegalArgumentException("죄송합니다.. 방장님은 나가실 수 없으십니다. 모임 삭제를 요청하세요.");
        }

        meetUserService.deleteExitUser(userId, meetId, Status.GUEST);

        Meet nowMeet = meetRepository.findById(meetId)
                .orElseThrow(() -> new IllegalArgumentException("올바르지 않은 모임 정보입니다."));

        decrementParticipants(nowMeet);
        chatRoomService.deleteExistUser(nowMeet.getChatRoom(), userId);
    }

    private void decrementParticipants(Meet meet) {
        meet.setNowParticipants(meet.getNowParticipants() - 1);
        meetRepository.save(meet);
    }

    public String manageMeet(Long userId, Long meetId, boolean applyResult) {
        Meet managementMeet = meetRepository.findById(meetId)
                .orElseThrow(() -> new IllegalArgumentException("미팅 정보를 찾을 수 없습니다."));

        User host = managementMeet.getHost();
        User manageUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("올바른 유저 정보가 입력되지 않았습니다."));

        if (applyResult) {
            processAcceptance(userId, meetId, managementMeet, manageUser, host);
            return userId + "유저 " + meetId + "모임 신청 승인";
        } else {
            processRejection(userId, meetId, managementMeet);
            return userId + "유저 " + meetId + "모임 신청 거절";
        }
    }

    private void processAcceptance(Long userId, Long meetId, Meet managementMeet, User manageUser, User host) {
        meetUserService.updateMeetStatus(userId, meetId, Status.GUEST);
        updateParticipants(meetId);

        chatRoomUserService.save(ChatRoomUser.builder()
                .user(manageUser)
                .chatRoom(managementMeet.getChatRoom())
                .build());

        chatMessageService.save(ChatMessage.builder()
                .chatRoom(managementMeet.getChatRoom())
                .message(manageUser.getName() + "님이 모임에 참여하셨습니다.")
                .createdAt(LocalDateTime.now())
                .build());

        pushService.send(host, manageUser, PushType.MEETACCESS,
                "회원님께서 모임(" + managementMeet.getMeetName() + ")참여 되셨습니다.\n 즐거운 시간 되세요.",
                "http://i9b310.p.ssafy.");
    }

    private void processRejection(Long userId, Long meetId, Meet managementMeet) {
        meetUserService.deleteExitUser(userId, meetId, Status.APPLY);

        pushService.send(managementMeet.getHost(),
                userRepository.findByUserId(userId).get(),
                PushType.MEETREJECT,
                "회원님께서 모임(" + managementMeet.getMeetName() + ")참여에 거절당했습니다.", "");
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
