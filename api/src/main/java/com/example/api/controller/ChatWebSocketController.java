package com.example.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import com.example.api.dto.ChatRequest;
import com.example.api.model.Chat;
import com.example.api.repository.ChatRepository;

import jakarta.validation.Valid;

@Validated
@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatRepository chatRepository;

    @MessageMapping("/send")
    @SendTo("/topic/public")
    public Chat sendChat(@Valid ChatRequest request) {
        Chat chat = Chat.builder()
                .username(request.username())
                .content(request.content())
                .build();
        return chatRepository.save(chat);
    }

}
