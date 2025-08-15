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
export const producer = kafka.producer({ allowAutoTopicCreation: true });

const run = async () => {
  await consumer.connect();
  await producer.connect();
  console.log("Consumer and Producer Connected");
  await consumer.subscribe({
    topic: process.env.KAFKA_CLONE_TOPIC || "clone-request",
  });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      try {
        await handler(JSON.parse(message.value.toString()));
      } catch (error) {
        // set the status of the deployment as failed
        console.error(error);
      }
    },
  });
};

run().then(() => {
  console.log("Cloner Started");
});
