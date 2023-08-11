package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.SubReviewDto;
import com.ssafy.backend.dto.SubReviewResponseDto;
import com.ssafy.backend.entity.DrinkReview;
import com.ssafy.backend.entity.SubReview;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkReviewRepository;
import com.ssafy.backend.repository.SubReviewRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubReviewService {
    private final SubReviewRepository subReviewRepository;
    private final UserRepository userRepository;
    private final DrinkReviewRepository drinkReviewRepository;
    private final PushService pushService;

    // 리뷰의 댓글을 조회하는 API
    public List<SubReviewResponseDto> findByDrinkReviewId(Long drinkReviewId) {
        List<SubReview> subReviews = subReviewRepository.findByDrinkReview_DrinkReviewIdOrderByCreatedAtDesc(drinkReviewId);
        return subReviews.stream()
                .map(subReview -> SubReviewResponseDto.builder()
                        .subReviewId(subReview.getSubReviewId())
                        .content(subReview.getContent())
                        .user(subReview.getUser())
                        .build())
                .collect(Collectors.toList());
    }

    private SubReviewDto toSubReviewDto(SubReview subReview) {
        return SubReviewDto.builder()
                .subReviewId(subReview.getSubReviewId())
                .content(subReview.getContent())
                .createdAt(subReview.getCreatedAt().toString())
                .drinkReviewId(subReview.getDrinkReview().getDrinkReviewId())
                .userId(subReview.getUser().getUserId())
                .build();
    }


    // 리뷰의 댓글을 작성하는 API
    public SubReview writeSubReview(SubReviewDto subReviewDto, Long userId) {
        DrinkReview drinkReview = drinkReviewRepository.findById(subReviewDto.getDrinkReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));
        // 여기가 getDrinkReviewId 로 바뀌어야함
        log.info("drinkReview" + drinkReview.toString());
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));
        log.info("user" + user.toString());

        // content가 비어있는지 확인
        if (subReviewDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        SubReview subReview = SubReview.builder()
                .content(subReviewDto.getContent())
                .drinkReview(drinkReview)
                .user(user)
                .build();

        //send(User sender, User receiver, PushType pushType, String content, String url) {
//        String pushContent = user.getNickname() + "님께서 " + drinkReview.getContent().substring(0, 10) + "... 리뷰에 댓글을 남기셨습니다.";
//        pushService.send(drinkReview.getUser(), user, PushType.REVIEWLIKE, pushContent, "이동할 URL");
        return subReviewRepository.save(subReview);
    }

    public void deleteSubReview(Long subReviewId, Long userId) {
        SubReview subReview = subReviewRepository.findById(subReviewId).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 삭제 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 삭제 요청자가 다릅니다.");
        }

        subReviewRepository.delete(subReview);
    }

    // 아이디 수정
    public SubReviewDto updateSubReview(SubReviewDto subReviewDto, Long userId) {
        log.info(subReviewDto.toString());
        SubReview subReview = subReviewRepository.findById(subReviewDto.getSubReviewId()).orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 댓글 작성자와 수정 요청자가 같은지 확인
        if (!subReview.getUser().equals(user)) {
            throw new IllegalArgumentException("댓글 작성자와 수정 요청자가 다릅니다.");
        }

        // content가 비어있는지 확인
        if (subReviewDto.getContent().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 비어있습니다.");
        }

        subReview.update(subReviewDto.getContent());
        SubReview updatedSubReview = subReviewRepository.save(subReview);

        return toSubReviewDto(updatedSubReview);
    }

}
