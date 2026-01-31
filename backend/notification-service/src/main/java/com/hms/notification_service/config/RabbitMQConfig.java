package com.hms.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NOTIFICATION_QUEUE = "notification.queue";
    public static final String INTERNAL_EXCHANGE = "internal.exchange";
    public static final String ROUTING_KEY = "internal.notification";

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public TopicExchange internalExchange() {
        return new TopicExchange(INTERNAL_EXCHANGE);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange internalExchange) {
        return BindingBuilder.bind(notificationQueue).to(internalExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
