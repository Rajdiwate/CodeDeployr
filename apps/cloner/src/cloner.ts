import { Kafka } from "kafkajs";
import { config } from "dotenv";
import { handler } from "./cloneHandler";

config();

const kafka = new Kafka({
  clientId: "deployr",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "cloner",
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_CLONE_TOPIC || "clone-request",
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      await handler(JSON.parse(message.value.toString()));
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message?.value?.toString(),
      });
    },
  });
};

run().then(() => {
  console.log("consumer connected");
  console.log("consuming topic", process.env.KAFKA_CLONE_TOPIC);
});
