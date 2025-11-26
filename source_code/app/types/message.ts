/**
 * Message Interface
 * 
 * Simple interface representing the raw data structure of a chat message.
 * This is a standalone type definition that can be used for:
 * - Data transfer objects (DTOs)
 * - API request/response types
 * - Serialization/deserialization
 * - Database schemas
 * 
 * Separating this interface from the ChatMessage class follows the
 * Supple Design principle of Standalone Classes, allowing the data
 * structure to be studied independently from the domain logic.
 */

export type MessageSender = "user" | "bot";

/**
 * Raw message data structure
 */
export interface Message {
  /**
   * Unique identifier for the message
   */
  id: number;

  /**
   * The message text content
   */
  text: string;

  /**
   * Who sent the message ("user" or "bot")
   */
  sender: MessageSender;

  /**
   * When the message was created
   * Can be a Date object or ISO string for serialization
   */
  timestamp: Date | string;
}

/**
 * Type guard to check if an object is a valid Message
 */
export function isMessage(obj: unknown): obj is Message {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const msg = obj as Record<string, unknown>;

  return (
    typeof msg.id === "number" &&
    typeof msg.text === "string" &&
    (msg.sender === "user" || msg.sender === "bot") &&
    (msg.timestamp instanceof Date || typeof msg.timestamp === "string")
  );
}
