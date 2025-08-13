// kafka/producer.js
import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "deployr",
  brokers: ["localhost:9092"],
});

let producerInstance: Producer;

export async function getProducer() {
  if (producerInstance) return producerInstance;

  const producer = kafka.producer({ allowAutoTopicCreation: true });
  await producer.connect();
  producerInstance = producer;

  return producerInstance;
}

export async function sendMessage(
  message: string,
  key?: string,
  topic?: string,
) {
  const producer = await getProducer();

  const config: { topic: string; messages: { value: string; key?: string }[] } =
    {
      topic: topic || process.env.KAFKA_CLONE_TOPIC!,
      messages: [{ value: message }],
    };

  if (key) {
    config.messages[0].key = key;
  }

  await producer.send(config);
}
