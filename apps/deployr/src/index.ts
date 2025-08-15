import { config } from "dotenv";
import { Kafka } from "kafkajs";

config();

const kafka = new Kafka({
  clientId: "deployr",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "deployr",
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_DEPLOY_TOPIC || "deploy-request",
  });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      console.log(JSON.parse(message.value.toString()));
    },
  });
};

run().then(() => {
  console.log("Deployr Started");
});
