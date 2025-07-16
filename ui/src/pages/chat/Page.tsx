import { Api, stompClient } from "@/lib";
import type { Chat } from "@/types";
import { Send, ThumbDown, ThumbUp } from "@mui/icons-material";
import {
  Badge,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { sortBy } from "lodash";
import moment from "moment";
import { generate } from "random-words";
import React, { useState } from "react";

export default function Page() {
  const api = new Api();

  const [chats, setChats] = useState<Chat[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = React.useState<boolean>(false);
  const [helperText, setHelperText] = React.useState<string>("");

  const [username] = useState<string>(
    generate({ exactly: 2, minLength: 4, maxLength: 10, join: "_" }) as string,
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setChats(await api.getAll());
      } catch (error) {
        console.error(error);
      }
    })();

    stompClient.onConnect = () => {
      console.log("Connected");

      stompClient.subscribe("/topic/public", (message) => {
        const body: Chat = JSON.parse(message.body);
        setChats((prev) => [...prev, body]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setError(false);
    setHelperText("");

    setInputValue(event.target.value);
  };

  const send = () => {
    if (inputValue.trim().length === 0) {
      setError(true);
      setHelperText("Messages cannot be blank.");
      return;
    }

    const newChat: Partial<Chat> = {
      username: username,
      content: inputValue,
    };

    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify(newChat),
    });

    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        my: (theme) => theme.spacing(4),
        position: "relative",
      }}
    >
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        sx={{
          position: "sticky",
          top: (theme) => theme.spacing(4),
          zIndex: 1100,
        }}
      >
        <TextField
          fullWidth
          inputRef={inputRef}
          variant="outlined"
          placeholder="Share your thoughts..."
          autoComplete="off"
          autoFocus
          value={inputValue}
          error={error}
          helperText={helperText}
          onChange={handleChange}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  color={
                    error
                      ? "error"
                      : inputValue.trim().length === 0
                        ? "default"
                        : "primary"
                  }
                  onClick={send}
                >
                  <Send />
                </IconButton>
              ),
            },
          }}
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        />
      </Box>

      <List>
        {sortBy(chats, (chat) => moment(chat.createdOn).valueOf())
          .reverse()
          .map((chat) => (
            <ListItem
              key={chat.id}
              secondaryAction={
                <Stack direction="row" gap={2}>
                  <Badge
                    badgeContent={chat.numLikes.toLocaleString()}
                    color="primary"
                  >
                    <IconButton
                      onClick={async () => {
                        try {
                          const updatedChat = await api.likeById(chat.id);
                          setChats((prev) =>
                            prev.map((e) => {
                              if (e.id === updatedChat.id) return updatedChat;
                              return e;
                            }),
                          );
                        } catch (error) {}
                      }}
                    >
                      <ThumbUp fontSize="small" color="primary" />
                    </IconButton>
                  </Badge>
                  <Badge
                    badgeContent={chat.numDislikes.toLocaleString()}
                    color="error"
                  >
                    <IconButton
                      onClick={async () => {
                        try {
                          const updatedChat = await api.dislikeById(chat.id);
                          setChats((prev) =>
                            prev.map((e) => {
                              if (e.id === updatedChat.id) return updatedChat;
                              return e;
                            }),
                          );
                        } catch (error) {}
                      }}
                    >
                      <ThumbDown fontSize="small" color="error" />
                    </IconButton>
                  </Badge>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <>
                    <Typography
                      component="span"
                      variant="inherit"
                      fontWeight="bold"
                    >
                      {chat.username}
                    </Typography>{" "}
                    •{" "}
                    <Typography component="span" variant="inherit">
                      {moment(chat.createdOn).format("LLL")}
                    </Typography>
                  </>
                }
                secondary={chat.content}
                slotProps={{
                  primary: { variant: "body2" },
                  secondary: { fontSize: "1.15rem" },
                }}
                sx={{ maxWidth: "85%", wordBreak: "break-word" }}
              />
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
