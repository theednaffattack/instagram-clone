import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Post } from "./entity.post";
import { User } from "./entity.user";
import { Message } from "./entity.message";

@ObjectType()
@Entity()
export class Image extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Field()
  // @Column()
  // title: string;

  // @Field()
  // @Column()
  // text: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updated_at?: Date;

  @Field()
  @Column()
  uri: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.images)
  post: Post;

  @Column()
  postId: string;

  @Field(() => Message, { nullable: true })
  @ManyToOne(() => Message, (message) => message.images, { nullable: true })
  message?: Message;

  @Column()
  messageId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @Column()
  userId: string;
}
