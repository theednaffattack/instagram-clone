import { ObjectType, Field, ID } from "type-graphql";
import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { User } from "./entity.user";
import { Thread } from "./entity.thread";
import { File } from "./entity.file";
// import { Hotel } from "./Hotel";

export interface MessagePayload {
  id: number;
  message?: string;
  created_at?: Date;
  updated_at?: Date;
  sentBy?: string;
  user?: User;
}

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @Field()
  @Column()
  text: string;

  @Field(() => [File], { nullable: "itemsAndList" })
  @OneToMany(() => File, (file) => file.message, { nullable: true })
  files: File[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sent_messages, { cascade: true })
  sentBy: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  user: User;

  @Field(() => Thread, { nullable: true })
  @ManyToOne(() => Thread, (thread) => thread.messages)
  thread: Thread;
}
