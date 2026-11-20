"use client";

import { Check, Clock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFriendsHydration, useFriendsStore, useFriendStatus } from "@/lib/friends-store";

const ICON = { size: 16, strokeWidth: 1.5, "aria-hidden": true } as const;

/** Add friend, cancel a pending request, or accept one that came in. */
export function FriendButton({ userId, name }: { userId: string; name: string }) {
  const isReady = useFriendsHydration();
  const status = useFriendStatus(userId);
  const { sendRequest, cancelRequest, accept, unfriend } = useFriendsStore();

  if (!isReady) {
    return (
      <Button size="compact" disabled>
        <UserPlus {...ICON} />
        Add friend
      </Button>
    );
  }
  if (status === "friends") {
    return (
      <Button variant="secondary" size="compact" onClick={() => unfriend(userId)} aria-label={`Friends with ${name}. Remove friend`} title="Remove friend">
        <Check {...ICON} />
        Friends
      </Button>
    );
  }
  if (status === "sent") {
    return (
      <Button variant="secondary" size="compact" onClick={() => cancelRequest(userId)} title="Cancel request">
        <Clock {...ICON} />
        Requested
      </Button>
    );
  }
  if (status === "received") {
    return (
      <Button size="compact" onClick={() => accept(userId)}>
        <Check {...ICON} />
        Accept request
      </Button>
    );
  }
  return (
    <Button size="compact" onClick={() => sendRequest(userId)}>
      <UserPlus {...ICON} />
      Add friend
    </Button>
  );
}
