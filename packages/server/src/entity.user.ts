import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";

import { Thread } from "./entity.thread";
import { Message } from "./entity.message";
import { File } from "./entity.file";
import { Image } from "./entity.image";
import { Like } from "./entity.like";
import { Post } from "./entity.post";

/**
 * User Entity (model)
 * @param {string} User.id - The ID of a User
 * @param {string} User.firstName - The given name of a User
 * @param {string} User.lastName - The family name (surname) of a User
 */
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column("text", { unique: true })
  username: string;

  @Field({ nullable: true })
  @Column("text", { unique: true })
  email: string;

  @Field(() => [File], { nullable: "itemsAndList" })
  @OneToMany(() => File, (file) => file.upload_user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  files: File[];

  @Field(() => [Image], { nullable: "itemsAndList" })
  @OneToMany(() => Image, (image) => image.user, {
    nullable: true,
    onDelete: "CASCADE",
  })
  images: Image[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @Field(() => [Message], { nullable: "itemsAndList" })
  mappedMessages: Message[];

  @Field(() => Post, { nullable: true })
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @Field(() => [User], { nullable: "itemsAndList" })
  @ManyToMany(() => User, (user) => user.following, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  followers: User[];

  @Field(() => [User], { nullable: "itemsAndList" })
  @ManyToMany(() => User, (user) => user.followers, {
    nullable: true,
    onDelete: "CASCADE",
  })
  following: User[];

  // @Field(() => Channel, { nullable: true })
  // @ManyToOne(() => Channel, (channel) => channel.created_by, {
  //   nullable: true,
  //   onDelete: "CASCADE",
  // })
  // channels_created?: Channel;

  // @Field(() => [Channel], { nullable: "itemsAndList" })
  // @ManyToMany(() => Channel, (channel) => channel.invitees, { nullable: true })
  // @JoinTable()
  // channel_memberships: Channel[];

  @Field({ nullable: true })
  @Column("text", { unique: true, nullable: true })
  profileImageUri: string;

  @Field({ nullable: true })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.user, {
    onDelete: "CASCADE",
  })
  messages?: Message[];

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.sentBy, {
    onDelete: "CASCADE",
  })
  sent_messages: Message[];

  @Field(() => [Thread], { nullable: "itemsAndList" })
  @OneToMany(() => Thread, (thread) => thread.user)
  threads?: Thread[];

  @Field(() => [Thread], { nullable: "itemsAndList" })
  @ManyToMany(() => Thread, (thread) => thread.invitees, { nullable: true })
  @JoinTable()
  thread_invitations: Thread[];

  @Column("int", { default: 0 })
  tokenVersion: number;
}
