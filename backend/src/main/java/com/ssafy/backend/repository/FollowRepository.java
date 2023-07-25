package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerUserIdAndFollowingUserId(Long followerId, Long followingId);

    List<Follow> findFollowsByFollowing_UserId(Long user);

    Optional<List<Follow>> findByFollowing_UserId(Long userId);
}
