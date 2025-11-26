/**
 * ChatMessage Value Object
 * 
 * Immutable value object representing a chat message in the chatbot system.
 * Follows Domain-Driven Design (DDD) principles:
 * - Encapsulation: All properties are private with controlled access
 * - Validation: Constructor validates all input data
 * - Immutability: No setters, all properties are readonly
 * - Domain Logic: Contains formatting and business logic
 */

export type MessageSender = "user" | "bot";

export class ChatMessage {
  private readonly id: number;
  private readonly text: string;
  private readonly sender: MessageSender;
  private readonly timestamp: Date;

  /**
   * Creates a new ChatMessage instance
   * @param id - Unique identifier for the message
   * @param text - The message text content
   * @param sender - Who sent the message ("user" or "bot")
   * @param timestamp - When the message was created
   * @throws Error if text is empty or contains only whitespace
   */
  constructor(id: number, text: string, sender: MessageSender, timestamp: Date) {
    // Validation: text cannot be empty or whitespace only
    if (!text || text.trim().length === 0) {
      throw new Error("Message text cannot be empty or whitespace only.");
    }

    // Validation: id must be a positive number
    if (!Number.isFinite(id) || id <= 0) {
      throw new Error("Message ID must be a positive number.");
    }

    // Validation: timestamp must be a valid Date
    if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      throw new Error("Message timestamp must be a valid Date.");
    }

    this.id = id;
    this.text = text.trim();
    this.sender = sender;
    this.timestamp = timestamp;
  }

  /**
   * Factory method to create a ChatMessage from a plain object
   * Useful for deserializing from localStorage or API responses
   */
  static fromObject(obj: {
    id: number;
    text: string;
    sender: MessageSender;
    timestamp: Date | string;
  }): ChatMessage {
    const timestamp = typeof obj.timestamp === "string" 
      ? new Date(obj.timestamp) 
      : obj.timestamp;
    
    return new ChatMessage(obj.id, obj.text, obj.sender, timestamp);
  }

  /**
   * Gets the message ID
   */
  getId(): number {
    return this.id;
  }

  /**
   * Gets the message text content
   */
  getText(): string {
    return this.text;
  }

  /**
   * Gets the message sender
   */
  getSender(): MessageSender {
    return this.sender;
  }

  /**
   * Gets the message timestamp
   */
  getTimestamp(): Date {
    return new Date(this.timestamp.getTime()); // Return a copy to maintain immutability
  }

  /**
   * Returns true if the message was sent by a user
   */
  get isUserSender(): boolean {
    return this.sender === "user";
  }

  /**
   * Returns true if the message was sent by the bot
   */
  get isBotSender(): boolean {
    return this.sender === "bot";
  }

  /**
   * Formats the timestamp for display
   * Returns time in "HH:MM AM/PM" format
   */
  getFormattedTime(): string {
    const hours = this.timestamp.getHours();
    const minutes = this.timestamp.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12; // Convert to 12-hour format
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }

  /**
   * Formats the timestamp with date for display
   * Returns date and time in "MM/DD/YYYY HH:MM AM/PM" format
   */
  getFormattedDateTime(): string {
    const month = this.timestamp.getMonth() + 1;
    const day = this.timestamp.getDate();
    const year = this.timestamp.getFullYear();
    
    return `${month}/${day}/${year} ${this.getFormattedTime()}`;
  }

  /**
   * Converts the ChatMessage to a plain object for serialization
   * Useful for localStorage or API requests
   */
  toObject(): {
    id: number;
    text: string;
    sender: MessageSender;
    timestamp: Date;
  } {
    return {
      id: this.id,
      text: this.text,
      sender: this.sender,
      timestamp: new Date(this.timestamp.getTime()),
    };
  }

  /**
   * Converts the ChatMessage to JSON
   */
  toJSON(): {
    id: number;
    text: string;
    sender: MessageSender;
    timestamp: string;
  } {
    return {
      id: this.id,
      text: this.text,
      sender: this.sender,
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Checks equality with another ChatMessage based on ID
   */
  equals(other: ChatMessage): boolean {
    return this.id === other.id;
  }
}
