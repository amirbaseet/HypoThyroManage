import React from "react";
import { FlatList } from "react-native";
import MessageBubble from "./MessageBubble";

const ChatList = ({ messages, userId, flatListRef }) => {
    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <MessageBubble message={item.message} isSender={item.sender === userId} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
    );
};

export default ChatList;

