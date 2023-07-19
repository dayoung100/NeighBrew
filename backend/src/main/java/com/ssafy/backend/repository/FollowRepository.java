package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<List<Follow>> findByFollower(User follower);

    Optional<List<Follow>> findByFollowing(User following);

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
}
