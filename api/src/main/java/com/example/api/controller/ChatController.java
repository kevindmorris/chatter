package com.example.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.api.dto.ChatRequest;
import com.example.api.model.Chat;
import com.example.api.repository.ChatRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/chats")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody ChatRequest request) {
        Chat chat = Chat.builder()
                .username(request.username())
                .content(request.content())
                .build();
        return ResponseEntity.ok(chatRepository.save(chat));
    }

    @GetMapping
    public ResponseEntity<List<Chat>> getChats() {
        List<Chat> chats = chatRepository.findAll();
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> getChatById(@PathVariable Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        return ResponseEntity.ok(chat);
    }

    @Transactional
    @PatchMapping("/{id}")
    public ResponseEntity<Chat> updateChatContentById(@PathVariable Long id, @RequestBody String content) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        chat.setContent(content);
        return ResponseEntity.ok(chatRepository.save(chat));
    }

    @Transactional
    @PatchMapping("/{id}/likes")
    public ResponseEntity<Chat> incrementChatLikesById(@PathVariable Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        chat.like();
        return ResponseEntity.ok(chatRepository.save(chat));
    }

    @Transactional
    @PatchMapping("/{id}/dislikes")
    public ResponseEntity<Chat> incrementChatDislikesById(@PathVariable Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        chat.dislike();
        return ResponseEntity.ok(chatRepository.save(chat));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllChats() {
        chatRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChatById(@PathVariable Long id) {
        chatRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
