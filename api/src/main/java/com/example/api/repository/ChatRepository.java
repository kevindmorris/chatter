package com.example.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.api.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
